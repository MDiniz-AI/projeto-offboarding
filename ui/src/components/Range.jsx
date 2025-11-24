import MuitoRuim from '../assets/smiley-sad-thin-1.svg?react'
import Horrivel from '../assets/smiley-sad-thin.svg?react'
import MuitoBom from '../assets/smiley-wink-thin.svg?react'
import Bom from '../assets/smiley-thin2.svg?react'
import Regular from '../assets/smiley-meh-thin.svg?react'
import Ruim from '../assets/smiley-sad-thin2.svg?react'
import Incrivel from '../assets/smiley-thin.svg?react'
import { Contexto } from "../pages/Form.jsx";
import { useContext } from "react";
import {SmileyMehIcon, SmileySadIcon, SmileyIcon} from '@phosphor-icons/react';

export default (props) => {
    const { atualizarResposta } = useContext(Contexto);
    return(
        <div className="flex flex-col gap-[1vh]">
            <label for={props.id} className="font-corpo md:text-[1vw] text-[4vw] text-justify text-primary">{props.label}</label>
            <input type="range" name={props.id} id={props.id} min={1} max="7"  onChange={(e) => atualizarResposta(props.id, null, Number(e.target.value))} defaultValue="4" className="range w-full h-[3vh] range-secondary bg-linear-to-r from-[#FF00004d] via-[#FFEB004d] to-[#15FF004d]" step="1" />  
            <div className='flex flex-col gap-[.5vh]'>
                <div className='flex md:gap-[4vw] gap-[7vw] ml-[1vw]'>
                    <Horrivel className='w-[10vw] h-auto text-primary' />
                    <MuitoRuim className='w-[10vw] h-auto text-primary'/>
                    <Ruim className='w-[10vw] h-auto text-primary'/>
                    <Regular className='w-[10vw] h-auto text-primary'/>
                    <Bom className='w-[10vw] h-auto text-primary'/>
                    <MuitoBom className='w-[10vw] h-auto text-primary' />
                    <Incrivel className='w-[10vw] h-auto text-primary' /> 
                </div>
                <div className='flex md:gap-[3vw] gap-[11vw]'>
                    <p className='text-primary font-corpo md:text-[.9vw] text-[2.7vw] text-center w-[3vw] md:hidden'>Horrí vel</p>
                    <p className='text-primary font-corpo md:text-[.9vw] text-[2.7vw] text-center w-[3vw] md:block hidden'>Horrível</p>
                    <p className='text-primary font-corpo md:text-[.9vw] text-[2.7vw] text-center md:w-[4vw] md:ml-0'>Muito <br/> Ruim</p>
                    <p className='text-primary font-corpo md:text-[.9vw] text-[2.7vw] text-center w-[2vw] md:ml-0 ml-[-3vw]'>Ruim</p>
                    <p className='text-primary font-corpo md:text-[.9vw] text-[2.7vw] text-center w-[3vw]'>Regular</p>
                    <p className='text-primary font-corpo md:text-[.9vw] text-[2.7vw] text-center w-[2vw] md:ml-[1vw] ml-[3vw]'>Bom</p>
                    <p className='text-primary font-corpo md:text-[.9vw] text-[2.7vw] text-center w-[4vw]'>Muito <br /> Bom</p>
                    <p className='text-primary font-corpo md:text-[.9vw] text-[2.7vw] text-center w-[3vw] ml-[-1vw] md:block hidden'>Incrível</p>
                    <p className='text-primary font-corpo md:text-[.9vw] text-[2.7vw] text-center w-[3vw] ml-[-1vw] md:hidden'>Incrí vel</p>
                </div>
            </div>
        </div>
    )
}