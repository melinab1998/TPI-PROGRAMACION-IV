import { useState, useEffect, useContext } from "react";
import Header from "@/components/common/Header/Header";
import SearchBar from "@/components/common/SearchBar/SearchBar";
import StatsCards from "@/components/super/SuperAdmin/StatsCards/StatsCards";
import DentistList from "@/components/super/SuperAdmin/DentistList/DentistList";
import DentistForm from "@/components/super/SuperAdmin/DentistForm/DentistForm";
import ConfirmDialog from "@/components/super/SuperAdmin/ConfirmDialog/ConfirmDialog";
import { toggleDentistStatus, createDentist, getAllDentists, updateDentistBySuperAdmin } from "@/services/api.services.js";
import { Plus } from "lucide-react";
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
  const itemsPerPage = 5;

  useEffect(() => {
    if (!token) return;
    loadDentists();
  }, [token]);

  const loadDentists = () => {
    getAllDentists(
      token,
      (response) => {
        console.log("Respuesta completa de la API:", response);

        const normalized = response.map((d) => {
          const id = d.id || d.id_user;
          if (!id) console.warn("Dentista sin ID:", d);

          return {
            id,
            id_user: id,
            first_name: d.firstName || d.first_name || "",
            last_name: d.lastName || d.last_name || "",
            email: d.email || d.Email || "",
            license_number: d.licenseNumber || d.license_number || "",
            status:
              d.isActive === undefined
                ? d.status || "inactive"
                : d.isActive
                ? "active"
                : "inactive",
            created_at:
              d.createdAt ||
              d.created_at ||
              new Date().toISOString().split("T")[0],
          };
        });

        setDentists(normalized);
      },
      (err) => {
        errorToast(err?.message || "Error del servidor al cargar los dentistas.");
      }
    );
  };

  const filteredDentists = dentists.filter(
    (dentist) =>
      `${dentist.first_name} ${dentist.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (dentist.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (dentist.license_number || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleCreateDentist = () => {
    setEditingDentist(null);
    setIsFormOpen(true);
  };

  const handleEditDentist = (dentist) => {
    console.log("Editando dentista:", dentist);

    if (!dentist.id) {
      errorToast("El dentista aún no está sincronizado. Actualizando lista...");
      loadDentists();
      return;
    }

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
        editingDentist.id,
        payload,
        token,
        (updated) => {
          const updatedDentist = {
            id: updated.id || updated.id_user || editingDentist.id,
            id_user: updated.id || updated.id_user || editingDentist.id,
            first_name: updated.firstName || updated.first_name,
            last_name: updated.lastName || updated.last_name,
            email: updated.email,
            license_number:
              updated.licenseNumber ||
              updated.license_number ||
              editingDentist.license_number,
            status:
              updated.isActive === undefined
                ? editingDentist.status
                : updated.isActive
                ? "active"
                : "inactive",
            created_at:
              updated.createdAt ||
              updated.created_at ||
              editingDentist.created_at,
          };

          setDentists((prev) =>
            prev.map((d) => (d.id === updatedDentist.id ? updatedDentist : d))
          );
          successToast("Dentista actualizado exitosamente");
          setIsFormOpen(false);
          setEditingDentist(null);
        },
        (err) => {
          errorToast(err?.message || "Error del servidor");
        }
      );
      return;
    }

    createDentist(
      payload,
      token,
      (response) => {
        const entity = response.entity || response;
        const id = entity.id;

        if (!id) {
          successToast("Dentista creado. Actualizando lista...");
          loadDentists();
          setIsFormOpen(false);
          return;
        }

        const newDentist = {
          id,
          id_user: id,
          first_name: entity.firstName || payload.firstName,
          last_name: entity.lastName || payload.lastName,
          email: entity.email || payload.email,
          license_number:
            entity.licenseNumber || payload.licenseNumber || "",
          status: entity.isActive ? "active" : "inactive",
          created_at: new Date().toISOString().split("T")[0],
        };

        setDentists((prev) => [...prev, newDentist]);
        successToast("Dentista creado exitosamente");
        setIsFormOpen(false);
      },
      (err) => {
        errorToast(err?.message || "Error del servidor");
      }
    );
  };

  const handleToggleStatus = (dentist) => {
    if (!dentist.id) {
      errorToast("ID del dentista no disponible. Actualizando lista...");
      loadDentists();
      return;
    }
    setDeleteConfirm(dentist);
  };

  const handleConfirmToggle = () => {
    if (!deleteConfirm?.id) {
      setDeleteConfirm(null);
      return;
    }

    const newStatusBool = deleteConfirm.status === "active" ? false : true;
    toggleDentistStatus(
      deleteConfirm.id,
      newStatusBool,
      token,
      (updatedDentist) => {
        const id = updatedDentist.id || updatedDentist.id_user || deleteConfirm.id;
        const status = updatedDentist.isActive
          ? "active"
          : "inactive";

        setDentists((prev) =>
          prev.map((d) => (d.id === id ? { ...d, status } : d))
        );
        successToast(
          `Dentista ${status === "active" ? "activado" : "desactivado"} exitosamente`
        );
        setDeleteConfirm(null);
      },
      (err) => {
        errorToast(err?.message || "Error al actualizar el estado del dentista");
        setDeleteConfirm(null);
      }
    );
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
        dentist={editingDentist}
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

