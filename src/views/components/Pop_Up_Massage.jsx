
export default (props) => { // title, massage, onClose (callbacks)

    return (
        <div className="h-fit w-[240px] text-left border-transparent rounded-lg fixed top-3 right-3 bg-white drop-shadow-lg transition-transform animate-slideBlock">
            <h2 className="text-xl font-bold my-1 ml-3 font-mono " style={{ color: props.color }}>{props.title}</h2>
            <p className="text-sm font-mono text-left my-1 ml-3">{props.massage}</p>

        </div>


    );
}