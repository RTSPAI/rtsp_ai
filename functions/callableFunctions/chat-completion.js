const functions = require("firebase-functions");
const admin = require("firebase-admin");
const OpenAI = require("openai");

if (admin.apps.length === 0) {
  admin.initializeApp();
}

exports.chatCompletion = functions.https.onCall(async (data, context) => {
  const { prompt } = data;
  const OPEN_AI_KEY = functions.config().openai.key;
  const openai = new OpenAI(OPEN_AI_KEY);

  const aiModel = "gpt-4o-mini";
  const messages = [
        { 
            role: "developer", 
            content: "You are an experienced sports performance doctor that assists the user."
        },                
        {
            role: "user",
            content: prompt
        }
  ]

  const completion = await openai.chat.completions.create({
      model: aiModel,
      messages: messages
  })

  const aiResponse = completion.choices[0].message.content;

  return {
       aiResponse: ""
  };
})
