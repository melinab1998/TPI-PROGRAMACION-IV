import React from "react";

export default function Header({ userName }) {
    return (
        <div className="text-center space-y-6 relative">
            <div className="pt-10">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent">
                    ¡Hola, <span className="text-primary">{userName}</span>!
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-4 leading-relaxed">
                    Gestiona tus turnos odontológicos con nuestra plataforma especializada
                </p>
            </div>
        </div>
    );
}
