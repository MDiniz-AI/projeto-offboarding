import imgFundo from '../assets/fundo-pg3.webp'
import BlocoPrincipal from '../components/BlocoPrincipal'
import Range from '../components/Range'

export default () => {
    const html = <div>
        <h1 className="font-title text-[3.5vw] text-primary">Pesquisa de offboarding</h1>
        <p className="font-corpo w-[40vw] text-[1vw] text-justify text-primary">Perguntas gerais</p>
        <div className='bg-primary h-[.01vh] min-h-[.5px] w-[40vw] mt-[3vh] '/>
        <form action="">
           
        </form>
    </div>
    
    return (
        <BlocoPrincipal codigo={html} idPag={2} imagemFundo={imgFundo} />
    )
}