import {
  sequelize,
  Entrevista,
  Resposta,
  Usuario,
} from "../models/Relations.js";


  // GET /entrevistas
  export const listarEntrevistas = async (req, res) => {
    try {
      const entrevistas = await Entrevista.findAll({
        include: [
          {
            model: Usuario,
            attributes: ["nome_completo", "cargo", "departamento"], 
          },
          {
            model: Resposta,
            attributes: ["id_pergunta", "resposta_texto", "resposta_valor"],
          },
        ],
        order: [["data_entrevista", "DESC"]],
      });
      return res.status(200).json(entrevistas);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Erro ao listar entrevistas.", details: error.message });
    }
  };


// GET /entrevistas/:id
export const buscarEntrevista = async (req, res) => {
    try {
        const entrevista = await Entrevista.findByPk(req.params.id, {
            include: [
                { model: Usuario, attributes: ['nome_completo', 'cargo'] },
                {
                    model: Resposta,
                    include: [{
                        model: Pergunta, 
                        attributes: ['texto_pergunta', 'categoria']
                    }]
                }
            ]
        });

        if (!entrevista) {
            return res.status(404).json({ error: 'Entrevista não encontrada.' });
        }
        return res.status(200).json(entrevista);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar entrevista.', details: error.message });
    }
};

// POST /entrevistas
export const criarEntrevistaComRespostas = async (req, res) => {

    const { id_usuario, data_entrevista, status_entrevista, respostas } = req.body;


    const t = await sequelize.transaction();
    try {
    
        const novaEntrevista = await Entrevista.create({
            id_usuario,
            data_entrevista,
            status_entrevista
        }, { transaction: t });

        const respostasParaCriar = respostas.map(resp => ({
            id_entrevista: novaEntrevista.id_entrevista, 
            id_pergunta: resp.id_pergunta,
            resposta_texto: resp.resposta_texto,
            resposta_valor: resp.resposta_valor,
        }));

        await Resposta.bulkCreate(respostasParaCriar, { transaction: t });

        await t.commit();

        return res.status(201).json({
            message: 'Entrevista e respostas criadas com sucesso!',
            entrevista: novaEntrevista
        });

    } catch (error) {
        await t.rollback(); 
        
        return res.status(500).json({ 
            error: 'Falha ao criar entrevista e respostas. Operação desfeita.', 
            details: error.message 
        });
    }
};