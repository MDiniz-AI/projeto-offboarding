import imgFundo from '../assets/fundo-pg3.webp'
import BlocoPrincipal from '../components/BlocoPrincipal'
import FormRenderer from '../components/FormRenderer'
import BotaoGrande from '../components/BotaoGrande'

export default (props) => {
    const perguntas = [{question: "Qual é a sua opinião sobre o clima organizacional de sua equipe/time?", type:3, option:null}, 
        {question: "Você se sentia valorizado pelas suas contribuições e entregas?", type:2, option:["opc1","opc2"]},
        {question: "Você se sentia ouvido e reconhecido?", type:2, option:["opc1","opc2"]}, 
        {question: "O que mais te motivou a aceitar a proposta inicial para trabalhar aqui?", type:2, option:["opc1","opc2"]},
        {question: "Qual é a sua opinião sobre o pacote de salário e benefícios oferecido pela empresa (em comparação com o mercado)?", type:3, option:null},
        {question: "Ainda sobre pacote de salário e benefícios, o que poderia melhorar?", type:0, option:null},
        {question: "Como descreveria sua experiência geral na empresa?", type:3, option:null},
        {question: "Se tivesse que resumir em uma palavra o que é trabalhar aqui, qual seria?", type:0, option:null},
        {question: "Há alguma justificativa para a escolha dessa palavra?", type:1, option:null}]

    const html = <div>
        <h1 className="font-title text-[3.5vw] text-primary">Pesquisa de offboarding</h1>
        <p className="font-corpo w-[40vw] text-[1vw] text-justify text-primary">Perguntas gerais</p>
        <div className='bg-primary h-[.01vh] min-h-[.5px] w-[40vw] mt-[3vh] '/>
        <form action="">
            <div className='mt-[5vh] h-[52vh] overflow-scroll w-[90vh] '>
                <FormRenderer perguntas={perguntas} />
            </div>
            <div className='mt-[3vh]'>
                <BotaoGrande texto="Continuar" />
            </div>
        </form>
    </div>
    
    return (
        <BlocoPrincipal codigo={html} idPag={props.idForm} imagemFundo={imgFundo} />
    )
}