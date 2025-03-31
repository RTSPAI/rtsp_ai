// Based on TF Lite model created for Exercise Detection
const EXERCISE_MAPPING = ["Pull Ups", "Push Ups", "Squats"];

// Function to create a dictionary with default (0) values for each exercise)
export function createPredictionDict(copy=null) {
    'worklet';
    const dict = {};
    for (let i = 0; i < EXERCISE_MAPPING.length; i++) {
        const exercise = EXERCISE_MAPPING[i];
        if (copy != null) {
            dict[exercise] = copy[exercise];
        } else {
            dict[exercise] = 0;
        }
    }
    return dict;
}

// Function to determine the exercise predicted by the exercise detection model.
export function getExercisePrediction(output) {
    'worklet';
    if (output[0] >= output[1] && output[0] >= output[2]) {
        return EXERCISE_MAPPING[0];
    } else if (output[1] >= output[0] && output[1] >= output[2]) {
        return EXERCISE_MAPPING[1];
    } else {
        return EXERCISE_MAPPING[2];
    }
}

// Function to return the highest predicted exercise
export function getFinalPrediction(dict) {
    'worklet';
    let highestExercise = EXERCISE_MAPPING[0];
    for (let i = 1; i < EXERCISE_MAPPING.length; i++) {
        const exercise = EXERCISE_MAPPING[i];
        if (dict[exercise] > dict[highestExercise]) {
            highestExercise = exercise;
        }
    }
    return highestExercise;
}

