import estrela from '../assets/Star 1.svg'
import { useNavigate } from "react-router-dom";
import {HouseIcon, AtIcon, TargetIcon, UsersThreeIcon, StrategyIcon, TreeStructureIcon, MegaphoneIcon, CrownSimpleIcon, PowerIcon, DotsThreeCircleIcon} from '@phosphor-icons/react';


export default (props) => {
    const ativo = "bg-accent px-[1.1vh] py-[1.1vh] w-[6vh] h-[6vh] rounded-4xl";
    const inativo = "bg-secondary px-[1.1vh] py-[1.1vh] w-[6vh] h-[6vh] rounded-4xl";
    const navigate = useNavigate();

    function redirectPagina(numPag){
        numPag < 2 ? navigate(`/?secao=${numPag}`) : navigate(`/form?secao=${numPag}`) 
    }
    
    return (
        <div>
            <img src={props.imagemFundo} alt="Foto de uma equipe trabalhando" className="hidden md:block w-screen h-screen object-cover"/>
            <div className='md:top-3 md:left-3 md:w-[53vw] md:h-[97vh] absolute top-0 left-0 w-screen h-screen bg-base-100 flex md:flex-row flex-col gap-[2vw] md:gap-[1vw] pt-[4vh] justify-end'>
                <div className='md:hidden w-screen h-screen'>
                    {props.codigo}
                </div>
                <div className='md:w-[.01vw] md:h-[90vh] h-[.1vh] w-screen bg-primary min-w-[.5px] md:hidden'></div>
                <div className='flex md:flex-col md:w-[7vw] md:gap-[12vh] gap-[5vw] overflow-x-scroll overflow-y-hidden md:overflow-hidden mb-[2vh] md:mb-0 h-[15vh] md:h-full'>
                    <img src={estrela} alt="simbolo estrela" className='ml-[2vw] w-[6vh] h-[6vh]'/>
                    <div className='flex md:flex-col gap-[1vh] ml-[2vw]'>
                        <div onClick={() => redirectPagina(0)}className={props.idPag == 0 ? ativo : inativo}><HouseIcon size="4vh" weight="thin" className='text-primary' /></div>
                        <div onClick={() => redirectPagina(1)}className={props.idPag == 1 ? ativo : inativo}><AtIcon size="4vh" weight="thin" className='text-primary' /></div>
                        <div onClick={() => redirectPagina(2)}className={props.idPag == 2 ? ativo : inativo}><TargetIcon size="4vh" weight="thin" className='text-primary' /></div>
                        <div onClick={() => redirectPagina(3)}className={props.idPag == 3 ? ativo : inativo}><UsersThreeIcon size="4vh" weight="thin" className='text-primary' /></div>
                        <div onClick={() => redirectPagina(4)}className={props.idPag == 4 ? ativo : inativo}><StrategyIcon size="4vh" weight="thin" className='text-primary' /></div>
                        <div onClick={() => redirectPagina(5)}className={props.idPag == 5 ? ativo : inativo}><TreeStructureIcon size="4vh" weight="thin" className='text-primary' /></div>
                        <div onClick={() => redirectPagina(6)}className={props.idPag == 6 ? ativo : inativo}><MegaphoneIcon size="4vh" weight="thin" className='text-primary' /></div>
                        <div onClick={() => redirectPagina(7)}className={props.idPag == 7 ? ativo : inativo}><PowerIcon size="4vh" weight="thin" className='text-primary' /></div>
                        <div onClick={() => redirectPagina(8)}className={props.idPag == 8 ? ativo : inativo}><CrownSimpleIcon size="4vh" weight="thin" className='text-primary' /></div>
                        <div onClick={() => redirectPagina(9)}className={props.idPag == 9 ? ativo : inativo}><DotsThreeCircleIcon size="4vh" weight="thin" className='text-primary' /></div>
                    </div>
                </div>
                <div className='md:w-[.01vw] md:h-[90vh] h-[.1vh] w-screen bg-primary min-w-[.5px] hidden md:block'></div>
                <div className='hidden md:block md:w-full ml-[1vw]'>
                    {props.codigo}
                </div>
            </div>
        </div>
    )
}