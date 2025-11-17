import { useSearchParams, useNavigate } from "react-router-dom";
import { HouseIcon } from '@phosphor-icons/react';
import BlocoPrincipal from "../components/BlocoPrincipal";
import image from "../assets/fundo-erro.webp"


export default () => {

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const tipoErro = searchParams.get("error")

    const erroAcesso = ["Sem acesso ao formulário", "Esse formulário só pode ser respondido por pessoas/contas selecionadas. Caso ache que isso seja um erro, entre em contato com o RH. Sentimos muito por isso 😔"]
    const erroRespondido = ["Formulário já respondido", "Esse formulário só pode ser respondido uma vez. Sentimos muito por isso 😔"]
    const erroNaoEncontrado = ["Página não encontrada", "Página não encontrada, verifique a URL digitada"]

    function irParaHome(){
        navigate("/");
    }

    const html = <div className='flex flex-col gap-[4vh] justify-center mt-[32vh] md:mb-0 mb-[32vh]'>
            <h1 className="font-title md:text-[3.5vw] text-[8vw] text-primary mx-auto">{tipoErro == 1 ? erroAcesso[0] : tipoErro == 2 ? erroRespondido[0] : erroNaoEncontrado[0]}</h1>
            <p className="font-corpo md:w-[40vw] w-[97vw] md:text-[1vw] text-[4vw] text-center text-primary mx-auto mt-[-4vh]">{tipoErro == 1 ? erroAcesso[1] : tipoErro == 2 ? erroRespondido[1] : erroNaoEncontrado[1]}</p>
            <button onClick={irParaHome} className="btn btn-accent text-primary font-corpo md:text-[.9vw] text-[3.5vw] md:w-[13vw] w-[50vw] h-[6vh] mx-auto"><HouseIcon size="2.5vh" weight="thin" />Voltar ao Menu</button>
        </div>
    
    return <BlocoPrincipal codigo={html} idPag={null} imagemFundo={image} />
}