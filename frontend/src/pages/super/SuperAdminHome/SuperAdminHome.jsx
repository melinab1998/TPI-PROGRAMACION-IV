import { useState, useEffect, useContext } from "react";
import Header from "@/components/common/Header/Header";
import SearchBar from "@/components/common/SearchBar/SearchBar";
import StatsCards from "@/components/super/SuperAdmin/StatsCards/StatsCards";
import DentistList from "@/components/super/SuperAdmin/DentistList/DentistList";
import DentistForm from "@/components/super/SuperAdmin/DentistForm/DentistForm";
import ConfirmDialog from "@/components/super/SuperAdmin/ConfirmDialog/ConfirmDialog";
import { Plus } from "lucide-react";
import { createDentist } from "@/services/api.services.js";
import { AuthContext } from "@/services/auth/AuthContextProvider";
import { successToast, errorToast } from "@/utils/notifications.js";

const mockDentists = [
  {
    id_user: 1,
    first_name: "María",
    last_name: "López",
    email: "maria.lopez@clinica.com",
    license_number: "MN-12345",
    status: "active",
    created_at: "2024-01-15",
  },
  {
    id_user: 2,
    first_name: "Carlos",
    last_name: "Rodríguez",
    email: "carlos.rodriguez@clinica.com",
    license_number: "MN-67890",
    status: "active",
    created_at: "2024-02-10",
  },
  {
    id_user: 3,
    first_name: "Ana",
    last_name: "Martínez",
    email: "ana.martinez@clinica.com",
    license_number: "MN-54321",
    status: "inactive",
    created_at: "2024-01-20",
  },
  {
    id_user: 4,
    first_name: "Pedro",
    last_name: "Gómez",
    email: "pedro.gomez@clinica.com",
    license_number: "MN-98765",
    status: "active",
    created_at: "2024-03-05",
  },
  {
    id_user: 5,
    first_name: "Laura",
    last_name: "Fernández",
    email: "laura.fernandez@clinica.com",
    license_number: "MN-13579",
    status: "active",
    created_at: "2024-03-10",
  },
  {
    id_user: 6,
    first_name: "Diego",
    last_name: "Sánchez",
    email: "diego.sanchez@clinica.com",
    license_number: "MN-24680",
    status: "inactive",
    created_at: "2024-03-15",
  },
];

export default function SuperAdminPage() {
  const { token } = useContext(AuthContext);

  const [dentists, setDentists] = useState(mockDentists);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDentist, setEditingDentist] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    license_number: "",
  });

  const filteredDentists = dentists.filter(
    (dentist) =>
      `${dentist.first_name} ${dentist.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      dentist.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dentist.license_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleCreateDentist = () => {
    setEditingDentist(null);
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      license_number: "",
    });
    setIsFormOpen(true);
  };

  const handleEditDentist = (dentist) => {
    setEditingDentist(dentist);
    setFormData({
      first_name: dentist.first_name,
      last_name: dentist.last_name,
      email: dentist.email,
      license_number: dentist.license_number,
    });
    setIsFormOpen(true);
  };

  const handleSaveDentist = async (data) => {
    try {
      if (editingDentist) {
        successToast("Edición no implementada en backend por ahora");
        // ❌ ELIMINAR: setIsFormOpen(false); - que lo haga el form
        setEditingDentist(null);
        return;
      }

      const payload = {
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        licenseNumber: data.license_number,
      };

      console.log("📤 Enviando payload:", payload);

      const response = await createDentist(payload, token);
      console.log("🔍 Respuesta COMPLETA:", response);

      // ✅ ACTUALIZAR estado
      setDentists((prev) => [
        ...prev,
        {
          id_user: response.id_user || response.id,
          first_name: response.firstName || response.first_name,
          last_name: response.lastName || response.last_name,
          email: response.email,
          license_number: response.licenseNumber || response.license_number,
          status: "active",
          created_at: new Date().toISOString().split("T")[0],
        },
      ]);

      // ✅ MOSTRAR TOAST DE ÉXITO (solo aquí)
      successToast("Dentista creado exitosamente");

      // ❌ ELIMINAR: setIsFormOpen(false); - que lo haga el form
      setEditingDentist(null);
    } catch (err) {
      console.error("❌ Error completo:", err);

      const errorMessage = err?.message || "";

      if (errorMessage.includes("ya está registrado") || err?.status === 400) {
        errorToast(
          err.data?.message || "El dentista ya está registrado en el sistema"
        );
      } else {
        errorToast(errorMessage || "Error al crear dentista");
      }

      setEditingDentist(null);
      // ❌ NO cerrar el modal en error - que el usuario pueda corregir
    }
  };

  const handleToggleStatus = (dentist) => {
    setDeleteConfirm(dentist);
  };

  const handleConfirmToggle = () => {
    if (deleteConfirm) {
      setDentists((prev) =>
        prev.map((dentist) =>
          dentist.id_user === deleteConfirm.id_user
            ? {
                ...dentist,
                status: dentist.status === "active" ? "inactive" : "active",
              }
            : dentist
        )
      );
      setDeleteConfirm(null);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const activeDentists = dentists.filter(
    (dentist) => dentist.status === "active"
  ).length;
  const totalDentists = dentists.length;

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-6 py-6 space-y-4">
      <Header
        title="Super Administrador"
        subtitle="Gestión integral de dentistas del sistema"
        onCreate={handleCreateDentist}
        actionLabel="Nuevo Dentista"
        actionIcon={Plus}
      />

      <StatsCards
        total={totalDentists}
        active={activeDentists}
        className="text-sm p-4 gap-3"
      />

      <SearchBar
        searchTerm={searchTerm}
        onChange={setSearchTerm}
        placeholder="Buscar por nombre, email o matrícula..."
        className="text-sm p-2"
      />

      <DentistList
        dentists={filteredDentists}
        onEdit={handleEditDentist}
        onToggleStatus={handleToggleStatus}
        searchTerm={searchTerm}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        className="text-sm gap-2"
      />

      <DentistForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSaveDentist}
        formData={formData}
        onChange={handleInputChange}
        isEditing={!!editingDentist}
        className="text-sm p-4"
      />

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleConfirmToggle}
        dentist={deleteConfirm}
        className="text-sm"
      />
    </div>
  );
}
