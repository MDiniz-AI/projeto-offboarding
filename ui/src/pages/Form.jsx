import imgFundoPg from "../assets/form/fundo-pg.webp";
import imgFundoCa from "../assets/form/fundo-ca.webp";
import imgFundoCde from "../assets/form/fundo-cde.webp";
import imgFundoEio from "../assets/form/fundo-eio.webp";
import imgFundoFim from "../assets/form/fundo-fim.webp";
import imgFundoLg from "../assets/form/fundo-lg.webp";
import imgFundoLi from "../assets/form/fundo-li.webp";
import imgFundoPd from "../assets/form/fundo-pd.webp";

import api from "../lib/api";

import BlocoPrincipal from "../components/BlocoPrincipal";
import FormRenderer from "../components/FormRenderer";
import { createContext, useContext, useState, useEffect } from "react";
import {
  CaretRightIcon,
  CheckIcon,
  PaperPlaneTiltIcon,
  HouseIcon,
} from "@phosphor-icons/react";
//import Perguntas from "../perguntas.json";
import { useNavigate, useSearchParams } from "react-router-dom";

export const Contexto = createContext();

export default () => {
  const [searchParams, setSearchParams] = useSearchParams();

  //  const [perguntas, setPerguntas] = useState(Perguntas);
  const [perguntas, setPerguntas] = useState([[], [], [], [], [], [], []]);
  const [isLoading, setIsLoading] = useState(true);
  const [secao, setSecao] = useState(2);
  const categorias = [
    "Perguntas gerais",
    "Cultura e ambiente",
    "Liderança e gestão",
    "Estrutura, incentivos e oportunidades",
    "Comunicação e decisões estratégicas",
    "Perguntas específicas: Pedido de desligamento",
    "Perguntas específicas: Liderança",
    "Finalização",
  ];
  const imgVet = [
    imgFundoPg,
    imgFundoCa,
    imgFundoLg,
    imgFundoEio,
    imgFundoCde,
    imgFundoPd,
    imgFundoLi,
    imgFundoFim,
  ];
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
  async function buscarPerguntas() {
    setIsLoading(true);
    try {
      const response = await api.get("/perguntas/");

      console.log("Dados brutos da API:", response.data);

      const perguntasNormalizadas = response.data.map(secao =>
        secao.map(p => ({
          id: p.id_pergunta,
          texto: p.texto_pergunta,
          categoria: p.categoria,
          tipo: p.tipo_resposta,
          opcoes: p.opcoes,
          resposta_texto: "",
          resposta_valor: null,
        }))
      );

      setPerguntas(perguntasNormalizadas);

    } catch (err) {
      console.error("Erro ao buscar perguntas da API:", err);
    } finally {
      setIsLoading(false);
    }
  }

  buscarPerguntas();
}, []);


  useEffect(() => {
    const param = searchParams.get("secao");

    if (param === null) {
      setSecao(2);
    } else {
      const novaSecao = Number(param);
      if (
        novaSecao == null ||
        isNaN(novaSecao) ||
        novaSecao > 9 ||
        novaSecao < 2
      )
        secaoQuery = 2;
      else setSecao(novaSecao);
    }
  }, [searchParams]);

  function avancaPasso() {
    setSecao(secao + 1);
  }

  function atualizarResposta(idPergunta, resposta_texto, resposta_valor) {
    setPerguntas((prev) =>
      prev.map((secao) =>
        secao.map((p) =>
          p.id === idPergunta
            ? {
                ...p,
                resposta_texto: resposta_texto ?? p.resposta_texto,
                resposta_valor: resposta_valor ?? p.resposta_valor,
              }
            : p
        )
      )
    );
  }

  async function enviarEntrevista() {
    const respostasMapeadas = perguntas.flat(Infinity).map((p) => ({
      id_pergunta: p.id,
      texto_resposta: p.resposta_texto ?? "",
      resposta_valor: p.resposta_valor ?? null,
    }));

    const payload = {
      id_usuario: 1,
      respostas: respostasMapeadas,
    };

    console.log("Payload final enviado:", payload);

    try {
      const response = await api.post("/respostas/", payload);

      console.log("Enviado com sucesso:", response.data);

      enviaDados();
    } catch (err) {
      console.error("Erro ao enviar:", err);
      alert("Erro ao enviar respostas.");
    }
  }

  function enviaDados() {
    setIsSubmitted(true);
  }

  function irParaHome() {
    navigate("/");
  }

  return (
    <Contexto.Provider
      value={{
        perguntas,
        secao,
        avancaPasso,
        categorias,
        imgVet,
        enviaDados,
        isSubmitted,
        isLoading,
        irParaHome,
        enviarEntrevista,
        atualizarResposta,
      }}
    >
      <App />
    </Contexto.Provider>
  );
};

function App() {
  const {
    perguntas,
    secao,
    avancaPasso,
    categorias,
    imgVet,
    enviaDados,
    isSubmitted,
    irParaHome,
    isLoading,
    atualizarResposta,
    enviarEntrevista,
  } = useContext(Contexto);


    const htmlForm =<div>
            <h1 className="font-title md:text-[3.5vw] text-[8vw] text-center md:text-left text-primary">Pesquisa de offboarding</h1>
            <p className="font-corpo md:w-[40vw] w-[95vw] md:text-[1vw] text-[3vw] md:text-justify text-center text-primary mx-auto md:mx-0">{categorias[secao-2]}</p>
            <div className='bg-primary h-[.01vh] min-h-[.5px] md:w-[40vw] md:mx-0 mx-auto w-[97vw] mt-[3vh] '/>
            <form action="">
                <div className='mt-[5vh] md:h-[52vh] h-[57vh] overflow-y-auto md:w-[42vw] w-[97vw] md:mx-0 mx-auto'>
                    <FormRenderer perguntas={perguntas[secao-2]} />
                </div>
                <div>
                    {secao < 7 ?
                        <button type="button" onClick={avancaPasso} className="flex md:gap-[32vw] gap-[60vw] bg-accent md:p-[1vw] p-[3vw] rounded-xl w-[97vw] md:w-[41vw] mx-auto md:mx-0 mb-[1vh] md:mb-0 mt-[2vh]" >
                            <p className="font-corpo md:text-[1vw] text-[4vw] my-auto text-primary">Continuar</p>
                            <CaretRightIcon size="4vh" weight="thin" className="my-auto text-primary" />
                        </button>
                        :
                        <div className='mt-[-10vw] md:mt-0'>
                            <p className='text-primary md:w-[42vw] w-[97vw] md:text-[.7vw] text-[2.5vw] font-corpo md:text-justify text-center md:mx-0 mx-auto'>Caso queira visualizar e/ou corrigir suas respostas, você pode navegar pelos blocos interagindo com os ícones do menu lateral. Ao enviar suas respostas, você concorda com os <a href="#" onClick={() => document.getElementById('modalTermos').showModal()}><u>Termos de Privacidade</u></a>.</p>
                            <button type="button" onClick={() => document.getElementById('modalConfirmar').showModal()} className="flex md:gap-[32vw] gap-[60vw] bg-accent md:p-[1vw] p-[3vw] rounded-xl w-[97vw] md:w-[41vw] mx-auto md:mx-0 md:mb-0 md:mt-0" >
                                <p className="font-corpo md:text-[1vw] text-[4vw] my-auto text-primary">Finalizar</p>
                                <CheckIcon size="4vh" weight="thin" className="my-auto text-primary" />
                            </button>
                        </div>
                    }
                </div>
            </form> 
        </div>


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


const secaoAtual = secao - 2;

const perguntasDaSecao =
  perguntas && Array.isArray(perguntas[secaoAtual])
    ? perguntas[secaoAtual]
    : [];

let htmlContent;

if (isLoading) {
  htmlContent = (
    <div className="flex items-center justify-center h-full text-primary font-title md:text-[2vw] text-[6vw]">
      Carregando Formulário...
    </div>
  );
} else if (isSubmitted) {
  htmlContent = htmlSubmitted;
} else if (!perguntasDaSecao || perguntasDaSecao.length === 0) {
  htmlContent = (
    <div className="p-8 text-center text-red-500 font-corpo">
      Erro ao carregar o formulário. Por favor, tente novamente mais tarde.
    </div>
  );
} else {

  if (secao === 1) {
    htmlContent = htmlForm;
    
  } else if (secao === 9) {
    htmlContent = (
      <div className="p-8 text-center">
        <h3 className="font-title md:text-[2vw] text-[6vw] text-primary">
          Pronto para enviar?
        </h3>
      </div>
    );
  } else {
    htmlContent = (
      <div>
        <h1 className="font-title md:text-[3.5vw] text-[8vw] text-center md:text-left text-primary">
          Pesquisa de offboarding
        </h1>

        <p className="font-corpo md:w-[40vw] w-[95vw] md:text-[1vw] text-[3vw] md:text-justify text-center text-primary mx-auto md:mx-0">
          {categorias[secaoAtual]}
        </p>

        <div className="bg-primary h-[.01vh] min-h-[.5px] md:w-[40vw] md:mx-0 mx-auto w-[97vw] mt-[3vh]" />

        <form>
          <div className="mt-[5vh] md:h-[52vh] h-[57vh] overflow-y-auto md:w-[42vw] w-[97vw] md:mx-0 mx-auto">
           
            <FormRenderer
              perguntas={perguntasDaSecao}
              atualizarResposta={atualizarResposta}
            />
          </div>

          <div>
            {secao < 7 ? (
              <button type="button"  className="flex md:gap-[32vw] gap-[60vw] bg-accent md:p-[1vw] p-[3vw] rounded-xl w-[97vw] md:w-[41vw] mx-auto md:mx-0 mb-[1vh] md:mb-0 mt-[2vh]"  onClick={avancaPasso}>
                <p className="font-corpo md:text-[1vw] text-[4vw] my-auto text-primary">
                  Continuar
                </p>
              </button>
            ) : (
              <div className="mt-[-10vw] md:mt-0">
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("modalConfirmar").showModal()
                  }
                >
                  <p className="font-corpo md:text-[1vw] text-[4vw] my-auto text-primary">
                    Finalizar
                  </p>
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    );
  }
}

return (
  <>
    <BlocoPrincipal imagemFundo={imgVet[secaoAtual]} idPag={secao}>
      {htmlContent}
    </BlocoPrincipal>

    <dialog id="modalTermos" className="modal"></dialog>
    <dialog id="modalConfirmar" className="modal"></dialog>
  </>
);

}