import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const useMock = String(process.env.USE_MOCK || 'true').toLowerCase() === 'true';
const ai = useMock ? null : new GoogleGenAI(process.env.GEMINI_API_KEY);
const model = "gemini-2.0-flash-001";

const outputSchema = {
    type: "object",
    properties: {
        score: { type: "number" },
        magnitude: { type: "number" },
        label: { type: "string", enum: ["positive", "neutral", "negative"] },
        allThemes: { type: "array", items: { type: "string" } },
        riskLevel: { type: "string", enum: ["High", "Medium", "Low"] },
        riskDetails: { type: "string" },
        summary: { type: "string" }
    },
    required: ["score", "magnitude", "label", "allThemes", "riskLevel", "riskDetails", "summary"] 
};

// --- EXPORTAÇÃO 1: ANÁLISE ---
export const analyzeWithGoogle = async (answerText, questionText) => {
    const safeAnswer = answerText || "";
    const safeQuestion = questionText || "Contexto geral";

    if (useMock) return mockResponse(safeAnswer);

    try {
        const fullPrompt = `
        Você é um especialista em People Analytics.
        PERGUNTA: "${safeQuestion}"
        RESPOSTA: "${safeAnswer}"
        Analise o sentimento, extraia temas e detecte riscos. Responda em JSON.
        `; 
        
        const response = await ai.models.generateContent({
            model: model,
            contents: { role: "user", parts: [{ text: fullPrompt }] },
            config: {
                responseMimeType: "application/json",
                responseSchema: outputSchema,
                temperature: 0.2,
            }
        });

        let jsonText = typeof response.text === 'function' ? response.text() : response.text;
        jsonText = jsonText.replace(/```json|```/g, '').trim();

        const analysis = JSON.parse(jsonText);
        return { ...analysis, source: 'gemini_context_aware' };
    } catch (e) {
        console.error('Gemini API ERROR:', e.message); 
        return { score: 0.0, magnitude: 0.0, label: 'neutral', allThemes: ['Erro'], riskLevel: 'Low', riskDetails: 'Erro API', summary: 'Falha.', source: 'gemini_fail' };
    }
};

// --- EXPORTAÇÃO 2: RESUMO (A QUE ESTAVA DANDO ERRO) ---
export const gerarResumoExecutivo = async (listaRespostas, departamento = "Geral") => {
    if (useMock) {
        return `[MOCK] Resumo Executivo para ${departamento}: Colaboradores apontam problemas de comunicação.`;
    }

    try {
        const textos = listaRespostas.filter(t => t && t.length > 5).slice(0, 50).map(t => `- "${t}"`).join("\n");
        if (!textos) return "Dados insuficientes.";

        const prompt = `Atue como RH. Resuma estas saídas de ${departamento}:\n${textos}\n\nEscreva 3 parágrafos sobre causas e ações.`;

        const response = await ai.models.generateContent({
            model: model,
            contents: { role: "user", parts: [{ text: prompt }] },
            config: { responseMimeType: "text/plain", temperature: 0.4 }
        });
        return typeof response.text === 'function' ? response.text() : response.text;
    } catch (e) {
        console.error('Erro resumo:', e.message);
        return "Erro ao gerar resumo.";
    }
};

function mockResponse(text) {
    const lower = text.toLowerCase();
    if (lower.includes('assédio') || lower.includes('processo')) {
        return { score: -0.9, magnitude: 1.8, label: 'negative', allThemes: ['Risco'], riskLevel: 'High', riskDetails: 'Risco Legal', summary: 'Grave.', source: 'mock' };
    }
    return { score: 0, magnitude: 0, label: 'neutral', allThemes: ['Geral'], riskLevel: 'Low', riskDetails: '', summary: 'Neutro.', source: 'mock' };
}