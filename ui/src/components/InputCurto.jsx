export default (props) => {
  return (
    <div className="flex flex-col gap-[1vh]">
      <label for={props.id} className="font-corpo text-[1vw]">
        {props.label}
      </label>
      <input
        name={props.id}
        type="email"
        id={props.id}
        placeholder={props.placeholder}
        className="bg-[#DEDB1826] p-[2vh] w-[40vw] font-corpo rounded-xl text-[1vw]"
      />
    </div>
  );
};
