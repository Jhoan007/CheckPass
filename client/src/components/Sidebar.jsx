import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaPlaneDeparture,
  FaUserFriends,
  FaChartBar,
  FaCity,
  FaSignOutAlt,
} from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import Inco from "./images/Inco.png";

function Sidebar({ isOpen, toggleSidebar, handleLogout }) {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menuName) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  return (
    <aside className={`sidebar ${isOpen ? "active" : ""}`}>
      <div className="sidebar-header">
        <img src={Inco} alt="Logo CheckPass" className="sidebar-logo" />
        <h2 className="logo-text">CheckPass</h2>
      </div>

      <nav className="sidebar-nav">
        {/* GENERAL */}
        <div className="nav-group">
          <div className="nav-link" onClick={() => toggleMenu("general")}>
            <FaHome className="sidebar-icon" />
            General
          </div>
          {openMenu === "general" && (
            <div className="sub-menu">
              <NavLink
                to="/general/dashboard"
                onClick={toggleSidebar}
                className="sub-link"
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/general/estadisticas"
                onClick={toggleSidebar}
                className="sub-link"
              >
                Estadísticas
              </NavLink>
              <NavLink
                to="/general/actividad"
                onClick={toggleSidebar}
                className="sub-link"
              >
                Actividad reciente
              </NavLink>
            </div>
          )}
        </div>

        {/* VUELOS */}
        <div className="nav-group">
          <div className="nav-link" onClick={() => toggleMenu("vuelos")}>
            <FaPlaneDeparture className="sidebar-icon" />
            Vuelos
          </div>
          {openMenu === "vuelos" && (
            <div className="sub-menu">
              <NavLink
                to="/vuelos/crearvuelo"
                onClick={toggleSidebar}
                className="sub-link"
              >
                Crear Vuelo
              </NavLink>
              <NavLink
                to="/vuelos/asignarpasajero"
                onClick={toggleSidebar}
                className="sub-link"
              >
                Asignar Pasajero
              </NavLink>
              <NavLink
                to="/vuelos/asignarpasillo"
                onClick={toggleSidebar}
                className="sub-link"
              >
                Asignar Pasillo
              </NavLink>
              <NavLink
                to="/vuelos/listarvuelos"
                onClick={toggleSidebar}
                className="sub-link"
              >
                Listar Vuelos
              </NavLink>
            </div>
          )}
        </div>

        {/* PASAJEROS */}
        <div className="nav-group">
          <div className="nav-link" onClick={() => toggleMenu("pasajeros")}>
            <FaUserFriends className="sidebar-icon" />
            Pasajeros
          </div>
          {openMenu === "pasajeros" && (
            <div className="sub-menu">
              <NavLink
                to="/pasajeros/crearpasajero"
                onClick={toggleSidebar}
                className="sub-link"
              >
                Crear Pasajero
              </NavLink>
              <NavLink
                to="/pasajeros/activarpasillo"
                onClick={toggleSidebar}
                className="sub-link"
              >
                Activar Pasillo
              </NavLink>
              <NavLink
                to="/pasajeros/nuevo"
                onClick={toggleSidebar}
                className="sub-link"
              >
                Nuevo pasajero
              </NavLink>
            </div>
          )}
        </div>

        {/* REPORTES */}
        <div className="nav-group">
          <div className="nav-link" onClick={() => toggleMenu("reportes")}>
            <FaChartBar className="sidebar-icon" />
            Reportes
          </div>
          {openMenu === "reportes" && (
            <div className="sub-menu">
              <NavLink
                to="/reportes/diario"
                onClick={toggleSidebar}
                className="sub-link"
              >
                Diario
              </NavLink>
              <NavLink
                to="/reportes/mensual"
                onClick={toggleSidebar}
                className="sub-link"
              >
                Mensual
              </NavLink>
              <NavLink
                to="/reportes/exportar"
                onClick={toggleSidebar}
                className="sub-link"
              >
                Exportar
              </NavLink>
            </div>
          )}
        </div>

        {/* CIUDADES */}
        <div className="nav-group">
          <div className="nav-link" onClick={() => toggleMenu("ciudades")}>
            <FaCity className="sidebar-icon" />
            Ciudades
          </div>
          {openMenu === "ciudades" && (
            <div className="sub-menu">
              <NavLink
                to="/ciudades/agregarciudad"
                onClick={toggleSidebar}
                className="sub-link"
              >
                Agregar ciudad
              </NavLink>
              <NavLink
                to="/ciudades/listado"
                onClick={toggleSidebar}
                className="sub-link"
              >
                Listado
              </NavLink>
              <NavLink
                to="/ciudades/populares"
                onClick={toggleSidebar}
                className="sub-link"
              >
                Populares
              </NavLink>
            </div>
          )}
        </div>
      </nav>

      {/* FOOTER CON CONFIGURACIÓN Y SALIR */}
      <div className="sidebar-footer">
        {/* CONFIGURACIÓN */}
        <div className="nav-group">
          <div className="nav-link" onClick={() => toggleMenu("configuracion")}>
            <FaGear className="sidebar-icon" />
            Configuración
          </div>
          {openMenu === "configuracion" && (
            <div className="sub-menu">
              <NavLink
                to="/configuracion/crearusuario"
                onClick={toggleSidebar}
                className="sub-link"
              >
                Crear Usuario
              </NavLink>
              <NavLink
                to="/configuracion/usuariosregistrados"
                onClick={toggleSidebar}
                className="sub-link"
              >
                Usuarios Registrados
              </NavLink>
              <NavLink
                to="/configuracion/gestormodulos"
                onClick={toggleSidebar}
                className="sub-link"
              >
                Gestor Modulos
              </NavLink>
            </div>
          )}
        </div>

        {/* BOTÓN DE SALIR */}
        <div className="logout-container">
          <button onClick={handleLogout} className="logout-button">
            <FaSignOutAlt className="sidebar-icon" />
            Salir
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
