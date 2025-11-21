import { Squircle } from "corner-smoothing";
import Logo from '../../assets/blip.svg?react'
import { SignOutIcon, HouseIcon, UsersThreeIcon, UserListIcon, ChartLineIcon, FileTextIcon, GearIcon, UserCircleIcon } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";

export default(props) => {

    const inativo = "w-[3vw] h-[6vh] mx-auto flex flex-col bg-secondary/30"
    const ativo = "w-[3vw] h-[6vh] mx-auto flex flex-col bg-secondary"
    const navigate = useNavigate();
    
    function redirectPagina(numPag){
        navigate(`/admin?pag=${numPag}`)
    }

    const htmlPrincipal = <>
        <Squircle cornerRadius={20} cornerSmoothing={1} className="bg-secondary/30 w-[5vw] h-[98vh] fixed inset-y-[1vh] my-auto mx-[2vh] flex flex-col py-[2vh]">
                <Logo className="w-[3vw] h-auto mx-auto"/>

                <div className="flex flex-col gap-[1.5vh] mt-auto">
                    <Squircle onClick={() => {redirectPagina(0)}}className={props.pagina == 0 ? ativo : inativo} cornerRadius={15} cornerSmoothing={1}>
                        <HouseIcon size="4vh" weight="thin" className='text-primary w-[2vw] h-[3vh] my-auto mx-[.5vw]' />
                    </Squircle>
                    <Squircle onClick={() => {redirectPagina(1)}}className={props.pagina == 1 ? ativo : inativo} cornerRadius={15} cornerSmoothing={1}>
                        <UsersThreeIcon size="4vh" weight="thin" className='text-primary w-[2vw] h-[3vh] my-auto mx-[.5vw]' />
                    </Squircle>
                    <Squircle onClick={() => {redirectPagina(2)}}className={props.pagina == 2 ? ativo : inativo} cornerRadius={15} cornerSmoothing={1}>
                        <UserListIcon size="4vh" weight="thin" className='text-primary w-[2vw] h-[3vh] my-auto mx-[.5vw]' />
                    </Squircle>
                    <Squircle onClick={() => {redirectPagina(3)}}className={props.pagina == 3 ? ativo : inativo} cornerRadius={15} cornerSmoothing={1}>
                        <ChartLineIcon size="4vh" weight="thin" className='text-primary w-[2vw] h-[3vh] my-auto mx-[.5vw]' />
                    </Squircle>
                    <Squircle onClick={() => {redirectPagina(4)}}className={props.pagina == 4 ? ativo : inativo} cornerRadius={15} cornerSmoothing={1}>
                        <FileTextIcon size="4vh" weight="thin" className='text-primary w-[2vw] h-[3vh] my-auto mx-[.5vw]' />
                    </Squircle>
                    <Squircle onClick={() => {redirectPagina(5)}}className={props.pagina == 5 ? ativo : inativo} cornerRadius={15} cornerSmoothing={1}>
                        <GearIcon size="4vh" weight="thin" className='text-primary w-[2vw] h-[3vh] my-auto mx-[.5vw]' />
                    </Squircle>
                </div>
                <div className="flex flex-col gap-[1.5vh] mt-auto">
                    <Squircle onClick={() => {redirectPagina(6)}}className={props.pagina == 6 ? ativo : inativo} cornerRadius={15} cornerSmoothing={1}>
                        <UserCircleIcon size="4vh" weight="thin" className='text-primary w-[2vw] h-[3vh] my-auto mx-[.5vw]' />
                    </Squircle>
                    <Squircle onClick={() => {redirectPagina(7)}}className={props.pagina == 7 ? ativo : inativo} cornerRadius={15} cornerSmoothing={1}>
                        <SignOutIcon size="4vh" weight="thin" className='text-primary w-[2vw] h-[3vh] my-auto mx-[.5vw]' />
                    </Squircle>
                </div>
        </Squircle>
    </>

    return htmlPrincipal;
}