import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FaPlaneDeparture,
  FaPlaneArrival,
  FaPlane,
  FaClock,
  FaArrowLeft,
  FaRedo,
  FaTimesCircle,
} from "react-icons/fa";

const Vuelo = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vuelo, setVuelo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerVuelo = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://checkpass.parqueoo.com/api/ProgramacionVuelo/${id}`
        );
        setVuelo(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error al cargar el vuelo");
        setLoading(false);
      }
    };

    obtenerVuelo();
  }, [id]);

  const cancelarAbordaje = async () => {
    const confirmar = await Swal.fire({
      title: "¿Cancelar abordaje?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (!confirmar.isConfirmed) return;

    try {
      const payload = {
        id_Programacion: vuelo.id_Programacion,
        numeroVuelo: vuelo.numeroVuelo || "",
        salida: vuelo.salida,
        llegada: vuelo.llegada,
        esInternacional: vuelo.esInternacional || false,
        horasAnticipacionAbordaje: vuelo.horasAnticipacionAbordaje || 0,
        cancelado: true,
        fkAerolinea: Number(vuelo.fkAerolinea) || 0,
        fkCiudadOrigen: Number(vuelo.fkCiudadOrigen) || 0,
        fkCiudadDestino: Number(vuelo.fkCiudadDestino) || 0,
      };

      await axios.put(
        `https://checkpass.parqueoo.com/api/ProgramacionVuelo/${id}`,
        payload
      );

      Swal.fire("Cancelado", "El abordaje ha sido cancelado.", "success");

      // se hace un nuevo GET para refrescar los datos
      const updated = await axios.get(
        `https://checkpass.parqueoo.com/api/ProgramacionVuelo/${id}`
      );
      setVuelo(updated.data);
    } catch (err) {
      console.error(
        "Error en cancelar abordaje:",
        err.response?.data || err.message
      );
      Swal.fire(
        "Error",
        "No se pudo cancelar el abordaje.\n" +
          (err.response?.data?.message || err.message),
        "error"
      );
    }
  };

  const formatearFechaHora = (fecha) => {
    if (!fecha) return "No disponible";
    return new Date(fecha).toLocaleString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour12: true,
    });
  };

  if (loading) return <p>Cargando vuelo...</p>;
  if (error) return <p>{error}</p>;
  if (!vuelo) return <p>Vuelo no encontrado</p>;

  return (
    <div className="detalle-vuelo">
      <h2>
        <FaPlaneDeparture /> Vuelo {vuelo.numeroVuelo || vuelo.id_Programacion}
      </h2>

      <div className="vuelo-grid">
        <div className="vuelo-item">
          <div className="vuelo-label">
           <FaPlane />  Aerolínea
          </div>
          <div className="vuelo-value">{vuelo.aerolineaNombre}</div>
        </div>
        <div className="vuelo-item">
          <div className="vuelo-label">
            <FaPlaneDeparture /> Origen
          </div>
          <div className="vuelo-value">{vuelo.ciudadOrigen}</div>
        </div>
        <div className="vuelo-item">
          <div className="vuelo-label">
            <FaPlaneArrival /> Destino
          </div>
          <div className="vuelo-value">{vuelo.ciudadDestino}</div>
        </div>
        <div className="vuelo-item">
          <div className="vuelo-label">
            <FaClock /> Salida
          </div>
          <div className="vuelo-value">{formatearFechaHora(vuelo.salida)}</div>
        </div>
        <div className="vuelo-item">
          <div className="vuelo-label">
            <FaClock /> Llegada
          </div>
          <div className="vuelo-value">{formatearFechaHora(vuelo.llegada)}</div>
        </div>
        <div className="vuelo-item">
          <div className="vuelo-label">Tipo</div>
          <div className="vuelo-value">
            {vuelo.esInternacional ? "Internacional" : "Nacional"}
          </div>
        </div>
        <div className="vuelo-item">
          <div className="vuelo-label">Estado</div>
          <div className={vuelo.cancelado ? "estado-danger" : "estado-success"}>
            {vuelo.cancelado ? "Cancelado" : "Activo"}
          </div>
        </div>
        <div className="vuelo-item">
          <div className="vuelo-label">Anticipación (minutos)</div>
          <input
            className="antip-input"
            type="number"
            value={vuelo.horasAnticipacionAbordaje ?? 0}
            readOnly
          />
        </div>
      </div>

      <div className="botones-container">
        <button className="btn btn-regresar" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Regresar
        </button>

        <button
          className="btn btn-reprogramar"
          onClick={() => navigate(`/vuelos/editar/${id}`, { state: { vuelo } })}
          disabled={vuelo.cancelado}
        >
          <FaRedo /> Reprogramar
        </button>

        <button
          className="btn btn-cancelar"
          onClick={cancelarAbordaje}
          disabled={vuelo.cancelado}
        >
          <FaTimesCircle /> Cancelar abordaje
        </button>
      </div>
    </div>
  );
};

export default Vuelo;
