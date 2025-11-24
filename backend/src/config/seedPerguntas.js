import Pergunta from '../models/Pergunta.js';

export const seedPerguntas = async () => {
  try {
    // 1. Verifica se o banco já tem dados para não duplicar
    const count = await Pergunta.count();
    if (count > 0) {
      console.log('⚠️ Seed ignorado: Tabela de perguntas já populada.');
      return;
    }

    // 2. Mapeamento das Categorias na ordem que o Front espera
    const categoriasMap = [
      "Perguntas gerais",       // Índice 0 do JSON
      "Cultura e ambiente",     // Índice 1 do JSON
      // Adicione mais se o front tiver mais grupos
    ];

    // 3. O JSON front
    const dadosDoFront = [
      // GRUPO 0: Perguntas gerais
      [
        { "question": "Qual é a sua opinião sobre o clima organizacional de sua equipe/time?", "type": 3, "option": null },
        { "question": "Você se sentia valorizado pelas suas contribuições e entregas?", "type": 2, "option": ["Sim", "Não", "Parcialmente"] },
        { "question": "Você se sentia ouvido e reconhecido?", "type": 2, "option": ["Sempre", "Às vezes", "Nunca"] },
        { "question": "O que mais te motivou a aceitar a proposta inicial para trabalhar aqui?", "type": 2, "option": ["Salário", "Desafio", "Localização"] },
        { "question": "Qual é a sua opinião sobre o pacote de salário e benefícios oferecido pela empresa?", "type": 3, "option": null },
        { "question": "Ainda sobre pacote de salário e benefícios, o que poderia melhorar?", "type": 0, "option": null },
        { "question": "Como descreveria sua experiência geral na empresa?", "type": 3, "option": null },
        { "question": "Se tivesse que resumir em uma palavra o que é trabalhar aqui, qual seria?", "type": 0, "option": null },
        { "question": "Há alguma justificativa para a escolha dessa palavra?", "type": 1, "option": null }
      ],
      // GRUPO 1: Cultura e ambiente
      [
        { "question": "O que mais te orgulhava na cultura da empresa?", "type": 2, "option": ["Colaboração", "Inovação", "Diversidade"] },
        { "question": "Que comportamentos ou práticas você acha que enfraquecem a cultura na prática?", "type": 2, "option": ["Fofoca", "Burocracia", "Falta de transparência"] },
        { "question": "Como os valores da empresa são vividos de forma coerente pelas lideranças?", "type": 3, "option": null },
        { "question": "Quais valores poderiam ser mais coerentes?", "type": 2, "option": ["Valor A", "Valor B"] },
        { "question": "Se pudesse mudar um elemento da cultura, qual seria?", "type": 2, "option": ["Flexibilidade", "Comunicação"] },
        { "question": "Poderia Justificar?", "type": 1, "option": null }
      ]
    ];

    // 4. Transformação (Front -> Back) e Inserção
    const perguntasParaSalvar = [];

    dadosDoFront.forEach((grupo, indexCategoria) => {
      // Pega o nome da categoria ("Perguntas gerais", "Cultura...")
      const nomeCategoria = categoriasMap[indexCategoria] || "Outros"; 
      
      // Itera sobre cada pergunta dentro do grupo
      grupo.forEach(item => {
        perguntasParaSalvar.push({
          texto_pergunta: item.question,  // Traduz "question"
          tipo_resposta: item.type,       // Traduz "type"
          opcoes: item.option,            // Traduz "option"
          categoria: nomeCategoria        // Adiciona a categoria
        });
      });
    });

    // 5. Salva tudo no banco de uma vez
    await Pergunta.bulkCreate(perguntasParaSalvar);
    console.log('✅ Perguntas do JSON Frontend inseridas com sucesso!');

  } catch (error) {
    console.error('❌ Erro no script seed:', error.message);
  }
};