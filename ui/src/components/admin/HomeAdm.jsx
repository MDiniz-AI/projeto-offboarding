import {
  UsersIcon,
  WarningCircleIcon,
  ChartBarIcon,
  BuildingsIcon,
  ChatTextIcon,
} from "@phosphor-icons/react";
import { Squircle } from "corner-smoothing";
import ReactApexChart from "react-apexcharts";
import { useState, useEffect } from "react";
import api from "../../lib/api";

export default function HomeAdm() {
  const [loading, setLoading] = useState(true);
  const [aiSummary, setAiSummary] = useState("Carregando resumo da análise...");

  const [kpis, setKpis] = useState({
    totalEntrevistas: 0,
    scoreGeral: 0,
    negativeCountTotal: 0,
    highRiskTotal: 0,
  });

  // --- CONFIGURAÇÕES DE CORES PARA MODO ESCURO ---
  const DARK_THEME_TEXT = "#9CA3AF"; // Cinza claro para textos de gráficos
  const DARK_GRID_COLOR = "#374151"; // Cinza escuro para linhas de grade

  // Gráfico 1: Volume por Tema (Rosca)
  const [donutState, setDonutState] = useState({
    series: [],
    options: {
      chart: { type: "donut", background: "transparent", foreColor: DARK_THEME_TEXT },
      labels: [],
      colors: [
        "#3B82F6", // Azul mais vibrante para dark mode
        "#60A5FA",
        "#FBBF24",
        "#F87171",
        "#2DD4BF",
        "#A78BFA",
        "#F472B6",
      ],
      legend: {
        position: "bottom",
        labels: { colors: DARK_THEME_TEXT },
      },
      dataLabels: { enabled: false },
      plotOptions: { pie: { donut: { size: "65%" } } },
      stroke: { show: true, colors: ["#1F2937"], width: 2 }, // Borda do gráfico na cor do card (bg-gray-800)
      tooltip: { theme: "dark" },
    },
  });

  // Gráfico 2: Score por Tema (Barras Horizontais)
  const [barState, setBarState] = useState({
    series: [{ name: "Score Médio", data: [] }],
    options: {
      chart: { 
        type: "bar", 
        toolbar: { show: true }, 
        background: "transparent",
        foreColor: DARK_THEME_TEXT 
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: true,
          dataLabels: { position: "top" },
          colors: {
            ranges: [
              { from: -1, to: 0, color: "#EF4444" }, // Vermelho mais visível
              { from: 0, to: 1, color: "#34D399" },  // Verde menta mais visível
            ],
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => val.toFixed(2),
        style: { colors: ["#FFFFFF"] }, // Texto dentro da barra branco
      },
      xaxis: {
        categories: [],
        min: -1,
        max: 1,
        title: {
          text: "Sentimento (Score)",
          style: { color: DARK_THEME_TEXT },
        },
        labels: { style: { colors: DARK_THEME_TEXT } },
      },
      yaxis: {
        title: { text: "Tema", style: { color: DARK_THEME_TEXT } },
        labels: { style: { colors: DARK_THEME_TEXT } },
      },
      grid: { borderColor: DARK_GRID_COLOR },
      colors: ["#34D399", "#EF4444"],
      tooltip: { shared: true, intersect: false, theme: "dark" },
    },
  });

  // Gráfico 3: Departamentos
  const [deptState, setDeptState] = useState({
    series: [{ name: "Entrevistas", data: [] }],
    options: {
      chart: { 
        type: "bar", 
        toolbar: { show: false }, 
        background: "transparent",
        foreColor: DARK_THEME_TEXT 
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          columnWidth: "50%",
          distributed: true,
        },
      },
      colors: ["#3B82F6", "#60A5FA", "#4ADE80", "#94A3B8", "#F472B6"],
      dataLabels: {
        enabled: true,
        style: { colors: ["#FFFFFF"] },
      },
      xaxis: {
        categories: [],
        labels: {
          style: { fontSize: "12px", colors: DARK_THEME_TEXT },
        },
      },
      yaxis: {
        labels: { style: { colors: DARK_THEME_TEXT } },
      },
      grid: { borderColor: DARK_GRID_COLOR },
      legend: { show: false },
      tooltip: { theme: "dark" },
    },
  });

  // BUSCA DADOS
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get("/analise/insights");
        const {
          totalEntrevistas,
          insights,
          departamentos,
          aiSummary: fetchedSummary,
          scoreGeral,
          highRiskCountTotal,
        } = response.data;

        const dataInsights = insights || [];
        const dataDept = departamentos || [];

        const totalNeg = dataInsights.reduce(
          (acc, item) => acc + Number(item.negativeCount),
          0
        );
        const totalHighRisk = dataInsights.reduce(
          (acc, item) => acc + Number(item.highRiskCount || 0),
          0
        );

        const mediaGeral = parseFloat(scoreGeral) || 0;

        setKpis({
          totalEntrevistas: totalEntrevistas || 0,
          scoreGeral: mediaGeral.toFixed(2),
          negativeCountTotal: totalNeg,
          highRiskTotal: totalHighRisk,
        });

        if (fetchedSummary) {
          setAiSummary(fetchedSummary);
        } else {
          setAiSummary(
            "O resumo da IA não foi gerado. O Backend retornou NULL para este campo."
          );
        }

        setDonutState((prev) => ({
          ...prev,
          series: dataInsights.map((item) => Number(item.responseCount)),
          options: {
            ...prev.options,
            labels: dataInsights.map((item) => item.theme),
          },
        }));

        const sortedInsights = [...dataInsights].sort(
          (a, b) => Number(a.averageScore) - Number(b.averageScore)
        );

        setBarState((prev) => ({
          ...prev,
          series: [
            {
              name: "Score Médio",
              data: sortedInsights.map((item) =>
                Number(item.averageScore).toFixed(2)
              ),
            },
          ],
          options: {
            ...prev.options,
            xaxis: {
              ...prev.options.xaxis,
              categories: sortedInsights.map((item) => item.theme),
            },
          },
        }));

        setDeptState((prev) => ({
          ...prev,
          series: [
            {
              name: "Entrevistas",
              data: dataDept.map((d) => Number(d.totalEntrevistas)),
            },
          ],
          options: {
            ...prev.options,
            xaxis: {
              ...prev.options.xaxis,
              categories: dataDept.map((d) => d.departamento),
            },
          },
        }));

        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar Dashboard:", error);
        setLoading(false);
        const errorMessage =
          error.response?.data?.msg ||
          "Erro interno do servidor.";
        setAiSummary(errorMessage);
      }
    }
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex h-full items-center justify-center bg-gray-900">
        <span className="loading loading-spinner text-white"></span>
      </div>
    );

  return (
    // Adicionei bg-gray-900 aqui caso queira preencher a tela toda
    <div className="flex flex-col gap-[2vh] md:pr-0 pr-[4vw] pb-10 min-h-screen bg-gray-900">
      <h1 className="text-white font-title text-4xl text-center md:text-left my-[2vh] pl-1">
        Visão Geral
      </h1>

      {/* KPI CARDS */}
      <div className="flex gap-[1vw] mr-[1vw] md:flex-nowrap flex-wrap">
        <Squircle
          cornerRadius={20}
          cornerSmoothing={1}
          // DARK MODE: BG CINZA ESCURO (800) + BORDA SUTIL (700)
          className="w-full bg-gray-800 border border-gray-700 shadow-lg flex px-[1vw] py-[3vh] gap-[1vw] items-center"
        >
          <UsersIcon size={42} weight="thin" className="text-blue-400" />
          <div>
            <p className="text-gray-400 font-corpo text-sm">
              Entrevistas Realizadas
            </p>
            <h1 className="text-2xl font-corpo font-bold text-white">
              {kpis.totalEntrevistas}
            </h1>
          </div>
        </Squircle>

        <Squircle
          cornerRadius={20}
          cornerSmoothing={1}
          className="w-full bg-gray-800 border border-gray-700 shadow-lg px-[1vw] py-[3vh] flex gap-[1vw] items-center"
        >
          <ChartBarIcon size={42} weight="thin" className="text-blue-400" />
          <div>
            <p className="text-gray-400 font-corpo text-sm">Score Geral</p>
            <h1
              className={`text-2xl font-corpo font-bold ${
                Number(kpis.scoreGeral) >= 0 ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {kpis.scoreGeral > 0 ? "+" : ""}
              {kpis.scoreGeral}
            </h1>
          </div>
        </Squircle>

        <Squircle
          cornerRadius={20}
          cornerSmoothing={1}
          className={`w-full bg-gray-800 border shadow-lg px-[1vw] py-[3vh] flex gap-[1vw] items-center ${
            kpis.highRiskTotal > 0
              ? "border-red-900/50 shadow-red-900/20"
              : "border-gray-700"
          }`}
        >
          <WarningCircleIcon size={42} weight="fill" className="text-red-400" />
          <div>
            <p className="text-gray-400 font-corpo text-sm">Risco Crítico</p>
            <h1 className="text-2xl font-corpo font-bold text-red-400">
              {kpis.highRiskTotal}
            </h1>
          </div>
        </Squircle>
      </div>

      {/* RESUMO EXECUTIVO DA IA */}
      <Squircle
        cornerRadius={20}
        cornerSmoothing={1}
        className="w-full mr-[1vw] px-[2vw] py-[3vh] bg-gray-800 border border-gray-700 shadow-lg flex flex-col gap-[2vh]"
      >
        <div className="flex items-center gap-3">
          <ChatTextIcon size={32} weight="fill" className="text-purple-400" />
          <h2 className="font-corpo font-bold text-xl text-white">
            Resumo Executivo da Análise
          </h2>
        </div>
        <div className="divider my-0 bg-gray-700 h-px"></div>
        <p
          className="text-gray-300 font-corpo text-base leading-relaxed"
          style={{ whiteSpace: "pre-wrap" }}
        >
          {aiSummary}
        </p>
      </Squircle>

      {/* LINHA 1 DE GRÁFICOS */}
      <div className="flex flex-row gap-[1vw] mr-[1vw] md:flex-nowrap flex-wrap">
        {/* Score por Tema */}
        <Squircle
          cornerRadius={20}
          cornerSmoothing={1}
          className="w-full md:w-2/3 px-[1vw] py-[3vh] bg-gray-800 border border-gray-700 shadow-lg"
        >
          <h2 className="text-left font-corpo font-bold text-lg text-white ml-4">
            Satisfação por Tema
          </h2>
          <p className="text-xs text-gray-400 ml-4 mb-4">
            Score Médio Sentimental (-1 a +1)
          </p>
          <div className="divider mt-0 mb-0 bg-gray-700 h-px"></div>
          <ReactApexChart
            options={barState.options}
            series={barState.series}
            type="bar"
            height={350}
          />
        </Squircle>

        {/* Volume de Menções */}
        <Squircle
          cornerRadius={20}
          cornerSmoothing={1}
          className="w-full md:w-1/3 px-[1vw] py-[3vh] bg-gray-800 border border-gray-700 shadow-lg"
        >
          <h2 className="text-left font-corpo font-bold text-lg text-white ml-4">
            Principais Tópicos
          </h2>
          <p className="text-xs text-gray-400 ml-4 mb-4">
            Volume de menções categorizadas
          </p>
          <div className="divider mt-0 mb-0 bg-gray-700 h-px"></div>
          <div className="flex justify-center items-center h-[280px]">
            <ReactApexChart
              options={donutState.options}
              series={donutState.series}
              type="donut"
              width={340}
            />
          </div>
        </Squircle>
      </div>

      {/* LINHA 2: GRÁFICO DE DEPARTAMENTOS */}
      <div className="mr-[1vw]">
        <Squircle
          cornerRadius={20}
          cornerSmoothing={1}
          className="w-full px-[1vw] py-[3vh] bg-gray-800 border border-gray-700 shadow-lg"
        >
          <div className="flex items-center gap-2 ml-4">
            <BuildingsIcon size={24} className="text-blue-400" />
            <h2 className="text-left font-corpo font-bold text-lg text-white">
              Respostas por Departamento
            </h2>
          </div>
          <p className="text-xs text-gray-400 ml-12 mb-4">
            Volume total de entrevistas por área
          </p>
          <div className="divider mt-0 mb-0 bg-gray-700 h-px"></div>
          <ReactApexChart
            options={deptState.options}
            series={deptState.series}
            type="bar"
            height={300}
          />
        </Squircle>
      </div>
    </div>
  );
}