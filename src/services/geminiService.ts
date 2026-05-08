import { GoogleGenAI } from "@google/genai";
import { MURATOV_DATA } from "../data";

export interface ChatMessage {
  role: 'user' | 'model';
  parts: [{ text: string }];
}

export class GeminiService {
  private ai: any;
  private model: string = "gemini-3-flash-preview";

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  private getSystemInstruction(): string {
    const familyDataStr = JSON.stringify(MURATOV_DATA, null, 2);
    return `
      Siz Muratovlar oilasining aqlli yordamchisiz. 
      Sizda Muratovlar sulolasi haqidagi barcha ma'lumotlar mavjud.
      Sizning vazifangiz foydalanuvchilarning ushbu oila haqidagi savollariga aniq va muloyim javob berishdir.
      
      Mana oila ma'lumotlari:
      ${familyDataStr}
      
      Javob berayotganda quyidagi qoidalarga amal qiling:
      1. Faqat berilgan ma'lumotlarga tayanib javob bering.
      2. Agar ma'lumot mavjud bo'lmasa, "Kechirasiz, ushbu oila a'zosi haqida menda ma'lumot yo'q" deb javob bering.
      3. O'zbek tilida javob bering.
      4. Javoblaringiz muloyim va chiroyli bo'lsin.
      5. Oilaviy munosabatlarni (ota, ona, farzand, turmush o'rtoq) aniq tushuntiring.
    `;
  }

  async sendMessage(message: string, history: ChatMessage[] = []): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: [
          ...history,
          { role: 'user', parts: [{ text: message }] }
        ],
        config: {
          systemInstruction: this.getSystemInstruction(),
        }
      });

      return response.text || "Kechirasiz, xatolik yuz berdi.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }
}
