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
                <p className="font-corpo text-[1vw]">Resposta</p>
                <p className="font-corpo text-[1.5vw]">Resposta do usuário</p>
                    
                

            </Squircle>}
        </div>
}