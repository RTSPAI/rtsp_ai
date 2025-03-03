/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import OpenAI from "openai";

import { onCall } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import { defineSecret } from "firebase-functions/params";

// Define secret
const OPENAI_API_KEY = defineSecret("OPENAI_KEY");



initializeApp();



export const chatCompletion = onCall({ secrets: [OPENAI_API_KEY] }, async (data, context) => {
  const prompt  = data.prompt;
  const aiModel = "gpt-4o-mini";
  const messages = [
        { 
            role: "developer", 
            content: "You are an experienced sports performance doctor that assists the user."
        },                
        {
            role: "user",
            content: "When I run on roads and sidewalks, my hips are really tight. What should I do?"
        }
  ]

  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY.value()
});

  const completion = await openai.chat.completions.create({
      model: aiModel,
      messages: messages
  })

  const aiResponse = completion.choices[0].message.content;

  return {
       aiResponse
  };
})
