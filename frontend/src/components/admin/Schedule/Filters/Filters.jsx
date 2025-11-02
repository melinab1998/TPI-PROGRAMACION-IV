import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Filters({ filters, setFilters }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar paciente..."
                    value={filters.patient}
                    onChange={(e) => setFilters({ ...filters, patient: e.target.value })}
                    className="pl-9"
                />
            </div>
            <Select 
                value={filters.status} 
                onValueChange={(value) => setFilters({ ...filters, status: value })}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Estado del turno" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Todos">Todos</SelectItem>
                    <SelectItem value="Pending">Activos</SelectItem>
                    <SelectItem value="Cancelled">Cancelados</SelectItem>
                    <SelectItem value="Completed">Completados</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}

