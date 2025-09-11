import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { FaTrashAlt } from "react-icons/fa";
import "../../App.css";

function AsignarPasajero() {
  const navigate = useNavigate();
  const location = useLocation();

  const [pasajeros, setPasajeros] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [asignados, setAsignados] = useState([]);
  const [cargando, setCargando] = useState(false);

  // Obtener vuelo ID desde localStorage o navegación
  const idProgramacionVuelo =
    location.state?.idProgramacionVuelo ||
    localStorage.getItem("idVueloActual");

  // Verificar existencia de vuelo
  useEffect(() => {
    if (!idProgramacionVuelo) {
      Swal.fire({
        icon: "warning",
        title: "Sin vuelo",
        text: "Debes crear un vuelo antes de asignar pasajeros.",
      }).then(() => {
        navigate("/vuelos/crearvuelo");
      });
    }
  }, [idProgramacionVuelo, navigate]);

  // Cargar pasajeros programados
  useEffect(() => {
    axios
      .get("https://checkpass.parqueoo.com/api/PasajeroProgramado")
      .then((res) => {
        const transformados = res.data.map((p) => ({
          id: p.id_PasajeroProgramado,
          nombres: p.nombres,
          apellidos: p.apellidos,
          documento: p.numeroDocumento || "—",
          tipoDocumento: p.tipoDocumento?.documento || "—",
        }));
        setPasajeros(transformados);
      })
      .catch(() => {
        Swal.fire("Error", "No se pudo cargar la lista de pasajeros.", "error");
      });
  }, []);

  const handleBusqueda = (texto) => {
    setBusqueda(texto);
    setSeleccionado(null);
    if (texto.length >= 2) {
      const filtrados = pasajeros.filter((p) =>
        `${p.nombres} ${p.apellidos}`
          .toLowerCase()
          .includes(texto.toLowerCase())
      );
      setResultados(filtrados);
    } else {
      setResultados([]);
    }
  };

  const agregarSeleccionado = async () => {
    if (!seleccionado) return;

    if (asignados.some((p) => p.id === seleccionado.id)) {
      Swal.fire("Atención", "Este pasajero ya está asignado.", "info");
      return;
    }

    if (!idProgramacionVuelo) {
      Swal.fire("Error", "No se encontró el ID del vuelo.", "error");
      return;
    }

    setCargando(true);

    const payload = {
      fk_PasajeroProgramado: seleccionado.id,
      fk_ProgramacionVuelo: Number(idProgramacionVuelo),
    };

    try {
      await axios.post(
        "https://checkpass.parqueoo.com/api/PasajeroProgramacionVuelo",
        payload
      );
      setAsignados([...asignados, seleccionado]);
      setSeleccionado(null);
      setBusqueda("");
      setResultados([]);

      Swal.fire("Éxito", "Pasajero asignado correctamente.", "success");
    } catch (error) {
      Swal.fire("Error", "Hubo un problema al asignar el pasajero.", "error");
    } finally {
      setCargando(false);
    }
  };

  const eliminarPasajero = async (pasajeroId) => {
  const confirmar = await Swal.fire({
    title: "¿Eliminar pasajero?",
    text: "¿Estás seguro de que deseas eliminar este pasajero del vuelo?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });

  if (!confirmar.isConfirmed) return;

  try {
    await axios.delete(
      `https://checkpass.parqueoo.com/api/PasajeroProgramacionVuelo/${pasajeroId}/${idProgramacionVuelo}`
    );

    // Eliminar del estado local
    setAsignados((prev) => prev.filter((p) => p.id !== pasajeroId));

    Swal.fire("Eliminado", "El pasajero fue desvinculado del vuelo.", "success");
  } catch (error) {
    Swal.fire("Error", "No se pudo eliminar el pasajero del vuelo.", "error");
    console.error("Error eliminando pasajero:", error);
  }
};


  return (
    <div className="asignacion-container">
      <h2>Asignación de pasajeros</h2>

      <div className="buscador-container">
        <input
          className="buscador-input"
          type="text"
          placeholder="Buscar por nombre o apellido"
          value={busqueda}
          onChange={(e) => handleBusqueda(e.target.value)}
          disabled={cargando}
        />
        <button
          className="boton-agregar"
          onClick={agregarSeleccionado}
          disabled={!seleccionado || cargando}
        >
          {cargando ? "Agregando..." : "+ Agregar"}
        </button>
      </div>

      {resultados.length > 0 && (
        <table className="tabla-resultados">
          <thead>
            <tr>
              <th>Nombre completo</th>
              <th>Documento</th>
              <th>Tipo documento</th>
            </tr>
          </thead>
          <tbody>
            {resultados.map((p) => (
              <tr
                key={p.id}
                className={
                  seleccionado?.id === p.id ? "fila-seleccionada" : "fila-hover"
                }
                onClick={() => setSeleccionado(p)}
              >
                <td>
                  {p.nombres} {p.apellidos}
                </td>
                <td>{p.documento}</td>
                <td>{p.tipoDocumento}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {asignados.length > 0 && (
        <>
          <h3>Pasajeros asignados</h3>
          <table className="tabla-asignados">
            <thead>
              <tr>
                <th>Nombre completo</th>
                <th>Documento</th>
                <th>Tipo documento</th>
                <th>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {asignados.map((p) => (
                <tr key={p.id}>
                  <td>
                    {p.nombres} {p.apellidos}
                  </td>
                  <td>{p.documento}</td>
                  <td>{p.tipoDocumento}</td>
                  <td>
                    <button
                      className="boton-eliminar"
                      onClick={() => eliminarPasajero(p.id)}
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

      <div className="form-buttons">
        <button
          className="btn-atras"
          type="button"
          onClick={() => navigate("/vuelos/crearvuelo")}
        >
          Atras
        </button>
        <button
          className="btn-siguiente"
          onClick={() =>
            navigate("/vuelos/asignarpasillo", {
              state: { idProgramacionVuelo },
            })
          }
        >
          Siguiente: Asignar Pasillo
        </button>
      </div>
    </div>
  );
}

export default AsignarPasajero;
