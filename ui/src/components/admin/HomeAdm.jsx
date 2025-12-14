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

  // NOVO ESTADO: Armazenar o resumo de texto da IA
  const [aiSummary, setAiSummary] = useState("Carregando resumo da análise...");

  // KPIs
  const [kpis, setKpis] = useState({
    totalEntrevistas: 0,
    scoreGeral: 0,
    negativeCountTotal: 0,
    highRiskTotal: 0,
  });

  // Gráfico 1: Volume por Tema (Rosca)
  const [donutState, setDonutState] = useState({
    series: [],
    options: {
      chart: { type: "donut" },
      labels: [],
      colors: [
        "#1968F0",
        "#8EA7D3",
        "#FFB547",
        "#FF6B6B",
        "#4ECDC4",
        "#A068F0",
        "#F068A0",
      ],
      legend: { position: "bottom" },
      dataLabels: { enabled: false },
      plotOptions: { pie: { donut: { size: "65%" } } },
      tooltip: { y: { formatter: (val) => `${val} menções` } },
    },
  });

  // Gráfico 2: Score por Tema (Barras Horizontais)
  const [barState, setBarState] = useState({
    series: [{ name: "Score Médio", data: [] }],
    options: {
      chart: { type: "bar", toolbar: { show: true } },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: true,
          dataLabels: { position: "top" },
          colors: {
            ranges: [
              { from: -1, to: 0, color: "#FF6B6B" },
              { from: 0, to: 1, color: "#4ECDC4" },
            ],
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => val.toFixed(2),
        style: { colors: ["#000"] },
      },
      xaxis: {
        categories: [],
        min: -1,
        max: 1,
        title: { text: "Sentimento (Score)" },
      },
      yaxis: { title: { text: "Tema" } },
      grid: { borderColor: "#f1f1f1" },
      colors: ["#4ECDC4", "#FF6B6B"],
      tooltip: { shared: true, intersect: false },
    },
  });

  const [deptState, setDeptState] = useState({
    series: [{ name: "Entrevistas", data: [] }],
    options: {
      chart: { type: "bar", toolbar: { show: false } },
      plotOptions: {
        bar: {
          borderRadius: 4,
          columnWidth: "50%",
          distributed: true,
        },
      },
      colors: ["#1968F0", "#2E93fA", "#66DA26", "#546E7A", "#E91E63"],
      dataLabels: {
        enabled: true,
        style: { colors: ["#000"] },
      },
      xaxis: {
        categories: [],
        labels: { style: { fontSize: "12px" } },
      },
      legend: { show: false },
    },
  });

  // BUSCA DADOS - VERSÃO COM CONVERSÃO DE DADOS MAIS SEGURA
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

        // GARANTIA: Se o Backend falhou parcialmente, usamos arrays vazios.
        const dataInsights = insights || [];
        const dataDept = departamentos || [];

        // 1. KPIs
        // Os KPIs de topo (scoreGeral e highRiskCountTotal) já deveriam vir calculados e formatados do backend.
        // Usamos parseFloat para garantir que sejam números.
        const totalVol = dataInsights.reduce(
          (acc, item) => acc + Number(item.responseCount),
          0
        );
        const totalNeg = dataInsights.reduce(
          (acc, item) => acc + Number(item.negativeCount),
          0
        );
        const totalHighRisk = dataInsights.reduce(
          (acc, item) => acc + Number(item.highRiskCount || 0),
          0
        );

        // Se o scoreGeral não vier, calculamos no frontend, mas ele DEVE vir do backend agora
        const mediaGeral = parseFloat(scoreGeral) || 0;

        setKpis({
          totalEntrevistas: totalEntrevistas || 0,
          scoreGeral: mediaGeral.toFixed(2), // Garante formato XX.XX
          negativeCountTotal: totalNeg,
          highRiskTotal: totalHighRisk, // Deve ser 1 ou 0 no seu caso (Daniel reportou assédio)
        });

        // ATUALIZADO: Salva o Resumo da IA
        if (fetchedSummary) {
          setAiSummary(fetchedSummary);
        } else {
          setAiSummary(
            "O resumo da IA não foi gerado. O Backend retornou NULL para este campo."
          );
        }

        // 2. Gráfico de Rosca (Volume)
        setDonutState((prev) => ({
          ...prev,
          series: dataInsights.map((item) => Number(item.responseCount)),
          options: {
            ...prev.options,
            labels: dataInsights.map((item) => item.theme),
          },
        }));

        // 3. Gráfico de Barras (Score)
        // Usamos map(Number) para garantir que o ApexCharts receba números
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

        // 4. Gráfico de Departamentos
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
        // Exibir a mensagem de erro do servidor no resumo.
        const errorMessage =
          error.response?.data?.msg ||
          "Erro interno do servidor (Status 500). Verifique o console do backend.";
        setAiSummary(errorMessage);
      }
    }
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex h-full items-center justify-center">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );

  return (
    <div className="flex flex-col gap-[2vh] md:pr-0 pr-[4vw] pb-10">
      <h1 className="text-primary font-title text-4xl text-center md:text-left my-[2vh]">
        Visão Geral
      </h1>

      {/* KPI CARDS */}
      <div className="flex gap-[1vw] mr-[1vw] md:flex-nowrap flex-wrap">
        {/* ... (KPIs existentes) ... */}
        <Squircle
          cornerRadius={20}
          cornerSmoothing={1}
          className="w-full bg-secondary/12 flex px-[1vw] py-[3vh] gap-[1vw] items-center"
        >
          <UsersIcon size={42} weight="thin" className="text-primary" />
          <div>
            <p className="text-primary/75 font-corpo text-sm">
              Entrevistas Realizadas
            </p>
            <h1 className="text-2xl font-corpo font-bold text-primary">
              {kpis.totalEntrevistas}
            </h1>
          </div>
        </Squircle>
        <Squircle
          cornerRadius={20}
          cornerSmoothing={1}
          className="w-full bg-secondary/12 px-[1vw] py-[3vh] flex gap-[1vw] items-center"
        >
          <ChartBarIcon size={42} weight="thin" className="text-primary" />
          <div>
            <p className="text-primary/75 font-corpo text-sm">Score Geral</p>
            <h1
              className={`text-2xl font-corpo font-bold ${
                Number(kpis.scoreGeral) >= 0 ? "text-green-600" : "text-red-500"
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
          className={`w-full bg-secondary/12 px-[1vw] py-[3vh] flex gap-[1vw] items-center ${
            kpis.highRiskTotal > 0
              ? "border border-error/50 shadow-md shadow-error/30"
              : ""
          }`}
        >
          <WarningCircleIcon size={42} weight="fill" className="text-error" />
          <div>
            <p className="text-primary/75 font-corpo text-sm">Risco Crítico</p>
            <h1 className="text-2xl font-corpo font-bold text-error">
              {kpis.highRiskTotal}
            </h1>
          </div>
        </Squircle>
        {/* Fim dos KPIs existentes */}
      </div>

      {/* NOVA SEÇÃO: RESUMO EXECUTIVO DA IA */}
      <Squircle
        cornerRadius={20}
        cornerSmoothing={1}
        className="w-full mr-[1vw] px-[2vw] py-[3vh] bg-secondary/12 flex flex-col gap-[2vh]"
      >
        <div className="flex items-center gap-3">
          <ChatTextIcon size={32} weight="fill" className="text-accent" />
          <h2 className="font-corpo font-bold text-xl text-primary">
            Resumo Executivo da Análise
          </h2>
        </div>
        <div className="divider my-0"></div>
        {/* O resumo é renderizado aqui. Usamos `white-space: pre-wrap` para respeitar quebras de linha/formatação. */}
        <p
          className="text-primary font-corpo text-base"
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
          className="w-full md:w-2/3 px-[1vw] py-[3vh] bg-secondary/12"
        >
          <h2 className="text-left font-corpo font-bold text-lg text-primary ml-4">
            Satisfação por Tema
          </h2>
          <p className="text-xs text-primary/60 ml-4 mb-4">
            Score Médio Sentimental (-1 a +1)
          </p>
          <div className="divider mt-0 mb-0"></div>
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
          className="w-full md:w-1/3 px-[1vw] py-[3vh] bg-secondary/12"
        >
          <h2 className="text-left font-corpo font-bold text-lg text-primary ml-4">
            Principais Tópicos
          </h2>
          <p className="text-xs text-primary/60 ml-4 mb-4">
            Volume de menções categorizadas
          </p>
          <div className="divider mt-0 mb-0"></div>
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
          className="w-full px-[1vw] py-[3vh] bg-secondary/12"
        >
          <div className="flex items-center gap-2 ml-4">
            <BuildingsIcon size={24} className="text-primary" />
            <h2 className="text-left font-corpo font-bold text-lg text-primary">
              Respostas por Departamento
            </h2>
          </div>
          <p className="text-xs text-primary/60 ml-12 mb-4">
            Volume total de entrevistas por área
          </p>
          <div className="divider mt-0 mb-0"></div>
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
