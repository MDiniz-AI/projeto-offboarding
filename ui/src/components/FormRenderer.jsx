// FormRenderer.jsx (RECOMENDADO)

import InputCurto from "./InputCurto.jsx";
import InputLongo from "./InputLongo.jsx";
import Seletor from "./Seletor.jsx";
import Range from "./Range.jsx";

// Não precisa mais receber atualizarResposta como prop,
// pois os componentes internos usam useFormContext().
export default function FormRenderer({ perguntas }) { 
    return (
        <div className="flex flex-col gap-[7vh] mr-[1vw]">
            {perguntas.map((p) => 
                p.tipo === 0 ? (
                    <InputCurto
                        key={p.id}
                        id={p.id}
                        label={p.texto}
                        placeholder="Digite algo aqui"
                        // REMOVIDO: onChange={(valor) => atualizarResposta(p.id, valor, null)}
                    />
                ) : p.tipo === 1 ? (
                    <InputLongo
                        key={p.id}
                        id={p.id}
                        label={p.texto}
                        placeholder="Digite algo aqui"
                        // REMOVIDO: onChange={(valor) => atualizarResposta(p.id, valor, null)}
                    />
                ) : p.tipo === 2 ? (
                    <Seletor
                        key={p.id}
                        id={p.id}
                        label={p.texto}
                        opcoes={p.opcoes}
                        // REMOVIDO: onSelect={(valor) => atualizarResposta(p.id, null, valor)}
                    />
                ) : (
                    <Range
                        key={p.id}
                        id={p.id}
                        label={p.texto}
                    />
                )
            )}
        </div>
    );
}