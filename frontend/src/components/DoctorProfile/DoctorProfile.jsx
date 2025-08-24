import React from "react";
import { Card, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function DoctorProfile() {
    return (
        <section className="max-w-4xl mx-auto mt-20 px-4">
            <Card className="bg-[var(--card)] border-[var(--border)] flex flex-col md:flex-row items-center p-6 gap-6">
                <Avatar className="w-24 h-24">
                    <AvatarImage src="/doctor.jpg" alt="Dra. Erica" />
                    <AvatarFallback>EZ</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="mb-2">Dra. Erica L. Zaghis</CardTitle>
                    <CardDescription>
                        Con más de 15 años de experiencia en odontología general y estética dental,
                        la Dra. Erica se especializa en brindar atención personalizada y de calidad
                        para cada paciente.
                    </CardDescription>
                </div>
            </Card>
        </section>
    );
}
