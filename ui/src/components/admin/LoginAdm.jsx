import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import FundoLogin from '../../assets/fundo-login.webp';
import Blip from '../../assets/blip.svg?react';
import GoogleLogo from '../../assets/Google__G__logo.svg';
import MicrosoftLogo from '../../assets/Microsoft_logo.svg';
import { CaretRightIcon } from '@phosphor-icons/react';
import { SignInButton } from '@clerk/clerk-react';

import api from '../../lib/api';
// Importa o contexto para usar a função de login
import { AdminContext } from '../../pages/Admin'; 

export default function LoginAdm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); // Adicionado estado para senha
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // Acessa a função de login do contexto Admin
    const { login } = useContext(AdminContext);
    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Chamada ao endpoint de login do seu backend
            const response = await api.post('/auth/login', { email, password });
            
            // Se sucesso, pega o token e chama a função de login do contexto
            const { token } = response.data;
            login(token);

        } catch (err) {
            console.error("Erro no login:", err);
            setError(err.response?.data?.error || "Falha ao realizar login. Verifique suas credenciais.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className=''>
            <img src={FundoLogin} alt="Foto de uma equipe trabalhando" className="hidden md:block w-screen h-screen object-cover"/>
            <div className='md:top-3 md:left-3 md:w-[42vw] md:h-[97vh] absolute top-0 left-0 w-screen h-screen bg-base-100 flex md:flex-row flex-col gap-[2vw] md:gap-[1vw] md:pt-[4vh] justify-end'>
                <div className='md:w-full ml-[1vw] md:pr-0 pr-4 pl-4 md:pl-0'>
                    <div className='flex items-center gap-2 mb-4'>
                        <Blip className="w-10 h-auto" />
                        <h1 className="font-title md:text-[2.5vw] text-3xl text-primary">Painel offboarding</h1>
                    </div>
                    
                    <p className="font-corpo md:w-[40vw] w-[95vw] md:text-[1vw] text-md md:mt-0 mt-2 text-center text-primary mx-auto">
                        Digite suas credenciais para acessar o painel administrativo.
                    </p>
                    
                    <div className='bg-primary h-[.01vh] min-h-[.5px] md:w-[40vw] mt-[3vh] '/>
                        
                        <form onSubmit={handleLogin} className="mt-[3vh] flex flex-col gap-6">
                            
                            {/* Campo de Email */}
                            <div className="flex flex-col gap-[1vh]">
                                <label htmlFor="email" className="font-corpo md:text-[1vw] md:ml-0 ml-[2vw] text-[4vw] text-primary">Email</label>
                                <input 
                                    name="email" 
                                    type="email" 
                                    id="email" 
                                    placeholder="Digite o seu email aqui" 
                                    className="bg-secondary/30 p-[2vh] md:w-[40vw] md:mx-0 w-full mx-auto font-corpo rounded-xl md:text-[1vw] text-[4vw] text-primary"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Campo de Senha (ADICIONADO para fluxo padrão) */}
                            <div className="flex flex-col gap-[1vh]">
                                <label htmlFor="password" className="font-corpo md:text-[1vw] md:ml-0 ml-[2vw] text-[4vw] text-primary">Senha</label>
                                <input 
                                    name="password" 
                                    type="password" 
                                    id="password" 
                                    placeholder="Digite sua senha" 
                                    className="bg-secondary/30 p-[2vh] md:w-[40vw] md:mx-0 w-full mx-auto font-corpo rounded-xl md:text-[1vw] text-[4vw] text-primary"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                            {/* Botões de Social Login (Mantidos) */}
                            <div className='flex gap-4 justify-center'> 
                                <SignInButton mode="redirect" redirectUrl="/admin" signInOptions={{ strategy: "oauth_google" }}>        
                                    <button type='button'><img src={GoogleLogo} alt="Logo do google" className='md:w-[3.2vw] w-[13vw] bg-secondary/30 p-[1.8vh] rounded-xl'/></button>
                                </SignInButton>

                                <SignInButton mode="redirect" redirectUrl="/admin" signInOptions={{ strategy: "oauth_microsoft" }}>
                                   <button type='button'><img src={MicrosoftLogo} alt="Logo da Microsoft" className='md:w-[3.2vw] w-[13vw] bg-secondary/30 p-[1.8vh] rounded-xl'/></button>
                                </SignInButton>
                            </div>
                            
                            {/* Botão de Entrar */}
                            <button type="submit" disabled={isLoading} className='flex items-center justify-between md:gap-[31vw] gap-[60vw] bg-accent md:p-[1vw] p-[3vw] rounded-xl w-[97vw] md:w-[40vw] mx-auto md:mx-0 mb-[1vh] md:mb-0 transition-opacity hover:opacity-90 disabled:opacity-50'>
                                <p className='font-corpo md:text-[1vw] text-[2vh] my-auto text-primary'>
                                    {isLoading ? 'Entrando...' : 'Continuar'}
                                </p>
                                <CaretRightIcon size="4vh" weight="thin" className='my-auto text-primary'/>
                            </button>

                        </form> 
                </div>
            </div>
        </div>
    )
}