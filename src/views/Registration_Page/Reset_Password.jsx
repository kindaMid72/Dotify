// halama reset password
import { useEffect, useState } from 'react';
import { UNSAFE_WithComponentProps, useNavigate } from 'react-router-dom';
import axios from 'axios';

// components
import Pop_Up_Massage from '../components/Pop_Up_Massage';

export default () => {
    let [password, setPassword] = useState('');
    let [confirmPassword, setConfirmPassword] = useState('');
    // Gunakan useState untuk mengelola elemen status agar UI bisa re-render
    let [statusElement, setStatusElement] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
    }, [statusElement]);

    // handler
    async function handleSubmit(){
        setStatusElement(null); // reset popup massage
        setTimeout(()=> {
            if(!password || !confirmPassword){
                setStatusElement(<Pop_Up_Massage title="Input Tidak Lengkap" massage="Mohon isi semua kolom yang wajib." color="red" />);
            }
            if(password !== confirmPassword){
                setStatusElement(<Pop_Up_Massage title="Password Tidak Cocok" massage="Konfirmasi password tidak sesuai." color="red" />);
            }
            if(password.length < 8){
                setStatusElement(<Pop_Up_Massage title="Password is Too Weak" massage="Your Password should have at least 8 characters." color="red" />);
            }
            if(password === confirmPassword && password.length >= 8){
                const token = new URLSearchParams(window.location.search).get('token');
                console.log(token);
                
                axios.post(`${import.meta.env.VITE_API_BASE_URL}/db/users/reset-password`, 
                    {
                        password: confirmPassword
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                        withCredentials: true
                    }
                )
                .then(res => {
                    if(res.status === 200){
                        setStatusElement(<Pop_Up_Massage title="Password Reset Successfuly" massage="Your password has been reset, please retry login" color="green" />)
                        setTimeout(() => navigate('/login'), 2000);
                    }
                })
                .catch(() => {
                    setStatusElement(<Pop_Up_Massage title="Something When Wrong" massage="contact support if the problem persists" color="red" />)
                })
            }

        },50)
    }

    return (
        <>
            <div className="flex items-center justify-center min-h-screen bg-gray-100 relative">
                {statusElement} {/* if submit is triggered */}
                <div className="flex flex-col justify-center items-center w-[450px] border-2 border-transparent rounded-xl py-6 px-8 font-mono [box-shadow:0px_0px_50px_#c7c7c7]">
                    <div> {/* welcome back section */}
                        <h1 className="text-4xl font-extrabold">Your New Password?</h1>
                        <p className="text-gray-600 mt-3">Reset your password for your Dotify account!</p>
                    </div>

                    <form onSubmit={(e) => e.preventDefault()} className="w-full flex flex-col mt-5">
                        <p>Password</p>
                        <input name="password" value={password} onChange={(e) => setPassword(e.target.value)} type='password' placeholder="Enter your password" className="w-full border-gray-300 border-2 p-2 rounded-md mb-2"></input>
                        <p>Confirm Password</p>
                        <input name="confirm_password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type='password' placeholder="Enter your password" className="w-full border-gray-300 border-2 p-2 rounded-md"></input>

                        {/* sign in button */}
                        <button onClick={() => {handleSubmit();}} type="submit" className="w-full border-2 border-transparent bg-blue-600 rounded-lg py-2 mt-5 text-white font-[800] hover:bg-blue-800 transition-color duration-150 ease-in-out">Reset Password</button>
                    </form>

                </div>
            </div>

        </>
    )
}