import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt, FaUsers } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2"; 
import "../../App.css";

const UsuariosRegistrados = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const navigate = useNavigate();

  const API_URL_USUARIOS= "https://checkpass.parqueoo.com/api/Usuario";
  const API_URL_ROLES= "https://checkpass.parqueoo.com/api/Rol";

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const [resUsuarios, resRoles] = await Promise.all([
          axios.get(API_URL_USUARIOS),
          axios.get(API_URL_ROLES),
        ]);

        const usuarios = resUsuarios.data;
        const roles = resRoles.data;

        const usuariosConRol = usuarios.map((usuario) => {
          const rol = roles.find((r) => r.id_Rol === usuario.rolId);
          return {
            ...usuario,
            rolNombre: rol ? rol.rolNombre : "Sin rol",
          };
        });

        setUsuarios(usuariosConRol);
        setUsuariosFiltrados(usuariosConRol);
      } catch (error) {
        console.error("Error al obtener datos:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron obtener los datos de usuarios o roles.",
        });
      }
    };

    fetchDatos();
  }, []);

  const handleBusqueda = (e) => {
    const valor = e.target.value.toLowerCase();
    setBusqueda(valor);

    const filtrados = usuarios.filter(
      (usuario) =>
        usuario.nombres.toLowerCase().includes(valor) ||
        usuario.apellidos.toLowerCase().includes(valor)
    );

    setUsuariosFiltrados(filtrados);
  };

  const handleEditar = (usuario) => {
    navigate(`/configuracion/editarusuario/${usuario.id_Usuario}`);
  };

  const handleEliminar = (idUsuario) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el usuario permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(
            `${API_URL_USUARIOS}/${idUsuario}`
          )
          .then(() => {
            const actualizados = usuarios.filter(
              (u) => u.id_Usuario !== idUsuario
            );
            setUsuarios(actualizados);
            setUsuariosFiltrados(actualizados);

            Swal.fire({
              icon: "success",
              title: "Eliminado",
              text: "El usuario ha sido eliminado exitosamente.",
              timer: 2000,
              showConfirmButton: false,
            });
          })
          .catch((error) => {
            console.error("Error al eliminar el usuario:", error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "No se pudo eliminar el usuario. Intenta nuevamente.",
            });
          });
      }
    });
  };

  return (
    <div className="tabla-contenedor-usuarios">
      <h2 className="titulo-tabla">
        {" "}
        <FaUsers /> Usuarios Registrados
      </h2>

      <input
        type="text"
        placeholder="Buscar por nombre o apellido"
        value={busqueda}
        onChange={handleBusqueda}
        className="buscador"
      />

      <table className="tabla-usuarios">
        <thead>
          <tr>
            <th>Nombres</th>
            <th>Apellidos</th>
            <th>Correo</th>
            <th>Activo</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuariosFiltrados.length > 0 ? (
            usuariosFiltrados.map((usuario) => (
              <tr key={usuario.id_Usuario}>
                <td>{usuario.nombres}</td>
                <td>{usuario.apellidos}</td>
                <td>{usuario.correo}</td>
                <td>{usuario.activo ? "Sí" : "No"}</td>
                <td>{usuario.rolNombre}</td>
                <td className="acciones">
                  <button
                    className="btn-accion editar"
                    onClick={() => handleEditar(usuario)}
                  >
                    {" "}
                    <FaEdit />
                  </button>
                  <button
                    className="btn-accion eliminar"
                    onClick={() => handleEliminar(usuario.id_Usuario)}
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No se encontraron usuarios.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UsuariosRegistrados;
