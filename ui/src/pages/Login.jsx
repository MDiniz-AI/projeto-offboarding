import imagem from '../assets/fundo-pg2.webp'
import BlocoPrincipal from '../components/BlocoPrincipal'
import InputCurto from '../components/InputCurto'
import GoogleLogo from '../assets/Google__G__logo.svg'
import MicrosoftLogo from '../assets/Microsoft_logo.svg'
import BotaoGrande from '../components/BotaoGrande'

export default () => {
    const html = <div>
        <h1 className="font-title text-[3.5vw]">Pesquisa de offboarding</h1>
        <p className="font-corpo w-[40vw] text-[1vw] text-justify">Perfeito! Vamos começar digitando o seu endereço de email preferido ✉️. <br/> Se preferir, você pode logar com contas da Microsoft e Google.</p>
        <div className='bg-[#1d1d1e] h-[.01vh] min-h-[.5px] w-[40vw] mt-[3vh] '/>
        <form action="" className="mt-[3vh]">
            <InputCurto label="Email" placeholder="Digite o seu email aqui" id="input1"/>
            <div className='flex gap-[1.5vw] mt-[2vh] justify-center'>
                <button><img src={GoogleLogo} alt="Logo do google" className='w-[3.2vw] bg-[#DEDB1826] p-[1.8vh] rounded-xl'/></button>
                <button><img src={MicrosoftLogo} alt="Logo da Microsoft" className='w-[3.2vw] bg-[#DEDB1826] p-[1.8vh] rounded-xl'/></button>
            </div>
            <div className='mt-[32vh]'>
                <BotaoGrande texto='Continuar'/>
            </div>
        </form>
    </div>

    return(
        <BlocoPrincipal codigo={html} idPag={1} imagemFundo={imagem} />
    )
}