import { useState, useEffect, useContext } from "react";
import Header from "@/components/common/Header/Header";
import SearchBar from "@/components/common/SearchBar/SearchBar";
import StatsCards from "@/components/super/SuperAdmin/StatsCards/StatsCards";
import DentistList from "@/components/super/SuperAdmin/DentistList/DentistList";
import DentistForm from "@/components/super/SuperAdmin/DentistForm/DentistForm";
import ConfirmDialog from "@/components/super/SuperAdmin/ConfirmDialog/ConfirmDialog";
import { Plus } from "lucide-react";
import { createDentist, getAllDentists } from "@/services/api.services.js";
import { AuthContext } from "@/services/auth/AuthContextProvider";
import { successToast, errorToast } from "@/utils/notifications.js";


export default function SuperAdminPage() {
  const { token } = useContext(AuthContext);

  const [dentists, setDentists] = useState([]);
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

  useEffect(() => {
    if (token) {
      getAllDentists(
        token,
        (response) => {
          console.log(response)
          setDentists(
            response.map((d) => ({
              id_user: d.id_user || d.id,
              first_name: d.firstName || d.first_name,
              last_name: d.lastName || d.last_name,
              email: d.email || d.Email,
              license_number: d.licenseNumber || d.license_number,
              status: d.status || "active",
              created_at: d.createdAt || d.created_at || new Date().toISOString().split("T")[0],
            }))
          );
        },
        (err) => {
          console.error(err);
          errorToast("Error al cargar los dentistas");
        }
      );
    }
  }, [token]);

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

  const handleSaveDentist = (data) => {
  if (editingDentist) {
    successToast("Edición no implementada en backend por ahora");
    setEditingDentist(null);
    return;
  }

  const payload = {
    firstName: data.first_name,
    lastName: data.last_name,
    email: data.email,
    licenseNumber: data.license_number,
  };

  createDentist(
    payload,
    token,
    (response) => {
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

      successToast("Dentista creado exitosamente");
      setEditingDentist(null);
    },
    (err) => {
      const message = err?.message?.toLowerCase();

      if (message?.includes("email")) {
        errorToast("El email ya está registrado");
      } else if (message?.includes("matrícula") || message?.includes("license")) {
        errorToast("La matrícula ya está registrada");
      } else {
        errorToast("Error del servidor");
      }
    }
  );
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
