// src/services/analise_sentimento/googleClient.js

import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenAI } from '@google/genai';

const useMock = String(process.env.USE_MOCK || 'true').toLowerCase() === 'true';

// Inicializa o cliente Gemini
const ai = useMock ? null : new GoogleGenAI(process.env.GEMINI_API_KEY);
const model = "gemini-2.5-flash"; // Modelo rápido para análise

// Define a estrutura JSON para extração de TUDO (incluindo array allThemes)
const outputSchema = {
    type: "object",
    properties: {
        score: { type: "number", description: "O score de sentimento entre -1.0 (muito negativo) e 1.0 (muito positivo)." },
        magnitude: { type: "number", description: "A força total da emoção na resposta, de 0.0 a 2.0." },
        label: { type: "string", description: "Classificação final: 'positive', 'negative' ou 'neutral'." },
        
        allThemes: { 
            type: "array",
            items: { type: "string" },
            description: "Lista de TODOS os temas citados no texto, usando estritamente a lista de temas pré-definida do RH. Não classifique o tema principal, apenas liste todos os que aparecem."
        },
        riskLevel: {
            type: "string",
            description: "Nível de risco para o RH/Pessoas: 'High', 'Medium', ou 'Low'."
        }
    },
    required: ["score", "magnitude", "label", "allThemes", "riskLevel"] 
};


export async function analyzeWithGoogle(text, language) {
    if (useMock) {
        // ===== MOCK SIMPLES DE FALLBACK (Para testes off-line) =====
        if (text && text.includes('excelente')) {
             return { score: 0.8, magnitude: 0.9, label: 'positive', allThemes: ['Reconhecimento'], riskLevel: 'Low', source: 'mock' };
        } else if (text && text.includes('tóxico') || text.includes('desrespeitad')) {
             return { score: -0.9, magnitude: 1.8, label: 'negative', allThemes: ['Liderança', 'Cultura e Ambiente'], riskLevel: 'High', source: 'mock' };
        }
        return { score: 0, magnitude: 0, label: 'neutral', allThemes: ['Geral'], riskLevel: 'Low', source: 'mock' };
    }

    // ===== INTEGRAÇÃO GEMINI LLM (Caminho Ideal) =====
    try {
        const fullPrompt = `Você é um analista de People Analytics especializado em offboarding. Use estritamente as categorias de temas e risco fornecidas no esquema JSON. 
        Analise a seguinte resposta de feedback: "${text}". 
        Regras:
        1. O campo 'allThemes' deve ser um array listando TODOS os temas citados.
        2. Não defina o tema principal.
        Responda estritamente no formato JSON definido.`; 
        
        const response = await ai.models.generateContent({
            model: model,
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: outputSchema,
            }
        });

        // CORREÇÃO ESSENCIAL: Verifica se a resposta contém texto antes de processar
        if (!response || !response.text || response.text.length < 5) {
            throw new Error("Gemini retornou uma resposta vazia ou incompleta.");
        }

        const jsonText = response.text.trim();
        const analysis = JSON.parse(jsonText);

        return { ...analysis, source: 'gemini' };

    } catch (e) {
        // Imprime o erro detalhado da API para diagnóstico
        console.error('Gemini API ERROR:', e.message, e.response?.text); 
        
        // Retorno de fallback seguro
        return { score: 0.0, magnitude: 0.0, label: 'neutral', allThemes: ['API_FAIL'], riskLevel: 'High', source: 'gemini_fail' };
    }
}