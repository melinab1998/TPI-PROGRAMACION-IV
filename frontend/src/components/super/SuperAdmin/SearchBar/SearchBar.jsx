import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function SearchBar({ searchTerm, onChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="px-1"
    >
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
        <Input
          placeholder="Buscar por nombre, email o matrícula..."
          value={searchTerm}
          onChange={(e) => onChange(e.target.value)}
          className="pl-12 h-14 text-lg rounded-full border-2 border-border/60 focus:border-primary shadow-lg bg-background/80 backdrop-blur-sm"
        />
      </div>
    </motion.div>
  )
}
