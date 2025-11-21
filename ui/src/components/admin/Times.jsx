import { Squircle } from "corner-smoothing"
import { CaretDownIcon, DotsThreeIcon, EyeglassesIcon, LightbulbIcon, LinkIcon, PencilIcon, PlusIcon } from "@phosphor-icons/react";

export default () => {

    const getBgClass = (valor) => {
        if (valor > 0.9) return "#277CDD";
        if (valor >= 0.75) return "#22B457";
        if (valor >= 0.6) return "#2DB61E";
        if (valor >= 0.4) return "#DDB927";
        if (valor >= 0.25) return "#FF3939";
        if (valor >= 0.1) return "#5F1D1D";
        return "#1E1E1E";
    };

    const objTime = {
        nomeTime: "Time 1",
        valorScore: 0.5,
        valorInten: 0.75,
    }

    return (
        <div>
            <h1 className="text-primary font-title text-[2.5vw] text-center my-[2vh]">Times</h1>
            <div className="flex flex-row flex-wrap gap-[1vw]">    
                <Squircle className="bg-secondary/30 w-[30vw] h-[43vh] px-[1.2vw] py-[1vh] flex-col" cornerRadius={20} cornerSmoothing={1}>
                    <h2 className="font-title text-primary text-[1.7vw] text-center mt-[1vw]">{objTime.nomeTime}</h2>
                    <div className="flex flex-col gap-[1.5vh]">
                        <div>
                            <div className="w-full h-[7vh] bg-secondary/60 rounded-xl"> 
                                <div className="h-full rounded-xl" style={{ 
                                    width: `calc(${objTime.valorScore} * 100%)`, 
                                    backgroundColor: `${getBgClass(objTime.valorScore)}` 
                                    }} />
                                <p className="text-primary text-center font-corpo text-[1vw] mt-[-5vh]">{objTime.valorScore}</p>
                            </div>
                            <p className="text-primary text-center font-corpo text-[1vw]">Score Médio</p>
                        </div>
                        <Squircle className="bg-secondary/30 w-full h-[10vh] px-[1vw] py-[1vh] flex gap-[.5vw]" cornerRadius={20} cornerSmoothing={1}>
                            <LightbulbIcon size="3vw" weight="thin" className="my-auto text-primary" />
                            <p className="font-corpo text-[.8vw] my-auto">Dica: Considere conversar com a liderança do time e entender o que pode ser melhorado</p>
                        </Squircle>
                    </div>
                    <Squircle onClick={() => {document.getElementById('modalEdicao').showModal()}} cornerRadius={10} cornerSmoothing={1} className="flex bg-secondary/50 w-[10vw] h-[7vh] justify-center mt-[2vh] ml-[17vw]">
                        <DotsThreeIcon size="4vh" weight="thin" className="my-auto" />
                        <p className="text-primary font-corpo my-auto">Detalhes</p>
                    </Squircle>
                </Squircle>
            </div>
        </div>
    )
}