import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = 'AIzaSyAP2RfaIiz26ZmEUWXeCUKHRO6dN31yrrk';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash", // Using 2.0 as originally requested, fell back to 1.5 if 2.0 fails
});

const SYSTEM_PROMPT = `
You are the AI Support Assistant for the "Fresh Hands Service Partner" app. 
Your users are service professionals (plumbers, electricians, cleaners, etc.) who use this app to accept jobs, track earnings, and manage their profile.

Guidance:
1. Be helpful, concise, and professional.
2. Help with app features:
   - "Jobs" tab: To view active and past jobs.
   - "Wallet" tab: To check earnings and withdraw money (min ₹500).
   - "Profile" tab: To manage documents and settings.
3. If a user has a payment issue or dispute, advise them to contact the dedicated support hotline: +91 99999 88888.
4. Keep responses short and easy to read on a mobile screen.
`;

export const sendToGemini = async (messages) => {
    try {
        // Construct the prompt with history
        // Since the SDK is stateless, we pass context manually or use startChat.
        // For simplicity with this current UI structure, we'll concatenate the conversation.

        let prompt = SYSTEM_PROMPT + "\n\nConversation History:\n";

        messages.forEach(msg => {
            const role = msg.sender === 'user' ? 'User' : 'Assistant';
            prompt += `${role}: ${msg.text}\n`;
        });

        prompt += "\nAssistant:";

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();

    } catch (error) {
        console.error("Gemini SDK Error:", error);
        return "I'm having a little trouble connecting. Please check your internet or try again.";
    }
};
