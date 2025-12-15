import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

// --- CONFIGURAÇÃO ---
// Se USE_MOCK for "true", não gasta cota nenhuma (útil para testes locais)
const useMock = String(process.env.USE_MOCK || "false").toLowerCase() === "true";

// Inicializa Groq
// Certifique-se de ter GROQ_API_KEY no seu .env
const groq = process.env.GROQ_API_KEY 
  ? new Groq({ apiKey: process.env.GROQ_API_KEY }) 
  : null;

// MODELOS GROQ
// 'llama3-70b-8192' -> Mais inteligente (Recomendado para análise e resumos complexos)
// 'llama3-8b-8192'  -> Mais rápido e econômico (Bom para tarefas simples)
const MODEL_SMART = "llama-3.3-70b-versatile"; 

// --- FUNÇÃO 1: ANÁLISE INDIVIDUAL (Retorna JSON) ---
export const analyzeWithGroq = async (answerText, questionText) => {
  const safeAnswer = answerText || "";
  const safeQuestion = questionText || "Contexto geral";

  // 1. Mock para economizar ou testes
  if (useMock || !safeAnswer) return mockResponse(safeAnswer);

  if (!groq) {
    console.error("❌ ERRO: Chave da Groq não configurada.");
    return mockResponse(safeAnswer);
  }

  // 2. Prompt Estruturado para JSON
  const systemPrompt = `
    Você é um especialista sênior em People Analytics e RH.
    Sua tarefa é analisar a resposta de um colaborador em uma entrevista de desligamento.
    
    Analise com profundidade e retorne APENAS um objeto JSON válido.
    NÃO escreva introduções como "Aqui está o JSON". Retorne apenas o JSON cru.

    ESTRUTURA DO JSON ESPERADA:
    {
      "score": (número decimal entre -1.0 e 1.0, onde -1 é muito negativo e 1 muito positivo),
      "magnitude": (número decimal entre 0.0 e 5.0, indicando a intensidade do sentimento),
      "label": ("positive", "neutral", "negative"),
      "allThemes": ["tema1", "tema2", "tema3"], (Array de strings, ex: "Salário", "Gestão", "Clima", "Carreira"),
      "riskLevel": ("High", "Medium", "Low"), (Baseado em menções a assédio, processos trabalhistas ou burnout grave),
      "riskDetails": (String curta explicando o risco, ou string vazia se Low),
      "summary": (Um resumo de 1 frase da resposta)
    }
  `;

  const userContent = `
    PERGUNTA FEITA: "${safeQuestion}"
    RESPOSTA DO COLABORADOR: "${safeAnswer}"
  `;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
      ],
      model: MODEL_SMART,
      temperature: 0.1, // Baixa temperatura para ser consistente no JSON
      response_format: { type: "json_object" }, // Força modo JSON (Crucial no Llama 3)
    });

    const content = completion.choices[0]?.message?.content;
    
    if (!content) throw new Error("Retorno vazio da Groq");

    // Parse seguro
    const analysis = JSON.parse(content);
    
    // Adiciona flag da fonte
    return { ...analysis, source: "groq-llama3" };

  } catch (error) {
    console.error("❌ Erro na análise Groq:", error.message);
    // Fallback para mock em caso de erro na API para não travar o front
    return { ...mockResponse(safeAnswer), riskDetails: "Erro na IA (Fallback)" };
  }
};


// --- FUNÇÃO 2: RESUMO EXECUTIVO GERAL ---
export const gerarResumoExecutivoGeral = async (listaRespostas) => {
  if (useMock) return "[MOCK] Visão geral: A empresa precisa focar em retenção e plano de carreira.";

  // Filtra respostas vazias e limita caracteres para não estourar contexto
  const textos = listaRespostas
    .filter((t) => t && t.length > 5)
    .slice(0, 100) // Pega as 100 primeiras para amostra (Llama suporta bastante contexto)
    .join("\n---\n");

  if (!textos || textos.length < 10) return "Dados insuficientes para gerar resumo.";

  if (!groq) return "Erro: API Key da Groq não configurada.";

  const prompt = `
    Você é um Diretor de RH experiente. Abaixo estão várias respostas de colaboradores em entrevistas de desligamento.
    
    Gere um RESUMO EXECUTIVO ESTRATÉGICO consolidando os principais motivos de saída e o sentimento geral da empresa.
    
    Diretrizes:
    1. Seja direto e profissional (Português do Brasil).
    2. Use no máximo 2 parágrafos.
    3. Não cite nomes de pessoas.
    4. Foque em padrões (ex: "70% citaram falta de reconhecimento").
    
    DADOS (RESPOSTAS):
    ${textos}
  `;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "Você é um assistente executivo de análise de dados." },
        { role: "user", content: prompt },
      ],
      model: MODEL_SMART,
      temperature: 0.3,
    });

    return completion.choices[0]?.message?.content || "Não foi possível gerar o resumo.";

  } catch (error) {
    console.error("❌ Erro Resumo Geral Groq:", error.message);
    return "Erro ao processar resumo executivo.";
  }
};


// --- FUNÇÃO 3: RESUMO POR DEPARTAMENTO ---
export const gerarResumoExecutivoDepartamento = async (listaRespostas, departamento) => {
  if (useMock) return `[MOCK] O departamento ${departamento} tem desafios pontuais de gestão.`;

  const textos = listaRespostas
    .filter((t) => t && t.length > 5)
    .slice(0, 50)
    .join("\n---\n");

  if (!textos || textos.length < 10) return `Dados insuficientes para o departamento ${departamento}.`;

  if (!groq) return "Erro: API Key não configurada.";

  const prompt = `
    Você é um consultor de RH focado no departamento: ${departamento}.
    Analise as respostas de saída abaixo e crie um micro-relatório.

    Formato de Saída:
    - Um parágrafo resumindo o clima do time.
    - Uma lista curta (bullet points) com 3 principais dores citadas.
    
    DADOS:
    ${textos}
  `;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "Você é um analista de clima organizacional." },
        { role: "user", content: prompt },
      ],
      model: MODEL_SMART,
      temperature: 0.3,
    });

    return completion.choices[0]?.message?.content || "Erro ao gerar resumo.";

  } catch (error) {
    console.error(`❌ Erro Resumo Dept ${departamento}:`, error.message);
    return "Erro ao processar resumo do departamento.";
  }
};


// --- FUNÇÃO MOCK (BACKUP) ---
function mockResponse(text) {
  const lower = text.toLowerCase();
  let score = 0;
  let label = "neutral";
  let themes = ["Geral"];
  let riskLevel = "Low";

  if (lower.includes("ruim") || lower.includes("péssimo") || lower.includes("sair")) {
    score = -0.6;
    label = "negative";
  }
  if (lower.includes("bom") || lower.includes("ótimo") || lower.includes("gostei")) {
    score = 0.8;
    label = "positive";
  }
  if (lower.includes("salário") || lower.includes("dinheiro")) themes.push("Remuneração");
  if (lower.includes("gestão") || lower.includes("chefe")) themes.push("Liderança");
  
  if (lower.includes("assédio") || lower.includes("abuso") || lower.includes("processo")) {
    riskLevel = "High";
    score = -0.9;
    themes.push("Risco Legal");
  }

  return {
    score,
    magnitude: Math.abs(score) + 0.2,
    label,
    allThemes: themes,
    riskLevel,
    riskDetails: riskLevel === "High" ? "Termos sensíveis detectados." : "",
    summary: "Análise simulada (Mock).",
    source: "mock_fallback",
  };
}