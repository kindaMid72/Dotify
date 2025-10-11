import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";


export default () => {
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2, // Memberi jeda animasi antar elemen anak
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut",
            },
        },
    };

    return (<>
        <motion.div
            className="flex flex-col font-mono justify-center items-center text-center min-h-[calc(100vh-80px)] px-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.h1 variants={itemVariants} className="font-black text-4xl sm:text-5xl md:text-6xl text-blue-600 leading-tight">Capture Your Ideas.<br />Organize Your Life.</motion.h1>
            <motion.p variants={itemVariants} className="font-medium text-base md:text-lg text-gray-600 max-w-md mt-6">The ultimate note-taking app that helps you organize your thoughts and ideas, all in one place.</motion.p>
            <motion.button variants={itemVariants} onClick={() => navigate('/login')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-blue-600 text-white font-bold text-base md:text-lg px-6 md:px-8 py-3 mt-8 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-300">Try Dotify Now</motion.button>
        </motion.div>
    </>)
}