import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus } from "lucide-react"
import PatientDetailModal from "@/components/Patients/PatientDetailModal/PatientDetailModal"
import PatientFormModal from "@/components/Patients/PatientFormModal/PatientFormModal"
import PatientsList from "@/components/Patients/PatientsList/PatientsList"
import PatientVisitsModal from "@/components/Patients/PatientVisitsModal/PatientVisitsModal"
import PatientOdontogramModal from "@/components/Patients/PatientOdontogramModal/PatientOdontogramModal"


const mockPatients = [
  {
    id_user: 1,
    first_name: "María",
    last_name: "López",
    email: "maria@email.com",
    birth_date: "1985-03-15",
    dni: "41239736",
    address: "Av. Siempre Viva 742",
    phone_number: "1122334455",
    city: "Buenos Aires",
    membership_number: "MEM123456",
    id_health_plan: 1,
    health_plan: {
      id_health_plan: 1,
      name: "Plan Oro",
      health_insurance: {
        id_health_insurance: 1,
        name: "OSDE"
      }
    }
  },
  {
    id_user: 2,
    first_name: "Juan",
    last_name: "Pérez",
    email: "juan@email.com",
    birth_date: "1990-07-22",
    dni: "38987654",
    address: "Calle Falsa 123",
    phone_number: "1166778899",
    city: "Córdoba",
    membership_number: "MEM789012",
    id_health_plan: 3,
    health_plan: {
      id_health_plan: 3,
      name: "Plan Básico",
      health_insurance: {
        id_health_insurance: 2,
        name: "Swiss Medical"
      }
    }
  },
  {
    id_user: 3,
    first_name: "Ana",
    last_name: "Gómez",
    email: "ana@email.com",
    birth_date: "1988-11-30",
    dni: "35123456",
    address: "Av. Libertador 1234",
    phone_number: "1133445566",
    city: "Mendoza",
    membership_number: "MEM345678",
    id_health_plan: 2,
    health_plan: {
      id_health_plan: 2,
      name: "Plan Plata",
      health_insurance: {
        id_health_insurance: 1,
        name: "OSDE"
      }
    }
  },
  {
    id_user: 4,
    first_name: "Carlos",
    last_name: "Rodríguez",
    email: "carlos@email.com",
    birth_date: "1975-05-18",
    dni: "28765432",
    address: "Calle 45 #67-89",
    phone_number: "1155667788",
    city: "Rosario",
    membership_number: "MEM901234",
    id_health_plan: 4,
    health_plan: {
      id_health_plan: 4,
      name: "Plan Premium",
      health_insurance: {
        id_health_insurance: 2,
        name: "Swiss Medical"
      }
    }
  },
  {
    id_user: 5,
    first_name: "Laura",
    last_name: "Martínez",
    email: "laura@email.com",
    birth_date: "1992-09-12",
    dni: "40123456",
    address: "Av. Corrientes 1234",
    phone_number: "1144556677",
    city: "Buenos Aires",
    membership_number: "MEM567890",
    id_health_plan: 1,
    health_plan: {
      id_health_plan: 1,
      name: "Plan Oro",
      health_insurance: {
        id_health_insurance: 1,
        name: "OSDE"
      }
    }
  },
  {
    id_user: 6,
    first_name: "Diego",
    last_name: "Sánchez",
    email: "diego@email.com",
    birth_date: "1983-12-05",
    dni: "36543210",
    address: "Calle San Martín 567",
    phone_number: "1177889900",
    city: "La Plata",
    membership_number: "MEM112233",
    id_health_plan: 3,
    health_plan: {
      id_health_plan: 3,
      name: "Plan Básico",
      health_insurance: {
        id_health_insurance: 2,
        name: "Swiss Medical"
      }
    }
  },
  {
    id_user: 7,
    first_name: "Sofía",
    last_name: "Fernández",
    email: "sofia@email.com",
    birth_date: "1995-02-28",
    dni: "42123456",
    address: "Av. Belgrano 789",
    phone_number: "1199887766",
    city: "Mar del Plata",
    membership_number: "MEM445566",
    id_health_plan: 2,
    health_plan: {
      id_health_plan: 2,
      name: "Plan Plata",
      health_insurance: {
        id_health_insurance: 1,
        name: "OSDE"
      }
    }
  },
  {
    id_user: 8,
    first_name: "Miguel",
    last_name: "Torres",
    email: "miguel@email.com",
    birth_date: "1978-08-15",
    dni: "30123456",
    address: "Calle Rivadavia 234",
    phone_number: "1122334455",
    city: "Salta",
    membership_number: "MEM778899",
    id_health_plan: 5,
    health_plan: {
      id_health_plan: 5,
      name: "Particular",
      health_insurance: {
        id_health_insurance: 3,
        name: "Particular"
      }
    }
  },
  {
    id_user: 9,
    first_name: "Elena",
    last_name: "Ramírez",
    email: "elena@email.com",
    birth_date: "1987-04-22",
    dni: "37123456",
    address: "Av. Santa Fe 1234",
    phone_number: "1166554433",
    city: "Buenos Aires",
    membership_number: "MEM001122",
    id_health_plan: 4,
    health_plan: {
      id_health_plan: 4,
      name: "Plan Premium",
      health_insurance: {
        id_health_insurance: 2,
        name: "Swiss Medical"
      }
    }
  },
  {
    id_user: 10,
    first_name: "Roberto",
    last_name: "Díaz",
    email: "roberto@email.com",
    birth_date: "1965-11-08",
    dni: "25123456",
    address: "Calle Alvear 567",
    phone_number: "1144778855",
    city: "Tucumán",
    membership_number: "MEM334455",
    id_health_plan: 1,
    health_plan: {
      id_health_plan: 1,
      name: "Plan Oro",
      health_insurance: {
        id_health_insurance: 1,
        name: "OSDE"
      }
    }
  },
  {
    id_user: 11,
    first_name: "Carolina",
    last_name: "Mendoza",
    email: "carolina@email.com",
    birth_date: "1991-06-14",
    dni: "39123456",
    address: "Av. Cabildo 2345",
    phone_number: "1133669977",
    city: "Buenos Aires",
    membership_number: "MEM667788",
    id_health_plan: 3,
    health_plan: {
      id_health_plan: 3,
      name: "Plan Básico",
      health_insurance: {
        id_health_insurance: 2,
        name: "Swiss Medical"
      }
    }
  },
  {
    id_user: 12,
    first_name: "Fernando",
    last_name: "Castro",
    email: "fernando@email.com",
    birth_date: "1980-03-25",
    dni: "32123456",
    address: "Calle Uruguay 123",
    phone_number: "1155996633",
    city: "Córdoba",
    membership_number: "MEM990011",
    id_health_plan: 2,
    health_plan: {
      id_health_plan: 2,
      name: "Plan Plata",
      health_insurance: {
        id_health_insurance: 1,
        name: "OSDE"
      }
    }
  },
  {
    id_user: 13,
    first_name: "Patricia",
    last_name: "Romero",
    email: "patricia@email.com",
    birth_date: "1972-09-03",
    dni: "27123456",
    address: "Av. Pueyrredón 678",
    phone_number: "1122446688",
    city: "Mendoza",
    membership_number: "MEM223344",
    id_health_plan: 5,
    health_plan: {
      id_health_plan: 5,
      name: "Particular",
      health_insurance: {
        id_health_insurance: 3,
        name: "Particular"
      }
    }
  },
  {
    id_user: 14,
    first_name: "Gabriel",
    last_name: "Herrera",
    email: "gabriel@email.com",
    birth_date: "1986-12-19",
    dni: "36123456",
    address: "Calle Chile 456",
    phone_number: "1188776655",
    city: "Rosario",
    membership_number: "MEM556677",
    id_health_plan: 4,
    health_plan: {
      id_health_plan: 4,
      name: "Plan Premium",
      health_insurance: {
        id_health_insurance: 2,
        name: "Swiss Medical"
      }
    }
  },
  {
    id_user: 15,
    first_name: "Lucía",
    last_name: "Morales",
    email: "lucia@email.com",
    birth_date: "1993-07-07",
    dni: "41123456",
    address: "Av. Callao 1234",
    phone_number: "1166998855",
    city: "Buenos Aires",
    membership_number: "MEM889900",
    id_health_plan: 1,
    health_plan: {
      id_health_plan: 1,
      name: "Plan Oro",
      health_insurance: {
        id_health_insurance: 1,
        name: "OSDE"
      }
    }
  },
  {
    id_user: 16,
    first_name: "Javier",
    last_name: "Ortega",
    email: "javier@email.com",
    birth_date: "1979-01-30",
    dni: "31123456",
    address: "Calle Paraguay 789",
    phone_number: "1144887799",
    city: "La Plata",
    membership_number: "MEM112233",
    id_health_plan: 3,
    health_plan: {
      id_health_plan: 3,
      name: "Plan Básico",
      health_insurance: {
        id_health_insurance: 2,
        name: "Swiss Medical"
      }
    }
  },
  {
    id_user: 17,
    first_name: "Daniela",
    last_name: "Silva",
    email: "daniela@email.com",
    birth_date: "1984-05-12",
    dni: "34123456",
    address: "Av. Dorrego 234",
    phone_number: "1133774466",
    city: "Mar del Plata",
    membership_number: "MEM445566",
    id_health_plan: 2,
    health_plan: {
      id_health_plan: 2,
      name: "Plan Plata",
      health_insurance: {
        id_health_insurance: 1,
        name: "OSDE"
      }
    }
  },
  {
    id_user: 18,
    first_name: "Ricardo",
    last_name: "Vargas",
    email: "ricardo@email.com",
    birth_date: "1968-10-23",
    dni: "26123456",
    address: "Calle Junín 567",
    phone_number: "1155443322",
    city: "Salta",
    membership_number: "MEM778899",
    id_health_plan: 5,
    health_plan: {
      id_health_plan: 5,
      name: "Particular",
      health_insurance: {
        id_health_insurance: 3,
        name: "Particular"
      }
    }
  },
  {
    id_user: 19,
    first_name: "Valeria",
    last_name: "Ríos",
    email: "valeria@email.com",
    birth_date: "1994-03-08",
    dni: "43123456",
    address: "Av. Las Heras 1234",
    phone_number: "1122778855",
    city: "Buenos Aires",
    membership_number: "MEM001122",
    id_health_plan: 4,
    health_plan: {
      id_health_plan: 4,
      name: "Plan Premium",
      health_insurance: {
        id_health_insurance: 2,
        name: "Swiss Medical"
      }
    }
  },
  {
    id_user: 20,
    first_name: "Andrés",
    last_name: "Molina",
    email: "andres@email.com",
    birth_date: "1981-08-17",
    dni: "33123456",
    address: "Calle Suipacha 456",
    phone_number: "1166887744",
    city: "Córdoba",
    membership_number: "MEM334455",
    id_health_plan: 1,
    health_plan: {
      id_health_plan: 1,
      name: "Plan Oro",
      health_insurance: {
        id_health_insurance: 1,
        name: "OSDE"
      }
    }
  },
  {
    id_user: 21,
    first_name: "Camila",
    last_name: "Paz",
    email: "camila@email.com",
    birth_date: "1996-12-01",
    dni: "44123456",
    address: "Av. Libertad 789",
    phone_number: "1144998877",
    city: "Mendoza",
    membership_number: "MEM667788",
    id_health_plan: 3,
    health_plan: {
      id_health_plan: 3,
      name: "Plan Básico",
      health_insurance: {
        id_health_insurance: 2,
        name: "Swiss Medical"
      }
    }
  },
  {
    id_user: 22,
    first_name: "Héctor",
    last_name: "Luna",
    email: "hector@email.com",
    birth_date: "1974-04-26",
    dni: "28123456",
    address: "Calle Maipú 123",
    phone_number: "1133557799",
    city: "Rosario",
    membership_number: "MEM990011",
    id_health_plan: 2,
    health_plan: {
      id_health_plan: 2,
      name: "Plan Plata",
      health_insurance: {
        id_health_insurance: 1,
        name: "OSDE"
      }
    }
  },
  {
    id_user: 23,
    first_name: "Natalia",
    last_name: "Cruz",
    email: "natalia@email.com",
    birth_date: "1989-11-14",
    dni: "38123456",
    address: "Av. Corrientes 5678",
    phone_number: "1122554466",
    city: "Buenos Aires",
    membership_number: "MEM223344",
    id_health_plan: 5,
    health_plan: {
      id_health_plan: 5,
      name: "Particular",
      health_insurance: {
        id_health_insurance: 3,
        name: "Particular"
      }
    }
  },
  {
    id_user: 24,
    first_name: "Sergio",
    last_name: "Flores",
    email: "sergio@email.com",
    birth_date: "1977-02-09",
    dni: "29123456",
    address: "Calle Lavalle 234",
    phone_number: "1188665544",
    city: "La Plata",
    membership_number: "MEM556677",
    id_health_plan: 4,
    health_plan: {
      id_health_plan: 4,
      name: "Plan Premium",
      health_insurance: {
        id_health_insurance: 2,
        name: "Swiss Medical"
      }
    }
  },
  {
    id_user: 25,
    first_name: "Verónica",
    last_name: "Miranda",
    email: "veronica@email.com",
    birth_date: "1990-06-20",
    dni: "40123457",
    address: "Av. Santa Fe 2345",
    phone_number: "1166443322",
    city: "Mar del Plata",
    membership_number: "MEM889900",
    id_health_plan: 1,
    health_plan: {
      id_health_plan: 1,
      name: "Plan Oro",
      health_insurance: {
        id_health_insurance: 1,
        name: "OSDE"
      }
    }
  }
]

const mockHealthPlans = [
  { id_health_plan: 1, name: "Plan Oro", id_health_insurance: 1, health_insurance: { name: "OSDE" } },
  { id_health_plan: 2, name: "Plan Plata", id_health_insurance: 1, health_insurance: { name: "OSDE" } },
  { id_health_plan: 3, name: "Plan Básico", id_health_insurance: 2, health_insurance: { name: "Swiss Medical" } },
  { id_health_plan: 4, name: "Plan Premium", id_health_insurance: 2, health_insurance: { name: "Swiss Medical" } },
  { id_health_plan: 5, name: "Particular", id_health_insurance: 3, health_insurance: { name: "Particular" } }
]

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [editingPatient, setEditingPatient] = useState(null)
  const [isVisitsModalOpen, setIsVisitsModalOpen] = useState(false)
  const [selectedPatientForVisits, setSelectedPatientForVisits] = useState(null)
  const [isOdontogramModalOpen, setIsOdontogramModalOpen] = useState(false)
  const [selectedPatientForOdontogram, setSelectedPatientForOdontogram] = useState(null)

  const handleViewVisits = (patient) => {
    setSelectedPatientForVisits(patient)
    setIsVisitsModalOpen(true)
  }

  const handleViewOdontogram = (patient) => {
    setSelectedPatientForOdontogram(patient)
    setIsOdontogramModalOpen(true)
  }

  const filteredPatients = mockPatients.filter(patient =>
    patient.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.dni.includes(searchTerm)
  )

  const handleCreatePatient = () => {
    setEditingPatient(null)
    setIsFormModalOpen(true)
  }

  const handleEditPatient = (patient) => {
    setEditingPatient(patient)
    setIsFormModalOpen(true)
  }

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient)
    setIsDetailModalOpen(true)
  }

  const handleSavePatient = (patientData) => {
    if (patientData.id_user) {
      console.log("Actualizando paciente:", patientData)
      // Aquí iría la lógica para actualizar el paciente
    } else {
      console.log("Creando nuevo paciente:", patientData)
      // Aquí iría la lógica para crear nuevo paciente
    }
    setIsFormModalOpen(false)
    setEditingPatient(null)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
  <div>
    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
      Gestión de Pacientes
    </h1>
    <p className="text-muted-foreground mt-1">
      Administra la información de tus pacientes
    </p>
  </div>
  <Button onClick={handleCreatePatient} className="flex items-center gap-2">
    <Plus className="w-4 h-4" />
    Nuevo Paciente
  </Button>
</div>

      {/* Barra de búsqueda */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, apellido o DNI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de pacientes */}
      <Card>
        <CardHeader>
          <CardTitle>Pacientes ({filteredPatients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <PatientsList
            patients={filteredPatients}
            onView={handleViewPatient}
            onEdit={handleEditPatient}
            onViewVisits={handleViewVisits}
            onViewOdontogram={handleViewOdontogram}
          />
        </CardContent>
      </Card>

      {/* Modal de formulario de paciente */}
      <PatientFormModal
        open={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false)
          setEditingPatient(null)
        }}
        onSave={handleSavePatient}
        patient={editingPatient}
        healthPlans={mockHealthPlans}
      />

      {/* Modal de detalle de paciente */}
      <PatientDetailModal
        open={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setSelectedPatient(null)
        }}
        patient={selectedPatient}
        onEdit={() => {
          setIsDetailModalOpen(false)
          handleEditPatient(selectedPatient)
        }}
      />

      {/* Modal de visitas del paciente */}
      <PatientVisitsModal
        open={isVisitsModalOpen}
        onClose={() => {
          setIsVisitsModalOpen(false)
          setSelectedPatientForVisits(null)
        }}
        patient={selectedPatientForVisits}
      />

      {/* Modal de odontograma del paciente (SOLO LECTURA) */}
      <PatientOdontogramModal
        open={isOdontogramModalOpen}
        onClose={() => {
          setIsOdontogramModalOpen(false)
          setSelectedPatientForOdontogram(null)
        }}
        patient={selectedPatientForOdontogram}
      />
    </div>
  )
}