import { motion } from 'framer-motion';

// Fades content up as it scrolls into view.
export default function Reveal({ children, delay = 0, as = 'div', className, ...rest }) {
    const Tag = motion[as];
    return (
        <Tag
            className={className}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -12% 0px' }}
            transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
            {...rest}
        >
            {children}
        </Tag>
    );
}
