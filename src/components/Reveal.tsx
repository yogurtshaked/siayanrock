// src/components/Reveal.tsx
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
    children: ReactNode;
    delay?: number;
    className?: string;
    y?: number; // how far below the final position it starts
};

export default function Reveal({ children, delay = 0, className, y = 24 }: RevealProps) {
    const reduce = useReducedMotion();
    return (
        <motion.div
            className={className}
            initial={reduce ? false : { opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: "some", margin: "0px 0px -15% 0px" }}
            transition={{ duration: 0.6, delay, ease: "easeOut" }}
        >
            {children}
        </motion.div>
    );
}