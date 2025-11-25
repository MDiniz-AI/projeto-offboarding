import { UsersIcon , UserIcon, StackIcon, CreditCardIcon} from '@phosphor-icons/react';
import LineChart from "./dashboard/components/LineChart";
import BarChart from "./dashboard/components/BarChart";
import { Squircle } from "corner-smoothing";
import ReactApexChart from "react-apexcharts";
import { useState } from 'react';


export default () => {

    const statsData = [
        {title : "Respostas totais", value : "212", description : "↙ 20 (22%)"},
        {title : "Score médio das respostas", value : "Muito Bom",  description : "↗︎"}
    ]

        const [gstate, setGstate] = useState({
          
            series: [44, 55, 41, 17, 15],
            options: {
                chart: {
                    type: 'donut',
                },
                labels: ["Time 1", "Time 1/Time 1", "Time 2", "Time 3", "Time 4"],
              responsive: [{
                breakpoint: 480,
                options: {
                  legend: {
                    position: 'top'
                  }
                }
              }]
            },
          
          
        });

    return(
        <div>
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
            
            <div className="flex flex-row gap-[1vw] mt-[2vh] mr-[1vw]">
                <Squircle cornerRadius={20} cornerSmoothing={1} className="w-full px-[1vw] py-[3vh] bg-secondary/12">
                    <h2 className='text-center font-corpo font-bold text-[2vw]'>Respostas por time</h2>
                    <div className="divider mt-[1vh]"></div>
                    <ReactApexChart options={gstate.options} series={gstate.series} type="donut" /> 
                </Squircle>
                <Squircle cornerRadius={20} cornerSmoothing={1} className="w-full px-[1vw] py-[3vh] bg-secondary/12">
                    <h2 className='text-center font-corpo font-bold text-[2vw]'>Gráfico</h2>
                    <div className="divider mt-[1vh]"></div>
                    <BarChart />
                </Squircle>
            </div>
                    <LineChart />
        </div>
    )
}