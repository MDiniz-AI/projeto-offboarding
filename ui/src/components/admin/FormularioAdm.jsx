import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Squircle } from "corner-smoothing";
import { CaretDownIcon, DotsThreeIcon, PlusIcon } from "@phosphor-icons/react";

import PerguntasEdit from "./PerguntasEdit";

export default () => {

    const [perg, setPerg] = useState([""]);

    function adicionarPerg() {
            setPerg((prev) => [...prev, ""]); // adiciona mais um vazio
    }

    const objFormulario = {
        nomeCategoria: "Salário e Benefícios",
        valorScore: 0.5,
        valorInten: 0.75,
    }

  const getBgClass = (valor) => {
    if (valor > 0.9) return "#277CDD";
    if (valor >= 0.75) return "#22B457";
    if (valor >= 0.6) return "#2DB61E";
    if (valor >= 0.4) return "#DDB927";
    if (valor >= 0.25) return "#FF3939";
    if (valor >= 0.1) return "#5F1D1D";
    return "#1E1E1E";
  };


    return (<div>
        <div>
            <h1 className="text-primary font-title text-4xl text-center my-[2vh]">Formulário</h1>
            <div className="flex flex-row flex-wrap gap-[1vw]">    
                <Squircle className="bg-secondary/30 w-[30vw] h-[35vh] px-[1.2vw] py-[1vh] flex-col" cornerRadius={20} cornerSmoothing={1}>
                    <h2 className="font-title text-primary text-[1.7vw] text-center mt-[1vw]">{objFormulario.nomeCategoria}</h2>
                    <div className="flex flex-row gap-[2vw]">
                        <div>
                            <div className="w-[12.5vw] h-[7vh] bg-secondary/60 rounded-xl"> 
                                <div className="h-full rounded-xl" style={{ 
                                    width: `calc(${objFormulario.valorScore} * 12.5vw)`, 
                                    backgroundColor: `${getBgClass(objFormulario.valorScore)}` 
                                    }} />
                                    {/* 0.10 ou menos -> pessimo
                                    0.10 a 0.25 -> muito ruim
                                    0.25 a 0.4 -> ruim
                                    0.4 a 0.6 -> regular
                                    0.6 a 0.75 -> bom
                                    0.75 a 0.9 -> muito bom
                                    acima de 0.9 -> perfeito */}
                  <p className="text-primary text-center font-corpo text-[1vw] mt-[-5vh]">
                    {objFormulario.valorScore}
                  </p>
                </div>
                <p className="text-primary text-center font-corpo text-[1vw]">
                  Score Médio
                </p>
              </div>
              <div>
                <div className="w-[12.5vw] h-[7vh] bg-secondary/60 rounded-xl">
                  <div
                    className="h-full rounded-xl"
                    style={{
                      width: `calc(${objFormulario.valorInten} * 12.5vw)`,
                      backgroundColor: `${getBgClass(
                        objFormulario.valorInten
                      )}`,
                    }}
                  />
                  <p className="text-primary text-center font-corpo text-[1vw] mt-[-5vh]">
                    {objFormulario.valorInten}
                  </p>
                </div>
                <p className="text-primary text-center font-corpo text-[1vw]">
                  Intensidade Média
                </p>
              </div>
            </div>
            <Squircle
            //   onClick={() => {
            //     document.getElementById("modalEdicao").showModal();
            //   }}
            onClick={() => document.getElementById('modalEdicao').showModal()}
              cornerRadius={10}
              cornerSmoothing={1}
              className="flex bg-secondary/50 w-[10vw] h-[7vh] justify-center mt-[4vh] ml-[17vw]"
            >
              <DotsThreeIcon size="4vh" weight="thin" className="my-auto" />
              <p className="text-primary font-corpo my-auto">Detalhes</p>
            </Squircle>
          </Squircle>
        </div>
      </div>

      <dialog id="modalEdicao" className="modal">
        <div className="modal-box max-w-90/100 ">
          <form method="dialog">
            <button class="btn btn-sm btn-circle btn-secondary absolute right-[1vw] top-[4vh] text-primary">
              ✕
            </button>
          </form>
          <h1 className="font-title md:text-[2vw] text-[6vw] text-primary">
            {objFormulario.nomeCategoria}
          </h1>
          <div className="flex flex-row gap-[2vw] mt-[1vh]">
            <div>
              <div className="w-[42vw] h-[7vh] bg-secondary/60 rounded-xl">
                <div
                  className="h-full rounded-xl"
                  style={{
                    width: `calc(${objFormulario.valorScore} * 42vw)`,
                    backgroundColor: `${getBgClass(objFormulario.valorScore)}`,
                  }}
                />
                {/* 0.10 ou menos -> pessimo
                                    0.10 a 0.25 -> muito ruim
                                    0.25 a 0.4 -> ruim
                                    0.4 a 0.6 -> regular
                                    0.6 a 0.75 -> bom
                                    0.75 a 0.9 -> muito bom
                                    acima de 0.9 -> perfeito */}
                                <p className="text-primary text-center font-corpo text-[1vw] mt-[-5vh]">{objFormulario.valorScore}</p>
                            </div>
                            <p className="text-primary text-center font-corpo text-[1vw]">Score Médio</p>
                        </div>
                        <div>
                            <div className="w-[42vw] h-[7vh] bg-secondary/60 rounded-xl"> 
                                <div className="h-full rounded-xl" style={{ 
                                    width: `calc(${objFormulario.valorInten} * 42vw)`, 
                                    backgroundColor: `${getBgClass(objFormulario.valorInten)}`
                                }} />
                                <p className="text-primary text-center font-corpo text-[1vw] mt-[-5vh]">{objFormulario.valorInten}</p>
                            </div>
                            <p className="text-primary text-center font-corpo text-[1vw]">Intensidade Média</p>
                        </div>
                    </div>
                <div className="mt-[2vh]">
                    <div className="flex flex-row gap-[68vw]">
                        <h2 className="font-title md:text-[1.7vw] text-[6vw] text-primary mt-5">Perguntas</h2>
                        <Squircle cornerRadius={10} cornerSmoothing={1} className="flex bg-secondary/50 w-[10vw] h-[7vh] justify-center mt-[1vh]" onClick={adicionarPerg}>
                            <PlusIcon size="4vh" weight="thin" className="my-auto" />
                            <p className="text-primary font-corpo my-auto">Adicionar</p>
                        </Squircle>
                    </div>
                    <div>
                        {perg.map((valor, index) => (
                            <PerguntasEdit />
                        ))}
                    </div>
                </div>
            </div>
        </dialog>
    </div>)
}