import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import { FaPlaneDeparture } from "react-icons/fa";

const CrearVuelo = () => {
  const navigate = useNavigate();

  const [numeroVuelo, setNumeroVuelo] = useState("");
  const [salida, setSalida] = useState("");
  const [llegada, setLlegada] = useState("");
  const [esInternacional, setEsInternacional] = useState(false);
  const [cancelado, setCancelado] = useState(false);
  const [horasAnticipacionAbordaje, setHorasAnticipacionAbordaje] = useState(0);

  const [aerolineas, setAerolineas] = useState([]);
  const [ciudades, setCiudades] = useState([]);

  const [fkAerolinea, setFkAerolinea] = useState("");
  const [fkCiudadOrigen, setFkCiudadOrigen] = useState("");
  const [fkCiudadDestino, setFkCiudadDestino] = useState("");

  const [idProgramacionCreado, setIdProgramacionCreado] = useState(null);

  // Limpiar cualquier ID anterior al montar
  useEffect(() => {
    localStorage.removeItem("idVueloActual");
  }, []);


  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const [resAerolineas, resCiudades] = await Promise.all([
          axios.get("https://checkpass.parqueoo.com/api/Aerolinea"),
          axios.get("https://checkpass.parqueoo.com/api/Ciudad"),
        ]);
        setAerolineas(resAerolineas.data);
        setCiudades(resCiudades.data);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error cargando datos",
          text: error.message,
        });
      }
    };
    fetchDatos();
  }, []);

  // Guardar vuelo en API
  const guardarVuelo = async () => {
    if (
      !numeroVuelo ||
      !salida ||
      !llegada ||
      !fkAerolinea ||
      !fkCiudadOrigen ||
      !fkCiudadDestino
    ) {
      return Swal.fire({
        icon: "warning",
        title: "Faltan datos obligatorios",
        text: "Por favor completa todos los campos requeridos.",
      });
    }

    const body = {
      numeroVuelo,
      salida,
      llegada,
      esInternacional,
      cancelado,
      horasAnticipacionAbordaje: Number(horasAnticipacionAbordaje),
      fk_Aerolinea: Number(fkAerolinea),
      fk_CiudadOrigen: Number(fkCiudadOrigen),
      fk_CiudadDestino: Number(fkCiudadDestino),
    };

    try {
      const response = await axios.post(
        "https://checkpass.parqueoo.com/api/ProgramacionVuelo",
        body
      );

      const idVueloCreado = response.data?.id?.id_Programacion;

      if (!idVueloCreado) {
        return Swal.fire({
          icon: "error",
          title: "No se pudo obtener el ID del vuelo creado.",
        });
      }

      setIdProgramacionCreado(idVueloCreado);

      // Guardar en localStorage para mantenerlo disponible
      localStorage.setItem("idVueloActual", idVueloCreado);

      Swal.fire({
        icon: "success",
        title: "Vuelo creado correctamente",
        text: `Número de vuelo: ${numeroVuelo}`,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al crear el vuelo",
        text:
          error.response?.data?.title ||
          error.message ||
          "Error desconocido al guardar el vuelo.",
      });
    }
  };

  // Navegar a asignar pasajero
  const irASiguiente = () => {
    if (!idProgramacionCreado) {
      return Swal.fire({
        icon: "warning",
        title: "Guarda primero el vuelo",
        text: "Debes guardar el vuelo antes de continuar.",
      });
    }

    navigate("/vuelos/asignarpasajero", {
      state: { idProgramacionVuelo: idProgramacionCreado },
    });
  };

  return (
    <div className="crear-vuelo-container">
      <form className="crear-vuelo-form">
        <h2>
          <FaPlaneDeparture /> Creación de Vuelo
        </h2>

        <div className="form-group">
          <label>Número de Vuelo*</label>
          <input
            value={numeroVuelo}
            onChange={(e) => setNumeroVuelo(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Fecha y hora de salida*</label>
          <input
            type="datetime-local"
            value={salida}
            onChange={(e) => setSalida(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Fecha y hora de llegada*</label>
          <input
            type="datetime-local"
            value={llegada}
            onChange={(e) => setLlegada(e.target.value)}
          />
        </div>

        <div className="checkbox-group">
          <label>¿Vuelo internacional?</label>
          <input
            type="checkbox"
            checked={esInternacional}
            onChange={(e) => setEsInternacional(e.target.checked)}
          />
        </div>

        <div className="checkbox-group">
          <label>¿Vuelo cancelado?</label>
          <input
            type="checkbox"
            checked={cancelado}
            onChange={(e) => setCancelado(e.target.checked)}
          />
        </div>

        <div className="form-group">
          <label>Horas de anticipación para abordaje</label>
          <input
            type="number"
            value={horasAnticipacionAbordaje}
            onChange={(e) => setHorasAnticipacionAbordaje(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Aerolínea*</label>
          <select
            value={fkAerolinea}
            onChange={(e) => setFkAerolinea(e.target.value)}
          >
            <option value="">Seleccione aerolínea</option>
            {aerolineas.map((a) => (
              <option key={a.id_Aerolinea} value={a.id_Aerolinea}>
                {a.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Ciudad de origen*</label>
          <select
            value={fkCiudadOrigen}
            onChange={(e) => setFkCiudadOrigen(e.target.value)}
          >
            <option value="">Seleccione ciudad origen</option>
            {ciudades.map((c) => (
              <option key={c.id_Ciudad} value={c.id_Ciudad}>
                {c.nombreCiudad}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Ciudad de destino*</label>
          <select
            value={fkCiudadDestino}
            onChange={(e) => setFkCiudadDestino(e.target.value)}
          >
            <option value="">Seleccione ciudad destino</option>
            {ciudades.map((c) => (
              <option key={c.id_Ciudad} value={c.id_Ciudad}>
                {c.nombreCiudad}
              </option>
            ))}
          </select>
        </div>

        <div className="botones-final">
          <button className="btn-guardar" type="button" onClick={guardarVuelo}>
            Guardar
          </button>
          <button
            className="btn-siguiente"
            type="button"
            onClick={irASiguiente}
            disabled={!idProgramacionCreado}
          >
            Siguiente: Asignar Pasajeros
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearVuelo;
