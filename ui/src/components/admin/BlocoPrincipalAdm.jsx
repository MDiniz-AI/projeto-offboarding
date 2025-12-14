import { Squircle } from "corner-smoothing";
import Logo from '../../assets/blip.svg?react'
import { SignOutIcon, HouseIcon, UsersThreeIcon, UserListIcon, FileTextIcon, GearIcon } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";

export default function BlocoPrincipalAdm(props) {

    // Estilos com Flexbox para centralização (garante que os ícones fiquem no meio)
    const baseStyle = "md:w-[3vw] h-[6vh] w-[12.5vw] mx-auto flex flex-col justify-center items-center cursor-pointer transition-all";
    const inativo = `${baseStyle} bg-secondary/30 hover:bg-secondary/50`;
    const ativo = `${baseStyle} bg-accent`;
    
    const navigate = useNavigate();
    
    function redirectPagina(numPag){
        // Navega para a página administrativa com o parâmetro 'pag'
        navigate(`/admin?pag=${numPag}`)
    }

    // Função de renderização para simplificar o JSX (útil se o menu fosse maior)
    const MenuItem = ({ pagina, Icon, num, title, isError = false }) => {
        const isActive = props.pagina === num;
        const style = isActive ? ativo : inativo;
        const iconWeight = isError ? "thin" : (isActive ? "fill" : "thin");
        const iconColor = isError ? 'text-error' : 'text-primary';

        return (
            <Squircle 
                onClick={() => {
                    // Se for o botão de Logout, chama a função do pai (props.onLogout)
                    if (isError) {
                        props.onLogout && props.onLogout();
                    } else {
                        redirectPagina(num);
                    }
                }} 
                className={style} 
                cornerRadius={15} 
                cornerSmoothing={1}
                title={title}
            >
                <Icon size="4vh" weight={iconWeight} className={`${iconColor} md:w-[2vw] w-[10vw] md:h-[3vh] h-5 my-auto`} />
            </Squircle>
        );
    };

    return (
        <Squircle 
            cornerRadius={20} 
            cornerSmoothing={1} 
            // Oculta o menu vertical no mobile e exibe apenas horizontalmente
            className="bg-secondary/30 md:w-[5vw] md:h-[98vh] w-screen h-[10vh] fixed md:bottom-0 bottom-10  md:inset-y-[1vh] my-auto md:mx-[2vh] mx-auto flex md:gap-0 md:flex-col py-[2vh] gap-2 md:px-0 px-[2vw]"
        >
            <Logo className="md:w-[3vw] w-[10vw] h-auto md:mx-auto"/>

            <div className="flex md:flex-col gap-[1vw] mt-auto">
                {/* Home (0 - Dashboard) */}
                <MenuItem Icon={HouseIcon} num={0} pagina={props.pagina} title="Dashboard" />
                
                {/* Times (1 - Entrevistas) */}
                <MenuItem Icon={UsersThreeIcon} num={1} pagina={props.pagina} title="Entrevistas" />
                
                {/* Colaboradores (2 - Usuários) */}
                <MenuItem Icon={UserListIcon} num={2} pagina={props.pagina} title="Usuários" />
                
                {/* Formulário Preview (3 - Configurar Perguntas) */}
                <MenuItem Icon={FileTextIcon} num={3} pagina={props.pagina} title="Perguntas" />
                
                {/* Configurações (4 - Geral) */}
                <MenuItem Icon={GearIcon} num={4} pagina={props.pagina} title="Configurações" />
            </div>
            
            <div className="flex md:flex-col gap-[1.5vw] mt-auto">
                {/* Logout */}
                <MenuItem Icon={SignOutIcon} isError={true} pagina={props.pagina} title="Sair" />
            </div>
        </Squircle>
    );
}