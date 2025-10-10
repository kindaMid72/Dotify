// halama reset password
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// components

export default () => {
    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');
    let [confirmPassword, setConfirmPassword] = useState('');
    let [name, setName] = useState('');
    // Gunakan useState untuk mengelola elemen status agar UI bisa re-render
    let [statusElement, setStatusElement] = useState(null);

    const navigate = useNavigate();


    return (
        <>
            <div className="flex items-center justify-center min-h-screen bg-gray-100 relative">
                <div className="flex flex-col justify-center items-center w-[450px] border-2 border-transparent rounded-xl py-6 px-8 font-mono [box-shadow:0px_0px_50px_#c7c7c7]">
                    <div> {/* welcome back section */}
                        <h1 className="text-4xl font-extrabold">Hi there!</h1>
                        <p className="text-gray-600 mt-3">Reset your password for your Dotify account</p>
                    </div>


                    {/* email login section */}
                    <form onSubmit={() => { }} className="w-full flex flex-col mt-5">
                        <p>Password</p>
                        <input name="password" value={password} onChange={(e) => setPassword(e.target.value)} type='password' placeholder="Enter your password" className="w-full border-gray-300 border-2 p-2 rounded-md mb-2"></input>
                        <p>Confirm Password</p>
                        <input name="confirm_password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type='password' placeholder="Enter your password" className="w-full border-gray-300 border-2 p-2 rounded-md"></input>

                        {/* sign in button */}
                        <button type="submit" className="w-full border-2 border-transparent bg-blue-600 rounded-lg py-2 mt-5 text-white font-[800] hover:bg-blue-800 transition-color duration-150 ease-in-out">Reset</button>
                    </form>

                </div>
            </div>

        </>
    )
}