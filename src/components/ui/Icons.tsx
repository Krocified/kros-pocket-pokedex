import { motion } from 'framer-motion'

export const PokeballIcon = ({ size = 24, className = "", color = "currentColor" }: { size?: number, className?: string, color?: string }) => (
    <motion.svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ color }}
        animate={className.includes('animate-spin') ? { rotate: 360 } : {}}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
    >
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <path d="M2 12H22" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="3" fill="white" stroke="currentColor" strokeWidth="2" />
    </motion.svg>
)
