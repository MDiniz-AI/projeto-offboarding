import { Squircle } from "corner-smoothing";
import Logo from '../../assets/blip.svg?react'
import { SignOutIcon, HouseIcon, UsersThreeIcon, UserListIcon, FileTextIcon, GearIcon } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";

export default function BlocoPrincipalAdm(props) {

    const inativo = "md:w-[3vw] h-[6vh] w-[12.5vw] mx-auto flex flex-col bg-secondary/30 cursor-pointer transition-all hover:bg-secondary/50"
    const ativo = "md:w-[3vw] h-[6vh] w-[12.5vw] mx-auto flex flex-col bg-accent cursor-pointer transition-all"
    const navigate = useNavigate();
    
    function redirectPagina(numPag){
        navigate(`/admin?pag=${numPag}`)
    }

    const htmlPrincipal = (
        <>
            <Squircle cornerRadius={20} cornerSmoothing={1} className="bg-secondary/30 md:w-[5vw] md:h-[98vh] w-screen h-[10vh] fixed md:bottom-0 bottom-10  md:inset-y-[1vh] my-auto md:mx-[2vh] mx-auto flex md:gap-0 md:flex-col py-[2vh] gap-2 md:px-0 px-[2vw]">
                    <Logo className="md:w-[3vw] w-[10vw] h-auto md:mx-auto"/>

                    <div className="flex md:flex-col gap-[1vw] mt-auto">
                        {/* Home (0) */}
                        <Squircle onClick={() => {redirectPagina(0)}} className={props.pagina == 0 ? ativo : inativo} cornerRadius={15} cornerSmoothing={1}>
                            <HouseIcon size="4vh" weight={props.pagina == 0 ? "fill" : "thin"} className='text-primary md:w-[2vw] w-[10vw] md:h-[3vh] h-5 my-auto mx-[.5vw]' />
                        </Squircle>
                        
                        {/* Times (1) */}
                        <Squircle onClick={() => {redirectPagina(1)}} className={props.pagina == 1 ? ativo : inativo} cornerRadius={15} cornerSmoothing={1}>
                            <UsersThreeIcon size="4vh" weight={props.pagina == 1 ? "fill" : "thin"} className='text-primary md:w-[2vw] w-[10vw] md:h-[3vh] h-5 my-auto mx-[.5vw]' />
                        </Squircle>
                        
                        {/* Colaboradores (2) */}
                        <Squircle onClick={() => {redirectPagina(2)}} className={props.pagina == 2 ? ativo : inativo} cornerRadius={15} cornerSmoothing={1}>
                            <UserListIcon size="4vh" weight={props.pagina == 2 ? "fill" : "thin"} className='text-primary md:w-[2vw] w-[10vw] md:h-[3vh] h-5 my-auto mx-[.5vw]' />
                        </Squircle>
                        
                        {/* Formulário Preview (3) */}
                        <Squircle onClick={() => {redirectPagina(3)}} className={props.pagina == 3 ? ativo : inativo} cornerRadius={15} cornerSmoothing={1}>
                            <FileTextIcon size="4vh" weight={props.pagina == 3 ? "fill" : "thin"} className='text-primary md:w-[2vw] w-[10vw] h-[3vh] my-auto mx-[.5vw]' />
                        </Squircle>
                        
                        {/* Configurações (4) */}
                        <Squircle onClick={() => {redirectPagina(4)}} className={props.pagina == 4 ? ativo : inativo} cornerRadius={15} cornerSmoothing={1}>
                            <GearIcon size="4vh" weight={props.pagina == 4 ? "fill" : "thin"} className='text-primary md:w-[2vw] w-[10vw] md:h-[3vh] h-5 my-auto mx-[.5vw]' />
                        </Squircle>
                    </div>
                    
                    <div className="flex md:flex-col gap-[1.5vw] mt-auto">
                        {/* MUDANÇA: Botão de Sair chama a função de Logout do Contexto */}
                        <Squircle onClick={props.onLogout} className={inativo} cornerRadius={15} cornerSmoothing={1}>
                            <SignOutIcon size="4vh" weight="thin" className='text-error md:w-[2vw] w-[10vw] md:h-[3vh] h-5 my-auto mx-[.5vw]' />
                        </Squircle>
                    </div>
            </Squircle>
        </>
    );

    return htmlPrincipal;
}