import InputCurto from "./InputCurto.jsx";
import InputLongo from "./InputLongo.jsx";
import Seletor from "./Seletor.jsx";
import Range from "./Range.jsx";

export default function FormRenderer({ perguntas, atualizarResposta }) {
    return (
        <div className="flex flex-col gap-[7vh] mr-[1vw]">
            {perguntas.map((p, index) => 
                p.type === 0 ? (
                    <InputCurto
                        key={p.id}
                        id={p.id}
                        label={p.question}
                        placeholder="Digite algo aqui"
                        onChange={(valor) => atualizarResposta(p.id, valor, null)}
                    />
                ) : p.type === 1 ? (
                    <InputLongo
                        key={p.id}
                        id={p.id}
                        label={p.question}
                        placeholder="Digite algo aqui"
                        onChange={(valor) => atualizarResposta(p.id, valor, null)}
                    />
                ) : p.type === 2 ? (
                    <Seletor
                        key={p.id}
                        id={p.id}
                        label={p.question}
                        opcoes={p.option}
                        onSelect={(valor) => atualizarResposta(p.id, null, valor)}
                    />
                ) : (
                    <Range
                        key={p.id}
                        id={p.id}
                        label={p.question}
                        onChange={(valor) => atualizarResposta(p.id, null, valor)}
                    />
                )
            )}
        </div>
    );
}



// import InputCurto from "./InputCurto.jsx"
// import InputLongo from "./InputLongo.jsx"
// import Seletor from "./Seletor.jsx"
// import Range from "./Range.jsx"

// export default (props) => {


//     return(
//         <div className="flex flex-col gap-[7vh] mr-[1vw]">
//             {props.perguntas.map((prop, index) =>
//                 prop.type == 0 ? (<InputCurto key={index} id={index} placeholder="Digite algo aqui" label={prop.question} tipo="text"/>) : 
//                 prop.type == 1 ? (<InputLongo key={index} id={index} placeholder="Digite algo aqui" label={prop.question}/>) :
//                 prop.type == 2 ? (<Seletor key={index} id={index} placeholder="Selecione uma opção" label={prop.question} opcoes={prop.option}/>) :
//                 (<Range key={index} id={index} label={prop.question}/>)
//             )}         
//         </div>
//     )
// }