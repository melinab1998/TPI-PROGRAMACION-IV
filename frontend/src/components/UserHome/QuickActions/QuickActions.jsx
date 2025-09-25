import React from "react";
import { Calendar, User, History, ArrowRight, Sparkles } from "lucide-react";
import ActionCard from "./ActionCard";

export default function QuickActions() {
    const actions = [
        {
            icon: Calendar,
            title: "Sacar turno",
            description: "Reserva una nueva cita con nuestros especialistas",
            link: "/appointments"
        },
        {
            icon: History,
            title: "Historial",
            description: "Revisa tu historial de visitas y tratamientos",
            link: "/profile"
        },
        {
            icon: User,
            title: "Mi perfil",
            description: "Gestiona tu información personal y preferencias",
            link: "/profile"
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {actions.map((action, idx) => (
                <ActionCard key={idx} {...action} />
            ))}
        </div>
    );
}
