import { useNavigate } from "react-router-dom";


export default () => {
    const navigate = useNavigate();
    
    return (<>
    <div className="flex flex-col [&_*]:text-center [&_*]:font-mono justify-center items-center pt-8 pb-8 ">
        <h1 className="font-[900] text-4xl text-blue-400">Capture Your Ideas.<br/>Organize Your Live.</h1>
        <p className="font-[500] text-[1.1em] w-[450px] mt-4">The ultimate note-taking app that help you organize your thoughts, ideas in one place.</p>
        <button onClick={() => navigate('/login')} className="border-2 border-gray-500 px-2 py-0.5 mt-5 rounded-lg">Try it Now</button> {/* go to login page, */}
    </div>
    </>)
}