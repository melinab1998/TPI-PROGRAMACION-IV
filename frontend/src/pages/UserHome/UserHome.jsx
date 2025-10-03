import React from "react";
import Header from "@/components/UserHome/Header/Header";
import NextAppointmentCard from "@/components/UserHome/NextAppointmentCard/NextAppointmentCard";
import QuickActions from "@/components/UserHome/QuickActions/QuickActions";
import { Sparkles, Calendar } from "lucide-react";

export default function UserHome() {
   const userData = {
        name: "María Gomez",
        nextAppointment: {
            date: "15 de Septiembre, 2024",
            time: "10:30 AM",
            dentist: "Dr. Juan Pérez"
        } 
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <div className="max-w-6xl mx-auto px-4 py-12 space-y-16 relative z-10">
                <Header userName={userData.name} />


                {/* Próximo turno */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-full">
                            <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-foreground">Próximo turno</h2>
                            <p className="text-muted-foreground">Aquí verás tu próxima cita programada</p>
                        </div>
                    </div>

                    <NextAppointmentCard appointment={userData.nextAppointment} />
                </section>
                
                {/* Acciones rápidas */}
            <section className="space-y-8">
  <div className="flex items-center gap-3">
    <div className="p-2 bg-primary/10 rounded-full hover:bg-primary/20 transition-all duration-300">
      <Sparkles className="h-5 w-5 text-primary" />
    </div>
    <div>
      <h2 className="text-2xl font-semibold text-foreground">Acciones rápidas</h2>
      <p className="text-muted-foreground">Accede rápidamente a las funciones principales</p>
    </div>
  </div>

  <QuickActions />
</section>
            </div>
        </div>
    );
}


