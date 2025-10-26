import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-background px-4">
            <div className="max-w-md w-full text-center">

                <div className="mb-8">
                    <h1 className="text-8xl font-bold text-primary font-serif">404</h1>
                </div>

                <h2 className="text-2xl font-bold text-foreground font-sans mb-4">
                    Página no encontrada
                </h2>

                <p className="text-muted-foreground font-sans mb-8">
                    Lo sentimos, la página que buscas no existe o ha sido movida.
                </p>

                <Link
                    to="/"
                    className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-sans font-medium rounded-lg hover:bg-primary/90 transition-colors duration-200 shadow-sm"
                >
                    Volver al inicio
                </Link>
            </div>
        </div>
    );
};

export default NotFound;