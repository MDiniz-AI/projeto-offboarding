import {CaretRightIcon} from '@phosphor-icons/react';

export default (props) => {

    return(
        <button href={props.link} className='flex gap-[32vw] bg-accent p-[1vw] rounded-xl'>
            <p className='font-corpo text-[1vw] my-auto text-primary'>{props.texto}</p>
            <CaretRightIcon size="4vh" weight="thin" className='my-auto text-primary'/>
        </button>
    )
}