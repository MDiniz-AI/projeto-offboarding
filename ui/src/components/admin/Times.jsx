import { Squircle } from "corner-smoothing";
import {
  DotsThreeIcon,
  LightbulbIcon,
  UserListIcon,
  ChatTextIcon,
} from "@phosphor-icons/react";
import { useState, useEffect } from "react";
import api from "../../lib/api";

// --- Componente de Card Individual do Departamento ---
const DepartmentCard = ({ departamento, onShowDetails }) => {
  // Score vem entre -1 e 1. Se for null/undefined, assume 0.
  const score = Number(departamento.averageScore) || 0;
  // Normaliza de [-1, 1] para [0, 1] para a barra de progresso
  const scoreNormalizado = (score + 1) / 2;
  const totalSaidas = departamento.total || 0;

  const getBgClass = (valor) => {
    if (valor >= 0.7) return "progress-success";
    if (valor >= 0.3) return "progress-warning";
    return "progress-error";
  };

  return (
    <Squircle
      className="bg-secondary/30 md:w-[30vw] w-full md:h-[35vh] h-70 px-[1.2vw] py-[1vh] flex flex-col justify-between"
      cornerRadius={20}
      cornerSmoothing={1}
    >
      <h2 className="font-title text-primary text-2xl text-center mt-[1vw]">
        {departamento.nome}
      </h2>

      <div className="flex flex-col gap-2">
        <div className="relative w-full">
          {/* Barra de Progresso do Score */}
          <progress
            className={`progress w-full h-[3vh] ${getBgClass(
              scoreNormalizado
            )}`}
            value={scoreNormalizado * 100}
            max="100"
          ></progress>

          <p className="text-primary text-center font-corpo text-md mt-1">
            Score Médio:
            <span
              className={`font-bold ${
                score >= 0 ? "text-green-600" : "text-error"
              }`}
            >
              {score.toFixed(2)}
            </span>
          </p>
          <p className="text-primary text-center font-corpo text-sm">
            Total de Entrevistas: {totalSaidas}
          </p>
        </div>

        {/* Dica baseada no Score */}
        <Squircle
          className="bg-secondary/30 w-full h-15 px-[1vw] py-[1vh] flex gap-[.5vw] items-center"
          cornerRadius={20}
          cornerSmoothing={1}
        >
          <LightbulbIcon
            size={24}
            weight="thin"
            className="my-auto text-primary w-7"
          />
          <p className="font-corpo text-xs my-auto">
            {scoreNormalizado < 0.3 && totalSaidas > 0
              ? "ALERTA: Priorize a conversa com a liderança para contenção de danos."
              : "Acompanhamento estável. Utilize o Resumo Executivo para identificar nuances."}
          </p>
        </Squircle>
      </div>

      <Squircle
        onClick={() => onShowDetails(departamento.nome)}
        cornerRadius={10}
        cornerSmoothing={1}
        className="flex bg-secondary/50 w-50 h-[7vh] justify-center mt-[2vh] mx-auto hover:bg-secondary/70 transition-all"
      >
        <DotsThreeIcon size="4vh" weight="thin" className="my-auto" />
        <p className="text-primary text-md font-corpo my-auto">Ver Detalhes</p>
      </Squircle>
    </Squircle>
  );
};

// --- Componente Principal da Página de Times/Departamentos ---
export default function TimesAdm() {
  const [departamentos, setDepartamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState({
    nome: "",
    resumo: "Carregando resumo executivo...",
    loading: false,
    score: 0,
  });

  // 1. Busca a lista de departamentos e suas métricas
  useEffect(() => {
    async function fetchDepartments() {
      try {
        // Busca os dados do Dashboard (que já tem a lista de departamentos)
        const response = await api.get("/analise/insights");

        // Mapeia a lista de departamentos (apenas volume)
        const dataDept = response.data.departamentos || [];

        // CRUCIAL: Se o Backend não fornece o averageScore por departamento, o Frontend simula 0.
        const departmentsWithScores = dataDept.map((d) => ({
          nome: d.departamento, // 🔥 ALINHAMENTO
          total: d.totalEntrevistas, // 🔥 ALINHAMENTO
          averageScore: d.averageScore ?? 0,
        }));

        setDepartamentos(departmentsWithScores);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar departamentos:", error);
        setLoading(false);
      }
    }
    fetchDepartments();
  }, []);

  // 2. Função para exibir o Modal e buscar o Resumo da IA
  const handleShowDetails = async (nomeDepartamento) => {
    // Encontra o score atual do departamento (pode ser 0.00)
    const dept = departamentos.find((d) => d.nome === nomeDepartamento);

    setModalData({
      nome: nomeDepartamento,
      resumo: "Gerando resumo executivo...",
      loading: true,
      score: dept?.averageScore || 0,
    });
    document.getElementById("modalTimes").showModal();

    try {
      // Chamada à Rota NOVA de Resumo Executivo
      const response = await api.get(
        `/analise/resumo-executivo/${nomeDepartamento}`
      );

      setModalData((prev) => ({
        ...prev,
        resumo:
          response.data.resumo_ia ||
          "Nenhuma informação detalhada encontrada. O departamento pode não ter respostas de texto.",
        loading: false,
      }));
    } catch (error) {
      console.error("Erro ao buscar resumo da IA:", error);
      setModalData((prev) => ({
        ...prev,
        resumo:
          "Erro ao comunicar com a IA para gerar o resumo. Tente novamente mais tarde.",
        loading: false,
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  return (
    <div className="md:pr-2 pr-7">
      <h1 className="text-primary font-title text-4xl text-center md:text-left my-[2vh]">
        Visão por Departamento
      </h1>
      <div className="flex md:flex-row flex-col flex-wrap gap-3">
        {/* Renderiza um Card para cada departamento encontrado */}
        {departamentos.map((dept, index) => (
          <DepartmentCard
            key={index}
            departamento={dept}
            onShowDetails={handleShowDetails}
          />
        ))}

        {departamentos.length === 0 && (
          <p className="text-primary/70 font-corpo text-lg mt-4">
            Nenhum departamento encontrado. Adicione usuários e entreviste para
            ver os dados.
          </p>
        )}
      </div>

      {/* --- MODAL DE DETALHES DO TIME --- */}
      <dialog id="modalTimes" className="modal">
        <div className="modal-box max-w-4xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-secondary absolute right-[1vw] top-[4vh] text-primary">
              ✕
            </button>
          </form>

          <div className="flex flex-col mt-[1vh] gap-[1vh]">
            <h1 className="font-title text-4xl text-primary">
              {modalData.nome}
            </h1>
            <p
              className={`font-corpo text-primary/70 text-lg ${
                modalData.score >= 0 ? "text-green-600" : "text-error"
              }`}
            >
              Score Médio: {Number(modalData.score).toFixed(2)}
            </p>
          </div>

          <div className="mt-[4vh]">
            <div className="tabs tabs-lift">
              {/* TAB 1: RESUMO EXECUTIVO (IA) */}
              <input
                type="radio"
                name="modal_tabs"
                id="tab_resumo"
                className="tab"
                defaultChecked
                aria-label="Resumo Executivo"
              />
              <label
                htmlFor="tab_resumo"
                className="tab flex gap-[.5vw] border-secondary/50 border-b-0"
              >
                <ChatTextIcon size={24} weight="thin" className="my-auto" />
                Resumo Executivo (IA)
              </label>

              <div className="tab-content bg-secondary/10 border-secondary/50 p-6">
                <h2 className="text-xl font-title text-primary mb-4">
                  Relatório Consolidado de Saídas ({modalData.nome})
                </h2>
                {modalData.loading ? (
                  <div className="flex justify-center items-center h-[200px]">
                    <span className="loading loading-spinner text-primary loading-lg"></span>
                  </div>
                ) : (
                  <p className="font-corpo text-primary whitespace-pre-wrap">
                    {modalData.resumo}
                  </p>
                )}
              </div>

              {/* TAB 2: EX-COLABORADORES (Tabela) */}
              <input
                type="radio"
                name="modal_tabs"
                id="tab_colab"
                className="tab"
                aria-label="(ex)Colaboradores"
              />
              <label
                htmlFor="tab_colab"
                className="tab flex gap-[.5vw] border-secondary/50 border-b-0"
              >
                <UserListIcon size={24} weight="thin" className="my-auto" />
                (ex)Colaboradores
              </label>

              <div className="tab-content bg-secondary/10 border-secondary/50 p-6">
                <h2 className="text-xl font-title text-primary mb-4">
                  Lista de Entrevistas
                </h2>
                <p className="font-corpo text-primary/70 mb-4">
                  **Funcionalidade em desenvolvimento.** Aqui serão listados os
                  ex-colaboradores deste departamento com acesso às respostas
                  individuais e scores de risco.
                </p>

                <table className="table table-zebra font-corpo mt-[2vh] border-separate w-full">
                  <thead>
                    <tr>
                      <th>Colaborador</th>
                      <th>Função</th>
                      <th>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-secondary/40">
                      <td>
                        <div className="font-bold">Dados Fictícios</div>
                      </td>
                      <td>Analista Júnior</td>
                      <td className="text-error font-bold"> -0.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
}
