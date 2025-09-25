import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const PatientProfile = () => {
  const [patientData] = useState({
    name: "María",
    lastName: "González",
    dni: "35.678.901",
    email: "maria.gonzalez@example.com"
  });

  const [appointments] = useState([
    { id: 1, date: "15/08/2023", time: "10:30", dentist: "Dra. Laura Martínez", treatment: "Limpieza dental y revisión general" },
    { id: 2, date: "22/06/2023", time: "16:00", dentist: "Dr. Carlos Rodríguez", treatment: "Extracción de muela del juicio" },
    { id: 3, date: "10/04/2023", time: "11:15", dentist: "Dra. Laura Martínez", treatment: "Curación de caries y obturación" }
  ]);

  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [email, setEmail] = useState(patientData.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleEmailSubmit = (e) => { e.preventDefault(); console.log("Nuevo email:", email); setEmailModalOpen(false); };
  const handlePasswordSubmit = (e) => { e.preventDefault(); console.log("Nueva contraseña:", newPassword); setPasswordModalOpen(false); };

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-10 mt-10">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-primary">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-foreground">Mi Perfil</h1>
      </div>
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
          <div className="flex flex-col sm:flex-row gap-3 mt-4 pt-6 border-t border-border">
            <Dialog open={emailModalOpen} onOpenChange={setEmailModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex-1 h-11 gap-2 border-border hover:bg-accent hover:text-accent-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                  Actualizar correo electrónico
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Actualizar correo electrónico</DialogTitle>
                  <DialogDescription>Ingresa tu nuevo correo electrónico.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleEmailSubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Nuevo Email</Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-border focus-visible:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Contraseña Actual</Label>
                    <Input
                      type="password"
                      required
                      className="border-border focus-visible:ring-primary"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="outline" onClick={() => setEmailModalOpen(false)}>Cancelar</Button>
                    <Button type="submit">Actualizar</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={passwordModalOpen} onOpenChange={setPasswordModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex-1 h-11 gap-2 border-border hover:bg-accent hover:text-accent-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                  Actualizar contraseña
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Actualizar contraseña</DialogTitle>
                  <DialogDescription>Ingresa tu nueva contraseña.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handlePasswordSubmit} className="space-y-4 mt-4">
                  {[
                    { label: "Contraseña Actual", value: currentPassword, setter: setCurrentPassword },
                    { label: "Nueva Contraseña", value: newPassword, setter: setNewPassword },
                    { label: "Confirmar Nueva Contraseña", value: confirmPassword, setter: setConfirmPassword }
                  ].map((input, idx) => (
                    <div key={idx} className="space-y-2">
                      <Label>{input.label}</Label>
                      <Input
                        type="password"
                        value={input.value}
                        onChange={(e) => input.setter(e.target.value)}
                        required
                        className="border-border focus-visible:ring-primary"
                      />
                    </div>
                  ))}
                  <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="outline" onClick={() => setPasswordModalOpen(false)}>Cancelar</Button>
                    <Button type="submit">Actualizar</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
      <Card className="border-border shadow-md">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">Historial de Turnos</CardTitle>
          <CardDescription>Tus consultas anteriores</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {appointments.length ? appointments.map((appointment) => (
            <div key={appointment.id} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border rounded-lg p-4 hover:bg-muted/30 transition-colors border-border">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{appointment.dentist}</h3>
                <p className="text-muted-foreground mt-1">{appointment.treatment}</p>
              </div>
              <div className="flex flex-col items-end">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                  </svg>
                  {appointment.date}
                </span>
                <span className="text-sm text-muted-foreground mt-2">{appointment.time}</span>
              </div>
            </div>
          )) : (
            <div className="text-center py-10 text-muted-foreground space-y-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 mx-auto opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
              </svg>
              <p className="text-lg font-medium">No hay turnos anteriores para mostrar.</p>
              <p className="text-sm">Cuando reserves una cita, aparecerá aquí tu historial.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientProfile;