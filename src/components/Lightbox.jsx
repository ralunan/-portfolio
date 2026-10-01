import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const LightboxContext = createContext(() => {});

export function useLightbox() {
    return useContext(LightboxContext);
}

// Click-to-enlarge overlay. Shows the image at native resolution with scroll,
// since many boards are dense Figma flows that are unreadable when shrunk.
export function LightboxProvider({ children }) {
    const [image, setImage] = useState(null);
    const close = useCallback(() => setImage(null), []);

    useEffect(() => {
        if (!image) return;
        const onKey = (e) => e.key === 'Escape' && close();
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [image, close]);

    return (
        <LightboxContext.Provider value={setImage}>
            {children}
            <AnimatePresence>
                {image && (
                    <motion.div
                        className="lightbox"
                        role="dialog"
                        aria-modal="true"
                        aria-label={image.alt}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={close}
                    >
                        <button type="button" className="lightbox-close" onClick={close} aria-label="Close">×</button>
                        <motion.img
                            src={image.src}
                            alt={image.alt}
                            initial={{ scale: 0.96 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.96 }}
                            onClick={(e) => e.stopPropagation()}
                        />
                        {image.alt && <p className="lightbox-caption">{image.alt}</p>}
                    </motion.div>
                )}
            </AnimatePresence>
        </LightboxContext.Provider>
    );
}
