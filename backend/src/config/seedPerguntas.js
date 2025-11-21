
import Pergunta from '../models/Pergunta.js';

// prof pediu para usar apenas o json e depois se der tempo usar perguntas do bd

export const seedPerguntas = async () => {
  try {
    const count = await Pergunta.count();
    if (count > 0) {
      console.log('⚠️ Seed ignorado: tabela de perguntas já populada.');
      return;
    }

    const categoriasMap = [
      "Geral",
      "Cultura e valores",
      "Liderança",
      "Experiência e futuro",
      "Desligamento",
      "Considerações finais"
    ];


    const dadosDoFront = [
      // Grupo 0
      [
        { question: "Como descreveria sua experiência geral na empresa?*", type: 3, option: null, required: true },
        { question: "Qual é a sua opinião sobre o clima organizacional de sua equipe/time?*", type: 3, option: null, required: true },
        { question: "Você se sentia ouvido e reconhecido?*", type: 2, option: ["opc1", "opc2"], required: true },
        { question: "Qual é a sua opinião sobre o pacote de salário e benefícios oferecido pela empresa (em comparação com o mercado)*?", type: 3, option: null, required: true },
        { question: "Ainda sobre pacote de salário e benefícios, o que poderia melhorar?", type: 0, option: null, required: false }
      ],

      // Grupo 1
      [
        { question: "Pensando em sua jornada aqui, o que você mais sentiu orgulho ou o que mais te deu energia no dia a dia?*", type: 1, option: null, required: true },
        { question: "Quais valores da Blip poderiam ser mais coerentes?*", type: 2, option: ["opc1", "opc2"], required: true },
        { question: "Gostaria de Justificar?", type: 1, option: null, required: false }
      ],

      // Grupo 2
      [
        { question: "Como você avaliaria o apoio de sua liderança direta no seu desenvolvimento e bem-estar?*", type: 3, required: true },
        { question: "Há algo que poderia melhorar?", type: 0, option: null, required: false }
      ],

      // Grupo 3
      [
        { question: "Se você tivesse um \"superpoder\" para mudar uma única coisa na Blip a fim de melhorar a experiência dos times, o que você mudaria?*", type: 0, required: true },
        { question: "No futuro, você voltaria a trabalhar na Blip?", type: 2, option: ["opc1", "opc2"], required: false }
      ],

      // Grupo 4
      [
        { question: "Como você avalia a forma como seu desligamento foi comunicado e conduzido, considerando clareza, respeito e suporte?*", type: 3, required: true },
        { question: "Se desejar, compartilhe o porquê da sua nota anterior", type: 0, option: null, required: false }
      ],

      // Grupo 5
      [
        { question: "Se pudesse dar um conselho direto ao CEO e à alta liderança, qual seria?", type: 0, option: null, required: false },
        { question: "Gostaria de dizer/adicionar algo que ainda não foi perguntado?", type: 1, option: null, required: false }
      ]
    ];

    
    const perguntasParaSalvar = [];

    dadosDoFront.forEach((grupo, indexCategoria) => {
      const categoria = categoriasMap[indexCategoria] || "Outros";

      grupo.forEach(item => {
        perguntasParaSalvar.push({
          texto_pergunta: item.question,
          tipo_resposta: item.type,
          opcoes: item.option,
          obrigatoria: item.required,
          categoria: categoria
        });
      });
    });

    await Pergunta.bulkCreate(perguntasParaSalvar);
    console.log("✅ Perguntas inseridas com sucesso!");

  } catch (error) {
    console.error("❌ Erro ao rodar seed de perguntas:", error);
  }
};