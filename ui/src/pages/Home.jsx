import BlocoPrincipal from "../components/BlocoPrincipal"
import {ClockCountdownIcon, LockSimpleIcon, LegoSmileyIcon, ChartLineIcon } from '@phosphor-icons/react';
import { Squircle } from 'corner-smoothing'
import BotaoGrande from "../components/BotaoGrande";
import imagem from '../assets/fundo-pg1.webp';

export default () => {

    const html = <div className="mt-[4vh]">
                    <h1 className="font-title text-[3.5vw] text-primary">Pesquisa de offboarding</h1>
                    <p className="font-corpo w-[40vw] text-[1vw] text-justify text-primary">Sua opinião é muito importante para nós. 💙 <br/> Esta pesquisa nos ajuda a entender melhor sua experiência e a aprimorar continuamente nosso ambiente de trabalho. ✍️</p>
                    <div className="mt-[2vh] flex flex-col gap-[2.5vh]">
                        <div className="flex gap-[2.5vh]">
                            <Squircle cornerRadius={20} cornerSmoothing={1} className="bg-secondary w-[20vw] h-[20vh] flex flex-col justify-center gap-2">
                                <ClockCountdownIcon size="7vh" weight="thin" className="mx-auto text-primary" />
                                <p className="font-corpo text-[2vh] mx-auto text-primary">Leva 10 Minutos</p>
                            </Squircle>
                            <Squircle cornerRadius={20} cornerSmoothing={1} className="bg-secondary w-[20vw] h-[20vh] flex flex-col justify-center gap-2">
                                <LockSimpleIcon size="7vh" weight="thin" className="mx-auto text-primary" />
                                <p className="font-corpo text-[2vh] mx-auto text-primary">Anonimização de respostas</p>
                            </Squircle>
                        </div>
                        
                        <div className="flex gap-[2.5vh]">
                             <Squircle cornerRadius={20} cornerSmoothing={1} className="bg-secondary w-[20vw] h-[20vh] flex flex-col justify-center gap-2">
                                <LegoSmileyIcon size="7vh" weight="thin" className="mx-auto text-primary" />
                                <p className="font-corpo text-[2vh] mx-auto text-primary">Promove melhorias</p>
                            </Squircle>
                             <Squircle cornerRadius={20} cornerSmoothing={1} className="bg-secondary w-[20vw] h-[20vh] flex flex-col justify-center gap-2">
                                <ChartLineIcon size="7vh" weight="thin" className="mx-auto text-primary" />
                                <p className="font-corpo text-[2vh] mx-auto text-primary">Identifica tendências</p>
                            </Squircle>
                        </div>
                    </div>
                    <div className="mt-[10vh]">
                        <BotaoGrande texto="Continuar" link="#"/>
                    </div>
                </div>

    return (
       <BlocoPrincipal codigo={html} idPag={0} imagemFundo={imagem} />
    )
}