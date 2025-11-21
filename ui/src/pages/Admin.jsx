import BlocoPrincipalAdm from "../components/admin/BlocoPrincipalAdm.jsx"
import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from "react-router-dom";
import FormularioAdm from "../components/admin/FormularioAdm.jsx";
import Colaboradores from "../components/admin/Colaboradores.jsx";


export const Contexto = createContext();

export default() => {
    const [searchParams, setSearchParams] = useSearchParams();
    let secaoQuery = Number(searchParams.get("pag") == null ? null : searchParams.get("pag"));
    if (secaoQuery == null || isNaN(secaoQuery) || secaoQuery < 1 || secaoQuery > 0) secaoQuery = 0

    const [pagAtual, setPagAtual] = useState(secaoQuery);

    // verifica a página atual pela query
    useEffect(() => {
        let novaSecao = Number(searchParams.get("pag"));
        if (novaSecao == null || isNaN(secaoQuery) || secaoQuery > 9 || secaoQuery < 2) secaoQuery = 2
        setPagAtual(novaSecao ?? 0);
    }, [searchParams]);

    return (
        <Contexto.Provider value={{pagAtual}}>
            <App />
        </Contexto.Provider>
    )

    function App(){

        const { pagAtual } = useContext(Contexto);

        const htmlForm = <div>
            <div className="ml-[7vw]">
                { pagAtual == 2 ? <Colaboradores /> : pagAtual == 4 ? <FormularioAdm /> : null}
            </div>
                <BlocoPrincipalAdm pagina={pagAtual}/>
        </div>
        

        return htmlForm;
    }
}