// src/components/Preloader.tsx
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Preloader({ heroSrc }: { heroSrc: string }) {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.src = heroSrc;
        Promise.all([
            img.decode().catch(() => { }),
            document.fonts.ready,
            new Promise((r) => setTimeout(r, 500)), 
        ]).then(() => setReady(true));
    }, [heroSrc]);

    return (
        <AnimatePresence>
            {!ready && (
                <motion.div
                    className="fixed inset-0 z-[9999] grid place-items-center bg-white"
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="h-[2px] w-48 overflow-hidden rounded-full bg-black/10">
                        <motion.div
                            className="h-full w-1/3 rounded-full bg-[#d4a73a]"
                            animate={{ x: ["-100%", "300%"] }}
                            transition={{
                                duration: 1.2,
                                ease: "easeInOut",
                                repeat: Infinity,
                            }}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}