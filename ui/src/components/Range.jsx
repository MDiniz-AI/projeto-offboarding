import MuitoRuim from '../assets/smiley-sad-thin-1.svg?react'
import Horrivel from '../assets/smiley-sad-thin.svg?react'
import MuitoBom from '../assets/smiley-wink-thin.svg?react'
import Incrivel from '../assets/smiley-thin.svg?react'
import {SmileyMehIcon, SmileySadIcon, SmileyIcon} from '@phosphor-icons/react';

export default (props) => {
    
    return(
        <div className="flex flex-col gap-[1vh]">
            <label for={props.id} className="font-corpo text-[1vw] text-justify text-primary">{props.label}</label>
            <input type="range" name={props.id} id={props.id} min={1} max="7" defaultValue="4" className="range w-[40vw] h-[3vh] range-secondary bg-linear-to-r from-[#FF00004d] via-[#FFEB004d] to-[#15FF004d]" step="1" />  
            <div className='flex flex-col gap-[.5vh]'>
                <div className='flex gap-[4vw] ml-[1vw]'>
                    <Horrivel className='w-[2vw] h-[2vw] text-primary' />
                    <MuitoRuim className='w-[2vw] h-[2vw] text-primary'/>
                    <SmileySadIcon size="2vw" weight="thin" className='text-primary'/>
                    <SmileyMehIcon size="2vw" weight="thin" className='text-primary'/>
                    <SmileyIcon size="2vw" weight="thin" className='text-primary'/>
                    <MuitoBom className='w-[2vw] h-[2vw] text-primary' />
                    <Incrivel className='w-[2vw] h-[2vw] text-primary' /> 
                </div>
                <div className='flex gap-[3vw]'>
                    <p className='text-primary font-corpo text-[.9vw] text-center w-[3vw]'>Horrível</p>
                    <p className='text-primary font-corpo text-[.9vw] text-center w-[4vw]'>Muito Ruim</p>
                    <p className='text-primary font-corpo text-[.9vw] text-center w-[2vw]'>Ruim</p>
                    <p className='text-primary font-corpo text-[.9vw] text-center w-[3vw]'>Regular</p>
                    <p className='text-primary font-corpo text-[.9vw] text-center w-[2vw] ml-[1vw]'>Bom</p>
                    <p className='text-primary font-corpo text-[.9vw] text-center w-[4vw]'>Muito Bom</p>
                    <p className='text-primary font-corpo text-[.9vw] text-center w-[3vw] ml-[-1vw]'>Incrível</p>
                </div>
            </div>
        </div>
    )
}