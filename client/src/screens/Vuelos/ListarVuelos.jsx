import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { IoAirplaneSharp } from "react-icons/io5";
import "../../App.css";

const ListaVuelos = () => {
  const [vuelos, setVuelos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVuelos = async () => {
      try {
        const response = await axios.get(
          "https://checkpass.parqueoo.com/api/ProgramacionVuelo"
        );
        setVuelos(response.data);
        setLoading(false);

        const data = response.data;
        console.log("Vuelos recibidos:", data);

        const vuelosOrdenados = data.sort(
          (a, b) => new Date(a.salida) - new Date(b.salida)
        );
        setVuelos(vuelosOrdenados);
      } catch (err) {
        setError("Error al cargar vuelos");
        setLoading(false);
      }
    };

    fetchVuelos();
  }, []);
  const formatearHora = (fecha) => {
    // Asegurar que la fecha termine con 'Z' para indicar que es UTC
    const fechaUtc = fecha.endsWith("Z") ? fecha : fecha + "Z";
    const date = new Date(fechaUtc);
    return date.toLocaleString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este vuelo?")) {
      try {
        await axios.delete(
          `https://checkpass.parqueoo.com/api/ProgramacionVuelo/${id}`
        );
        setVuelos(vuelos.filter((vuelo) => vuelo.id_Programacion !== id));
      } catch (err) {
        alert("Error al eliminar el vuelo");
      }
    }
  };

  if (loading) return <p>Cargando vuelos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="tabla-contenedor">
      <h2 className="titulo-tabla">
        <IoAirplaneSharp /> Vuelos
      </h2>

      <div className="tabla-scroll-vertical">
        <table className="tabla-vuelos">
          <thead>
            <tr>
              <th>Vuelo#</th>
              <th>Salida</th>
              <th>Llegada</th>
              <th>Origen</th>
              <th>Destino</th>
              <th>Aerolínea</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {vuelos.map((vuelo) => (
              <tr key={vuelo.id_Programacion}>
                <td>{vuelo.numeroVuelo}</td>
                <td>{formatearHora(vuelo.salida)}</td>
                <td>{formatearHora(vuelo.llegada)}</td>
                <td>{vuelo.ciudadOrigen}</td>
                <td>{vuelo.ciudadDestino}</td>
                <td>{vuelo.aerolineaNombre}</td>
                <td>
                  <span
                    className={`etiqueta-tipo ${
                      vuelo.esInternacional ? "internacional" : "nacional"
                    }`}
                  >
                    {vuelo.esInternacional ? "Internacional" : "Nacional"}
                  </span>
                </td>
                <td>
                  <span
                    className={`etiqueta-estado ${
                      vuelo.cancelado ? "cancelado" : "activo"
                    }`}
                  >
                    {vuelo.cancelado ? "Cancelado" : "Activo"}
                  </span>
                </td>
                <td className="acciones">
                  <button
                    className="btn-accion editar"
                    onClick={() =>
                      navigate(`/vuelos/editar/${vuelo.id_Programacion}`)
                    }
                    title="Editar"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn-accion eliminar"
                    onClick={() => handleEliminar(vuelo.id_Programacion)}
                    title="Eliminar"
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListaVuelos;
