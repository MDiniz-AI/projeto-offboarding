import estrela from '../assets/blip.svg'
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  HouseIcon, 
  AtIcon, 
  TargetIcon, 
  UsersThreeIcon,
  StrategyIcon, 
  TreeStructureIcon, 
  MegaphoneIcon,
  DotsThreeCircleIcon
} from '@phosphor-icons/react';

export default function BlocoPrincipal(props) {
    const ativo = "bg-accent px-[1.1vh] py-[1.1vh] w-[6vh] h-[6vh] rounded-4xl flex items-center justify-center cursor-pointer transition-all";
    const inativo = "bg-secondary/30 px-[1.1vh] py-[1.1vh] w-[6vh] h-[6vh] rounded-4xl flex items-center justify-center cursor-pointer hover:bg-secondary/50 transition-all";
    
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    function redirectPagina(numPag){
        const token = searchParams.get("t");
        if (token) {
            navigate(`/?secao=${numPag}&t=${token}`);
        } else {
            navigate(`/?secao=${numPag}`);
        }
    }

    // --- LÓGICA DE ÍCONES DINÂMICOS ---
    // Escolhe o ícone visual baseado no texto da categoria que veio do banco
    function getIconePorCategoria(categoria) {
        if (!categoria) return DotsThreeCircleIcon;
        const texto = categoria.toLowerCase();

        if (texto.includes('identifica') || texto.includes('pessoal')) return AtIcon;
        if (texto.includes('motivo') || texto.includes('alvo')) return TargetIcon;
        if (texto.includes('equipe') || texto.includes('time')) return UsersThreeIcon;
        if (texto.includes('lider') || texto.includes('gest')) return StrategyIcon;
        if (texto.includes('cultura') || texto.includes('clima')) return TreeStructureIcon;
        if (texto.includes('feedback') || texto.includes('sugest')) return MegaphoneIcon;
        
        return DotsThreeCircleIcon; // Ícone padrão se não achar
    }

    return (
        <div>
            {/* Imagem de Fundo (Desktop) */}
            <img
                src={props.imagemFundo}
                alt="Fundo"
                className="hidden md:block w-screen h-screen object-cover"
            />

            {/* Container Principal */}
            <div className='md:top-3 md:left-3 md:w-[53vw] md:h-[97vh] absolute top-0 left-0 w-screen h-screen bg-base-100 flex md:flex-row flex-col gap-[2vw] md:gap-[1vw] pt-[4vh] justify-end'>
                
                {/* Conteúdo Mobile (Sobreposto) */}
                <div className='md:hidden w-screen h-screen absolute top-0 left-0 z-0'>
                    {props.children}
                </div>

                {/* Divisória Vertical (Mobile) */}
                <div className='md:w-[.01vw] md:h-[90vh] h-[.1vh] w-screen bg-primary min-w-[.5px] md:hidden'></div>

                {/* --- MENU LATERAL (Sidebar) --- */}
                <div className='flex md:flex-col md:w-[7vw] overflow-x-auto md:overflow-visible mb-[2vh] md:mb-0 h-[15vh] md:h-full z-10'>
                    
                    {/* Logo (Topo) */}
                    <img onClick={() => redirectPagina(1)} src={estrela} alt="logo" className='ml-[2vw] w-[6vh] h-[6vh] cursor-pointer'/>
                    
                    {/* Lista de Botões */}
                    <div className='flex md:flex-col gap-[1vh] ml-[2vw] fixed bottom-[7vh] md:static md:mt-auto md:mb-[7vh] pr-4 md:pr-0'>
                        
                        {/* 1. Botão HOME (Fixo - Sempre é a seção 1) */}
                        <div 
                            onClick={() => redirectPagina(1)} 
                            className={props.idPag == 1 ? ativo : inativo}
                            title="Início"
                        >
                            <HouseIcon size="3.5vh" weight={props.idPag == 1 ? "fill" : "thin"} className='text-primary' />
                        </div>

                        {/* 2. Botões DINÂMICOS (Categorias vindas do Banco) */}
                        {props.categorias && props.categorias.map((cat, index) => {
                            // A seção das categorias começa em 2 (pois 1 é Home)
                            const numPag = index + 2;
                            const Icone = getIconePorCategoria(cat);
                            const isAtivo = props.idPag == numPag;

                            return (
                                <div 
                                    key={index}
                                    onClick={() => redirectPagina(numPag)}
                                    className={isAtivo ? ativo : inativo}
                                    title={cat}
                                >
                                    <Icone 
                                        size="3.5vh" 
                                        weight={isAtivo ? "fill" : "thin"} 
                                        className='text-primary' 
                                    />
                                </div>
                            );
                        })}

                    </div>
                </div>

                {/* Divisória Vertical (Desktop) */}
                <div className='md:w-[.01vw] md:h-[90vh] h-[.1vh] w-screen bg-primary min-w-[.5px] hidden md:block'></div>

                {/* Área de Conteúdo (Desktop) */}
                <div className='hidden md:block md:w-full ml-[1vw] overflow-y-auto'>
                    {props.children}
                </div>
            </div>
        </div>
    );
}