<<<<<<< HEAD
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";
import UserSkeleton from "./UserSkeleton";

Modal.setAppElement("#root");

=======
import axios from "axios";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import UserSkeleton from "./UserLoader";

// Configuramos react-modal para señalar el elemento raíz de nuestra aplicación
Modal.setAppElement("#root");

// Función para obtener un token de autenticación del almacenamiento local
>>>>>>> a420465 (Comentando código)
const getAuthToken = () => {
  return localStorage.getItem("token");
};

const SideBar = () => {
<<<<<<< HEAD
=======

  // Definimos el estado para los modales y el usuario
>>>>>>> a420465 (Comentando código)
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState("system");

<<<<<<< HEAD
  // Cambiar tema de la app
=======
  // useEffect para cambiar el tema de la app en base al estado theme
>>>>>>> a420465 (Comentando código)
  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [theme]);

<<<<<<< HEAD
=======
  // Manejador de evento para cambiar el tema cuando el usuario selecciona una opción diferente
>>>>>>> a420465 (Comentando código)
  const handleThemeChange = (event) => {
    setTheme(event.target.value);
  };

  const API_URL = "https://api.gimnasio.neatly.es/api";

<<<<<<< HEAD
=======
  // Función para obtener información de usuario desde la API
>>>>>>> a420465 (Comentando código)
  const fetchUser = async () => {
    try {
      const authToken = getAuthToken();
      const response = await axios.get(`${API_URL}/admin`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
<<<<<<< HEAD
=======

      // Establecer los datos del usuario en el estado y detener el loading
>>>>>>> a420465 (Comentando código)
      setUser(response.data[0]);
      console.log(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

<<<<<<< HEAD
=======
  // useEffect para obtener la información del usuario cuando el componente se monta
>>>>>>> a420465 (Comentando código)
  useEffect(() => {
    fetchUser();
  }, []);

<<<<<<< HEAD
=======
  // Manejador de evento para realizar el logout del usuario
>>>>>>> a420465 (Comentando código)
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

<<<<<<< HEAD
=======
  // Funciones para abrir y cerrar el modal
>>>>>>> a420465 (Comentando código)
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

<<<<<<< HEAD
  // Cambiar el tema
=======
  // Funciones para abrir y cerrar el modal de configuración
>>>>>>> a420465 (Comentando código)
  const openSettingsModal = () => {
    setIsSettingsModalOpen(true);
  };

  const closeSettingsModal = () => {
    setIsSettingsModalOpen(false);
  };

  return (
    <>
      <aside className="hidden md:flex sidebar flex-col px-4 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700">
        <a href="#">
          <img
            className="w-auto m-auto mb-3 h-6 sm:h-7"
            src="https://merakiui.com/images/logo.svg"
            alt=""
          />
        </a>

        <div className="flex flex-col justify-between flex-1 mt-6">
          <nav>
            <a
              className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-md dark:bg-gray-800 dark:text-gray-200"
              href="/dashboard"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span className="mx-4 font-medium">Dashboard</span>
            </a>

            <a
              className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
              href="#"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span className="mx-4 font-medium">Cuentas</span>
            </a>

            <a
              className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
              href="#"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 5V7M15 11V13M15 17V19M5 5C3.89543 5 3 5.89543 3 7V10C4.10457 10 5 10.8954 5 12C5 13.1046 4.10457 14 3 14V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V14C19.8954 14 19 13.1046 19 12C19 10.8954 19.8954 10 21 10V7C21 5.89543 20.1046 5 19 5H5Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span className="mx-4 font-medium">Tickets</span>
            </a>

            <hr className="my-6 border-gray-200 dark:border-gray-600" />

            <button
              onClick={openModal}
              className="flex w-full items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
            >
              {/* Salir */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                />
              </svg>
              <span className="mx-4 font-medium">Cerrar sesión</span>
            </button>

            <button
              onClick={openSettingsModal}
              className="flex w-full items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.3246 4.31731C10.751 2.5609 13.249 2.5609 13.6754 4.31731C13.9508 5.45193 15.2507 5.99038 16.2478 5.38285C17.7913 4.44239 19.5576 6.2087 18.6172 7.75218C18.0096 8.74925 18.5481 10.0492 19.6827 10.3246C21.4391 10.751 21.4391 13.249 19.6827 13.6754C18.5481 13.9508 18.0096 15.2507 18.6172 16.2478C19.5576 17.7913 17.7913 19.5576 16.2478 18.6172C15.2507 18.0096 13.9508 18.5481 13.6754 19.6827C13.249 21.4391 10.751 21.4391 10.3246 19.6827C10.0492 18.5481 8.74926 18.0096 7.75219 18.6172C6.2087 19.5576 4.44239 17.7913 5.38285 16.2478C5.99038 15.2507 5.45193 13.9508 4.31731 13.6754C2.5609 13.249 2.5609 10.751 4.31731 10.3246C5.45193 10.0492 5.99037 8.74926 5.38285 7.75218C4.44239 6.2087 6.2087 4.44239 7.75219 5.38285C8.74926 5.99037 10.0492 5.45193 10.3246 4.31731Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span className="mx-4 font-medium">Ajustes</span>
            </button>
          </nav>

          {isLoading ? (
            <UserSkeleton />
          ) : (
            <a href="#" className="flex items-center px-4 -mx-2">
              <img
                className="object-cover mx-2 rounded-full h-9 w-9"
                src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
                alt="avatar"
              />
              <div className="flex-col">
                <span className="mx-2 font-medium text-gray-800 dark:text-gray-200">
                  {user.username}
                </span>{" "}
                <br />
                <span className="mx-2 font-normal text-sm text-gray-500 dark:text-gray-300 group-hover:text-gray-200 transition duration-500 ease-in-out">
                  {user.email}
                </span>
              </div>
            </a>
          )}
        </div>

        {/* Modal confirmacion cerrar sesion */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Cerrar sesión"
          className="md:max-w-md max-w-xs p-8 mx-auto mt-10 bg-white dark:bg-gray-800/30 backdrop-blur-2xl dark:text-white rounded-md shadow-md"
          overlayClassName="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div>
            <h2 className="text-2xl font-bold text-gray-700 dark:text-white">
              ¿Estás seguro de que quieres cerrar sesión?
            </h2>
            <div className=" flex-col mt-6 gap-3">
              <button
                onClick={handleLogout}
                className="px-6 py-2 text-center w-full text-gray-100 inline-flex items-center text-base leading-5 font-semibold rounded-lg bg-red-600 hover:bg-red-500 focus:outline-none focus:bg-red-500"
              >
                Sí, cerrar sesión
              </button>
              <button
                onClick={closeModal}
                className="px-6 py-2 text-center w-full mt-2 text-gray-700 inline-flex items-center text-base leading-5 font-semibold rounded-lg bg-gray-200 hover:bg-gray-300 focus:outline-none focus:bg-gray-300"
              >
                Cancelar
              </button>
            </div>
          </div>
        </Modal>

        {/* Modal ajustes */}
        <Modal
          isOpen={isSettingsModalOpen}
          onRequestClose={closeSettingsModal}
          contentLabel="Ajustes"
          className="max-w-xs w-[350px] p-6 mx-auto mt-10 bg-white dark:bg-gray-800/30 backdrop-blur-2xl dark:text-white rounded-md shadow-md"
          overlayClassName="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div>
            <h2 className="text-2xl font-bold text-gray-700 dark:text-white">
              Ajustes
            </h2>
            <div className="mt-6">
              {/* Selector de lista para elegir tema claro o oscuro*/}
              <div class="pb-4">
                <div class="flex items-center justify-between">
                  <p className="text-lg">Tema</p>
                  <select
                    class="rounded border py-1 px-2 border-black/10 bg-transparent text-sm dark:border-white/20 dark:text-white"
                    onChange={handleThemeChange}
                  >
                    <option className="dark:text-black" value="system">
                      Sistema
                    </option>
                    <option className="dark:text-black" value="dark">
                      Oscuro
                    </option>
                    <option className="dark:text-black" value="light">
                      Claro
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex-col gap-3">
              <button
                onClick={closeSettingsModal}
                className="py-2 text-center w-full mt-2 text-gray-700 inline-flex items-center justify-center text-base leading-5 font-semibold rounded-lg bg-gray-200 hover:bg-gray-300 focus:outline-none focus:bg-gray-300"
              >
                Cerrar
              </button>
            </div>
          </div>
        </Modal>
      </aside>

      <aside className="flex sidebar-2 md:hidden">
        <div class="flex flex-col items-center w-16 h-screen py-8 bg-white border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700 ">
          <nav class="flex flex-col items-center flex-1 space-y-8 ">
            <a href="#">
              <img
                class="w-auto h-6"
                src="https://merakiui.com/images/logo.svg"
                alt=""
              />
            </a>

            <a
              href="/dashboard"
              class="p-1.5 inline-block text-gray-500 focus:outline-nones transition-colors duration-200 rounded-lg dark:text-gray-400 dark:hover:bg-gray-800 hover:bg-gray-100"
            >
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>

            <a
              href="#"
              class="p-1.5 inline-block text-gray-500 transition-colors duration-200 rounded-lg dark:text-gray-400 dark:bg-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                />
              </svg>
            </a>

            <a
              href="#"
              class="p-1.5 inline-block text-gray-500 focus:outline-nones transition-colors duration-200 rounded-lg dark:text-gray-400 dark:hover:bg-gray-800 hover:bg-gray-100"
            >
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 5V7M15 11V13M15 17V19M5 5C3.89543 5 3 5.89543 3 7V10C4.10457 10 5 10.8954 5 12C5 13.1046 4.10457 14 3 14V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V14C19.8954 14 19 13.1046 19 12C19 10.8954 19.8954 10 21 10V7C21 5.89543 20.1046 5 19 5H5Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>

            <button
              onClick={openModal}
              className="p-1.5 border-t-2 pt-7 inline-block text-gray-500 focus:outline-nones transition-colors duration-200 dark:text-gray-400 dark:hover:bg-gray-800 hover:bg-gray-100"
            >
              {/* Salir */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                />
              </svg>
            </button>

            <button
              onClick={openSettingsModal}
              className="flex w-full items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
            >
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.3246 4.31731C10.751 2.5609 13.249 2.5609 13.6754 4.31731C13.9508 5.45193 15.2507 5.99038 16.2478 5.38285C17.7913 4.44239 19.5576 6.2087 18.6172 7.75218C18.0096 8.74925 18.5481 10.0492 19.6827 10.3246C21.4391 10.751 21.4391 13.249 19.6827 13.6754C18.5481 13.9508 18.0096 15.2507 18.6172 16.2478C19.5576 17.7913 17.7913 19.5576 16.2478 18.6172C15.2507 18.0096 13.9508 18.5481 13.6754 19.6827C13.249 21.4391 10.751 21.4391 10.3246 19.6827C10.0492 18.5481 8.74926 18.0096 7.75219 18.6172C6.2087 19.5576 4.44239 17.7913 5.38285 16.2478C5.99038 15.2507 5.45193 13.9508 4.31731 13.6754C2.5609 13.249 2.5609 10.751 4.31731 10.3246C5.45193 10.0492 5.99037 8.74926 5.38285 7.75218C4.44239 6.2087 6.2087 4.44239 7.75219 5.38285C8.74926 5.99037 10.0492 5.45193 10.3246 4.31731Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </nav>

          <div class="flex flex-col items-center mt-4 space-y-4">
            <a href="#">
              <img
                class="object-cover w-8 h-8 rounded-lg"
                src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&h=634&q=80"
                alt="avatar"
              />
            </a>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SideBar;
