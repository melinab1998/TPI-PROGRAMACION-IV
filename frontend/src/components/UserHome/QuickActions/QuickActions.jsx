import React from "react";
import { Calendar, User, History, ArrowRight, Sparkles } from "lucide-react";
import ActionCard from "./ActionCard";

export default function QuickActions() {
    const actions = [
        {
            icon: Calendar,
            title: "Sacar turno",
            description: "Reserva una nueva cita",
            link: "/appointments",
            buttonLabel: "Reservar ahora"
        },
        {
            icon: History,
            title: "Historial",
            description: "Revisa tu historial de visitas",
            link: "/profile",
            buttonLabel: "Ver historial"
        },
        {
            icon: User,
            title: "Mi perfil",
            description: "Gestiona tu información personal",
            link: "/profile",
            buttonLabel: "Editar perfil"
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

