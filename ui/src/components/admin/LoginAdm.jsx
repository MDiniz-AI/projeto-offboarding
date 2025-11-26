import FundoLogin from '../../assets/fundo-login.webp'
import Blip from '../../assets/blip.svg?react'
import GoogleLogo from '../../assets/Google__G__logo.svg'
import MicrosoftLogo from '../../assets/Microsoft_logo.svg'
import { CaretRightIcon } from '@phosphor-icons/react'

export default () => {

    return (
        <div className=''>
            <img src={FundoLogin} alt="Foto de uma equipe trabalhando" className="hidden md:block w-screen h-screen object-cover"/>
            <div className='md:top-3 md:left-3 md:w-[42vw] md:h-[97vh] absolute top-0 left-0 w-screen h-screen bg-base-100 flex md:flex-row flex-col gap-[2vw] md:gap-[1vw] md:pt-[4vh] justify-end'>
                <div className='md:w-full ml-[1vw] md:pr-0 pr-4 pl-4 md:pl-0'>
                    <div className='flex'>
                        <Blip className="w-10 h-auto" />
                        <h1 className="font-title md:text-[3.5vw] text-4xl text-center text-primary mx-auto">Painel offboarding</h1>
                    </div>
                    <p className="font-corpo md:w-[40vw] w-[95vw] md:text-[1vw] text-md md:mt-0 mt-2 text-center text-primary mx-auto">Digite o seu email para realizar log-in</p>
                    <div className='bg-primary h-[.01vh] min-h-[.5px] md:w-[40vw] mt-[3vh] '/>
                        <form action="" className="mt-[3vh] flex flex-col md:gap-[32vh] gap-[29vh]">
                            <div className=''> 
                                <div className="flex flex-col gap-[1vh]">
                                    <label for="email" className="font-corpo md:text-[1vw] md:ml-0 ml-[2vw] text-[4vw] text-primary">Email</label>
                                    <input name="email" type="email" id="email" placeholder="Digite o seu email aqui" className="bg-secondary/30 p-[2vh] md:w-[40vw] md:mx-0 w-full mx-auto font-corpo rounded-xl md:text-[1vw] text-[4vw] text-primary"/>
                                </div>
                                <div className='flex gap-[1.5vw] mt-[2vh] justify-center'>
                                    <button><img src={GoogleLogo} alt="Logo do google" className='md:w-[3.2vw] w-[13vw] bg-secondary/30 p-[1.8vh] rounded-xl'/></button>
                                    <button><img src={MicrosoftLogo} alt="Logo da Microsoft" className='md:w-[3.2vw] w-[13vw] bg-secondary/30 p-[1.8vh] rounded-xl'/></button>
                                </div>
                            </div>
                            <button onClick={{}} className='flex md:gap-[31vw] gap-[60vw] bg-accent md:p-[1vw] p-[3vw] rounded-xl w-[97vw] md:w-[40vw] mx-auto md:mx-0 mb-[1vh] md:mb-0 '>
                                <p className='font-corpo md:text-[1vw] text-[2vh] my-auto text-primary'>Continuar</p>
                                <CaretRightIcon size="4vh" weight="thin" className='my-auto text-primary'/>
                            </button>
                        </form> 
                </div>
            </div>
        </div>
    )
}