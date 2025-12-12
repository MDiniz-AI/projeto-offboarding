import { Pergunta } from '../models/Relations.js';

export const seedPerguntas = async () => {
  try {
    console.log('🌱 [CHRO Mode] Sincronizando perguntas estratégicas (Preservando IDs)...');

    const perguntasEstrategicas = [
      // ---------------------------------------------------------
      // SEÇÃO 2: Perguntas gerais
      // ---------------------------------------------------------
      {
        texto_pergunta: "Em uma escala de 1 a 7, como você avalia sua experiência geral na empresa?",
        categoria: "Perguntas gerais",
        tipo_resposta: 3, // Range
        opcoes: null
      },
      {
        texto_pergunta: "Defina a cultura da nossa empresa em uma única palavra ou frase curta.",
        categoria: "Perguntas gerais",
        tipo_resposta: 0, // Texto Curto
        opcoes: null
      },
      {
        texto_pergunta: "Você recomendaria a empresa a um amigo como um bom lugar para trabalhar?",
        categoria: "Perguntas gerais",
        tipo_resposta: 3, // Range
        opcoes: null
      },

      // ---------------------------------------------------------
      // SEÇÃO 3: Cultura e ambiente
      // ---------------------------------------------------------
      {
        texto_pergunta: "O ambiente de trabalho promovia seu bem-estar físico e mental?",
        categoria: "Cultura e ambiente",
        tipo_resposta: 3, // Range
        opcoes: null
      },
      {
        texto_pergunta: "Descreva uma situação onde você sentiu (ou não sentiu) os valores da empresa na prática.",
        categoria: "Cultura e ambiente",
        tipo_resposta: 1, // Texto Longo
        opcoes: null
      },

      // ---------------------------------------------------------
      // SEÇÃO 4: Liderança e gestão
      // ---------------------------------------------------------
      {
        texto_pergunta: "Seu líder direto te dava autonomia para realizar suas tarefas?",
        categoria: "Liderança e gestão",
        tipo_resposta: 3, // Range
        opcoes: null
      },
      {
        texto_pergunta: "O que seu líder poderia ter feito diferente para melhorar sua experiência?",
        categoria: "Liderança e gestão",
        tipo_resposta: 1, // Texto Longo
        opcoes: null
      },

      // ---------------------------------------------------------
      // SEÇÃO 5: Estrutura, incentivos e oportunidades
      // ---------------------------------------------------------
      {
        texto_pergunta: "As ferramentas e tecnologias disponíveis eram adequadas para o seu trabalho?",
        categoria: "Estrutura, incentivos e oportunidades",
        tipo_resposta: 3, // Range
        opcoes: null
      },
      {
        texto_pergunta: "Como você avalia a clareza do plano de carreira e oportunidades de crescimento?",
        categoria: "Estrutura, incentivos e oportunidades",
        tipo_resposta: 3, // Range
        opcoes: null
      },
      {
        texto_pergunta: "O pacote de benefícios atendia às suas necessidades?",
        categoria: "Estrutura, incentivos e oportunidades",
        tipo_resposta: 3, // Range
        opcoes: null
      },

      // ---------------------------------------------------------
      // SEÇÃO 6: Comunicação e decisões estratégicas
      // ---------------------------------------------------------
      {
        texto_pergunta: "A comunicação da alta liderança sobre os rumos da empresa era clara?",
        categoria: "Comunicação e decisões estratégicas",
        tipo_resposta: 3, // Range
        opcoes: null
      },
      {
        texto_pergunta: "Você se sentia ouvido(a) nas decisões que impactavam sua área?",
        categoria: "Comunicação e decisões estratégicas",
        tipo_resposta: 2, // Seletor
        opcoes: JSON.stringify(["Sim, sempre", "Na maioria das vezes", "Raramente", "Nunca"])
      },

      // ---------------------------------------------------------
      // SEÇÃO 7: Perguntas específicas: Pedido de desligamento
      // ---------------------------------------------------------
      {
        texto_pergunta: "Qual foi o fator principal para a sua decisão de sair?",
        categoria: "Perguntas específicas: Pedido de desligamento",
        tipo_resposta: 2, // Seletor
        opcoes: JSON.stringify([
            "Melhor oportunidade salarial", 
            "Insatisfação com a liderança", 
            "Falta de crescimento/carreira", 
            "Ambiente/Cultura", 
            "Mudança de área/carreira",
            "Motivos pessoais",
            "Outros"
        ])
      },
      {
        texto_pergunta: "Existe algo que a empresa poderia ter feito para evitar sua saída?",
        categoria: "Perguntas específicas: Pedido de desligamento",
        tipo_resposta: 1, // Texto Longo
        opcoes: null
      },

      // ---------------------------------------------------------
      // SEÇÃO 8: Perguntas específicas: Liderança
      // ---------------------------------------------------------
      {
        texto_pergunta: "Como você avalia a competência técnica do seu gestor?",
        categoria: "Perguntas específicas: Liderança",
        tipo_resposta: 3, // Range
        opcoes: null
      },
      {
        texto_pergunta: "Seu gestor fornecia feedbacks construtivos regularmente?",
        categoria: "Perguntas específicas: Liderança",
        tipo_resposta: 2, // Seletor
        opcoes: JSON.stringify(["Sim, frequentemente", "Às vezes", "Raramente", "Nunca"])
      }
    ];

    // LÓGICA DE SINCRONIZAÇÃO INTELIGENTE (UPSERT)
    // Se a pergunta já existe, atualiza os campos (exceto ID). Se não, cria.
    for (const p of perguntasEstrategicas) {
        const perguntaExistente = await Pergunta.findOne({ 
            where: { texto_pergunta: p.texto_pergunta } 
        });

        if (perguntaExistente) {
            // Atualiza caso você mude o tipo ou categoria no código, mas MANTÉM O ID
            await perguntaExistente.update(p);
        } else {
            // Cria nova apenas se não existir
            await Pergunta.create(p);
        }
    }

    console.log('✅ Seed de perguntas sincronizado! IDs preservados.');

  } catch (error) {
    console.error('❌ Erro ao rodar seed de perguntas:', error);
  }
};