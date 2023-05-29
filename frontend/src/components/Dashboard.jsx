import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import SearchBar from "./SearchBar";
import TableLoader from "./TableLoader";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "850px",
    background: "transparent",
    border: "none",
  },
};

const customStylesPop = {
  content: {
    top: "10",
    right: "10",
    left: "auto",
    bottom: "auto",
    width: "600px",
    background: "transparent",
    border: "none",
  },
};

const getAuthToken = () => {
  return localStorage.getItem("token");
};

Modal.setAppElement("#root");

const Dashboard = () => {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]); // nuevo estado para miembros filtrados
  const [editingMember, setEditingMember] = useState(null);
  const [editingMemberModalOpen, setEditingMemberModalOpen] = useState(false);
  const [deletingMember, setDeletingMember] = useState(null);
  const [invalidDates, setInvalidDates] = useState(false); // nuevo estado para validar fechas
  const [success, setSuccess] = useState(false);
  const [successEdit, setSuccessEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);
  const [addingMember, setAddingMember] = useState(false);
  const [invalidFileType, setInvalidFileType] = useState(false);
  const [showErrorFieldsModal, setShowErrorFieldsModal] = useState(false);
  const [newMember, setNewMember] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    birth_date: "",
    registration_date: "",
    active: "1",
    image_path: ""
  });

  const API_URL = "https://api.gimnasio.neatly.es/api";
  const PIC_URL = "https://api.gimnasio.neatly.es"

  const fetchMembers = async () => {
    try {
      const authToken = getAuthToken();
      const response = await axios.get(`${API_URL}/members`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setMembers(response.data);
      console.log(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  // Función para editar miembros
  const updateMember = async (member) => {
    try {
      const authToken = getAuthToken();
      const response = await axios.put(`${API_URL}/members/${member.id}`, {
        first_name: member.first_name,
        last_name: member.last_name,
        email: member.email,
        phone: member.phone,
        birth_date: member.birth_date,
        registration_date: member.registration_date,
        active: member.active,
        image_path: member.image_path
      }, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });
  
      return response.data;
    } catch (error) {
      console.error("Error updating member:", error);
      throw error;
    }
  };

  // Funcion para subir foto
  const uploadMemberPicture = async (memberId, image) => {
    try {
      const authToken = getAuthToken();
      const formData = new FormData();
      formData.append('image_path', image);
  
      const response = await axios.post(`${API_URL}/members/${memberId}/upload`, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });
  
      return response.data;
    } catch (error) {
      console.error("Error uploading member picture:", error);
      throw error;
    }
  };
  
  // Encargado de guardar los cambios realizados al miembro y cerrar el modal
  const handleSaveEditedMember = async (e) => {
    e.preventDefault();
  
    // Validación de campos de fecha
    if (!editingMember.birth_date || !editingMember.registration_date) {
      setInvalidDates(true);
      return;
    }

    // Verificar que todos los campos estén completos
    if (!editingMember.first_name || !editingMember.last_name || !editingMember.email || !editingMember.phone || !editingMember.birth_date || !editingMember.registration_date) {
      setShowErrorFieldsModal(true);
      return;
    }
  
    try {
      await updateMember(editingMember);
      if (editingMember.image) {
        await uploadMemberPicture(editingMember.id, editingMember.image);
      }
      setEditingMemberModalOpen(false);
      setSuccessEdit(true);
      URL.revokeObjectURL(previewImage);
      setPreviewImage(null);
      fetchMembers(); // Recargar la lista de miembros después de editar uno
    } catch (err) {
      console.log(err);
    }
  };
  

  // Función para eliminar miembros
  const deleteMember = async (memberId) => {
    try {
      const authToken = getAuthToken();
      await axios.delete(`${API_URL}/members/${memberId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
    } catch (error) {
      console.error("Error deleting member:", error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleUpdateMember = (member) => {
    if(member.image_path === "uploads/pictures/default.png" || member.image_path === "null") {
      setPreviewImage(null)
    } else {
      setPreviewImage(`${PIC_URL}/${member.image_path}`);
    }
    setEditingMember(member);
    setEditingMemberModalOpen(true);
  };
  

  // También, crea una función para manejar el cierre del modal de edición
  const handleCancelEditMember = () => {
    setEditingMemberModalOpen(false);
    URL.revokeObjectURL(previewImage);
    setPreviewImage(null);
  };

  // Funciones para manejar la confirmación de borrado
  const handleDeleteButtonClick = (member) => {
    setDeletingMember(member);
  };

  const handleConfirmDelete = async () => {
    await deleteMember(deletingMember.id);
    setDeletingMember(null);
    fetchMembers(); // Recargar la lista de miembros después de eliminar uno
  };

  const handleCancelDelete = () => {
    setDeletingMember(null);
  };

  // Funciones para añadir miembros
  const handleAddButtonClick = () => {
    setAddingMember(true);
  };
  
  const handleSaveNewMember = async (e) => {
    e.preventDefault();
  
    const authToken = getAuthToken();
  
    // Validación de campos de fecha
    if (!newMember.birth_date || !newMember.registration_date) {
      setInvalidDates(true);
      return;
    }

    // Verificar que todos los campos estén completos
    if (!newMember.first_name || !newMember.last_name || !newMember.email || !newMember.phone || !newMember.birth_date || !newMember.registration_date) {
      setShowErrorFieldsModal(true);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('first_name', newMember.first_name);
      formData.append('last_name', newMember.last_name);
      formData.append('email', newMember.email);
      formData.append('phone', newMember.phone);
      formData.append('birth_date', newMember.birth_date);
      formData.append('registration_date', newMember.registration_date);
      formData.append('active', newMember.active);
  
      // Si no hay imagen seleccionada, se utiliza una imagen por defecto
      if (!newMember.image) {
        formData.append('image_path', 'uploads/pictures/default.png');
      } else {
        formData.append('image_path', newMember.image);
      }
  
      const response = await axios.post(`${API_URL}/members`, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'multipart/form-data'
        },
      });
  
      if (response.status === 200) {
        setSuccess(true);
        setAddingMember(false);
        URL.revokeObjectURL(previewImage);
        setPreviewImage(null);
        fetchMembers(); // Recargar la lista de miembros después de añadir uno
      }
    } catch (err) {
      console.log(err);
    }
  };
  
  const handleCancelAddMember = () => {
    URL.revokeObjectURL(previewImage);
    setPreviewImage(null);
    setAddingMember(false);
  };

  // Funciones para filtrar miembros
  function handleSearchResults(data) {
    setFilteredMembers(data);
    console.log(data);
  }

  // Funciones para validar fechas
  const handleCancelInvalidDates = () => {
    setInvalidDates(false);
  };

  // Funciones para mostrar mensaje de éxito
  const handleCancelSuccess = () => {
    setSuccess(false);
  };

  // Funciones para mostrar mensaje de éxito al editar
  const handleCancelSuccessEdit = () => {
    setSuccessEdit(false);
  };

  // Funcion para mostrar mensaje de error tipo archivo
  const handleCloseInvalidFileType = () => {
    setInvalidFileType(false);
  };


  return (
    <div className="main">
      <div className="lg:px-4 px-2 md:w-[95%] mx-2 md:mx-auto dark:bg-gray-800">
        <div className="flex flex-col mt-8">
          <div className="md:pb-2 pb-5 md:flex justify-between items-center">
              <h1 className="font-bold text-gray-800 text-[28px] md:text-3xl dark:text-white">
                Listado de miembros
              </h1>
              <SearchBar onSearch={handleSearchResults} />
          </div>
            <button
                className="px-4 py-2 w-full md:w-[210px] block text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                onClick={handleAddButtonClick}
              >
                Añadir miembro
            </button>
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                {/* Si se han encontrado miembros mostrar los miembros filtrados, si no, mostrar toda la lista 
                de miembros */}
                {filteredMembers.length > 0 ? (
                  <div>
                    <h2 className="font-bold text-2xl mt-10 dark:text-white text-gray-700 mb-5">Miembros encontrados</h2>
                    <div className="shadow overflow-hidden border-gray-200 rounded-lg mb-6">
                      <table className="min-w-full divide-y  divide-gray-200 dark:divide-gray-500">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                          >
                            Foto
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                          >
                            Nombre
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                          >
                            Email
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                          >
                            Teléfono
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                          >
                            Fecha Registro
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                          >
                            ¿Miembro?
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                          >
                            Acciones
                          </th>
                        </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-500 dark:bg-gray-900/40">
                          {filteredMembers.map((member) => (
                            <tr key={member.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <img
                                  src={`${PIC_URL}/${member.image_path || 'uploads/pictures/default.png'}`}
                                  alt="Imagen de perfil"
                                  className="w-12 h-12 rounded-full"
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="">
                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
                                      {member.first_name}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                      {member.last_name}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 dark:text-gray-200">
                                  {member.email}
                                </div>
                                <div className="text-sm text-gray-400">
                                  {member.email}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-center whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  {member.phone}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  {member.registration_date &&
                                    member.registration_date.indexOf("T") !== -1
                                    ? member.registration_date.substring(
                                      0,
                                      member.registration_date.indexOf("T")
                                    )
                                    : "N/A"}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                {/* Si el miembro está activo mostrar Sí con verde y si no está activo No con rojo */}
                                {member.active === 1 ? (
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    Sí
                                  </span>
                                ) : (
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                    No
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                <button
                                  className="text-indigo-600 dark:text-indigo-300 hover:text-indigo-900 mr-3"
                                  onClick={() => handleUpdateMember(member)}
                                >
                                  Editar
                                </button>
                                <button
                                  className="text-red-500 hover:text-red-800"
                                  onClick={() => handleDeleteButtonClick(member)}
                                >
                                  Borrar
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="shadow overflow-hidden border-gray-200 rounded-lg mt-8 mb-6">
                    { isLoading ? (
                      <TableLoader />
                    ) : (
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-500">
                      <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                          >
                            Foto
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                          >
                            Nombre
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                          >
                            Email
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                          >
                            Teléfono
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                          >
                            Fecha Registro
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                          >
                            ¿Miembro?
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                          >
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-500 dark:bg-gray-900/40">
                        {members.map((member) => (
                          <tr key={member.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                            <img
                              src={`${PIC_URL}/${member.image_path || 'uploads/pictures/default.png'}`}
                              alt="Imagen de perfil"
                              className="w-12 h-12 border-2 rounded-full"
                            />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="">
                                  <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
                                    {member.first_name}
                                  </div>
                                  <div className="text-sm text-gray-400">
                                    {member.last_name}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-gray-200">
                                {member.email}
                              </div>
                              <div className="text-sm text-gray-400">
                                {member.email}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                {member.phone}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                {member.registration_date &&
                                member.registration_date.indexOf("T") !== -1
                                  ? member.registration_date.substring(
                                      0,
                                      member.registration_date.indexOf("T")
                                    )
                                  : "N/A"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                              {/* Si el miembro está activo mostrar Sí con verde y si no está activo No con rojo */}
                              {member.active === 1 ? (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  Sí
                                </span>
                              ) : (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                  No
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                              <button
                                className="text-indigo-600 dark:text-indigo-300 hover:text-indigo-900 mr-3"
                                onClick={() => handleUpdateMember(member)}
                              >
                                Editar
                              </button>
                              <button
                                className="text-red-500 hover:text-red-800"
                                onClick={() => handleDeleteButtonClick(member)}
                              >
                                Borrar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    )}
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal añadir usuario */}
      <Modal
        isOpen={addingMember}
        onRequestClose={handleCancelAddMember}
        style={customStyles}
        overlayClassName="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50"
        contentLabel="Añadir miembro"
      >
        <div className="md:max-w-6xl md:overflow-hidden overflow-scroll md:h-auto pt-8 h-[590px] max-w-[350px] p-6 mx-auto bg-white dark:bg-gray-800/30 backdrop-blur-2xl dark:text-white rounded-md shadow-md">
          <h2 className="text-2xl font-bold text-gray-700 dark:text-white capitalize">
            Añadir miembro
          </h2>
          <form onSubmit={handleSaveNewMember}>
            <div className="md:flex mt-4 gap-x-6">
              <div className="md:w-1/3">
                  <label className="text-gray-700 dark:text-white dark:border-gray-400" htmlFor="image">
                    Imagen
                  </label>
                  { previewImage === null ? (
                    <div class="flex items-center justify-center w-full mt-2">
                        <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-[248px] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                            <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg aria-hidden="true" class="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400 text-center"><span class="font-semibold">Click para subir</span>  o arrastra<br /> y suelta</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400 text-center">PNG, JPG or GIF <br /> (MAX. 800x400px)</p>
                            </div>
                            <input
                              id="dropzone-file"
                              className="hidden"
                              type="file"
                              name="image"
                              onChange={(e) => {
                                // Comprueba si el archivo es de un tipo permitido
                                const file = e.target.files[0];
                                if (file && (file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg')) {
                                  // Si es así, actualiza el estado y genera una vista previa
                                  setNewMember({ ...newMember, image: file });
                                  setPreviewImage(URL.createObjectURL(file));
                                  setInvalidFileType(false);
                                } else {
                                  // Si no es así, muestra un error
                                  setInvalidFileType(true);
                                }
                              }}
                            />
                        </label>
                    </div>
                  ) : (
                    <div>
                      <img
                        src={previewImage}
                        alt="Imagen de vista previa"
                        className="flex mt-2 flex-col items-center justify-center w-full h-[248px] border-2 border-gray-300 rounded-lg dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                      />
                      <label for="dropzone-file" class="flex mt-6 flex-col items-center justify-center w-full h-[60px] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                          <div className="flex items-center justify-center gap-2 pt-5 pb-4">
                              <svg aria-hidden="true" className="w-8 h-8 mb-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">PNG, JPG or GIF <br /> (MAX. 800x400px)</p>
                          </div>
                          <input
                            id="dropzone-file"
                              className="hidden"
                              type="file"
                              name="image"
                              onChange={(e) => {
                                // Comprueba si el archivo es de un tipo permitido
                                const file = e.target.files[0];
                                if (file && (file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg')) {
                                  // Si es así, actualiza el estado y genera una vista previa
                                  setNewMember({ ...newMember, image: file });
                                  setPreviewImage(URL.createObjectURL(file));
                                  setInvalidFileType(false);
                                } else {
                                  // Si no es así, muestra un error
                                  setInvalidFileType(true);
                                }
                              }}
                          />
                      </label>
                    </div>
                  )}
              </div>

              <div className="md:w-2/3 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="text-gray-700 dark:text-white dark:border-gray-400" htmlFor="first_name">
                    Nombre
                  </label>
                  <input
                    className="block w-full px-4 py-2 mt-2 dark:bg-gray-700 text-gray-700 dark:text-white dark:border-gray-400 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                    type="text"
                    name="first_name"
                    value={newMember.first_name}
                    onChange={(e) =>
                      setNewMember({ ...newMember, first_name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-gray-700 dark:text-white dark:border-gray-400" htmlFor="last_name">
                    Apellidos
                  </label>
                  <input
                    className="block w-full px-4 py-2 mt-2 dark:bg-gray-600 text-gray-700 dark:text-white dark:border-gray-400 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                    type="text"
                    name="last_name"
                    value={newMember.last_name}
                    onChange={(e) =>
                      setNewMember({ ...newMember, last_name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-gray-700 dark:text-white dark:border-gray-400" htmlFor="email">
                    Email
                  </label>
                  <input
                    className="block w-full px-4 py-2 mt-2 dark:bg-gray-600 text-gray-700 dark:text-white dark:border-gray-400 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                    type="email"
                    name="email"
                    value={newMember.email}
                    onChange={(e) =>
                      setNewMember({ ...newMember, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-gray-700 dark:text-white dark:border-gray-400" htmlFor="phone">
                    Teléfono
                  </label>
                  <input
                    className="block w-full px-4 py-2 mt-2 dark:bg-gray-600 text-gray-700 dark:text-white dark:border-gray-400 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                    type="text"
                    name="phone"
                    value={newMember.phone}
                    onChange={(e) =>
                      setNewMember({ ...newMember, phone: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-gray-700 dark:text-white dark:border-gray-400" htmlFor="registration_date">
                    Fecha de registro
                  </label>
                  <input
                    className="block w-full px-4 py-2 mt-2 dark:bg-gray-600 text-gray-700 dark:text-white dark:border-gray-400 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                    type="date"
                    name="registration_date"
                    value={newMember.registration_date}
                    onChange={(e) =>
                      setNewMember({
                        ...newMember,
                        registration_date: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-gray-700 dark:text-white dark:border-gray-400" htmlFor="birth_date">
                    Fecha de nacimiento
                  </label>
                  <input
                    className="block w-full px-4 py-2 mt-2 dark:bg-gray-600 text-gray-700 dark:text-white dark:border-gray-400 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                    type="date"
                    name="birth_date"
                    value={newMember.birth_date}
                    onChange={(e) =>
                      setNewMember({ ...newMember, birth_date: e.target.value })
                    }
                  />
                </div>

                <div className="w-full">
                  <label className="text-gray-700 dark:text-white dark:border-gray-400" htmlFor="is_active">
                    ¿Está el miembro activo?
                  </label>
                  <select
                    className=" inline-block w-full px-4 py-2 mt-2 dark:bg-gray-600 text-gray-700 dark:text-white dark:border-gray-400 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                    name="active"
                    value={newMember.active}
                    onChange={(e) =>
                      setNewMember({ ...newMember, active: e.target.value })
                    }
                  >
                    <option value="1">Sí</option>
                    <option value="0">No</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="flex justify-end mt-8 gap-3">
              <button
                type="submit"
                class="px-6 py-2 text-center text-gray-100 items-center inline-flex text-base leading-5 font-semibold rounded-lg bg-gray-700 hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
              >
                Guardar
              </button>
              <button
                className="px-6 py-2 text-center items-center inline-flex text-base leading-5 font-semibold rounded-lg bg-red-100 text-red-800"
                onClick={handleCancelAddMember}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Modal editar miembro */}
      <Modal
        isOpen={editingMemberModalOpen}
        onRequestClose={handleCancelEditMember}
        style={customStyles}
        overlayClassName="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50"
        contentLabel="Editar miembro"
      >
        {editingMember && (
          <div className="md:max-w-4xl md:overflow-hidden overflow-scroll md:h-auto pt-8 h-[590px] max-w-[350px] p-6 mx-auto bg-white dark:bg-gray-800/30 backdrop-blur-2xl dark:text-white rounded-md shadow-md">
            <h2 className="text-2xl font-bold text-gray-700 dark:text-white capitalize">
              Editar miembro
            </h2>
            <form onSubmit={handleSaveEditedMember}>
              <div className="md:flex mt-4 gap-x-6">
                <div className="md:w-1/3">
                  <label className="text-gray-700 dark:text-white dark:border-gray-400" htmlFor="image">
                    Imagen
                  </label>
                  { previewImage === null ? (
                    <div class="flex items-center justify-center w-full mt-2">
                        <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-[248px] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                            <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg aria-hidden="true" class="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400 text-center"><span class="font-semibold">Click para subir</span>  o arrastra<br /> y suelta</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400 text-center">PNG, JPG or GIF <br /> (MAX. 800x400px)</p>
                            </div>
                            <input
                              id="dropzone-file"
                              className="hidden"
                              type="file"
                              name="image"
                              onChange={(e) => {
                                // Comprueba si el archivo es de un tipo permitido
                                const file = e.target.files[0];
                                if (file && (file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg')) {
                                  // Si es así, actualiza el estado y genera una vista previa
                                  setEditingMember({ ...editingMember, image: file });
                                  setPreviewImage(URL.createObjectURL(file));
                                  setInvalidFileType(false);
                                } else {
                                  // Si no es así, muestra un error
                                  setInvalidFileType(true);
                                }
                              }}
                            />
                        </label>
                    </div>
                  ) : (
                    <div>
                      <img
                        src={previewImage}
                        alt="Imagen de vista previa"
                        className="flex mt-2 flex-col items-center justify-center w-full h-[248px] border-2 border-gray-300 rounded-lg dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                      />
                      <label for="dropzone-file" class="flex mt-6 flex-col items-center justify-center w-full h-[60px] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                          <div className="flex items-center justify-center gap-2 pt-5 pb-4">
                              <svg aria-hidden="true" className="w-8 h-8 mb-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">PNG, JPG or GIF <br /> (MAX. 800x400px)</p>
                          </div>
                          <input
                            id="dropzone-file"
                              className="hidden"
                              type="file"
                              name="image"
                              onChange={(e) => {
                                // Comprueba si el archivo es de un tipo permitido
                                const file = e.target.files[0];
                                if (file && (file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg')) {
                                  // Si es así, actualiza el estado y genera una vista previa
                                  setEditingMember({ ...editingMember, image: file });
                                  setPreviewImage(URL.createObjectURL(file));
                                  setInvalidFileType(false);
                                } else {
                                  // Si no es así, muestra un error
                                  setInvalidFileType(true);
                                }
                              }}
                          />
                      </label>
                    </div>
                  )}
                </div>

                <div className="md:w-2/3 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="text-gray-700 dark:text-white" htmlFor="first_name">
                      Nombre
                    </label>
                    <input
                    className="block w-full px-4 py-2 mt-2 dark:bg-gray-600 text-gray-700 dark:text-white dark:border-gray-400 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                    type="text"
                      name="first_name"
                      value={editingMember.first_name}
                      onChange={(e) =>
                        setEditingMember({
                          ...editingMember,
                          first_name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="dark:text-white text-gray-700" htmlFor="last_name">
                      Apellidos
                    </label>
                    <input
                      className="block w-full px-4 py-2 mt-2 dark:bg-gray-600 text-gray-700 dark:text-white dark:border-gray-400 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                      type="text"
                      name="last_name"
                      value={editingMember.last_name}
                      onChange={(e) =>
                        setEditingMember({
                          ...editingMember,
                          last_name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="dark:text-white text-gray-700" htmlFor="email">
                      Email
                    </label>
                    <input
                      className="block w-full px-4 py-2 mt-2 dark:bg-gray-600 text-gray-700 dark:text-white dark:border-gray-400 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                      type="email"
                      name="email"
                      value={editingMember.email}
                      onChange={(e) =>
                        setEditingMember({
                          ...editingMember,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="dark:text-white text-gray-700" htmlFor="phone">
                      Teléfono
                    </label>
                    <input
                      className="block w-full px-4 py-2 mt-2 dark:bg-gray-600 text-gray-700 dark:text-white dark:border-gray-400 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                      type="text"
                      name="phone"
                      value={editingMember.phone}
                      onChange={(e) =>
                        setEditingMember({
                          ...editingMember,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="dark:text-white text-gray-700" htmlFor="registration_date">
                      Fecha de registro
                    </label>
                    <input
                      className="block w-full px-4 py-2 mt-2 dark:bg-gray-600 text-gray-700 dark:text-white dark:border-gray-400 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                      type="date"
                      name="registration_date"
                      value={editingMember.registration_date}
                      onChange={(e) =>
                        setEditingMember({
                          ...editingMember,
                          registration_date: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="dark:text-white text-gray-700" htmlFor="birth_date">
                      Fecha de nacimiento
                    </label>
                    <input
                      className="block w-full px-4 py-2 mt-2 dark:bg-gray-600 text-gray-700 dark:text-white dark:border-gray-400 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                      type="date"
                      name="birth_date"
                      value={editingMember.birth_date}
                      onChange={(e) =>
                        setEditingMember({
                          ...editingMember,
                          birth_date: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="dark:text-white text-gray-700" htmlFor="active">¿Está el usuario activo?</label>
                    <select
                      className="block w-full px-4 py-2 mt-2 dark:bg-gray-600 text-gray-700 dark:text-white dark:border-gray-400 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                      name="active"
                      value={editingMember.active}
                      onChange={(e) =>
                        setEditingMember({
                          ...editingMember,
                          active: e.target.value,
                        })
                      }
                    >
                      <option value="1">Sí</option>
                      <option value="0">No</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-8 gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 text-center text-gray-100 items-center inline-flex text-base leading-5 font-semibold rounded-lg bg-gray-700 hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
                >
                  Guardar
                </button>
                <button
                  className="px-6 py-2 text-center items-center inline-flex text-base leading-5 font-semibold rounded-lg bg-red-100 text-red-800"
                  type="button"
                  onClick={handleCancelEditMember}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}
      </Modal>

      {/* Modal de confirmación de borrado */}
      <Modal
        isOpen={deletingMember !== null}
        onRequestClose={handleCancelDelete}
        style={customStyles}
        overlayClassName="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50"
        contentLabel="Confirmar borrado"
      >
        <div className="bg-white w-[450px] md:max-w-2xl max-w-[340px] mx-auto dark:bg-gray-800/30 backdrop-blur-2xl dark:text-white p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl mb-4 text-gray-700 dark:text-white font-bold">
            Confirmar borrado
          </h2>
          <p>
            ¿Estás seguro de que quieres borrar a {deletingMember?.first_name}{" "}
            {deletingMember?.last_name}?
          </p>
          <div className="flex items-center pt-4 gap-3">
            <button
              className="px-6 py-2 inline-flex text-base leading-5 font-semibold rounded-lg bg-red-100 text-red-800"
              onClick={handleConfirmDelete}
            >
              Sí, borrar
            </button>
            <button
              className="px-6 py-2 inline-flex text-base leading-5 font-semibold rounded-lg bg-gray-100 text-gray-800"
              onClick={handleCancelDelete}
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal de error de fechas invalidas al crear o editar usuario */}
      <Modal
        isOpen={invalidDates}
        onRequestClose={handleCancelInvalidDates}
        className="popup"
        overlayClassName="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50"
        contentLabel="Error de fechas"
      >
        <div className="bg-red-400/20 w-[350px] md:w-96 dark:bg-red-400/20 backdrop-blur-2xl text-white p-6 rounded-2xl shadow-md">
          <h2 className="text-lg mb-2 text-white font-semibold">
            Error de fechas
          </h2>
          <p className=" text-sm">
            Por favor, introduce las fechas correctamente. No se pueden dejar vacias.
          </p>
          <div className="flex items-center pt-4 gap-3">
            <button
              className="px-6 py-2 inline-flex text-sm leading-5 font-bold rounded-lg bg-gray-100 text-gray-800"
              onClick={handleCancelInvalidDates}
            >
              Aceptar
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal de que salio correctamente al crear usuario */}
      <Modal
        isOpen={success}
        onRequestClose={handleCancelSuccess}
        className="popup"
        overlayClassName="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50"
        contentLabel="Exito"
      >
        <div className="bg-green-400/20 w-[350px] md:w-96 dark:bg-green-400/20 backdrop-blur-2xl text-white p-6 rounded-2xl shadow-md">
          <h2 className="text-lg mb-2 text-white font-semibold">
            Exito
          </h2>
          <p className=" text-sm">
            El miembro ha sido añadido correctamente. Se ha realizado la operación correctamente.
          </p>
          <div className="flex items-center pt-4 gap-3">
            <button
              className="px-6 py-2 inline-flex text-sm leading-5 font-bold rounded-lg bg-gray-100 text-gray-800"
              onClick={handleCancelSuccess}
            >
              Aceptar
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal de que salio correctamente al editar usuario */}
      <Modal
        isOpen={successEdit}
        onRequestClose={handleCancelSuccessEdit}
        className="popup"
        overlayClassName="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50"
        contentLabel="Exito"
      >
        <div className="bg-green-500/20 w-[350px] md:w-96 z-20 dark:bg-green-400/20 backdrop-blur-2xl text-white p-6 rounded-2xl shadow-md">
          <h2 className="text-lg mb-2 dark:text-white font-semibold">
            Exito
          </h2>
          <p className=" text-sm">
            El miembro ha sido editado correctamente. Se ha realizado la operación correctamente.
          </p>
          <div className="flex items-center pt-4 gap-3">
            <button
              className="px-6 py-2 inline-flex text-sm leading-5 font-bold rounded-lg bg-gray-100 text-gray-800"
              onClick={handleCancelSuccessEdit}
            >
              Aceptar
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal de error de tipo de archivo inválido al crear o editar usuario */}
      <Modal
        isOpen={invalidFileType}
        onRequestClose={handleCloseInvalidFileType}
        className="popup"
        overlayClassName="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50"
        contentLabel="Error de tipo de archivo"
      >
        <div className="bg-red-400/20 w-[350px] md:w-96 dark:bg-red-400/20 backdrop-blur-2xl text-white p-6 rounded-2xl shadow-md">
          <h2 className="text-lg mb-2 text-white font-semibold">
            Error de tipo de archivo
          </h2>
          <p className=" text-sm">
            Por favor, sube un archivo de tipo .jpg, .jpeg o .png.
          </p>
          <div className="flex items-center pt-4 gap-3">
            <button
              className="px-6 py-2 inline-flex text-sm leading-5 font-bold rounded-lg bg-gray-100 text-gray-800"
              onClick={handleCloseInvalidFileType}
            >
              Aceptar
            </button>
          </div>
        </div>
      </Modal>
      
      {/* Modal de error de campos vacíos al crear o editar usuario */}
      <Modal
        isOpen={showErrorFieldsModal}
        onRequestClose={() => setShowErrorFieldsModal(false)}
        className="popup"
        overlayClassName="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50"
        contentLabel="Error de campos vacíos"
      >
        <div className="bg-red-400/20 w-[350px] md:w-96 dark:bg-red-400/20 backdrop-blur-2xl text-white p-6 rounded-2xl shadow-md">
          <h2 className="text-lg mb-2 text-white font-semibold">
            Error de campos vacíos
          </h2>
          <p className=" text-sm">
            Por favor, asegúrate de llenar todos los campos.
          </p>
          <div className="flex items-center pt-4 gap-3">
            <button
              className="px-6 py-2 inline-flex text-sm leading-5 font-bold rounded-lg bg-gray-100 text-gray-800"
              onClick={() => setShowErrorFieldsModal(false)}
            >
              Aceptar
            </button>
          </div>
        </div>
      </Modal>


    </div>
  );
};

export default Dashboard;
