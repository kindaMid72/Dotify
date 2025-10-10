/**
 * TODO: some request got send when the login page get reloaded
 */

import axios from 'axios';
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// components
import PopupMassage from '../components/Pop_Up_Massage.jsx';

export default (props) => {

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [popUpElement, setPopUpElement] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        setPopUpElement(null); // reset popup massage
        // auth login
        setTimeout(async () => {
            if (!email || !password) {
                setPopUpElement(<PopupMassage title="Login attempt failed" massage="fill all the fields" color="red" />)
                return;
            }
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/db/users/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include', // <-- Perbaiki kesalahan ketik dari 'inclued' menjadi 'include'
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                });
                const data = await response.json(); // extract json
                if (data.accessToken) { // if token exist (login successful)
                    props.setJwt(data.accessToken); // pass
                    setPopUpElement(<PopupMassage title="Login Successfull" massage="we happy to have you back" color="green" />);
                    console.log("Login Successfull");
                    navigate('/notes');
                } else {
                    setPopUpElement(<PopupMassage title="Failed to Login" massage="email or password is incorrect" color="red" />)
                    return;
                }
                setEmail('');
                setPassword('');
            } catch (err) {
                setPopUpElement(<PopupMassage title="Something When Wrong" massage="contact support if the problem persists" color="red" />)
                console.error(err);
            }
        }, 50);
    }
    async function handleForgotPassword() {
        setPopUpElement(null); // reset popup massage

        // 1. send email based on current email input
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setTimeout(async () => {
            if (!emailRegex.test(email)) {
                setPopUpElement(<PopupMassage title="Email Tidak Valid" massage="Mohon masukkan format email yang benar." color="red" />);
                return;
            }
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/db/users/send-reset-password-email`, { email: email })
                .then(res => {
                    if (res.status === 200) {
                        setPopUpElement(<PopupMassage title="Check Your Email" massage="Reset password instruction has been sent to your email" color="green" />);
                    }
                })
                .catch(err => {
                    setPopUpElement(<PopupMassage title="Failed to Send Email" massage="contact support if the problem persists" color="red" />)
                    console.error(err)
                })
        }, 10);
    }

    // {/* google login section */}
    // <div className="flex justify-center items-center border-2 border-gray-300 rounded-lg py-2 w-full mt-8 hover:bg-stone-200 cursor-pointer transition-color duration-75 ease-in-out">
    //     <i className="fa-brands fa-google text-red-500 mr-3"></i>
    //     <button className=""> Log in with Google</button>
    // </div>
    // {/* or break line */}
    // <div className="flex justify-center items-center mt-8 w-full">
    //     <div className="h-0 w-5 border-y-1 border-gray-300 flex-1"></div>
    //     <p className="px-2 text-gray-400">or</p>
    //     <div className="h-0 w-5 border-y-1 border-gray-300 flex-1"></div>
    // </div>
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            {popUpElement}
            <div className="flex flex-col justify-center items-center w-[450px] border-2 border-transparent rounded-xl py-6 px-8 font-mono [box-shadow:0px_0px_50px_#c7c7c7]">
                <div> {/* welcome back section */}
                    <h1 className="text-4xl font-extrabold">Welcome back!</h1>
                    <p className="text-gray-600 mt-3">Log in to your Dotify account to continue</p>
                </div>

                {/* email login section */}
                <form onSubmit={(e) => e.preventDefault()} className="w-full flex flex-col mt-5">
                    <p>Email</p>
                    <input type='text' value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@example.com" className="w-full border-2 border-gray-300 p-2 rounded-md mb-2"></input>
                    <p>Password</p>
                    <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="w-full border-gray-300 border-2 p-2 rounded-md"></input>

                    <div className="flex justify-between items-center mt-5"> {/* forgot password section */}
                        <div className="flex justify-start items-center">
                            <input type='checkbox' className="mr-2"></input>
                            <p>Remember me</p>
                        </div>
                        <button className="hover:underline" onClick={() => handleForgotPassword()}>Forgot Password?</button>
                    </div>

                    {/* login button */} {/* onClick auth */}
                    <button onClick={(e) => handleSubmit(e)} type="submit" className="w-full border-2 border-transparent bg-blue-600 rounded-lg py-2 mt-5 text-white font-[800]">Log in</button>
                </form>

                {/* sign up section */}
                <div>
                    <p className="text-center mt-7 text-gray-500">Don't have an account? <Link to="/signin" className="text-blue-600 hover:underline font-extrabold">Sign up for free</Link></p>
                </div>

            </div>
        </div>
    );
}