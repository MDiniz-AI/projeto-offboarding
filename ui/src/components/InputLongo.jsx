
import { Contexto } from "../pages/Form.jsx";
import { useContext } from "react";

export default (props) => {
const { atualizarResposta } = useContext(Contexto);
    return (
        <div className="flex flex-col gap-[1vh] text-justify">
            <label for={props.id} className="font-corpo md:text-[1vw] text-[4vw] text-primary">{props.label}</label>
            <textarea name={props.id} type="email" id={props.id} placeholder={props.placeholder} className="bg-secondary/30 p-[2vh] h-[15vh] w-full font-corpo rounded-xl md:text-[1vw] text-[4vw] text-primary"></textarea>
        </div>
    )
}