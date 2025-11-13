
export default (props) => {

    return (
        <div className="flex flex-col gap-[1vh]">
            <label for={props.id} className="font-corpo text-[1vw]">{props.label}</label>
            <select name={props.id} type="email" id={props.id} placeholder={props.placeholder} className="bg-[#DEDB1826] p-[2vh] w-[40vw] font-corpo rounded-xl text-[1vw]">
                <option key={props.opcoes.length} value={props.placeholder} disabled hidden selected="selected">{props.placeholder}</option>
                {props.opcoes.map((opc, index) => (
                    <option key={index} value={opc}>{opc}</option>
                ))}
            </select>
        </div>
    )
}