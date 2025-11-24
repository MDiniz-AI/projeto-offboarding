import { EyeglassesIcon, PlusIcon, UserIcon, UserListIcon, UsersThreeIcon, XIcon } from "@phosphor-icons/react"
import { Squircle } from "corner-smoothing"
import { useState } from "react"

export default () => {

    const [usrs, setUsrs] = useState(["email@email.com"]);
    const [email, setEmail] = useState("");

    function adicionarUsuario() {
        setUsrs((prev) => [...prev, email])
    }

    return(
        <div className="pr-[1vw]">
            <h1 className="text-primary font-title text-[2.5vw] text-center my-[2vh]">Configurações</h1>
            <div class="tabs tabs-lift">
                <label className="tab flex gap-[.5vw] border-secondary/50 border-b-0">
                    <input type="radio" name="my_tabs_3" class="tab" aria-label="Usuários do Sistema" />
                    <UserIcon size="4vh" weight="thin" className="my-auto" />
                    Usuários do Sistema
                </label>
                <div class="tab-content bg-secondary/10 border-secondary/50 p-6">
                    <div className="flex gap-[1vw]">
                        <div className="flex flex-row gap-[1vh] w-full">
                            <label for="pesquisar" className="font-corpo md:text-[1vw] md:ml-0 ml-[2vw] text-[4vw] text-primary my-auto">Adicionar</label>
                            <input name="pesquisar" type="text" id="pesquisar" onChange={(e) => setEmail(e.target.value)} placeholder="Digite o email que deseja adicionar ao sistema" className="bg-secondary/30 p-[2vh] md:mx-0 w-full h-[7vh] md:w-full mx-auto font-corpo rounded-xl md:text-[1vw] text-[4vw] text-primary"/>
                        </div>
                        <Squircle cornerRadius={10} cornerSmoothing={1} className="flex bg-secondary/50 w-[10vw] h-[7vh] justify-center" onClick={() => {adicionarUsuario()}}>
                            <PlusIcon size="4vh" weight="thin" className="my-auto" />
                            <p className="text-primary font-corpo my-auto font-light">Adicionar</p>
                        </Squircle>
                    </div>
                    <h2 className="text-primary font-title text-[1.5vw] mt-[3vh]">Usuários com acesso</h2>
                    <div className="flex flex-row flex-wrap gap-[1vw] mt-[2vh]">
                        {usrs.map ((email, index) =>
                        <div key={index} className="relative group inline-block">
                            <span key={index} className="badge badge-ghost badge-lg pr-6"> {email} </span>
                            <button key={index} className="absolute right-1 top-1 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => {}}><XIcon size="1vw" weight="thin" className="my-[.5vh]"/></button>
                        </div> )}
                    </div>
                </div>
            </div>
        </div>
    )
}
