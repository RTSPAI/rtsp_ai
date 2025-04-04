import { FIREBASE_FUNC, FIREBASE_DB } from '../firebaseConfig';
import { httpsCallable } from 'firebase/functions';
import { ref, push } from 'firebase/database';

// Function to create starting session object. Note: Needs to be updated after exercise is done.
export const createSessionObject = (exercise) => {
    return { 
        createdAt: Date.now(), duration: -1, exercise: exercise,
        feedback: "", repetitions: -1
    };
}

// Function to generate text prompt for OpenAI based on repetition flags and injury model feedback
export const generateExercisePredictionPrompt = (angles_seen) => {
    let prompt = `Given an array of key body joint angles for multiple frames, all sorted in order, classify the exercise as one of the following: "Push Ups", "Pull Ups", or "Squats".
    
    Output Format:
    Return only a single string from the following choices: "Pull Ups", "Push Ups", or "Squats". Do not include explanations, additional text, or formatting—only the classification result. No markdown as well
    
    Here's the data:\n`;
    prompt += JSON.stringify(angles_seen);
    return prompt;
}

// Function to generate text prompt for OpenAI based on repetition flags and injury model feedback
export const generatePrompt = (exercise, repFlags, modelFeedback) => {
    // Throw error if inconsistent data
    if (repFlags.length != modelFeedback.length) {
        throw new Error("repFlags and modelFeedback arrays must be the same length.");
    }

    // Create start of prompt with instructions and warnings
    let prompt = `Generate feedback for the repetitions I completed when performing ${exercise}.\n`;
    prompt += "Be concise and clear. Do not repeat the same information and don't include markdown.\n";
    prompt += "For each repetition, write a sentence or more with feedback, no bullet points."
    prompt += "After including the feedback for each repetition, include a final small summary.\n";
    prompt += "For example, follow this format:\n";
    prompt += "Repetition #i: <feedback>\n";
    prompt += "Summary: <summary feedback>\n\n";
    prompt += "Below are what happened at each repetition:\n"

    // For every repetition
    for (let i = 0; i < repFlags.length; i++) {
        // Append title, risk, and quality
        // TODO: Change the order (if needed) after model output is verified
        let injuryFeedback = modelFeedback[i];
        const [risk, quality] = injuryFeedback;
        prompt += `Repetition #${i + 1} | Risk: ${risk} | Pre-Determined Quality: ${quality}\n`;
        prompt += "Mistakes through the repetition:\n";
        // Append the flags to the prompt
        const flags = repFlags[i];
        if (flags.length === 0)
            prompt += "- None\n";
        for (const flag of flags) {
            prompt += `- ${flag}\n`;
        }
    }

    // Attempt to stop hallucinations and misinformation
    prompt += "\nNote: Be careful not to hallucinate and make up fake statements, such as grip strength or things not measured."

    return prompt;
}

// Function to send an OpenAI request with the specified prompt and return the response
export const requestAIFeedback = async (prompt) => {
    const chatCompletion = httpsCallable(FIREBASE_FUNC, "chatCompletion");
    try {
        const data = { prompt };
        const result = await chatCompletion(data);
        return result.data.aiResponse;
    } catch (error) {
        console.log(error);
        return error;
    }
}

// Function to send an OpenAI request with the specified prompt and return the response
export const requestExercisePrediction = async (prompt) => {
    const chatCompletion = httpsCallable(FIREBASE_FUNC, "chatCompletion");
    try {
        const data = { prompt };
        const result = await chatCompletion(data);
        return result.data.aiResponse;
    } catch (error) {
        console.log(error);
        return error;
    }
}

// Function to write session object to user's DB
export const saveExerciseSession = async (userId, session) => {
    // Define reference to user's sessions field
    const sessionsRef = ref(FIREBASE_DB, `users/${userId}/sessions`);
    try {
        // Write session object to DB
        const response = await push(sessionsRef, session);
        return true;
    } catch (error) {
        console.log("Error adding session:", error);
        return false;
    }
}
