import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../App.css";
import { FaTrashAlt, FaUsersCog, FaArrowLeft, FaSave } from "react-icons/fa";

const ModuloRol = () => {
  const [roles, setRoles] = useState([]);
  const [modulos, setModulos] = useState([]);
  const [modulosFiltrados, setModulosFiltrados] = useState([]);
  const [modulosAsignados, setModulosAsignados] = useState([]);
  const [rolSeleccionado, setRolSeleccionado] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://checkpass.parqueoo.com/api/Rol")
      .then((res) => setRoles(res.data))
      .catch((err) => console.error("Error cargando roles:", err));
  }, []);

  useEffect(() => {
    axios
      .get("https://checkpass.parqueoo.com/api/Modulo")
      .then((res) => setModulos(res.data))
      .catch((err) => console.error("Error cargando módulos:", err));
  }, []);

  useEffect(() => {
    if (busqueda === "") {
      setModulosFiltrados([]);
    } else {
      const resultados = modulos.filter((modulo) =>
        modulo.nombreModulo.toLowerCase().includes(busqueda.toLowerCase())
      );
      setModulosFiltrados(resultados);
    }
  }, [busqueda, modulos]);

  const agregarModulo = (modulo) => {
    const existe = modulosAsignados.find(
      (m) => m.id_Modulo === modulo.id_Modulo
    );
    if (!existe) {
      setModulosAsignados([...modulosAsignados, modulo]);
    } else {
      Swal.fire("Ya existe", "Este módulo ya fue agregado.", "info");
    }
  };

  const eliminarModulo = (id) => {
    setModulosAsignados(modulosAsignados.filter((m) => m.id_Modulo !== id));
  };

  const guardarAsignaciones = async () => {
    if (!rolSeleccionado || modulosAsignados.length === 0) {
      Swal.fire("Error", "Seleccione un rol y al menos un módulo.", "error");
      return;
    }

    try {
      await Promise.all(
        modulosAsignados.map((modulo) =>
          axios.post("https://checkpass.parqueoo.com/api/RolModulo", {
            rolId: parseInt(rolSeleccionado),
            moduloId: modulo.id_Modulo,
          })
        )
      );
      Swal.fire("Éxito", "Asignaciones guardadas correctamente.", "success");
      setModulosAsignados([]);
      setBusqueda("");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Hubo un problema al guardar.", "error");
    }
  };

  return (
    <div className="modulo-rol-container">
      <h2 className="titulo-tabla"><FaUsersCog /> Administrador de Usuarios</h2>

      <select
        className="select-role"
        value={rolSeleccionado}
        onChange={(e) => setRolSeleccionado(e.target.value)}
      >
        <option value="">Seleccione un rol</option>
        {roles.map((rol) => (
          <option key={rol.id_Rol} value={rol.id_Rol}>
            {rol.rolNombre}
          </option>
        ))}
      </select>

      <input
        type="text"
        className="search-input"
        placeholder="Buscar módulo..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <div className="search-results">
        {modulosFiltrados.map((modulo) => (
          <div className="modulo-result" key={modulo.id_Modulo}>
            {modulo.nombreModulo}
            <button className="btn" onClick={() => agregarModulo(modulo)}>
              Agregar
            </button>
          </div>
        ))}
      </div>

      <table className="module-table">
        <thead>
          <tr>
            <th>Módulo</th>
            <th>Ruta</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {modulosAsignados.map((modulo) => (
            <tr key={modulo.id_Modulo}>
              <td>{modulo.nombreModulo}</td>
              <td>{modulo.ruta}</td>
              <td>
                <button
                  className="btn btn-delete"
                  onClick={() => eliminarModulo(modulo.id_Modulo)}
                >
                  <FaTrashAlt />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="form-buttons">
        <button type="button" className="btn-back" onClick={() => navigate("general/dashboard")}>
          <FaArrowLeft /> Regresar
        </button>
        <button
          type="button"
          className="btn-save"
          onClick={guardarAsignaciones}
        >
          <FaSave/> Guardar
        </button>
      </div>
    </div>
  );
};

export default ModuloRol;
