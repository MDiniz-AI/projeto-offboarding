import { EyeglassesIcon, PlusIcon, UserIcon, UserListIcon, UsersThreeIcon, XIcon } from "@phosphor-icons/react"
import { Squircle } from "corner-smoothing"
import { useState } from "react"

export default () => {

    const [users, setUsers] = useState(["email@email.com"]);
    const [email, setEmail] = useState("");

    function adicionarUsuario() {
        setUsers((prev) => [...prev, email])
    }

    function removerUsuario(emailRem){
        setUsers((prev => prev.filter(u => u !== emailRem)))
    }

    return(
        <div className="mt:pr-[1vw] pr-6">
            <h1 className="text-primary font-title text-4xl text-center my-[2vh]">Configurações</h1>
            <div class="tabs tabs-lift">
                <label className="tab flex gap-[.5vw] border-secondary/50 border-b-0">
                    <input type="radio" name="my_tabs_3" class="tab" aria-label="Usuários do Sistema" />
                    <UserIcon size="4vh" weight="thin" className="my-auto" />
                    Usuários do Sistema
                </label>
                <div class="tab-content bg-secondary/10 border-secondary/50 p-6">
                    <div className="flex md:flex-row flex-col gap-[1vw]">
                        <div className="flex md:flex-row flex-col gap-[1vh] w-full">
                            <label for="pesquisar" className="font-corpo md:text-[1vw] md:ml-0 ml-[2vw] text-[4vw] text-primary my-auto">Adicionar</label>
                            <input name="pesquisar" type="text" id="pesquisar" onChange={(e) => setEmail(e.target.value)} placeholder="Digite o email que deseja adicionar ao sistema" className="bg-secondary/30 p-[2vh] md:mx-0 w-full h-[7vh] md:w-full mx-auto font-corpo rounded-xl md:text-[1vw] text-[4vw] text-primary"/>
                        </div>
                        <Squircle cornerRadius={10} cornerSmoothing={1} className="flex bg-secondary/50 w-50 h-[7vh] justify-center md:mx-0 mx-auto" onClick={() => {adicionarUsuario()}}>
                            <PlusIcon size="4vh" weight="thin" className="my-auto" />
                            <p className="text-primary font-corpo my-auto font-light">Adicionar</p>
                        </Squircle>
                    </div>
                    <h2 className="text-primary font-title text-xl mt-[3vh]">Usuários com acesso</h2>
                    <div className="flex flex-row flex-wrap gap-[1vw] mt-[2vh]">
                        {users.map ((email, index) =>
                        <div key={index} className="relative group inline-block">
                            <span key={index} className="badge badge-ghost badge-lg pr-6" onClick={() => {removerUsuario(email)}}> {email} </span>
                            <button key={index} className="absolute right-1 top-1 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => {removerUsuario(email)}}><XIcon size="1vw" weight="thin" className="my-[.5vh]"/></button>
                        </div> )}
                    </div>
                </div>
            </div>
        </div>
    )
}
