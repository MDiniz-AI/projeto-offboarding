import { UsersIcon, UserIcon, WarningCircleIcon, ChartBarIcon } from '@phosphor-icons/react';
import { Squircle } from "corner-smoothing";
import ReactApexChart from "react-apexcharts";
import { useState, useEffect } from 'react';
import api from '../../lib/api';

export default function HomeAdm() {
    const [loading, setLoading] = useState(true);
    
    // Estados para os Cards (KPIs)
    const [kpis, setKpis] = useState({
        totalRespostas: 0,
        scoreGeral: 0,
        riscoAlto: 0
    });

    // Estado para o Gráfico de Rosca (Volume por Tema)
    const [donutState, setDonutState] = useState({
        series: [],
        options: {
            chart: { type: "donut" },
            labels: [],
            colors: ['#1968F0', '#8EA7D3', '#FFB547', '#FF6B6B', '#4ECDC4'], // Cores da paleta
            legend: { position: "bottom" },
            dataLabels: { enabled: false },
            plotOptions: { pie: { donut: { size: '65%' } } }
        }
    });

    // Estado para o Gráfico de Barras (Score por Tema)
    const [barState, setBarState] = useState({
        series: [{ name: 'Score Médio', data: [] }],
        options: {
            chart: { type: 'bar', toolbar: { show: false } },
            plotOptions: {
                bar: {
                    borderRadius: 4,
                    horizontal: true, // Barras deitadas facilitam ler os temas
                    colors: {
                        ranges: [
                            { from: -1, to: -0.1, color: '#FF6B6B' }, // Vermelho para negativo
                            { from: 0, to: 1, color: '#4ECDC4' }     // Verde para positivo
                        ]
                    }
                }
            },
            dataLabels: { enabled: true, formatter: (val) => val.toFixed(2) },
            xaxis: { 
                categories: [], 
                min: -1, 
                max: 1,
                labels: { formatter: (val) => val.toFixed(1) }
            },
            grid: { borderColor: '#f1f1f1' }
        }
    });

    // BUSCA DADOS DA API
    useEffect(() => {
        async function fetchData() {
            try {
                // Chama o endpoint de agregação que criamos no backend
                const response = await api.get('/analise/insights');
                const data = response.data; // Array de objetos { theme, averageScore, responseCount, negativeCount }

                if (!data || data.length === 0) {
                    setLoading(false);
                    return;
                }

                // 1. CALCULA KPIs
                const totalVol = data.reduce((acc, item) => acc + Number(item.responseCount), 0);
                const totalNeg = data.reduce((acc, item) => acc + Number(item.negativeCount), 0);
                // Média ponderada simples dos scores
                const somaScores = data.reduce((acc, item) => acc + (Number(item.averageScore) * Number(item.responseCount)), 0);
                const mediaGeral = totalVol > 0 ? (somaScores / totalVol).toFixed(2) : 0;

                setKpis({
                    totalRespostas: totalVol,
                    scoreGeral: mediaGeral,
                    riscoAlto: totalNeg // Usando contagem de negativos como proxy de risco por enquanto
                });

                // 2. PREPARA GRÁFICO DE ROSCA (Volume por Tema)
                setDonutState(prev => ({
                    ...prev,
                    series: data.map(item => Number(item.responseCount)),
                    options: { ...prev.options, labels: data.map(item => item.theme) }
                }));

                // 3. PREPARA GRÁFICO DE BARRAS (Score por Tema)
                // Ordena do pior para o melhor score para destacar problemas no topo
                const sortedData = [...data].sort((a, b) => a.averageScore - b.averageScore);
                
                setBarState(prev => ({
                    ...prev,
                    series: [{ name: 'Score Médio', data: sortedData.map(item => Number(item.averageScore).toFixed(2)) }],
                    options: {
                        ...prev.options,
                        xaxis: { ...prev.options.xaxis, categories: sortedData.map(item => item.theme) }
                    }
                }));

                setLoading(false);

            } catch (error) {
                console.error("Erro ao carregar dashboard:", error);
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    if (loading) {
        return <div className="flex h-full items-center justify-center"><span className="loading loading-spinner text-primary"></span></div>;
    }

    return(
        <div className='flex flex-col gap-[2vh] md:pr-0 pr-[4vw] pb-10'>
            <h1 className="text-primary font-title text-4xl text-center md:text-left my-[2vh]">Visão Geral</h1>
            
            {/* SEÇÃO 1: CARTÕES DE KPI */}
            <div className="flex gap-[1vw] mr-[1vw] md:flex-nowrap flex-wrap">
                
                {/* Card 1: Total de Respostas */}
                <Squircle cornerRadius={20} cornerSmoothing={1} className="w-full bg-secondary/12 flex px-[1vw] py-[3vh] gap-[1vw] items-center">
                    <UsersIcon size={42} weight="thin" className="text-primary"/>
                    <div>
                        <p className="text-primary/75 font-corpo text-sm">Total de Respostas</p>
                        <h1 className="text-2xl font-corpo font-bold text-primary">{kpis.totalRespostas}</h1>
                    </div>
                </Squircle>

                {/* Card 2: Score Geral (Termômetro) */}
                <Squircle cornerRadius={20} cornerSmoothing={1} className="w-full bg-secondary/12 px-[1vw] py-[3vh] flex gap-[1vw] items-center">
                    <ChartBarIcon size={42} weight="thin" className="text-primary"/>
                    <div>
                        <p className="text-primary/75 font-corpo text-sm">Score de Sentimento</p>
                        <h1 className={`text-2xl font-corpo font-bold ${Number(kpis.scoreGeral) >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {kpis.scoreGeral > 0 ? '+' : ''}{kpis.scoreGeral}
                        </h1>
                        <p className="text-xs text-primary/60">Escala de -1 a +1</p>
                    </div>
                </Squircle>

                {/* Card 3: Alerta de Risco */}
                <Squircle cornerRadius={20} cornerSmoothing={1} className="w-full bg-secondary/12 px-[1vw] py-[3vh] flex gap-[1vw] items-center">
                    <WarningCircleIcon size={42} weight="thin" className="text-error"/>
                    <div>
                        <p className="text-primary/75 font-corpo text-sm">Feedbacks Negativos</p>
                        <h1 className="text-2xl font-corpo font-bold text-error">{kpis.riscoAlto}</h1>
                        <p className="text-xs text-primary/60">Requerem atenção</p>
                    </div>
                </Squircle>
            </div>
            
            {/* SEÇÃO 2: GRÁFICOS PRINCIPAIS */}
            <div className="flex flex-row gap-[1vw] mr-[1vw] md:flex-nowrap flex-wrap h-full">
                
                {/* Gráfico 1: Barras Horizontais (Satisfação por Tema) */}
                <Squircle cornerRadius={20} cornerSmoothing={1} className="w-full md:w-2/3 px-[1vw] py-[3vh] bg-secondary/12">
                    <h2 className='text-left font-corpo font-bold text-lg text-primary ml-4'>Satisfação por Tema (Score Médio)</h2>
                    <p className="text-xs text-primary/60 ml-4 mb-4">Onde estamos indo bem vs. onde precisamos melhorar</p>
                    <div className="divider mt-0 mb-0"></div>
                    <ReactApexChart options={barState.options} series={barState.series} type="bar" height={350} />
                </Squircle>

                {/* Gráfico 2: Donut (Volume por Tema) */}
                <Squircle cornerRadius={20} cornerSmoothing={1} className="w-full md:w-1/3 px-[1vw] py-[3vh] bg-secondary/12">
                    <h2 className='text-left font-corpo font-bold text-lg text-primary ml-4'>Volume de Menções</h2>
                    <p className="text-xs text-primary/60 ml-4 mb-4">Quais assuntos são mais citados?</p>
                    <div className="divider mt-0 mb-0"></div>
                    <div className="flex justify-center items-center h-[300px]">
                        <ReactApexChart options={donutState.options} series={donutState.series} type="donut" width={380} /> 
                    </div>
                </Squircle>
            </div>
        </div>
    )
}