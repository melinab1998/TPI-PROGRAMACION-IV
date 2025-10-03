import { motion } from "framer-motion";

export default function Header() {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4"
        >
            <div className="flex flex-col items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="1.5" 
                        className="w-8 h-8 text-primary"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" 
                        />
                    </svg>
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    Mi Perfil
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Gestiona tu información personal y revisa tu historial de citas
                </p>
            </div>
        </motion.div>
    );
}