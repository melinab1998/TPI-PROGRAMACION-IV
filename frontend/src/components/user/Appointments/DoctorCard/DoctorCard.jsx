import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FaCalendarAlt } from "react-icons/fa";

export default function DoctorCard({ doctor, navigate }) {
    return (
        <Card className="hover:shadow-lg transition-all">
            <CardHeader className="flex flex-col items-center">
                <Avatar className="w-32 h-32 mb-4">
                    <AvatarImage src={`https://i.pravatar.cc/150?img=${doctor.id + 10}`} />
                    <AvatarFallback>👤</AvatarFallback>
                </Avatar>
                <CardTitle>{doctor.firstName} {doctor.lastName}</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
                <Button variant="outline" className="flex items-center justify-center gap-2" onClick={() => navigate(`/calendar/${doctor.id}`)}>
                    <FaCalendarAlt /> Solicitar Turno
                </Button>
            </CardContent>
        </Card>
    );
}
