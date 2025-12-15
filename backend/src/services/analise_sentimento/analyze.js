// src/services/analise_sentimento/analyze.js

import { tryShortAnswer } from './shortLexicon.js';
import { analyzeWithGroq } from './googleClient.js';
import { Pergunta } from '../../models/Relations.js';

// ⚠️ IMPORTANTE: mock DESATIVADO por padrão
const useMock = String(process.env.USE_MOCK || 'false').toLowerCase() === 'true';

async function analyzeBatch(items, { language } = {}) {
  const out = [];

  for (const it of items) {
    const questionId = it.questionId ?? it.id_pergunta;
    const answerText = it.answerText ?? it.resposta_texto ?? '';

    let questionText = it.texto_pergunta ?? it.questionText;

    // 🔎 Busca contexto da pergunta
    if (!questionText && questionId) {
      try {
        const perguntaDoc = await Pergunta.findByPk(questionId);
        if (perguntaDoc) {
          questionText = perguntaDoc.texto_pergunta;
        }
      } catch (err) {
        console.warn(`⚠️ Não foi possível buscar a pergunta ${questionId}`);
      }
    }

    // 🧠 Respostas curtas (léxico)
    const shortHit = tryShortAnswer(questionId, answerText);

    if (shortHit) {
      out.push({
        questionId,
        score: shortHit.score ?? 0,
        magnitude: 0,
        label: shortHit.label ?? 'neutral',
        theme: shortHit.theme ?? 'Geral',
        riskLevel: 'Low',
        riskDetails: '',
        summary: answerText,
        source: 'lexicon'
      });
      continue;
    }

    // 🤖 IA (Gemini)
    const analysis = await analyzeWithGroq(answerText, questionText);

    out.push({
      questionId,
      score: analysis.score ?? 0,
      magnitude: analysis.magnitude ?? 0,
      label: analysis.label ?? 'neutral',
      theme: analysis.allThemes?.[0] ?? 'Geral',
      riskLevel: analysis.riskLevel ?? 'Low',
      riskDetails: analysis.riskDetails ?? '',
      summary: analysis.summary ?? '',
      source: analysis.source ?? (useMock ? 'mock' : 'gemini')
    });
  }

  return out;
}

export default analyzeBatch;