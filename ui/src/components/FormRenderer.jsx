import InputCurto from "./InputCurto.jsx"
import InputLongo from "./InputLongo.jsx"
import Seletor from "./Seletor.jsx"
import Range from "./Range.jsx"

export default (props) => {


    return(
        <div className="flex flex-col gap-[7vh] mr-[1vw]">
            {props.perguntas.map((prop, index) =>
                prop.type == 0 ? (<InputCurto key={index} id={index} placeholder="Digite algo aqui" label={prop.question} tipo="text"/>) : 
                prop.type == 1 ? (<InputLongo key={index} id={index} placeholder="Digite algo aqui" label={prop.question}/>) :
                prop.type == 2 ? (<Seletor key={index} id={index} placeholder="Selecione uma opção" label={prop.question} opcoes={prop.option}/>) :
                (<Range key={index} id={index} label={prop.question}/>)
            )}         
        </div>
    )
}