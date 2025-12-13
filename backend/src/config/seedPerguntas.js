import { Pergunta } from '../models/Relations.js';

export const seedPerguntas = async () => {
  try {
    console.log('🌱 [CHRO Mode] Sincronizando Matriz de Perguntas (Voluntário/Involuntário/Liderança)...');

    /* ESTRATÉGIA DE PERGUNTAS:
       1. Núcleo Comum (Todos respondem): Cultura, Clima, Estrutura.
       2. Condicional de Saída: 
          - Voluntária: Foco em retenção e motivos da escolha.
          - Involuntária: Foco em respeito no processo e feedback prévio.
       3. Condicional de Cargo:
          - Liderança: Foco em autonomia, estratégia e apoio da diretoria.
    */

    const perguntasEstrategicas = [
      // ==============================================================================
      // 🟢 NÚCLEO COMUM (TODOS RESPONDEM)
      // ==============================================================================
      
      // SEÇÃO: Perguntas gerais
      {
        texto_pergunta: "Em uma escala de 1 a 7, como você avalia sua experiência geral na empresa?",
        categoria: "Perguntas gerais",
        tipo_resposta: 3, // Range
        opcoes: null
      },
      {
        texto_pergunta: "Você recomendaria a empresa a um amigo como um bom lugar para trabalhar (eNPS)?",
        categoria: "Perguntas gerais",
        tipo_resposta: 3, 
        opcoes: null
      },

      // SEÇÃO: Cultura e ambiente
      {
        texto_pergunta: "O ambiente de trabalho promovia segurança psicológica para você ser quem é?",
        categoria: "Cultura e ambiente",
        tipo_resposta: 3,
        opcoes: null
      },
      {
        texto_pergunta: "Você sentia que os valores da empresa eram praticados no dia a dia ou apenas escritos?",
        categoria: "Cultura e ambiente",
        tipo_resposta: 1, // Texto Longo
        opcoes: null
      },

      // SEÇÃO: Liderança e gestão (Avaliação do Chefe Imediato)
      {
        texto_pergunta: "Seu líder direto fornecia feedbacks construtivos que ajudavam no seu desenvolvimento?",
        categoria: "Liderança e gestão",
        tipo_resposta: 3,
        opcoes: null
      },
      {
        texto_pergunta: "Como você avalia a competência técnica e humana do seu gestor direto?",
        categoria: "Liderança e gestão",
        tipo_resposta: 3,
        opcoes: null
      },

      // SEÇÃO: Estrutura e Benefícios
      {
        texto_pergunta: "O pacote de remuneração e benefícios estava alinhado com suas responsabilidades?",
        categoria: "Estrutura, incentivos e oportunidades",
        tipo_resposta: 3,
        opcoes: null
      },

      // ==============================================================================
      // 🟡 CONDICIONAL: TIPO DE SAÍDA
      // ==============================================================================

      // SEÇÃO: Saída Voluntária (Pediu demissão) -> Foco: O que perdemos?
      {
        texto_pergunta: "Qual foi o fator determinante (o 'gatilho') para você aceitar outra proposta ou sair?",
        categoria: "Saída: Voluntária",
        tipo_resposta: 2, // Seletor
        opcoes: JSON.stringify(["Salário/Benefícios maiores", "Melhor oportunidade de carreira", "Insatisfação com Liderança", "Cultura/Ambiente tóxico", "Falta de Flexibilidade", "Mudança de Carreira", "Outros"])
      },
      {
        texto_pergunta: "O que a empresa poderia ter feito diferente nos últimos 6 meses para que você ficasse?",
        categoria: "Saída: Voluntária",
        tipo_resposta: 1, // Texto Longo (Crucial para retenção)
        opcoes: null
      },
      {
        texto_pergunta: "Você chegou a conversar sobre sua insatisfação antes de decidir sair?",
        categoria: "Saída: Voluntária",
        tipo_resposta: 2,
        opcoes: JSON.stringify(["Sim, com meu líder", "Sim, com o RH", "Sim, com colegas", "Não, não me senti confortável"])
      },

      // SEÇÃO: Saída Involuntária (Foi demitido) -> Foco: Justiça e Processo
      {
        texto_pergunta: "O processo de desligamento foi conduzido de forma respeitosa e clara?",
        categoria: "Saída: Involuntária",
        tipo_resposta: 3,
        opcoes: null
      },
      {
        texto_pergunta: "Você já havia recebido feedbacks anteriores indicando que seu desempenho ou comportamento não estavam adequados?",
        categoria: "Saída: Involuntária",
        tipo_resposta: 2,
        opcoes: JSON.stringify(["Sim, estava ciente e tivemos planos de ação", "Sim, mas foram superficiais", "Não, foi uma surpresa total"])
      },
      {
        texto_pergunta: "Como você avalia o suporte da empresa neste momento de transição?",
        categoria: "Saída: Involuntária",
        tipo_resposta: 1,
        opcoes: null
      },

      // ==============================================================================
      // 🔵 CONDICIONAL: LIDERANÇA (Apenas para quem era Líder)
      // ==============================================================================
      
      // SEÇÃO: Público Liderança
      {
        texto_pergunta: "Você sentiu que tinha autonomia suficiente para montar e gerir seu time?",
        categoria: "Público: Liderança",
        tipo_resposta: 3,
        opcoes: null
      },
      {
        texto_pergunta: "Como você avalia o suporte da Diretoria/C-Level para resolver os problemas da sua área?",
        categoria: "Público: Liderança",
        tipo_resposta: 3,
        opcoes: null
      },
      {
        texto_pergunta: "As decisões estratégicas da empresa eram claras e permitiam que você desdobrasse metas para seu time?",
        categoria: "Público: Liderança",
        tipo_resposta: 2,
        opcoes: JSON.stringify(["Sim, sempre claras", "Parcialmente claras", "Confusas/Mudavam sempre", "Nunca tive visibilidade"])
      },
      {
        texto_pergunta: "Qual o maior desafio de gestão que você enfrentou e que a empresa não ajudou a resolver?",
        categoria: "Público: Liderança",
        tipo_resposta: 1,
        opcoes: null
      }
    ];

    // UPSERT (Atualiza ou Cria)
    for (const p of perguntasEstrategicas) {
        const perguntaExistente = await Pergunta.findOne({ 
            where: { texto_pergunta: p.texto_pergunta } 
        });

        if (perguntaExistente) {
            await perguntaExistente.update(p);
        } else {
            await Pergunta.create(p);
        }
    }

    console.log('✅ Matriz de Perguntas de RH Sincronizada!');

  } catch (error) {
    console.error('❌ Erro ao rodar seed de perguntas:', error);
  }
};