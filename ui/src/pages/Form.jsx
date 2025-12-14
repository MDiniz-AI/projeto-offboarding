// src/pages/Form.jsx

import imgFundoPg from "../assets/form/fundo-pg.webp";
import imgFundoCa from "../assets/form/fundo-ca.webp";
import imgFundoCde from "../assets/form/fundo-cde.webp";
import imgFundoEio from "../assets/form/fundo-eio.webp";
import imgFundoFim from "../assets/form/fundo-fim.webp";
import imgFundoLg from "../assets/form/fundo-lg.webp";
import imgFundoLi from "../assets/form/fundo-li.webp";
import imgFundoPd from "../assets/form/fundo-pd.webp";
import imgFundoHm from "../assets/fundo-pg1.webp";

import api from "../lib/api";

import BlocoPrincipal from "../components/BlocoPrincipal";
import FormRenderer from "../components/FormRenderer";
import { useState, useEffect, useContext } from "react";
import {
    CaretRightIcon,
    CheckIcon,
    HouseIcon,
    ClockCountdownIcon,
    LockSimpleIcon,
    LegoSmileyIcon,
    ChartLineIcon,
    PaperPlaneTiltIcon
} from "@phosphor-icons/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Squircle } from "corner-smoothing";
import { useFormContext } from '../context/FormContext.jsx'; 


// --- LÓGICA DE ESTADO (WRAPPER) ---
export default () => {
    // 1. ACESSO AO ESTADO PERSISTENTE, COM FALLBACKS (SOLUÇÃO PARA TYPERROR)
    const {
        perguntas = [], setPerguntas, 
        isLoading, setIsLoading, 
        secao = 1, setSecao, 
        categoriasVisiveis = [], setCategoriasVisiveis, 
        isSubmitted, setIsSubmitted,
        atualizarResposta, 
        token, setToken 
    } = useFormContext();

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // Imagens de fundo para rotação
    const imgVet = [
        imgFundoHm, imgFundoPg, imgFundoCa, imgFundoLg, imgFundoEio, imgFundoCde, imgFundoPd, imgFundoLi, imgFundoFim,
    ];

    // LÓGICA 1: BUSCAR PERGUNTAS E SALVAR TOKEN
    useEffect(() => {
        const urlToken = searchParams.get("t");

        // 2. SALVAR O TOKEN NO CONTEXTO (E localStorage) ASSIM QUE FOR ENCONTRADO NA URL
        if (urlToken) {
            setToken(urlToken);
        }

        async function buscarPerguntas() {
            setIsLoading(true);
            try {
                // Tenta usar o token da URL ou o token salvo no estado
                const activeToken = urlToken || token; 
                
                // Se não houver token, não busca. (Evita 401/403 no backend)
                if (!activeToken) {
                    setIsLoading(false);
                    return;
                }

                const config = { headers: { Authorization: `Bearer ${activeToken}` } };
                const response = await api.get("/perguntas", config); 
                const dadosDoBackend = response.data;

                const perguntasNormalizadas = dadosDoBackend.map((secao) =>
                    secao.map((p) => ({
                        id: p.id_pergunta,
                        texto: p.texto_pergunta,
                        categoria: p.categoria,
                        tipo: p.tipo_resposta,
                        opcoes: typeof p.opcoes === 'string' ? JSON.parse(p.opcoes) : p.opcoes,
                        resposta_texto: "", 
                        resposta_valor: null,
                    }))
                );

                if (perguntasNormalizadas.length > 0) {
                    const novasCategorias = perguntasNormalizadas.map(secao => secao[0]?.categoria || "Geral");
                    setCategoriasVisiveis(novasCategorias);
                }

                setPerguntas(perguntasNormalizadas); 
            } catch (err) {
                console.error("Erro ao buscar perguntas da API:", err);
            } finally {
                setIsLoading(false);
            }
        }
        
        // Só busca as perguntas se elas ainda não estiverem no estado persistente (para não zerar)
        if (perguntas.length === 0) {
             buscarPerguntas();
        }
        
    }, [searchParams, setPerguntas, setCategoriasVisiveis, setToken, token]); 

    // LÓGICA 2: CONTROLE DE NAVEGAÇÃO POR URL (?secao=X)
    useEffect(() => {
        const param = searchParams.get("secao");
        if (param === null) {
            setSecao(1);
        } else {
            const novaSecao = Number(param);
            if (novaSecao == null || isNaN(novaSecao) || novaSecao < 1)
                setSecao(1);
            else setSecao(novaSecao);
        }
    }, [searchParams, setSecao]);

    // LÓGICA 3: NAVEGAÇÃO
    function avancaPasso() {
        const currentToken = searchParams.get("t") || token; 
        const proximaSecao = secao + 1;
        const newQuery = `/?secao=${proximaSecao}${currentToken ? `&t=${currentToken}` : ''}`;
        navigate(newQuery);
    }
    
    function irParaSecao(num) {
        const currentToken = searchParams.get("t") || token;
        const newQuery = `/?secao=${num}${currentToken ? `&t=${currentToken}` : ''}`;
        navigate(newQuery);
    }

    // LÓGICA 4: ENVIO (USA O TOKEN DO CONTEXTO OU O DA URL COMO FALLBACK)
    async function enviarEntrevista() {
        try {
            // Checagem defensiva: usa o token do estado (persistente) ou da URL
            const finalToken = token || searchParams.get("t"); 

            if (!finalToken) { 
                alert("Token não encontrado ou expirado! Use o link enviado por e-mail.");
                return;
            }

            const authConfig = { headers: { Authorization: `Bearer ${finalToken}` } };
            
            const respostas = perguntas.flat().map((p) => ({
                id_pergunta: p.id,
                resposta_texto: p.resposta_texto ?? "",
                resposta_valor: p.resposta_valor ?? null,
            }));

            const payload = { respostas };
            await api.post("/entrevistas", payload, authConfig); 

            console.log("✔️ Enviado com sucesso!");
            enviaDados();
        } catch (err) {
            console.error("❌ Erro ao enviar:", err);
            const mensagemErro = err.response?.data?.error || "Ocorreu um erro ao enviar suas respostas.";
            alert(mensagemErro);
        }
    }

    function enviaDados() {
        setIsSubmitted(true);
    }

    function irParaHome() {
        navigate("/");
    }

    return (
        <App 
            perguntas={perguntas}
            secao={secao}
            avancaPasso={avancaPasso}
            irParaSecao={irParaSecao}
            imgVet={imgVet}
            enviaDados={enviaDados}
            isSubmitted={isSubmitted}
            isLoading={isLoading}
            irParaHome={irParaHome}
            enviarEntrevista={enviarEntrevista}
            atualizarResposta={atualizarResposta}
            categoriasVisiveis={categoriasVisiveis}
        />
    );
};

// --- COMPONENTE DE APRESENTAÇÃO ---
function App({ 
    perguntas, secao, avancaPasso, irParaHome, imgVet, isSubmitted, 
    isLoading, atualizarResposta, enviarEntrevista, categoriasVisiveis, irParaSecao 
}) {
    // Código inalterado do componente App (HTML e modals)
    const secaoIndex = secao - 2; 
    const totalSecoesReais = perguntas.length;

    const htmlForm = (
        <div>
            <h1 className="font-title md:text-[3.5vw] text-[8vw] text-center md:text-left text-primary">
                Pesquisa de offboarding
            </h1>
            <p className="font-corpo md:w-[40vw] w-[95vw] md:text-[1vw] text-[3vw] md:text-justify text-center text-primary mx-auto md:mx-0">
                {categoriasVisiveis && categoriasVisiveis[secaoIndex]}
            </p>
            <div className="bg-primary h-[.01vh] min-h-[.5px] md:w-[40vw] md:mx-0 mx-auto w-[97vw] mt-[3vh] " />
            <form action="">
                <div className="mt-[5vh] md:h-[52vh] h-[57vh] overflow-y-auto md:w-[42vw] w-[97vw] md:mx-0 mx-auto">
                    <FormRenderer 
                        perguntas={perguntas[secaoIndex] || []} 
                        atualizarResposta={atualizarResposta}
                    />
                </div>
                <div>
                    {secaoIndex < totalSecoesReais - 1 ? (
                        <button
                            type="button"
                            onClick={avancaPasso}
                            className="flex md:gap-[32vw] gap-[60vw] bg-accent md:p-[1vw] p-[3vw] rounded-xl w-[97vw] md:w-[41vw] mx-auto md:mx-0 mb-[1vh] md:mb-0 mt-[2vh]"
                        >
                            <p className="font-corpo md:text-[1vw] text-[4vw] my-auto text-primary">
                                Continuar
                            </p>
                            <CaretRightIcon
                                size="4vh"
                                weight="thin"
                                className="my-auto text-primary"
                            />
                        </button>
                    ) : (
                        <div className="mt-[-10vw] md:mt-0">
                            <p className="text-primary md:w-[42vw] w-[97vw] md:text-[.7vw] text-4xl font-corpo md:text-justify text-center md:mx-0 mx-auto">
                                Caso queira visualizar e/ou corrigir suas respostas, você pode
                                navegar pelos blocos interagindo com os ícones do menu lateral.
                                Ao enviar suas respostas, você concorda com os{" "}
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        document.getElementById("modalTermos").showModal();
                                    }}
                                >
                                    <u>Termos de Privacidade</u>
                                </a>
                                .
                            </p>
                            <button
                                type="button"
                                onClick={() =>
                                    document.getElementById("modalConfirmar").showModal()
                                }
                                className="flex md:gap-[32vw] gap-[60vw] bg-accent md:p-[1vw] p-[3vw] rounded-xl w-[97vw] md:w-[41vw] mx-auto md:mx-0 md:mb-0 md:mt-0"
                            >
                                <p className="font-corpo md:text-[1vw] text-[4vw] my-auto text-primary">
                                    Finalizar
                                </p>
                                <CheckIcon
                                    size="4vh"
                                    weight="thin"
                                    className="my-auto text-primary"
                                />
                            </button>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );

    const htmlInicio = (
        <div className="mt-[4vh] flex flex-col">
            <h1 className="font-title md:text-[3.5vw] text-[8vw] text-center md:text-left text-primary">
                Pesquisa de offboarding
            </h1>
            <p className="font-corpo md:w-[40vw] w-[95vw] md:text-[1vw] text-[4vw] md:text-justify text-center text-primary mx-auto md:mx-0">
                Sua opinião é muito importante para nós. 💙 <br /> Esta pesquisa nos
                ajuda a entender melhor sua experiência e a aprimorar continuamente
                nosso ambiente de trabalho. ✍️
            </p>
            <div className="mt-[2vh] flex flex-col gap-[2.5vh] mx-auto md:mx-0">
                <div className="flex gap-[2.5vh]">
                    <Squircle
                        cornerRadius={20}
                        cornerSmoothing={1}
                        className="bg-secondary/30 md:w-[20vw] w-[45vw] h-[20vh] flex flex-col justify-center gap-2"
                    >
                        <ClockCountdownIcon
                            size="7vh"
                            weight="thin"
                            className="mx-auto text-primary"
                        />
                        <p className="font-corpo text-[2vh] mx-auto text-primary">
                            Leva 10 Minutos
                        </p>
                    </Squircle>
                    <Squircle
                        cornerRadius={20}
                        cornerSmoothing={1}
                        className="bg-secondary/30 md:w-[20vw] w-[45vw] h-[20vh] flex flex-col justify-center gap-2"
                    >
                        <LockSimpleIcon
                            size="7vh"
                            weight="thin"
                            className="mx-auto text-primary"
                        />
                        <p className="font-corpo text-[2vh] mx-auto text-primary text-center">
                            Anonimização de respostas
                        </p>
                    </Squircle>
                </div>

                <div className="flex gap-[2.5vh]">
                    <Squircle
                        cornerRadius={20}
                        cornerSmoothing={1}
                        className="bg-secondary/30 md:w-[20vw] w-[45vw] h-[20vh] flex flex-col justify-center gap-2"
                    >
                        <LegoSmileyIcon
                            size="7vh"
                            weight="thin"
                            className="mx-auto text-primary"
                        />
                        <p className="font-corpo text-[2vh] mx-auto text-primary">
                            Promove melhorias
                        </p>
                    </Squircle>
                    <Squircle
                        cornerRadius={20}
                        cornerSmoothing={1}
                        className="bg-secondary/30 md:w-[20vw] w-[45vw] h-[20vh] flex flex-col justify-center gap-2"
                    >
                        <ChartLineIcon
                            size="7vh"
                            weight="thin"
                            className="mx-auto text-primary"
                        />
                        <p className="font-corpo text-[2vh] mx-auto text-primary text-center">
                            Identifica tendências
                        </p>
                    </Squircle>
                </div>
            </div>
            <div className="md:mt-[8vh] mt-[2vh]">
                <button
                    onClick={avancaPasso}
                    className="flex md:gap-[32vw] gap-[60vw] bg-accent md:p-[1vw] p-[3vw] rounded-xl w-[97vw] md:w-[41vw] mx-auto md:mx-0 mb-[1vh] md:mb-0"
                >
                    <p className="font-corpo md:text-[1vw] text-[2vh] my-auto text-primary">
                        {" "}
                        Continuar{" "}
                    </p>
                    <CaretRightIcon
                        size="3.5vh"
                        weight="thin"
                        className="my-auto text-primary"
                    />
                </button>
            </div>
        </div>
    );

    const htmlSubmitted = (
        <div className="flex flex-col gap-[4vh] justify-center md:mt-[-4vh] mt-[25vh] md:mb-0 mb-[22vh] md:my-0">
            <h1 className="font-title md:text-[3.5vw] text-[12vw] text-primary mx-auto">
                Obrigado!
            </h1>
            <p className="font-corpo md:w-[40vw] w-[97vw] md:text-[1vw] text-[4vw] text-center text-primary mx-auto mt-[-4vh]">
                Agradecemos por dedicar alguns minutos para compartilhar seu feedback e
                contribuir com a melhoria e a evolução do ambiente de trabalho.
                Desejamos muita sorte e sucesso no seu futuro.😊
            </p>
            <button
                onClick={irParaHome}
                className="btn btn-accent text-primary font-corpo md:text-[.9vw] text-[3.5vw] md:w-[13vw] w-[40vw] h-[6vh] mx-auto"
            >
                <HouseIcon size="2.5vh" weight="thin" />
                Voltar ao Menu
            </button>
        </div>
    );

    let htmlContent;

    if (isLoading && secao === 2) {
        htmlContent = (
            <div className="flex flex-col gap-[1vh] items-center justify-center h-full text-primary font-title md:text-[2vw] text-[6vw]">
                <span className="loading loading-spinner loading-xl"></span>
                Carregando Formulário...
            </div>
        );
    } else if (isSubmitted) {
        htmlContent = htmlSubmitted;
    } else if (secao === 1) {
        htmlContent = htmlInicio;
    } else if (!perguntas || perguntas.length === 0) {
        htmlContent = (
            <div className="p-8 text-center text-red-500 font-corpo">
                Erro ao carregar o formulário. Por favor, tente novamente mais tarde.
            </div>
        );
    } else {
        if (secaoIndex < totalSecoesReais) {
            htmlContent = htmlForm;
        } else {
            htmlContent = htmlSubmitted;
        }
    }

    const bgIndex = secao % imgVet.length;

    return (
        <>
            <BlocoPrincipal 
                imagemFundo={imgVet[bgIndex]} 
                idPag={secao} 
                categorias={categoriasVisiveis}
                irParaSecao={irParaSecao} 
            >
                {htmlContent}
            </BlocoPrincipal>

            <dialog id="modalTermos" className="modal">
                <div className="modal-box max-h-[92vh]">
                    <div className="flex gap-[5vw]">
                        <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-secondary absolute right-[1vw] top-[4vh] text-primary">
                                ✕
                            </button>
                        </form>
                        <h3 className="font-title md:text-[2vw] text-[6vw] text-primary">
                            Termos de privacidade
                        </h3>
                    </div>
                    <p className="py-4 md:text-[1vw] text-[4vw] font-corpo text-primary">
                        Ao preencher este formulário, o(a) colaborador(a) desligado(a)
                        concorda com os seguintes termos de uso e privacidade de suas
                        respostas: <br />
                        <br />
                        1. Objetivo da Pesquisa <br />
                        O objetivo desta pesquisa é coletar feedback honesto e construtivo...
                    </p>
                </div>
            </dialog>

            <dialog id="modalConfirmar" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-secondary absolute right-[1vw] top-[4vh] text-primary">
                            ✕
                        </button>
                    </form>
                    <h3 className="font-title md:text-[2vw] text-[6vw] text-primary">
                        Confirmação
                    </h3>
                    <p className="py-4 md:text-[1vw] text-[4vw] font-corpo text-primary">
                        Você confirma o envio do formulário? Ao enviar o formulário, suas
                        respostas não poderão ser mais editadas{" "}
                    </p>
                    <div className="modal-action">
                        <form method="dialog" className="flex gap-[1vw]">
                            <button
                                onClick={enviarEntrevista}
                                className="btn btn-accent text-primary font-corpo md:text-[.9vw] text-[3.5vw] md:w-[8vw] w-[30vw] h-[6vh]"
                            >
                                <PaperPlaneTiltIcon size="2.5vh" weight="thin" />
                                Enviar
                            </button>
                            <button className="btn btn-outline text-red-400 font-corpo md:text-[.9vw] text-[3.5vw] md:w-[8vw] w-[32vw] h-[6vh] btn-error">
                                ✕ Cancelar
                            </button>
                        </form>
                    </div>
                </div>
            </dialog>
        </>
    );
}