import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const ParallaxWrapper = ({ children, offset = 50, speed = 1, className = "" }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [offset * speed, -offset * speed]);
    const springY = useSpring(y, { stiffness: 400, damping: 90 });

    return (
        <motion.div
            ref={ref}
            style={{ y: springY }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default ParallaxWrapper;
