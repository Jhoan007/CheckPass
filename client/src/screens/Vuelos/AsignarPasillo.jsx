import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaTrashAlt } from "react-icons/fa";
import "../../App.css";
import { useNavigate, useLocation } from "react-router-dom";

function AsignarPasillo() {
  const navigate = useNavigate();
  const location = useLocation();

  const vueloId =
    location.state?.idProgramacionVuelo ||
    localStorage.getItem("idVueloActual");

  const [pasillos, setPasillos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [asignados, setAsignados] = useState([]);

  // Validar existencia del ID de vuelo
  useEffect(() => {
    if (!vueloId) {
      Swal.fire({
        icon: "warning",
        title: "Sin vuelo",
        text: "Debes crear un vuelo antes de asignar pasillos.",
      }).then(() => {
        navigate("/vuelos/crearvuelo");
      });
    }
  }, [vueloId, navigate]);

  // Cargar todos los pasillos activos
  useEffect(() => {
    axios
      .get("https://checkpass.parqueoo.com/api/Pasillo")
      .then((res) => {
        const activos = res.data.filter((p) => p.activo);
        setPasillos(activos);
      })
      .catch(() =>
        Swal.fire("Error", "No se pudo cargar los pasillos", "error")
      );
  }, []);

  // Cargar pasillos ya asignados al vuelo
  useEffect(() => {
    if (!vueloId) return;

    axios
      .get("https://checkpass.parqueoo.com/api/ProgramacionVueloPasillo")
      .then((res) => {
        const asignadosFiltrados = res.data
          .filter((rel) => rel.fk_ProgramacionVuelo === Number(vueloId))
          .map((rel) => ({
            ...rel.pasillo, // Info del pasillo
            idRelacion: rel.id, // ID de la relación para eliminar
          }));

        setAsignados(asignadosFiltrados);
      })
      .catch(() =>
        Swal.fire("Error", "No se pudo cargar pasillos asignados", "error")
      );
  }, [vueloId]);

  // Buscar pasillo por IP
  const handleBusqueda = (texto) => {
    setBusqueda(texto);
    setSeleccionado(null);

    if (texto.length >= 2) {
      const filtrados = pasillos.filter((p) =>
        p.ipPasillo.toLowerCase().includes(texto.toLowerCase())
      );
      setResultados(filtrados);
    } else {
      setResultados([]);
    }
  };

  // Agregar pasillo
  const agregarPasillo = async () => {
    if (!seleccionado || !vueloId) {
      return Swal.fire(
        "Advertencia",
        "Debe seleccionar un pasillo y tener un vuelo válido.",
        "warning"
      );
    }

    const yaAsignado = asignados.some(
      (p) => p.id_Pasillo === seleccionado.id_Pasillo
    );

    if (yaAsignado) {
      return Swal.fire(
        "Duplicado",
        "Este pasillo ya está asignado a este vuelo.",
        "info"
      );
    }

    try {
      const response = await axios.post(
        "https://checkpass.parqueoo.com/api/ProgramacionVueloPasillo",
        {
          fk_ProgramacionVuelo: Number(vueloId),
          fk_Pasillo: seleccionado.id_Pasillo,
        }
      );

      // Guardar el nuevo pasillo con idRelacion (respuesta del POST)
      setAsignados((prev) => [
        ...prev,
        {
          ...seleccionado,
          idRelacion: response.data.id, // suponiendo que devuelve el ID nuevo
        },
      ]);

      setSeleccionado(null);
      setBusqueda("");
      setResultados([]);

      Swal.fire("Éxito", "Pasillo asignado correctamente.", "success");
    } catch (error) {
      console.error("Error al asignar pasillo:", error);
      Swal.fire(
        "Error",
        "No se pudo asignar el pasillo. Revisa duplicados o conexión.",
        "error"
      );
    }
  };

  // Eliminar pasillo asignado
  const eliminarPasillo = async (idRelacion) => {
    const confirmar = await Swal.fire({
      title: "¿Eliminar pasillo?",
      text: "Esta acción quitará el pasillo del vuelo.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirmar.isConfirmed) return;

    try {
      await axios.delete(
        `https://checkpass.parqueoo.com/api/ProgramacionVueloPasillo/${idRelacion}`
      );

      setAsignados((prev) => prev.filter((p) => p.idRelacion !== idRelacion));

      Swal.fire("Eliminado", "Pasillo desvinculado correctamente.", "success");
    } catch (error) {
      console.error("Error al eliminar pasillo:", error);
      Swal.fire("Error", "No se pudo eliminar el pasillo.", "error");
    }
  };

  return (
    <div className="contenedor-asignar">
      <h2>Asignación de pasillos</h2>

      <div className="busqueda-contenedor">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => handleBusqueda(e.target.value)}
          placeholder="Buscar por IP de pasillo"
        />
        <button onClick={agregarPasillo} disabled={!seleccionado}>
          + Agregar
        </button>
      </div>

      {resultados.length > 0 && (
        <table className="tabla">
          <thead>
            <tr>
              <th>IP Pasillo</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {resultados.map((p) => (
              <tr
                key={p.id_Pasillo}
                onClick={() => setSeleccionado(p)}
                className={
                  seleccionado?.id_Pasillo === p.id_Pasillo
                    ? "seleccionado"
                    : ""
                }
              >
                <td>{p.ipPasillo}</td>
                <td>{p.activo ? "Activo" : "Inactivo"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {asignados.length > 0 && (
        <>
          <h3>Pasillos asignados</h3>
          <table className="tabla">
            <thead>
              <tr>
                <th>IP Pasillo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {asignados.map((p) => (
                <tr key={p.id_Pasillo}>
                  <td>{p.ipPasillo}</td>
                  <td>
                    <button
                      className="boton-eliminar"
                      onClick={() => eliminarPasillo(p.idRelacion)}
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <button className="btn-atras" type="button" onClick={() => navigate(-1)}>
        Atrás
      </button>
    </div>
  );
}

export default AsignarPasillo;
