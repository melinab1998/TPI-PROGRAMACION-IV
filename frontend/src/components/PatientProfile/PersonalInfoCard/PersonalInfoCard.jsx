import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PersonalInfoCard({ patientData }) {
    return (
        <Card className="border-border shadow-md">
            <CardHeader>
                <CardTitle className="text-xl text-foreground">Información Personal</CardTitle>
                <CardDescription>Datos básicos de tu perfil</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {["name", "lastName", "dni", "email"].map((field) => (
                        <div key={field} className="space-y-2">
                            <Label className="text-sm font-medium text-foreground">
                                {field === "name" ? "Nombre" : field === "lastName" ? "Apellido" : field === "dni" ? "DNI" : "Email"}
                            </Label>
                            <Input
                                value={patientData[field]}
                                disabled
                                className="bg-muted/50 border-border h-11 focus-visible:ring-primary/30"
                            />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
