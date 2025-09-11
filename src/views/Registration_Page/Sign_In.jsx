import { useState } from 'react';
import PopUpMassage from '../components/Pop_Up_Massage.jsx';

export default () => {
    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');
    let [confirmPassword, setConfirmPassword] = useState('');
    let [name, setName] = useState('');
    // Gunakan useState untuk mengelola elemen status agar UI bisa re-render
    let [statusElement, setStatusElement] = useState(null);


    async function handleSubmit(event) {
        event.preventDefault();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        try {
            // Hapus pesan lama setiap kali submit baru
            setStatusElement(null);
            setTimeout(async () => { // delay for UIs
                switch (true) {
                    case !email || !password || !confirmPassword:
                        setStatusElement(<PopUpMassage title="Input Tidak Lengkap" massage="Mohon isi semua kolom yang wajib." color="red" />);
                        throw new Error("invalid input")
                    case password.length < 8: // check password length 
                        setStatusElement(<PopUpMassage title="Password Lemah" massage="Password harus memiliki minimal 8 karakter." color="red" />);
                        throw new Error("password too short")
                    case password !== confirmPassword: // check password match
                        setStatusElement(<PopUpMassage title="Password Tidak Cocok" massage="Konfirmasi password tidak sesuai." color="red" />);
                        throw new Error("password mismatch")
                    case !emailRegex.test(email): // check email format
                        setStatusElement(<PopUpMassage title="Email Tidak Valid" massage="Mohon masukkan format email yang benar." color="red" />);
                        throw new Error('Invalid email format');
                    default:
                        break;
                }
                // Gunakan environment variable untuk base URL API
                const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/db/users/create_user`;
                const name = email.split('@')[0]; // get name from email before @
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password,
                        name: name
                    })
                    
                });
                
                if (response.ok) {
                    setStatusElement(<PopUpMassage title="Welcome!!" massage="Akun berhasil dibuat." color="green" />);
                    /* redirect ke halaman aplikasi yang sudah login*/
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');
                } else {
                    console.log(response);
                    setStatusElement(<PopUpMassage title="Failed to create account" massage={response.statusText} color="red" />);
                }
            }, 50);
        } catch (error) {
            console.error(error);
        }
    };


    return (<>
        <div className="flex items-center justify-center min-h-screen bg-gray-100 relative">
            {statusElement} {/* if submit is triggered */}
            <div className="flex flex-col justify-center items-center w-[450px] border-2 border-transparent rounded-xl py-6 px-8 font-mono [box-shadow:0px_0px_50px_#c7c7c7]">
                <div> {/* welcome back section */}
                    <h1 className="text-4xl font-extrabold">Welcome to Dotify!</h1>
                    <p className="text-gray-600 mt-3">Sign in to Dotify account to continue</p>
                </div>

                {/* google login section */}
                <div className="flex justify-center items-center border-2 border-gray-300 rounded-lg py-2 w-full mt-8 hover:bg-stone-200 cursor-pointer transition-color duration-75 ease-in-out">
                    <i className="fa-brands fa-google text-red-500 mr-3"></i>
                    <button className=""> Sign in with Google</button>
                </div>

                {/* or break line */}
                <div className="flex justify-center items-center mt-8 w-full">
                    <div className="h-0 w-5 border-y-1 border-gray-300 flex-1"></div>
                    <p className="px-2 text-gray-400">or</p>
                    <div className="h-0 w-5 border-y-1 border-gray-300 flex-1"></div>
                </div>

                {/* email login section */}
                <form onSubmit={handleSubmit} className="w-full flex flex-col mt-5">


                    <p>Email</p>
                    <input name="email" value={email} onChange={(e) => setEmail(e.target.value)} type='text' placeholder="your@example.com" className="w-full border-2 border-gray-300 p-2 rounded-md mb-2"></input>
                    <p>Password</p>
                    <input name="password" value={password} onChange={(e) => setPassword(e.target.value)} type='password' placeholder="Enter your password" className="w-full border-gray-300 border-2 p-2 rounded-md mb-2"></input>
                    <p>Confirm Password</p>
                    <input name="confirm_password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type='password' placeholder="Enter your password" className="w-full border-gray-300 border-2 p-2 rounded-md"></input>

                    <div className="flex justify-between items-center mt-5"> {/* forgot password section */}
                        <div className="flex justify-start items-center">
                            <input type='checkbox' className="mr-2"></input>
                            <p>Remember me</p>
                        </div>
                    </div>

                    {/* sign in button */}
                    <button type="submit" className="w-full border-2 border-transparent bg-blue-600 rounded-lg py-2 mt-5 text-white font-[800] hover:bg-blue-800 transition-color duration-150 ease-in-out">Sign in</button>
                </form>

            </div>
        </div>


    </>);
}