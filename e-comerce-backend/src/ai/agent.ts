import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
// import { ChatGroq } from "@langchain/groq"
import { createAgent } from "langchain";

import { env } from "../config/env";
import { ECOMMERCE_SYSTEM_PROMPT } from "./prompts/ecommerce";

import { searchProductsTool } from "./tools/searchProducts";
import { getProductTool } from "./tools/getProduct";
import { getCategoriesTool } from "./tools/getCategories";
// import { addToCartTool } from "./tools/addToCart";
import { trackOrderTool } from "./tools/trackOrder";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  temperature: 0.3,
  maxRetries: 2,
  apiKey: env.GOOGLE_API_KEY,
});

// const model = new ChatGroq({
//     model: "llama-3.3-70b-versatile",
//     temperature: 0,
//     // maxTokens: undefined,
//     maxRetries: 2,
//     apiKey: env.GROQ_API_KEY,
// })

export const agent = createAgent({
  model,
  tools: [
    searchProductsTool,
    getProductTool,
    getCategoriesTool,
    // addToCartTool,
    trackOrderTool,
  ],
  systemPrompt: ECOMMERCE_SYSTEM_PROMPT,
});

export async function askAgent(message: string): Promise<string> {
  const response = await agent.invoke({
    messages: [
      {
        role: "user",
        content: message,
      },
    ],
  });

  const lastMessage =
    response.messages[response.messages.length - 1];

  if (typeof lastMessage.content === "string") {
    return lastMessage.content;
  }

  return JSON.stringify(lastMessage.content);
}