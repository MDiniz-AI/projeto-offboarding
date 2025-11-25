// Regras para respostas curtas (até 3 palavras) e perguntas "fechadas".
// Usamos correspondência por "contém", com normalização de acentos.

function norm(s = '') {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

// Dicionário por pergunta (ex.: q_salario) com listas de termos/expressões
const closedQuestions = {
  q_salario: {
    positive: [
      'sim',
      'excelente', 'otimo', 'ótimo',
      'bom', 'boa', 'muito bom',
      'satisfatorio', 'satisfatório',
      'na media pra cima', 'na média pra cima',
      'acima da media', 'acima da média',
      'salario excelente', 'salário excelente',
      'salario ok', 'salário ok'
    ],
    negative: [
      'nao', 'não',
      'ruim', 'pessimo', 'péssimo',
      'horrivel', 'horrível', 'terrivel', 'terrível',
      'baixo', 'muito baixo',
      'salario baixo', 'salário baixo',
      'insuficiente'
    ],
    neutral: [
      'ok', 'na media', 'na média', 'tanto faz', 'regular', 'aceitável', 'coerente'
    ]
  }
};

// fallback genérico para respostas curtíssimas em outras perguntas
const genericWords = {
  positive: ['excelente','otimo','ótimo','bom','boa','maravilhoso','maravilhosa','top','satisfeito','satisfeita'],
  negative: ['ruim','pessimo','péssimo','horrivel','horrível','terrivel','terrível','pessima','péssima'],
  neutral:  ['ok','regular','tanto faz','sei la','sei lá','na media','na média']
};

export function tryShortAnswer(questionId, raw) {
  if (!raw) return null;
  const text = norm(raw);

  // Considera "resposta curta" até 3 palavras
  if (text.split(/\s+/).length <= 3) {
    const q = closedQuestions[questionId];
    const hasAny = (arr) => arr.some(k => text.includes(norm(k)));

    if (q) {
      if (hasAny(q.positive)) return { score: 0.8, magnitude: 0.9, label: 'positive', source: 'lexicon' };
      if (hasAny(q.negative)) return { score: -0.8, magnitude: 0.9, label: 'negative', source: 'lexicon' };
      if (hasAny(q.neutral))  return { score: 0.0, magnitude: 0.0, label: 'neutral',  source: 'lexicon' };
    }

    // fallback genérico
    if (hasAny(genericWords.positive)) return { score: 0.6, magnitude: 0.7, label: 'positive', source: 'lexicon' };
    if (hasAny(genericWords.negative)) return { score: -0.6, magnitude: 0.7, label: 'negative', source: 'lexicon' };
    if (hasAny(genericWords.neutral))  return { score: 0.0, magnitude: 0.0, label: 'neutral',  source: 'lexicon' };
  }

  return null;
}
// MUDANÇA: module.exports removido e trocado por 'export' acima