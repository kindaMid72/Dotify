import { useState } from 'react';
import AnimateOnView from '../components/AnimateOnView.jsx';

export default () => {

    const [languages, setLanguages] = useState('indo');

    return (
        <div className="container mx-auto px-6 py-8 md:py-12 font-mono text-gray-800">
            <AnimateOnView>
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-blue-600">About Dotify</h1>
                    <p className="mt-4 text-base md:text-lg text-gray-600">Your simple, fast, and elegant solution for note-taking.</p>
                </div>
            </AnimateOnView>

            <AnimateOnView delay={0.2} className="max-w-3xl mx-auto mt-12">
                <div className="bg-white p-8 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900">What is Dotify?</h2>
                    <p className="text-gray-700 leading-relaxed">
                        Dotify is a modern note-taking web application designed to help you capture and organize your thoughts seamlessly. With a clean interface and powerful features, Dotify focuses on providing a distraction-free writing experience, allowing your ideas to flow and stay organized.
                    </p>
                </div>
            </AnimateOnView>

            <AnimateOnView delay={0.3} className="max-w-3xl mx-auto mt-8">
                <div className="bg-white p-8 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900">Why This Project Was Built</h2>
                    <p className="text-gray-700 leading-relaxed">
                        This project was born out of a passion for learning and building. Dotify serves as a comprehensive learning-based project to master the fundamentals and advanced concepts of full-stack web development. It integrates a modern technology stack, including <span className="font-bold text-blue-500">React.js</span> for the frontend, <span className="font-bold text-green-500">Node.js</span> with <span className="font-bold text-gray-600">Express.js</span> for the backend, and <span className="font-bold text-orange-500">MySQL</span> for the database.
                    </p>
                </div>
            </AnimateOnView>

            <AnimateOnView delay={0.4} className="max-w-3xl mx-auto mt-8">
                <div className="bg-white p-8 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900">About The Creator</h2>
                    <p className="text-gray-700 leading-relaxed">
                        {languages === 'indo' ? 'Perkenalkan, saya King Ahmad Ilyas, developer di balik proyek ini. Dengan antusiasme tinggi dalam dunia software engineering, saya mendedikasikan proyek ini sebagai sarana untuk mengasah keterampilan, bereksperimen dengan teknologi baru, dan membangun produk yang fungsional dan bermanfaat. Semoga Anda menikmati menggunakan Dotify!'
                            :
                            "Allow me to introduce myself—I'm King Ahmad Ilyas, the developer behind this project. With a deep enthusiasm for the world of software engineering, I dedicate this project as a platform to sharpen my skills, experiment with new technologies, and build a product that is both functional and meaningful. I hope you enjoy using Dotify!"
                        }
                    </p>
                    <div>
                        <button onClick={() => setLanguages(prev => (prev === 'indo' ? 'en' : 'indo'))} className='border-2 mt-4 border-transparent text-white font-bold py-2 px-4 rounded-md bg-blue-500 hover:bg-blue-600 transition-colors duration-300'>
                            {languages === 'indo' ? 'Switch to English' : 'Ganti Bahasa'}
                        </button>
                        {/* Menggunakan tag <a> untuk link eksternal dan styling seperti tombol */}
                        <a href="https://www.instagram.com/khmadlys/" target="blank" rel="noopener noreferrer" className='ml-3 inline-block border-2 mt-4 border-transparent text-white font-bold py-2 px-4 rounded-md bg-blue-500 hover:bg-blue-600 transition-colors duration-300'>
                            {languages === 'indo' ? 'Kenal Saya Lebih Jauh' : "Get to Know me Well"} <i className="fa-brands fa-instagram ml-2"></i>
                        </a>
                    </div>
                </div>
            </AnimateOnView>
        </div>
    )
}