import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

export default function SearchBar({ searchTerm, setSearchTerm }) {
    const fadeSlideDown = { hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

    return (
        <motion.div variants={fadeSlideDown} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
            <div className="relative w-full">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar por nombre o DNI del paciente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full"
                />
            </div>
        </motion.div>
    )
}
