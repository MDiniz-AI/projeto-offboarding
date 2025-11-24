// O nome do arquivo será analyze.js (ou analyzeBatch.js)

// MUDANÇA 1: Troca de require por import (com a extensão .js obrigatória para ES Modules)
import { tryShortAnswer } from './shortLexicon.js';
import { analyzeWithGoogle } from './googleClient.js';
import { labelFrom } from './label.js';

// CORREÇÃO ESSENCIAL: Define a variável useMock localmente
const useMock = String(process.env.USE_MOCK || 'true').toLowerCase() === 'true'; 

async function analyzeBatch(items, { language } = {}) {
  const out = [];
  for (const it of items) {
    // MUDANÇA 1: Capturamos os dados da seção que vêm do dashboard
    const { questionId, answerText, sectionId, sectionName } = it;

    // 1) Respostas curtas com dicionário/direcionalidade
    const shortHit = tryShortAnswer(questionId, answerText);
    if (shortHit) {
      out.push({ 
        questionId, 
        // MUDANÇA 2: Adicionamos os dados da seção na resposta
        sectionId: sectionId || 'sem_secao',
        sectionName: sectionName || 'Sem Seção',
        ...shortHit 
      });
      continue;
    }

    // 2) LLM (Gemini)
    // NOTE: O analyzeWithGoogle agora retorna TUDO (score, magnitude, theme, risk)
    const analysis = await analyzeWithGoogle(answerText || '', language); 

    out.push({
      // MUDANÇA: Adicionamos os dados da seção aqui também
      sectionId: sectionId || 'sem_secao',
      sectionName: sectionName || 'Sem Seção',
      questionId,
      ...analysis, // Inclui score, magnitude, label, theme, riskLevel
      // CORREÇÃO FINAL: Usa a variável useMock definida no topo
      source: useMock ? 'mock' : 'gemini' 
    });
  }
  return out;
}

// MUDANÇA 4: Trocamos module.exports por export default
export default analyzeBatch;