import { Squircle } from "corner-smoothing";
import {
  DotsThreeIcon,
  LightbulbIcon,
  UserListIcon,
  ChatTextIcon,
} from "@phosphor-icons/react";
import { useState, useEffect } from "react";
import api from "../../lib/api";

// --- Card do Departamento (Sem alterações) ---
const DepartmentCard = ({ departamento, onShowDetails }) => {
  const score = Number(departamento.averageScore) || 0;
  const scoreNormalizado = (score + 1) / 2;
  const totalSaidas = departamento.total || 0;

  const getBgClass = (valor) => {
    if (valor >= 0.7) return "progress-success";
    if (valor >= 0.3) return "progress-warning";
    return "progress-error";
  };

  return (
    <Squircle
      className="bg-gray-800 border border-gray-700 shadow-lg md:w-[30vw] w-full md:h-[35vh] h-70 px-[1.2vw] py-[1vh] flex flex-col justify-between"
      cornerRadius={20}
      cornerSmoothing={1}
    >
      <h2 className="font-title text-white text-2xl text-center mt-[1vw]">
        {departamento.nome}
      </h2>
      <div className="flex flex-col gap-2">
        <div className="relative w-full">
          <progress
            className={`progress w-full h-[3vh] bg-gray-700 ${getBgClass(scoreNormalizado)}`}
            value={scoreNormalizado * 100}
            max="100"
          ></progress>
          <p className="text-gray-300 text-center font-corpo text-md mt-1">
            Score Médio: <span className={`font-bold ${score >= 0 ? "text-emerald-400" : "text-red-400"}`}>{score.toFixed(2)}</span>
          </p>
          <p className="text-gray-400 text-center font-corpo text-sm">
            Total de Entrevistas: {totalSaidas}
          </p>
        </div>
        <Squircle
          className="bg-gray-700/50 border border-gray-600/30 w-full h-15 px-[1vw] py-[1vh] flex gap-[.5vw] items-center"
          cornerRadius={20}
          cornerSmoothing={1}
        >
          <LightbulbIcon size={24} weight="thin" className="my-auto text-yellow-400 w-7" />
          <p className="font-corpo text-xs my-auto text-gray-300">
            {scoreNormalizado < 0.5 && totalSaidas > 0
              ? "ALERTA: Priorize a conversa com a liderança para contenção de danos."
              : "Acompanhamento estável. Utilize o Resumo Executivo para identificar nuances."}
          </p>
        </Squircle>
      </div>
      <Squircle
        onClick={() => onShowDetails(departamento.nome)}
        cornerRadius={10}
        cornerSmoothing={1}
        className="flex bg-gray-700 w-50 h-[7vh] justify-center mt-[2vh] mx-auto hover:bg-gray-600 hover:text-white transition-all cursor-pointer border border-gray-600"
      >
        <DotsThreeIcon size="4vh" weight="thin" className="my-auto text-gray-300" />
        <p className="text-gray-300 text-md font-corpo my-auto ml-2">Ver Detalhes</p>
      </Squircle>
    </Squircle>
  );
};

export default function TimesAdm() {
  const [departamentos, setDepartamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("resumo"); 

  // Estado do Modal agora inclui a lista de colaboradores
  const [modalData, setModalData] = useState({
    nome: "",
    resumo: "Carregando resumo executivo...",
    loading: false,
    score: 0,
    colaboradores: [] // <--- NOVO CAMPO
  });

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const response = await api.get("/analise/insights");
        const dataDept = response.data.departamentos || [];
        const departmentsWithScores = dataDept.map((d) => ({
          nome: d.departamento,
          total: d.totalEntrevistas,
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

  // --- FUNÇÃO DE ABRIR MODAL ATUALIZADA ---
  const handleShowDetails = async (nomeDepartamento) => {
    const dept = departamentos.find((d) => d.nome === nomeDepartamento);
    setActiveTab("resumo");

    // 1. Define estado inicial do modal
    setModalData({
      nome: nomeDepartamento,
      resumo: "Gerando resumo executivo...",
      loading: true,
      score: dept?.averageScore || 0,
      colaboradores: [] // Reseta lista
    });
    
    document.getElementById("modalTimes").showModal();

    // 2. Dispara as requisições em paralelo (Resumo IA + Lista Colaboradores)
    try {
      const [resResumo, resColab] = await Promise.all([
        api.get(`/analise/resumo-executivo/${nomeDepartamento}`), // Rota IA
        api.get(`/analise/colaboradores/${nomeDepartamento}`)     // Rota Lista (Nova)
      ]);

      setModalData((prev) => ({
        ...prev,
        resumo: resResumo.data.resumo || "Sem resumo disponível.",
        colaboradores: resColab.data || [], // Popula a lista
        loading: false,
      }));

    } catch (error) {
      console.error("Erro ao carregar detalhes:", error);
      setModalData((prev) => ({
        ...prev,
        resumo: "Erro ao comunicar com o servidor.",
        loading: false,
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-900 min-h-screen">
        <span className="loading loading-spinner text-white"></span>
      </div>
    );
  }

  return (
    <div className="md:pr-2 pr-7 bg-gray-900 min-h-screen pb-10">
      <h1 className="text-white font-title text-4xl text-center md:text-left my-[2vh] pl-1">
        Visão por Departamento
      </h1>
      <div className="flex md:flex-row flex-col flex-wrap gap-3">
        {departamentos.map((dept, index) => (
          <DepartmentCard
            key={index}
            departamento={dept}
            onShowDetails={handleShowDetails}
          />
        ))}
        {departamentos.length === 0 && (
          <p className="text-gray-400 font-corpo text-lg mt-4 pl-1">
            Nenhum departamento encontrado.
          </p>
        )}
      </div>

      {/* --- MODAL --- */}
      <dialog id="modalTimes" className="modal backdrop-blur-sm">
        <div className="modal-box max-w-4xl bg-gray-800 border border-gray-700 shadow-2xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-[1vw] top-[4vh] text-gray-400 hover:bg-gray-700">✕</button>
          </form>

          <div className="flex flex-col mt-[1vh] gap-[1vh]">
            <h1 className="font-title text-4xl text-white">{modalData.nome}</h1>
            <p className={`font-corpo text-lg ${modalData.score >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              Score Médio: {Number(modalData.score).toFixed(2)}
            </p>
          </div>

          <div className="mt-[4vh]">
            <div role="tablist" className="tabs tabs-lifted">
                <a 
                    role="tab" 
                    className={`tab ${activeTab === "resumo" ? "tab-active [--tab-bg:var(--color-gray-900)] [--tab-border-color:var(--color-gray-700)] text-white font-bold" : "text-gray-500 hover:text-gray-300"}`}
                    onClick={() => setActiveTab("resumo")}
                >
                    <ChatTextIcon size={24} weight="thin" className="mr-2" />
                    Resumo Executivo (IA)
                </a>
                
                <a 
                    role="tab" 
                    className={`tab ${activeTab === "colab" ? "tab-active [--tab-bg:var(--color-gray-900)] [--tab-border-color:var(--color-gray-700)] text-white font-bold" : "text-gray-500 hover:text-gray-300"}`}
                    onClick={() => setActiveTab("colab")}
                >
                    <UserListIcon size={24} weight="thin" className="mr-2" />
                    (ex)Colaboradores
                </a>
            </div>

            {/* ABA RESUMO */}
            {activeTab === "resumo" && (
                <div className="bg-gray-900 border border-gray-700 p-6 rounded-b-box text-gray-300 border-t-0 min-h-[30vh]">
                    <h2 className="text-xl font-title text-white mb-4">Relatório Consolidado de Saídas ({modalData.nome})</h2>
                    {modalData.loading ? (
                        <div className="flex justify-center items-center h-[200px]"><span className="loading loading-spinner text-white loading-lg"></span></div>
                    ) : (
                        <p className="font-corpo text-gray-300 whitespace-pre-wrap leading-relaxed">{modalData.resumo}</p>
                    )}
                </div>
            )}

            {/* ABA COLABORADORES (AGORA DINÂMICA) */}
            {activeTab === "colab" && (
                <div className="bg-gray-900 border border-gray-700 p-6 rounded-b-box border-t-0 min-h-[30vh]">
                    <h2 className="text-xl font-title text-white mb-4">Lista de Entrevistas</h2>
                    
                    {modalData.colaboradores.length === 0 ? (
                      <p className="text-gray-500 italic">Nenhum colaborador encontrado para este departamento.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="table font-corpo mt-[2vh] border-separate w-full">
                            <thead>
                                <tr className="border-b border-gray-700 text-left">
                                    <th className="text-gray-400 font-bold bg-transparent">Colaborador</th>
                                    <th className="text-gray-400 font-bold bg-transparent">Função</th>
                                    <th className="text-gray-400 font-bold text-center bg-transparent">Score Individual</th>
                                </tr>
                            </thead>
                            <tbody>
                                {modalData.colaboradores.map((colab) => (
                                  <tr key={colab.id} className="hover:bg-gray-800 transition-colors border-b border-gray-800">
                                      <td className="py-3">
                                          <div className="font-bold text-gray-200">{colab.nome}</div>
                                      </td>
                                      <td className="text-gray-400 py-3">{colab.cargo}</td>
                                      <td className={`font-bold text-center py-3 ${colab.score >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                                          {Number(colab.score).toFixed(2)}
                                      </td>
                                  </tr>
                                ))}
                            </tbody>
                        </table>
                      </div>
                    )}
                </div>
            )}
          </div>
        </div>
        <form method="dialog" className="modal-backdrop"><button>close</button></form>
      </dialog>
    </div>
  );
}