import { UsersIcon , UserIcon, StackIcon, CreditCardIcon} from '@phosphor-icons/react';
import { Squircle } from "corner-smoothing";
import ReactApexChart from "react-apexcharts";
import { useState } from 'react';


export default () => {

    const statsData = [
        {title : "Respostas totais", value : "212", description : "↙ 20 (22%)"},
        {title : "Score médio das respostas", value : "Muito Bom",  description : "↗︎"}
    ]

    const anoAtual = new Date().getFullYear();

        const [dstate, setDstate] = useState({
            series: [44, 55, 41, 17, 15],
            options: {
                chart: {
                type: "donut",
                },

                labels: [
                "Depto. 1",
                "Depto. 1/Depto. 1",
                "Depto. 2",
                "Depto. 3",
                "Depto. 4",
                ],

                legend: {
                position: "top",
                labels: {
                    colors: "rgb(var(--color-primary))", // cor do texto
                    useSeriesColors: false,
                },
                },

                responsive: [
                {
                    breakpoint: 480,
                    options: {
                    legend: {
                        position: "bottom", // exemplo
                    },
                    },
                },
                ],
            },
            });

        const [colState, setColState] = useState({
            series: [{
              name: 'Impressões positivas',
              data: [5, 10, 20, 40, 80, 22, 10, 44, 56, 87, 12, 21]
            }],
            options: {
              chart: {
                height: 500,
                type: 'bar',
              },
              plotOptions: {
                bar: {
                  borderRadius: 10,
                  dataLabels: {
                    position: 'top', // top, center, bottom
                  },
                }
              },
              dataLabels: {
                enabled: true,
                formatter: function (val) {
                  return val + "%";
                },
                offsetY: -20,
                style: {
                  fontSize: '12px',
                  colors: ["#304758"]
                }
              },
              
              xaxis: {
                categories: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dec"],
                position: 'top',
                axisBorder: {
                  show: false
                },
                axisTicks: {
                  show: false
                },
                crosshairs: {
                  fill: {
                    type: 'gradient',
                    gradient: {
                      colorFrom: '#D8E3F0',
                      colorTo: '#BED1E6',
                      stops: [0, 100],
                      opacityFrom: 0.4,
                      opacityTo: 0.5,
                    }
                  }
                },
                tooltip: {
                  enabled: true,
                }
              },
              yaxis: {
                axisBorder: {
                  show: false
                },
                axisTicks: {
                  show: false,
                },
                labels: {
                  show: false,
                  formatter: function (val) {
                    return val + "%";
                  }
                }
              
              },
            },
        });

        const [lnState, setlnState] = useState({
          
            series: [{
                name: "Impressão média",
                data: [0.5, 0.6, 0.54, 0.8, 0.3, 0.7, 0.9, 0.86, 0.91]
            }],
            options: {
              chart: {
                height: 350,
                type: 'line',
                zoom: {
                  enabled: false
                }
              },
              dataLabels: {
                enabled: false
              },
              stroke: {
                curve: 'straight'
              },
              grid: {
                row: {
                  colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                  opacity: 0.5
                },
              },
              xaxis: {
                categories: [anoAtual-8, anoAtual-7, anoAtual-6, anoAtual-5, anoAtual-4, anoAtual-3, anoAtual-2, anoAtual-1, anoAtual],
              }
            },
          
          
        });


    return(
        <div className='flex flex-col gap-[2vh]'>
            <h1 className="text-primary font-title text-[2.5vw] text-center my-[2vh]">Página inicial</h1>
            
            <div className="flex gap-[1vw] mr-[1vw]">
                <Squircle cornerRadius={20} cornerSmoothing={1} className="w-full bg-secondary/12 flex px-[1vw] py-[3vh] gap-[1vw]">
                        <UsersIcon size="4vw" weight="thin" className="my-auto"/>
                    <div>
                        <p className="text-primary/75 font-corpo text-[1vw]">{statsData[0].title}</p>
                        <h1 className="text-[2vw] font-corpo font-bold">{statsData[0].value}</h1>
                        <p className={statsData[0].description.includes("↗︎") ? "text-green-500 font-corpo text-[1vw]" : statsData[0].description.includes("↙") ? "text-red-500 font-corpo text-[1vw]" : "text-primary/75 font-corpo text-[1vw]" }>{statsData[0].description}</p>
                    </div>
                </Squircle>
                <Squircle cornerRadius={20} cornerSmoothing={1} className="w-full bg-secondary/12 px-[1vw] py-[3vh] flex gap-[1vw]">
                    <UserIcon size="4vw" weight="thin" className="my-auto"/>
                    <div>
                        <p className="text-primary/75 font-corpo text-[1vw]">{statsData[1].title}</p>
                        <h1 className="text-[2vw] font-corpo font-bold">{statsData[1].value}</h1>
                        <p className={statsData[1].description.includes("↗︎") ? "text-green-500 font-corpo text-[1vw]" : statsData[1].description.includes("↙") ? "text-red-500 font-corpo text-[1vw]" : "text-primary/75 font-corpo text-[1vw]" }>{statsData[1].description}</p>
                    </div>
                </Squircle>
            </div>
            
            <div className="flex flex-row gap-[1vw] mr-[1vw]">
                <Squircle cornerRadius={20} cornerSmoothing={1} className="w-full px-[1vw] py-[3vh] bg-secondary/12">
                    <h2 className='text-center font-corpo font-bold text-[2vw]'>Respostas por depto</h2>
                    <div className="divider mt-[1vh]"></div>
                    <ReactApexChart options={dstate.options} series={dstate.series} type="donut" className="text-primary" /> 
                </Squircle>
                <Squircle cornerRadius={20} cornerSmoothing={1} className="w-full px-[1vw] py-[3vh] bg-secondary/12">
                    <h2 className='text-center font-corpo font-bold text-[2vw]'>Impressões positivas (2025)</h2>
                    <div className="divider mt-[1vh]"></div>
                    <ReactApexChart options={colState.options} series={colState.series} type="bar" height={500} />
                </Squircle>
            </div>

            <Squircle cornerRadius={20} cornerSmoothing={1} className="w-full px-[1vw] py-[3vh] bg-secondary/12">
                    <h2 className='text-center font-corpo font-bold text-[2vw]'>Nível médio de impressões</h2>
                    <div className="divider mt-[1vh]"></div>
                    <ReactApexChart options={lnState.options} series={lnState.series} type="line" height={350} />
            </Squircle>
        </div>
    )
}