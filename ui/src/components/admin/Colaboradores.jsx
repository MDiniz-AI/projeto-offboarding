import { Squircle } from "corner-smoothing"
import { CaretDownIcon, DotsThreeIcon, LinkIcon, PlusIcon } from "@phosphor-icons/react";

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

    return(
        <div>
            <h1 className="text-primary font-title text-[2.5vw] text-center my-[2vh]">Colaboradores</h1>
            <div className="flex gap-[1vw] mr-[1vw]">
                <Squircle cornerRadius={20} cornerSmoothing={1} className="flex justify-center items-center bg-secondary/30 w-full h-[30vh]">
                    <p className="font-corpo text-primary text-[2vw] text-center">xx% respondido</p>
                </Squircle>

                <Squircle cornerRadius={20} cornerSmoothing={1} className="flex justify-center items-center bg-secondary/30 w-full h-[30vh]">
                    <p className="font-corpo text-primary text-[2vw] text-center">xx% não respondido</p>
                </Squircle>
            </div>
            <div>
                <h2 className="text-primary font-title text-[2vw] my-[2vh]">(ex)Colaboradores</h2>
                <div className="flex mr-[1vw] gap-[5vw]">
                    <div className="flex flex-row gap-[1vh] w-full">
                        <label for="pesquisar" className="font-corpo md:text-[1vw] md:ml-0 ml-[2vw] text-[4vw] text-primary my-auto">Pesquisar</label>
                        <input name="pesquisar" type="text" id="pesquisar" placeholder="Pesquisar" className="bg-secondary/30 p-[2vh] md:mx-0 w-full h-[7vh] md:w-full mx-auto font-corpo rounded-xl md:text-[1vw] text-[4vw] text-primary"/>
                    </div>
                    <div>
                        <Squircle cornerRadius={10} cornerSmoothing={1} className="flex bg-secondary/50 w-[10vw] h-[7vh] justify-center">
                            <PlusIcon size="4vh" weight="thin" className="my-auto" />
                            <p className="text-primary font-corpo my-auto">Adicionar</p>
                        </Squircle>
                    </div>
                </div>
                <table className="font-corpo mt-[2vh]">
                    <tr>
                        <th className="w-[10vw]">Foto</th>
                        <th className="w-[20vw]" >Nome</th>
                        <th className="w-[12.5vw]">Sentimento</th>
                        <th className="w-[12.5vw]">Link</th>
                        <th className="w-[12.5vw]">Detalhes</th>
                    </tr>
                    <tr>
                        <th><img src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg" alt="" className="w-[4vw] h-[4vw] object-cover rounded-full"/></th>
                        <th>João da Silva</th>
                        <th><div className="w-[12.5vw] h-[6vh] bg-secondary/60 rounded-xl"> 
                                <div className="h-full rounded-xl" style={{ 
                                    width: `calc(0.5 * 12.5vw)`, 
                                    backgroundColor: `${getBgClass(0.5)}` 
                                    }} />
                                <p className="text-primary text-center font-corpo text-[1vw] mt-[-4.5vh]">0.5</p>
                        </div></th>
                        <th><Squircle cornerRadius={10} cornerSmoothing={1} className="flex bg-secondary/50 w-[10vw] h-[6vh] justify-center">
                            <LinkIcon size="4vh" weight="thin" className="my-auto" />
                            <p className="text-primary font-corpo my-auto">Copiar Link</p>
                        </Squircle></th>
                        <th><Squircle cornerRadius={10} cornerSmoothing={1} className="flex bg-secondary/50 w-[10vw] h-[6vh] justify-center">
                            <DotsThreeIcon size="4vh" weight="thin" className="my-auto" />
                            <p className="text-primary font-corpo my-auto">Detalhes</p>
                        </Squircle></th>
                    </tr>
                </table>
            </div>
        </div>
    )
}