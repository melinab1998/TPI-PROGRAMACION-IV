import { useState, useEffect } from "react"
import Header from "@/components/SuperAdmin/Header/Header"
import SearchBar from "@/components/SuperAdmin/SearchBar/SearchBar"
import StatsCards from "@/components/SuperAdmin/StatsCards/StatsCards"
import DentistList from "@/components/SuperAdmin/DentistList/DentistList"
import DentistForm from "@/components/SuperAdmin/DentistForm/DentistForm"
import ConfirmDialog from "@/components/SuperAdmin/ConfirmDialog/ConfirmDialog"

const mockDentists = [
  {
    id_user: 1,
    first_name: "María",
    last_name: "López",
    email: "maria.lopez@clinica.com",
    license_number: "MN-12345",
    status: "active",
    created_at: "2024-01-15"
  },
  {
    id_user: 2,
    first_name: "Carlos",
    last_name: "Rodríguez",
    email: "carlos.rodriguez@clinica.com",
    license_number: "MN-67890",
    status: "active",
    created_at: "2024-02-10"
  },
  {
    id_user: 3,
    first_name: "Ana",
    last_name: "Martínez",
    email: "ana.martinez@clinica.com",
    license_number: "MN-54321",
    status: "inactive",
    created_at: "2024-01-20"
  },
  {
    id_user: 4,
    first_name: "Pedro",
    last_name: "Gómez",
    email: "pedro.gomez@clinica.com",
    license_number: "MN-98765",
    status: "active",
    created_at: "2024-03-05"
  },
  {
    id_user: 5,
    first_name: "Laura",
    last_name: "Fernández",
    email: "laura.fernandez@clinica.com",
    license_number: "MN-13579",
    status: "active",
    created_at: "2024-03-10"
  },
  {
    id_user: 6,
    first_name: "Diego",
    last_name: "Sánchez",
    email: "diego.sanchez@clinica.com",
    license_number: "MN-24680",
    status: "inactive",
    created_at: "2024-03-15"
  }
]

export default function SuperAdminPage() {
  const [dentists, setDentists] = useState(mockDentists)
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingDentist, setEditingDentist] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    license_number: ""
  })

  const filteredDentists = dentists.filter(dentist =>
    `${dentist.first_name} ${dentist.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dentist.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dentist.license_number.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const handleCreateDentist = () => {
    setEditingDentist(null)
    setFormData({ first_name: "", last_name: "", email: "", license_number: "" })
    setIsFormOpen(true)
  }

  const handleEditDentist = (dentist) => {
    setEditingDentist(dentist)
    setFormData({
      first_name: dentist.first_name,
      last_name: dentist.last_name,
      email: dentist.email,
      license_number: dentist.license_number
    })
    setIsFormOpen(true)
  }

  const handleSaveDentist = () => {
    if (editingDentist) {
      setDentists(prev => prev.map(dentist =>
        dentist.id_user === editingDentist.id_user
          ? { ...dentist, ...formData }
          : dentist
      ))
    } else {
      const newDentist = {
        id_user: Date.now(),
        ...formData,
        status: "active",
        created_at: new Date().toISOString().split('T')[0]
      }
      setDentists(prev => [...prev, newDentist])
    }
    setIsFormOpen(false)
    setEditingDentist(null)
  }

  const handleToggleStatus = (dentist) => {
    setDeleteConfirm(dentist)
  }

  const handleConfirmToggle = () => {
    if (deleteConfirm) {
      setDentists(prev => prev.map(dentist =>
        dentist.id_user === deleteConfirm.id_user
          ? { ...dentist, status: dentist.status === "active" ? "inactive" : "active" }
          : dentist
      ))
      setDeleteConfirm(null)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const activeDentists = dentists.filter(dentist => dentist.status === "active").length
  const totalDentists = dentists.length

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-6 py-4 space-y-4">

      <Header onCreate={handleCreateDentist} />


      <StatsCards
        total={totalDentists}
        active={activeDentists}
        className="text-sm p-4 gap-3"
      />


      <SearchBar
        searchTerm={searchTerm}
        onChange={setSearchTerm}
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
  )
}