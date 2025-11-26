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
    if (valor >= 0.75) return "progress-success";
    if (valor >= 0.25) return "progress-warning";
    return "progress-error";
  };


    return (<div>
        <div>
            <h1 className="text-primary font-title text-4xl text-center my-[2vh]">Formulário</h1>
            <div className="flex flex-row flex-wrap gap-[1vw]">    
                <Squircle className="bg-secondary/30 md:w-[24vw] w-83 h-55 md:h-[27vh] px-[1.2vw] py-[1vh] flex-col" cornerRadius={20} cornerSmoothing={1}>
                    <h2 className="font-title text-primary text-2xl text-center mt-[1vw]">{objFormulario.nomeCategoria}</h2>
                    <div className="flex flex-row gap-[2vw]">
                    <div className="relative">
                        <progress class={`progress md:w-[10vw] w-39 h-[5vh] ${getBgClass(objFormulario.valorScore)}`}  value={objFormulario.valorScore * 100} max="100"></progress>
                        
                        <p className="text-primary text-center font-corpo text-md absolute bottom-7 md:bottom-8 left-15 md:left-[4vw]">
                          {objFormulario.valorScore}
                        </p>
              
                        <p className="text-primary text-center font-corpo text-xs">
                          Score Médio
                        </p>
                    </div>
              <div className="relative">
                <progress class={`progress md:w-[10vw] w-39 h-[5vh] ${getBgClass(objFormulario.valorInten)}`} value={objFormulario.valorInten * 100} max="100"></progress>
                
                <p className="text-primary text-center font-corpo text-md absolute bottom-7 md:bottom-8 left-15 md:left-[4vw]">
                    {objFormulario.valorInten}
                  </p>
                
                <p className="text-primary text-center font-corpo text-xs">
                  Intensidade Média
                </p>
              </div>
            </div>
            <Squircle
            onClick={() => document.getElementById('modalEdicao').showModal()}
              cornerRadius={10}
              cornerSmoothing={1}
              className="flex bg-secondary/50 w-40 h-[7vh] justify-center mt-[4vh] mx-auto"
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
            <div className="relative flex-1">
                <progress class={`progress md:w-full w-39 h-[5vh] ${getBgClass(objFormulario.valorScore)}`}  value={objFormulario.valorScore * 100} max="100"></progress>
                
                <p className="text-primary text-center font-corpo text-md absolute bottom-15 md:bottom-10 left-15 md:left-[20vw]">
                  {objFormulario.valorScore}
                </p>
      
                <p className="text-primary text-center font-corpo text-md">
                  Score Médio
                </p>
            </div>

            <div className="relative flex-1">
                <progress class={`progress md:w-full w-39 h-[5vh] ${getBgClass(objFormulario.valorInten)}`}  value={objFormulario.valorInten * 100} max="100"></progress>
                
                <p className="text-primary text-center font-corpo text-md absolute bottom-15 md:bottom-10 left-15 md:left-[20vw]">
                  {objFormulario.valorInten}
                </p>
      
                <p className="text-primary text-center font-corpo text-md">
                  Intensidade Média
                </p>
            </div>          
          </div>
          <div className="mt-[2vh]">
              <div className="flex flex-row md:gap-[68vw] gap-15">
                  <h2 className="font-title md:text-[1.7vw] text-[6vw] text-primary mt-5">Perguntas</h2>
                  <Squircle cornerRadius={10} cornerSmoothing={1} className="flex bg-secondary/50 md:w-[10vw] w-33 h-[7vh] justify-center mt-[1vh]" onClick={adicionarPerg}>
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