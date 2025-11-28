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
import api from "../../lib/api.js";

export default ({
  pergunta,
  edicao,
  tipo,
  opcoes: opcoesProps,
  setEdicoes,
  setTipoCampo,
  onToggle,
  setOpcoes,
}) => {
  const [tipoCampo, setTipoCampoLocal] = useState(tipo || "");
  const [opcoes, setOpcoesLocal] = useState(opcoesProps || [""]);
  const [aberto, setAberto] = useState(false);
  const [textoPergunta, setTextoPergunta] = useState("");
  //  const [idEmEdicao, setIdEmEdicao] = useState(null);

  useEffect(() => {
    if (aberto) {
      setTextoPergunta(edicao);
      setTipoCampoLocal(tipo);
      setOpcoesLocal(opcoesProps);
    }
  }, [aberto, edicao, tipo, opcoesProps]);


  const toggleAberto = () => {
    setAberto((prev) => !prev);
  };

  const handleEdicao = (valor) => {
    setTextoPergunta(valor);
    setEdicoes((prev) => ({ ...prev, [pergunta.id_pergunta]: valor }));
  };

  // const handleTipo = (valor) => {
  //   setTipoCampoLocal(valor);
  //   setTipoCampo((prev) => ({ ...prev, [pergunta.id]: valor }));
  // };

  const handleOpcao = (index, valor) => {
    const novasOpcoes = [...opcoes];
    novasOpcoes[index] = valor;
    setOpcoesLocal(novasOpcoes);
    setOpcoes((prev) => ({ ...prev, [pergunta.id]: novasOpcoes }));
  };

 function mapTipoResposta(texto) {
  switch (texto) {
    case "Texto": return 0;
    case "Texto longo": return 1;
    case "Select de opções": return 2;
    case "Seletor de emoções": return 3;
    default: return 0;
  }
}


  const salvarEdicao = async () => {
    try {
     const body = {
      texto_pergunta: textoPergunta,
      tipo_resposta: mapTipoResposta(tipoCampo), 
      opcoes: opcoes
    };

      const response = await api.put(`/perguntas/${pergunta.id_pergunta}`, body);
        console.log("📤 Payload enviado para o backend:", body);
    console.log("📌 ID da pergunta sendo atualizada:", pergunta.id_pergunta);


      console.log("Pergunta atualizada:", response.data);


      toggleAberto();
      //onToggle();
    } catch (err) {
      console.error("Erro ao atualizar pergunta:", err);
    }
  };

  function adicionarOpcao() {
    setOpcoes((prev) => [...prev, ""]); // adiciona mais um vazio
  }

  return (
    <div>
      <Squircle
        cornerRadius={10}
        cornerSmoothing={1}
        className="flex bg-secondary/50 w-auto h-[10vh] mt-[1vh] px-[2vw]"
      >
        <p className="text-primary font-corpo my-auto w-[82vw]">
          {" "}
          {pergunta.texto_pergunta}{" "}
        </p>
        <CaretDownIcon
          size="4vh"
          weight="thin"
          className="my-auto"
         onClick={toggleAberto}
        />
      </Squircle>

      {aberto && (
        <Squircle
          cornerRadius={10}
          cornerSmoothing={1}
          className="bg-secondary/10 w-auto h-auto px-[2vw] py-[2vh] "
        >
          <div className="flex gap-[2vw] w-full">
            <div className="flex flex-col gap-[1vh] w-[65vw]">
              <label
                for={1}
                className="font-corpo md:text-[1vw] md:ml-0 ml-[2vw] text-[4vw] text-primary"
              >
                Pergunta
              </label>
              <input
                name="textoPergunta"
                type="text"
                id={1}
                placeholder="Digite pergunta aqui"
                onChange={(e) => setTextoPergunta(e.target.value)}
                value={textoPergunta}
                className="bg-secondary/30 p-[2vh] md:w-full md:mx-0 w-full mx-auto font-corpo rounded-xl md:text-[1vw] text-[4vw] text-primary"
              />
            </div>

            <div className="flex flex-col w-[30vw]">
              <label
                for={2}
                className="font-corpo md:text-[1vw] text-[4vw] text-primary text-justify"
              >
                Tipo de resposta
              </label>
              <select
                name="tipoCampo"
                id={2}
                value={tipoCampo[pergunta.id_pergunta]}
                className="bg-secondary/30 p-[2vh] w-full font-corpo rounded-xl md:text-[1vw] text-[4vw] text-primary mt-[1vh]"
                 onChange={(e) =>
                setTipoCampo((prev) => ({
                  ...prev,
                  [pergunta.id_pergunta]: e.target.value,
                }))
              }
              >
                <option
                  key={0}
                  value="Selecione uma opção"
                  disabled
                  hidden
                  selected="selected"
                >
                  Selecione uma opção
                </option>
                <option key={1} value="Texto Curto">
                  Texto Curto
                </option>
                <option key={2} value="Texto Longo">
                  Texto Longo
                </option>
                <option key={3} value="Lista de opções">
                  Lista de opções
                </option>
                <option key={4} value="Seletor de emoções">
                  Seletor de emoções
                </option>
              </select>
            </div>
          </div>
          <div>
            {tipoCampo === "Lista de opções" && (
              <div className="flex flex-row gap-[1vw] flex-wrap">
                {opcoes.map((valor, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-[1vh] mt-[2vh] w-[25vw]"
                  >
                    <label
                      for={index}
                      className="font-corpo md:text-[1vw] md:ml-0 ml-[2vw] text-[4vw] text-primary"
                    >{`Opção ${index + 1}`}</label>
                    <input
                      name="opcoes"
                      type="text"
                      id={index}
                      value={valor[pergunta.id_pergunta]}
                      placeholder={`Opção ${index + 1}`}
                      className="bg-secondary/30 p-[2vh] md:w-full md:mx-0 w-full mx-auto font-corpo rounded-xl md:text-[1vw] text-[4vw] text-primary"
                    />
                  </div>
                ))}

                <Squircle
                  onClick={adicionarOpcao}
                  cornerRadius={10}
                  cornerSmoothing={1}
                  className="flex bg-secondary/50 w-[4vw] h-[7vh] justify-center mt-[6vh]"
                >
                  <PlusIcon size="4vh" weight="thin" className="my-auto" />
                </Squircle>
              </div>
            )}
          </div>
          <div className="flex gap-[1vw] mx-auto justify-center">
            <Squircle
              cornerRadius={10}
              cornerSmoothing={1}
              className="flex bg-secondary/50 w-[10vw] h-[7vh] justify-center mt-[2vh]"
            >
              <FloppyDiskIcon size="4vh" weight="thin" className="my-auto" />
              <button
                onClick={salvarEdicao}
                className="text-primary font-corpo my-auto"
              >
                Salvar edição
              </button>
            </Squircle>
            <Squircle
              cornerRadius={10}
              cornerSmoothing={1}
              className="flex bg-secondary/50 w-[10vw] h-[7vh] justify-center mt-[2vh]"
            >
              <TrashIcon size="4vh" weight="thin" className="my-auto" />
              <p className="text-primary font-corpo my-auto">Apagar</p>
            </Squircle>
          </div>
        </Squircle>
      )}
    </div>
  );
};
