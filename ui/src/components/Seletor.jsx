import { Contexto } from "../context/FormContext"
import { useContext } from "react";
export default (props) => {
const { atualizarResposta } = useContext(Contexto);
    return (
        <div className="flex flex-col gap-[1vh]">
            <label for={props.id} className="font-corpo md:text-[1vw] text-[4vw] text-primary text-justify">{props.label}</label>
            <select name={props.id} type="email" id={props.id} placeholder={props.placeholder}  onChange={(e) => atualizarResposta(props.id, e.target.value)} className="bg-secondary/30 p-[2vh] w-full font-corpo rounded-xl md:text-[1vw] text-[4vw] text-primary">
                <option key={props.opcoes.length} value={props.placeholder} disabled hidden selected="selected">{props.placeholder}</option>
                {props.opcoes.map((opc, index) => (
                    <option className="select-option" key={index} value={opc}>{opc}</option>
                ))}
            </select>
        </div>
    )
}