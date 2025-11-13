import {CaretRightIcon} from '@phosphor-icons/react';

export default (props) => {

    return(
        <button href={props.link} className='flex gap-[32vw] bg-[#EBEA76] p-[1vw] rounded-xl'>
            <p className='font-corpo text-[1vw] my-auto'>{props.texto}</p>
            <CaretRightIcon size="4vh" weight="thin" className='my-auto'/>
        </button>
    )
}