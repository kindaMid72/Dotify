import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

export default ({ children, delay = 0, className }) => {
    const controls = useAnimation();
    const [ref, inView] = useInView({
        triggerOnce: true, // Hanya animasikan sekali
        threshold: 0.1,    // Animasikan saat 10% elemen terlihat
    });

    useEffect(() => {
        if (inView) {
            controls.start('visible');
        }
    }, [controls, inView]);

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay } },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};