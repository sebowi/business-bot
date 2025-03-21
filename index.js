import { Bot } from "grammy";
import { GoogleGenerativeAI } from "@google/generative-ai";

const bot = new Bot("7593483991:AAHx1vs9UaxBlo_ZgkR_V8ZKNnTXJDqqkE4");
const genAI = new GoogleGenerativeAI("AIzaSyAAjGOno1B1aTWjGczMT-KaAiqtznLiWKM");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

bot.on("business_message").filter(
  async (ctx) => {
    const conn = await ctx.getBusinessConnection();
    return ctx.from.id !== conn.user.id;
  },
  async (ctx) => {
    if (!ctx.msg.text) {
      console.log("Xabar matn emas, e’tiborsiz qoldirildi.");
      return;
    }
    const text = ctx.msg.text;
    try {
      const prompt = `You are a smart bot that assists in Uzbek, Russian, English, Cyrillic, Kazakh, and Turkish. Respond to user messages in a friendly, sincere, and concise manner. 😊\n\nUser: ${text}`;
      const result = await model.generateContent(prompt);
      const aiReply = result.response.text();;
      await ctx.reply(aiReply, {parse_mode: "Markdown"});
    } catch (error) {
      const errorMessage = error.message || "Noma’lum xato yuz berdi";
      console.error("Google Gemini API xatosi:", errorMessage, error);
      await ctx.reply(`Xato: ${errorMessage}. Iltimos, qayta urinib ko‘ring!`);
    }
  }
);

bot.start();
console.log("Biznes bot ishga tushdi!");