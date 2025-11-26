import InputCurto from "../InputCurto.jsx";
import InputLongo from "../InputLongo.jsx";
import Seletor from "../Seletor.jsx";
import {
  CaretDownIcon,
  FloppyDiskIcon,
  PlusIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { createContext, useContext, useState, useEffect } from "react";
import { Squircle } from "corner-smoothing";
import api from "../../lib/api";

export default (props) => {
  const [perguntas, setPerguntas] = useState([]);
  const [entrevistasUsuario, setEntrevistasUsuario] = useState([]);
  const [idUsuarioReal, setIdUsuarioReal] = useState(null);
  const [respostas, setRespostas] = useState([]);


  useEffect(() => {
    async function carregarUsuario() {
      try {
        if (!props.emailUsuario) return;
        

        const response = await api.get(`/usuarios/email/${props.emailUsuario}`);
       // console.log("Usuário encontrado:", response.data);
        setIdUsuarioReal(response.data.usuario_id);
       
      } catch (err) {
        console.error("Erro ao buscar usuário:", err);
      }
    }

    carregarUsuario();
  }, [props.emailUsuario]);


  useEffect(() => {
    async function carregarEntrevistas() {
      try {
            
        if (!idUsuarioReal) return;
        const response = await api.get("/entrevistas/entrevistas");

        const todas = response.data;
        // console.log(todas)

        const filtradas = todas.filter(
          (e) => Number(e.id_usuario) === Number(idUsuarioReal)
        );

       // console.log("Entrevistas filtradas:", filtradas);

        setEntrevistasUsuario(filtradas);
      } catch (error) {
        console.error("Erro ao carregar entrevistas:", error);
      }
    }

    carregarEntrevistas();
  }, [idUsuarioReal]);


  useEffect(() => {
    async function carregarPerguntas() {
      try {
        const response = await api.get("/perguntas/");
        const todasPerguntas = response.data.flat();
        console.log(todasPerguntas)

        setPerguntas(todasPerguntas);
      } catch (err) {
        console.error("Erro ao carregar perguntas:", err);
      }
    }

    carregarPerguntas();
  }, []);

  function getTextoPergunta(idPergunta) {
    const p = perguntas.find(
      (x) => Number(x.id_pergunta) === Number(idPergunta)
    );
    return p ? p.texto_pergunta : "Pergunta não encontrada";
  }

  useEffect(() => {
  async function carregarRespostas() {
    try {
      const response = await api.get("/respostas/");
      const todasRespostas = response.data.flat();

     // console.log("Respostas carregadas:", todasRespostas);

      setRespostas(todasRespostas);
    } catch (err) {
      console.error("Erro ao carregar respostas:", err);
    }
  }

  carregarRespostas();
}, []);

const respostasUsuario = respostas.filter(
  (r) => Number(r.entrevistum.id_usuario) === Number(idUsuarioReal)
);

//console.log("Respostas do usuário:", respostasUsuario);



  function adicionarOpcao() {
    setOpcoes((prev) => [...prev, ""]); // adiciona mais um vazio
  }

 return (
  <div>
    {respostasUsuario.length > 0 &&
      respostasUsuario.map((resp, index) => (
        <div key={resp.id_resposta}>
          <Squircle
            cornerRadius={10}
            cornerSmoothing={1}
            className="flex bg-secondary/50 w-auto h-[10vh] mt-[1vh] px-[2vw]"
          >
            <p className="text-primary font-corpo my-auto w-[82vw]">
              {resp.perguntum?.texto_pergunta || "Pergunta não encontrada"}
            </p>

            <CaretDownIcon
              size="4vh"
              weight="thin"
              className="my-auto"
              onClick={() =>
                setAberto((prev) => (prev === index ? null : index))
              }
            />
          </Squircle>

          {aberto === index && (
            <Squircle
              cornerRadius={10}
              cornerSmoothing={1}
              className="bg-secondary/10 w-auto h-auto px-[2vw] py-[2vh]"
            >
              <p className="font-corpo text-[1vw]">Resposta</p>

              <p className="font-corpo text-[1.5vw]">{resp.resposta_texto}</p>
            </Squircle>
          )}
        </div>
      ))}
  </div>
);
};
