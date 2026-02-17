#!/usr/bin/env node

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
  const prompt = process.argv.slice(2).join(" ");
  
  if (!prompt) {
    console.error("Usage: node gemini-cli.js <your prompt>");
    process.exit(1);
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error("Error: GEMINI_API_KEY environment variable not set");
    process.exit(1);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    console.log(response.text());
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

run();
