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
  const [tipoCampo, setTipoCampo] = useState("");
  const [opcoes, setOpcoes] = useState([""]);
  const [aberto, setAberto] = useState(null);

  const [perguntas, setPerguntas] = useState([]);
  const [entrevistasUsuario, setEntrevistasUsuario] = useState([]);

  useEffect(() => {
    async function carregarEntrevistas() {
      try {
        const response = await api.get("/entrevistas");

        const filtradas = response.data.filter(
          (e) => e.id_usuario === props.idUsuario
        );

        setEntrevistasUsuario(filtradas);
      } catch (error) {
        console.error("Erro ao carregar entrevistas:", error);
      }
    }

    carregarEntrevistas();
  }, [props.idUsuario]);

  useEffect(() => {
    async function carregarPerguntas() {
      try {
        const response = await api.get("/perguntas");
        setPerguntas(response.data);
      } catch (err) {
        console.error("Erro ao carregar perguntas:", err);
      }
    }

    carregarPerguntas();
  }, []);

  function getTextoPergunta(idPergunta) {
    const p = perguntas.find((x) => x.id_pergunta === idPergunta);
    return p ? p.texto_pergunta : "Pergunta não encontrada";
  }


  function adicionarOpcao() {
    setOpcoes((prev) => [...prev, ""]); // adiciona mais um vazio
  }

  return (
    <div>
      {entrevistasUsuario.length > 0 &&
        entrevistasUsuario[0].respostas.map((resp, index) => (
          <div key={resp.id_resposta}>
            <Squircle
              cornerRadius={10}
              cornerSmoothing={1}
              className="flex bg-secondary/50 w-auto h-[10vh] mt-[1vh] px-[2vw]"
            >
              <p className="text-primary font-corpo my-auto w-[82vw]">
                {getTextoPergunta(resp.id_pergunta)}
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
                className="bg-secondary/10 w-auto h-auto px-[2vw] py-[2vh] "
              >
                <p className="font-corpo text-[1vw]">Resposta</p>

                <p className="font-corpo text-[1.5vw]">{resp.resposta_texto}</p>
              </Squircle>
            )}
          </div>
        ))}

      {/* <Squircle cornerRadius={10} cornerSmoothing={1} className="flex bg-secondary/50 w-auto h-[10vh] mt-[1vh] px-[2vw]">
                <p className="text-primary font-corpo my-auto w-[82vw]">Pergunta 1 gdfhjkldfkg hhjklçdfglhkdfghkldfghklhkdfghkldfghlkhkldfghkldfghksgkldjkglkdfhklhglfkdhjgkldf hgjlj dfsgçolçdfghldf hkglç j?????</p>
                <CaretDownIcon size="4vh" weight="thin" className="my-auto" onClick={() => setAberto((prev) => !prev)} />
            </Squircle>


            {aberto && <Squircle cornerRadius={10} cornerSmoothing={1} className="bg-secondary/10 w-auto h-auto px-[2vw] py-[2vh] ">
                <p className="font-corpo text-[1vw]">Resposta</p>
                <p className="font-corpo text-[1.5vw]">Resposta do usuário</p>
                    
                

            </Squircle>} */}
    </div>
  );
};
