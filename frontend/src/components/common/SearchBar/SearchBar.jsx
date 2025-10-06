import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function SearchBar({ searchTerm, onChange, placeholder = "Buscar...", className = "" }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`w-full ${className}`}
        >
            <div className="relative w-full">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => onChange(e.target.value)}
                    className="pl-9 w-full"
                />
            </div>
        </motion.div>
    );
}