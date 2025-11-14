import muitoRuim from '../assets/smiley-sad-thin-1.svg'
import horrivel from '../assets/smiley-sad-thin.svg'
import muitoBom from '../assets/smiley-wink-thin.svg'
import incrivel from '../assets/smiley-thin.svg'
import {SmileyMehIcon, SmileySadIcon, SmileyIcon} from '@phosphor-icons/react';

export default (props) => {
    
    return(
        <div className="flex flex-col gap-[1vh]">
            <label for={props.id} className="font-corpo text-[1vw] text-justify text-primary">{props.label}</label>
            <input type="range" name={props.id} id={props.id} min={1} max="7" defaultValue="4" className="range w-[40vw] h-[3vh] range-secondary bg-linear-to-r from-[#FF00004d] via-[#FFEB004d] to-[#15FF004d]" step="1" />  
            <div className='flex flex-col gap-[.5vh]'>
                <div className='flex gap-[4vw] ml-[1vw]'>
                    <img src={horrivel} alt="Carinha muito muito triste" className='w-[2vw]' />
                    <img src={muitoRuim} alt="Carinha muito triste" className='w-[2vw]' />
                    <SmileySadIcon size="2vw" weight="thin" className='text-primary'/>
                    <SmileyMehIcon size="2vw" weight="thin" className='text-primary'/>
                    <SmileyIcon size="2vw" weight="thin" className='text-primary'/>
                    <img src={muitoBom} alt="Carinha muito feliz" className='w-[2vw]' />
                    <img src={incrivel} alt="Carinha muito muito feliz" className='w-[2vw]' /> 
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