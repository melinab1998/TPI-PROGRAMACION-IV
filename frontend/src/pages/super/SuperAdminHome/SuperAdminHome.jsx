import { useState, useEffect, useContext } from "react";
import Header from "@/components/common/Header/Header";
import SearchBar from "@/components/common/SearchBar/SearchBar";
import StatsCards from "@/components/super/SuperAdmin/StatsCards/StatsCards";
import DentistList from "@/components/super/SuperAdmin/DentistList/DentistList";
import DentistForm from "@/components/super/SuperAdmin/DentistForm/DentistForm";
import ConfirmDialog from "@/components/super/SuperAdmin/ConfirmDialog/ConfirmDialog";
import { Plus } from "lucide-react";
import {
  createDentist,
  getAllDentists,
  updateDentistBySuperAdmin,
} from "@/services/api.services.js";
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

  useEffect(() => {
    if (!token) return;

    getAllDentists(
      token,
      (response) => {
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
  }, [token]);

  const filteredDentists = dentists.filter(
    (dentist) =>
      `${dentist.first_name} ${dentist.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dentist.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dentist.license_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => setCurrentPage(1), [searchTerm]);

  const handleCreateDentist = () => {
    setEditingDentist(null);
    setIsFormOpen(true);
  };

  const handleEditDentist = (dentist) => {
    setEditingDentist(dentist);
    setIsFormOpen(true);
  };

  const handleSaveDentist = (data) => {
    const payload = {
      firstName: data.firstName || data.first_name,
      lastName: data.lastName || data.last_name,
      email: data.email,
      licenseNumber: data.licenseNumber || data.license_number,
    };

    if (editingDentist) {
      updateDentistBySuperAdmin(
        editingDentist.id_user || editingDentist.id,
        payload,
        token,
        (updated) => {
          setDentists((prev) =>
            prev.map((d) =>
              d.id_user === (updated.id_user || updated.id)
                ? {
                    ...d,
                    first_name: updated.firstName || updated.first_name,
                    last_name: updated.lastName || updated.last_name,
                    email: updated.email,
                    license_number: updated.licenseNumber || updated.license_number,
                  }
                : d
            )
          );
          successToast("Dentista actualizado exitosamente");
          setEditingDentist(null);
          setIsFormOpen(false);
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
      return;
    }

    // Crear nuevo dentista
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
        setIsFormOpen(false);
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
    if (!deleteConfirm) return;

    setDentists((prev) =>
      prev.map((dentist) =>
        dentist.id_user === deleteConfirm.id_user
          ? { ...dentist, status: dentist.status === "active" ? "inactive" : "active" }
          : dentist
      )
    );
    setDeleteConfirm(null);
  };

  const activeDentists = dentists.filter((d) => d.status === "active").length;
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

      <StatsCards total={totalDentists} active={activeDentists} className="text-sm p-4 gap-3" />

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
        dentist={editingDentist} // <-- PASAR DENTISTA A EDITAR
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
