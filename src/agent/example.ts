import { ChatAlibabaTongyi } from "@langchain/community/chat_models/alibaba_tongyi";
import { HumanMessage } from "@langchain/core/messages";
import env from "@/utils/load-env.js";

// Default model is qwen-turbo
const qwenTurbo = new ChatAlibabaTongyi({
  alibabaApiKey: env.QWEN_API_KEY, // In Node.js defaults to process.env.ALIBABA_API_KEY
});

// Use qwen-plus
const qwenPlus = new ChatAlibabaTongyi({
  model: "qwen-plus", // Available models: qwen-turbo, qwen-plus, qwen-max
  temperature: 0.5,
  alibabaApiKey: env.QWEN_API_KEY, // In Node.js defaults to process.env.ALIBABA_API_KEY
});

export { qwenTurbo, qwenPlus };

// const messages = [new HumanMessage("Hello")];

// const res = await qwenTurbo.invoke(messages);
// /*
// AIMessage {
//   content: "Hello! How can I help you today? Is there something you would like to talk about or ask about? I'm here to assist you with any questions you may have.",
// }
// */

// const res2 = await qwenPlus.invoke(messages);
// /*
// AIMessage {
//   text: "Hello! How can I help you today? Is there something you would like to talk about or ask about? I'm here to assist you with any questions you may have.",
// }
// */
