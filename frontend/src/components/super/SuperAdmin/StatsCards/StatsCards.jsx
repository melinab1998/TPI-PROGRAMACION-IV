import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Users, UserCheck, UserX } from "lucide-react"

export default function StatsCards({ total, active }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="group border-2 border-transparent hover:border-primary/20 hover:shadow-lg transition-all bg-gradient-to-b from-background to-muted/10">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{total}</div>
              <div className="text-sm text-muted-foreground">Total Dentistas</div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="group border-2 hover:border-primary/20 hover:shadow-lg transition-all bg-gradient-to-b from-background to-muted/10">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full group-hover:scale-110 transition-transform">
              <UserCheck className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{active}</div>
              <div className="text-sm text-muted-foreground">Activos</div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="group border-2 hover:border-primary/20 hover:shadow-lg transition-all bg-gradient-to-b from-background to-muted/10">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-red-500/10 rounded-full group-hover:scale-110 transition-transform">
              <UserX className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{total - active}</div>
              <div className="text-sm text-muted-foreground">Inactivos</div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
