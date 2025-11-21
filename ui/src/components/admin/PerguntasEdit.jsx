import InputCurto from "../InputCurto.jsx"
import InputLongo from "../InputLongo.jsx"
import Seletor from "../Seletor.jsx"
import { CaretDownIcon, FloppyDiskIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { createContext, useContext, useState, useEffect } from 'react'
import { Squircle } from "corner-smoothing"; 


export default (props) => {
    const [tipoCampo, setTipoCampo] = useState("");
    const [opcoes, setOpcoes] = useState([""]);
    const [aberto, setAberto] = useState(false);

    function adicionarOpcao() {
            setOpcoes((prev) => [...prev, ""]); // adiciona mais um vazio
    }




    return <div>
            <Squircle cornerRadius={10} cornerSmoothing={1} className="flex bg-secondary/50 w-auto h-[10vh] mt-[1vh] px-[2vw]">
                <p className="text-primary font-corpo my-auto w-[82vw]">Pergunta 1 gdfhjkldfkg hhjklçdfglhkdfghkldfghklhkdfghkldfghlkhkldfghkldfghksgkldjkglkdfhklhglfkdhjgkldf hgjlj dfsgçolçdfghldf hkglç j?????</p>
                <CaretDownIcon size="4vh" weight="thin" className="my-auto" onClick={() => setAberto((prev) => !prev)} />
            </Squircle>


            {aberto && <Squircle cornerRadius={10} cornerSmoothing={1} className="bg-secondary/10 w-auto h-auto px-[2vw] py-[2vh] ">
                <div className="flex gap-[2vw] w-full">
                    <div className="flex flex-col gap-[1vh] w-[65vw]">
                        <label for={1} className="font-corpo md:text-[1vw] md:ml-0 ml-[2vw] text-[4vw] text-primary">Pergunta</label>
                        <input name={1} type="text" id={1} placeholder="Digite pergunta aqui" value="Pergunta" className="bg-secondary/30 p-[2vh] md:w-full md:mx-0 w-full mx-auto font-corpo rounded-xl md:text-[1vw] text-[4vw] text-primary"/>
                    </div>

                    <div className="flex flex-col w-[30vw]">
                        <label for={2} className="font-corpo md:text-[1vw] text-[4vw] text-primary text-justify">Tipo de resposta</label>
                        <select name={2} id={2} className="bg-secondary/30 p-[2vh] w-full font-corpo rounded-xl md:text-[1vw] text-[4vw] text-primary mt-[1vh]" onChange={(e) => setTipoCampo(e.target.value)}>
                            <option key={0} value="Selecione uma opção" disabled hidden selected="selected">Selecione uma opção</option>
                            <option key={1} value="Texto Curto" >Texto Curto</option>
                            <option key={2} value="Texto Longo">Texto Longo</option>
                            <option key={3} value="Lista de opções" >Lista de opções</option>
                            <option key={4} value="Seletor de emoções" >Seletor de emoções</option>   
                        </select>
                    </div>
                </div>
                <div>
                    {tipoCampo === "Lista de opções" && (
                        <div className="flex flex-row gap-[1vw] flex-wrap">
                            {opcoes.map((valor, index) => (
                                <div key={index} className="flex flex-col gap-[1vh] mt-[2vh] w-[25vw]">
                                    <label for={index} className="font-corpo md:text-[1vw] md:ml-0 ml-[2vw] text-[4vw] text-primary">{`Opção ${index + 1}`}</label>
                                    <input name={index} type="text" id={index} placeholder={`Opção ${index + 1}`} className="bg-secondary/30 p-[2vh] md:w-full md:mx-0 w-full mx-auto font-corpo rounded-xl md:text-[1vw] text-[4vw] text-primary"/>
                                </div>
                            ))}
                            
                            <Squircle onClick={adicionarOpcao} cornerRadius={10} cornerSmoothing={1} className="flex bg-secondary/50 w-[4vw] h-[7vh] justify-center mt-[6vh]">
                                <PlusIcon size="4vh" weight="thin" className="my-auto" />
                            </Squircle>
                        </div>
                    )}
                </div>
                <div className="flex gap-[1vw] mx-auto justify-center">
                    <Squircle cornerRadius={10} cornerSmoothing={1} className="flex bg-secondary/50 w-[10vw] h-[7vh] justify-center mt-[2vh]">
                        <FloppyDiskIcon size="4vh" weight="thin" className="my-auto" />
                        <p className="text-primary font-corpo my-auto">Salvar</p>
                    </Squircle>
                    <Squircle cornerRadius={10} cornerSmoothing={1} className="flex bg-secondary/50 w-[10vw] h-[7vh] justify-center mt-[2vh]">
                        <TrashIcon size="4vh" weight="thin" className="my-auto" />
                        <p className="text-primary font-corpo my-auto">Apagar</p>
                    </Squircle>
                </div>
                

            </Squircle>}
        </div>
}