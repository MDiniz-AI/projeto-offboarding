import imagemFundo from '../assets/fundo-pg1.jpg';
import estrela from '../assets/Star 1.svg'
import {HouseIcon, AtIcon, TargetIcon, UsersThreeIcon, StrategyIcon, TreeStructureIcon, MegaphoneIcon, ChatCircleIcon, DotsThreeCircleIcon} from '@phosphor-icons/react';

export default (props) => {
    const ativo = "bg-[#DEDB18D9] px-[1.1vh] py-[1.1vh] w-[5.2vh] h-[5.2vh] rounded-4xl";
    const inativo = "bg-[#DEDB1817] px-[1.1vh] py-[1.1vh] w-[5.2vh] h-[5.2vh] rounded-4xl";

    return (
        <div>
            <img src={imagemFundo} alt="Foto de uma equipe trabalhando" className="w-screen h-screen object-cover"/>
            <div className='absolute top-3 left-3 w-[55vw] h-[97vh] bg-[#F8F6EE] flex gap-[2vw] pt-[4vh]'>
                <div className='flex flex-col gap-[27vh]'>
                    <img src={estrela} alt="simbolo estrela" className='ml-[2vw] w-[6vh] h-[6vh]'/>
                    <div className='flex flex-col gap-[1vh] ml-[2vw]'>
                        <div className={props.idPag == 0 ? ativo : inativo}><HouseIcon size="3vh" weight="thin" /></div>
                        <div className={props.idPag == 1 ? ativo : inativo}><AtIcon size="3vh" weight="thin" /></div>
                        <div className={props.idPag == 2 ? ativo : inativo}><TargetIcon size="3vh" weight="thin" /></div>
                        <div className={props.idPag == 3 ? ativo : inativo}><UsersThreeIcon size="3vh" weight="thin" /></div>
                        <div className={props.idPag == 4 ? ativo : inativo}><StrategyIcon size="3vh" weight="thin" /></div>
                        <div className={props.idPag == 5 ? ativo : inativo}><TreeStructureIcon size="3vh" weight="thin" /></div>
                        <div className={props.idPag == 6 ? ativo : inativo}><MegaphoneIcon size="3vh" weight="thin" /></div>
                        <div className={props.idPag == 7 ? ativo : inativo}><ChatCircleIcon size="3vh" weight="thin" /></div>
                        <div className={props.idPag == 8 ? ativo : inativo}><DotsThreeCircleIcon size="3vh" weight="thin" /></div>
                    </div>
                </div>
                <div className='bg-[#1d1d1e] w-1/1000 h-[90vh] '></div>
                {props.codigo}
            </div>
        </div>
    )
}