import { Contexto } from "../context/FormContext"
import { useContext } from "react";
export default (props) => {
const { atualizarResposta } = useContext(Contexto);
    return (
        <div className="flex flex-col gap-[1vh]">
            <label for={props.id} className="font-corpo md:text-[1vw] md:ml-0 ml-[2vw] text-[4vw] text-primary">{props.label}</label>
            <input name={props.id} type={props.tipo} id={props.id} placeholder={props.placeholder} value={props.texto} onChange={(e) => atualizarResposta(props.id, e.target.value)} className="bg-secondary/30 p-[2vh] md:w-[40vw] md:mx-0 w-[97vw] mx-auto font-corpo rounded-xl md:text-[1vw] text-[4vw] text-primary"/>
        </div>
    )
}