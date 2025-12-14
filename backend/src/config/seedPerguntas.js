import { Pergunta } from '../models/Relations.js';

export const seedPerguntas = async () => {
  try {
    console.log('🌱 [CHRO Mode] Sincronizando Matriz de Perguntas Estratégicas...');

    const perguntasEstrategicas = [
      // ==============================================================================
      // 🟢 NÚCLEO COMUM (TODOS RESPONDEM)
      // ==============================================================================
      
      {
        texto_pergunta: "Em uma escala de 1 a 7, como você avalia sua experiência geral na empresa?",
        categoria: "Perguntas gerais",
        tipo_resposta: 3, 
        opcoes: null,
        condicao_saida: 'todos',
        condicao_cargo: 'todos'
      },
      {
        texto_pergunta: "Você recomendaria a empresa a um amigo como um bom lugar para trabalhar (eNPS)?",
        categoria: "Perguntas gerais",
        tipo_resposta: 3, 
        opcoes: null,
        condicao_saida: 'todos',
        condicao_cargo: 'todos'
      },
      {
        texto_pergunta: "O ambiente de trabalho promovia segurança psicológica para você ser quem é?",
        categoria: "Cultura e ambiente",
        tipo_resposta: 3,
        opcoes: null,
        condicao_saida: 'todos',
        condicao_cargo: 'todos'
      },
      {
        texto_pergunta: "Você sentia que os valores da empresa eram praticados no dia a dia ou apenas escritos?",
        categoria: "Cultura e ambiente",
        tipo_resposta: 1, 
        opcoes: null,
        condicao_saida: 'todos',
        condicao_cargo: 'todos'
      },
      {
        texto_pergunta: "Seu líder direto fornecia feedbacks construtivos que ajudavam no seu desenvolvimento?",
        categoria: "Liderança e gestão",
        tipo_resposta: 3,
        opcoes: null,
        condicao_saida: 'todos',
        condicao_cargo: 'todos'
      },
      {
        texto_pergunta: "O pacote de remuneração e benefícios estava alinhado com suas responsabilidades?",
        categoria: "Estrutura e Benefícios",
        tipo_resposta: 3,
        opcoes: null,
        condicao_saida: 'todos',
        condicao_cargo: 'todos'
      },

      // ==============================================================================
      // 🟡 CONDICIONAL: TIPO DE SAÍDA
      // ==============================================================================

      // --- VOLUNTÁRIA ---
      {
        texto_pergunta: "Qual foi o fator determinante (o 'gatilho') para você aceitar outra proposta ou sair?",
        categoria: "Motivos da Saída",
        tipo_resposta: 2, 
        opcoes: JSON.stringify(["Salário/Benefícios maiores", "Melhor oportunidade de carreira", "Insatisfação com Liderança", "Cultura/Ambiente tóxico", "Falta de Flexibilidade", "Mudança de Carreira", "Outros"]),
        condicao_saida: 'voluntaria', // <--- SÓ APARECE SE FOR VOLUNTÁRIA
        condicao_cargo: 'todos'
      },
      {
        texto_pergunta: "O que a empresa poderia ter feito diferente nos últimos 6 meses para que você ficasse?",
        categoria: "Motivos da Saída",
        tipo_resposta: 1, 
        opcoes: null,
        condicao_saida: 'voluntaria',
        condicao_cargo: 'todos'
      },

      // --- INVOLUNTÁRIA ---
      {
        texto_pergunta: "O processo de desligamento foi conduzido de forma respeitosa e clara?",
        categoria: "Processo de Desligamento",
        tipo_resposta: 3,
        opcoes: null,
        condicao_saida: 'involuntaria', // <--- SÓ APARECE SE FOR INVOLUNTÁRIA (DEMISSÃO)
        condicao_cargo: 'todos'
      },
      {
        texto_pergunta: "Você já havia recebido feedbacks anteriores indicando que seu desempenho não estava adequado?",
        categoria: "Processo de Desligamento",
        tipo_resposta: 2,
        opcoes: JSON.stringify(["Sim, estava ciente e tivemos planos de ação", "Sim, mas foram superficiais", "Não, foi uma surpresa total"]),
        condicao_saida: 'involuntaria',
        condicao_cargo: 'todos'
      },

      // ==============================================================================
      // 🔵 CONDICIONAL: LIDERANÇA
      // ==============================================================================
      
      {
        texto_pergunta: "Você sentiu que tinha autonomia suficiente para montar e gerir seu time?",
        categoria: "Gestão e Estratégia",
        tipo_resposta: 3,
        opcoes: null,
        condicao_saida: 'todos',
        condicao_cargo: 'lider' // <--- SÓ APARECE SE FOR LÍDER
      },
      {
        texto_pergunta: "As decisões estratégicas da empresa eram claras e permitiam que você desdobrasse metas para seu time?",
        categoria: "Gestão e Estratégia",
        tipo_resposta: 2,
        opcoes: JSON.stringify(["Sim, sempre claras", "Parcialmente claras", "Confusas/Mudavam sempre", "Nunca tive visibilidade"]),
        condicao_saida: 'todos',
        condicao_cargo: 'lider'
      },
      
      // FINALIZAÇÃO (Todos)
      {
        texto_pergunta: "Se pudesse dar um conselho direto ao CEO e à alta liderança, qual seria?",
        categoria: "Considerações Finais",
        tipo_resposta: 1,
        opcoes: null,
        condicao_saida: 'todos',
        condicao_cargo: 'todos'
      }
    ];

    // UPSERT Inteligente
    for (const p of perguntasEstrategicas) {
        // Tenta encontrar pelo texto da pergunta
        const perguntaExistente = await Pergunta.findOne({ 
            where: { texto_pergunta: p.texto_pergunta } 
        });

        if (perguntaExistente) {
            // Se já existe, atualiza as condições (caso tenhamos mudado a lógica)
            await perguntaExistente.update(p);
        } else {
            // Se não, cria
            await Pergunta.create(p);
        }
    }

    console.log('✅ Matriz de Perguntas de RH Sincronizada com Condicionais!');

  } catch (error) {
    console.error('❌ Erro ao rodar seed de perguntas:', error);
  }
};