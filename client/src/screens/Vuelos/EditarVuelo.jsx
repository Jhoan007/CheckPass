import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "../../App.css"; 
import { FaPlaneDeparture } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const EditarVuelo = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const location = useLocation();
  const vueloDesdeDetalle = location.state?.vuelo || null;

  const [vuelo, setVuelo] = useState(vueloDesdeDetalle);
  const [ciudades, setCiudades] = useState([]);
  const [aerolineas, setAerolineas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchData = async () => {
    try {
      if (!vueloDesdeDetalle) {
        const vueloRes = await axios.get(`https://checkpass.parqueoo.com/api/ProgramacionVuelo/${id}`);
        const data = vueloRes.data;

        setVuelo({
          ...data,
          fk_CiudadOrigen: String(data.fk_CiudadOrigen),
          fk_CiudadDestino: String(data.fk_CiudadDestino),
          fk_Aerolinea: String(data.fk_Aerolinea),
          horasAnticipacionAbordaje: data.horasAnticipacionAbordaje || 0,
          cancelado: data.cancelado || false,
          esInternacional: data.esInternacional || false,
        });
      }

      const [ciudadesRes, aerolineasRes] = await Promise.all([
        axios.get("https://checkpass.parqueoo.com/api/Ciudad"),
        axios.get("https://checkpass.parqueoo.com/api/Aerolinea"),
      ]);

      setCiudades(ciudadesRes.data);
      setAerolineas(aerolineasRes.data);
      setLoading(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al cargar datos",
        text: error.message,
      });
    }
  };

  fetchData();
}, [id, vueloDesdeDetalle]);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setVuelo({ ...vuelo, [name]: type === "checkbox" ? checked : value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const datos = {
      numeroVuelo: vuelo.numeroVuelo,
      salida: vuelo.salida,
      llegada: vuelo.llegada,
      esInternacional: vuelo.esInternacional,
      cancelado: vuelo.cancelado,
      horasAnticipacionAbordaje: Number(vuelo.horasAnticipacionAbordaje),
      fk_Aerolinea: Number(vuelo.fk_Aerolinea),
      fk_CiudadOrigen: Number(vuelo.fk_CiudadOrigen),
      fk_CiudadDestino: Number(vuelo.fk_CiudadDestino),
    };

    try {
      await axios.put(
        `https://checkpass.parqueoo.com/api/ProgramacionVuelo/${id}`,
        datos
      );

      Swal.fire({
        icon: "success",
        title: "Vuelo actualizado",
      });

      navigate("/vuelos/listarvuelos");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al actualizar",
        text: error.message,
      });
    }
  };

  if (loading || !vuelo) return <p>Cargando datos...</p>;

  return (
    <div className="crear-vuelo-container">
      <form className="crear-vuelo-form" onSubmit={handleUpdate}>
        <h2>
          <FaPlaneDeparture /> Editar Vuelo #{vuelo.numeroVuelo}
        </h2>

        <div className="form-group">
          <label>Número de Vuelo*</label>
          <input
            name="numeroVuelo"
            value={vuelo.numeroVuelo}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Fecha y hora de salida*</label>
          <input
            type="datetime-local"
            name="salida"
            value={vuelo.salida.slice(0, 16)}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Fecha y hora de llegada*</label>
          <input
            type="datetime-local"
            name="llegada"
            value={vuelo.llegada.slice(0, 16)}
            onChange={handleChange}
          />
        </div>

        <div className="checkbox-group">
          <label>¿Vuelo internacional?</label>
          <input
            type="checkbox"
            name="esInternacional"
            checked={vuelo.esInternacional}
            onChange={handleChange}
          />
        </div>

        <div className="checkbox-group">
          <label>¿Vuelo cancelado?</label>
          <input
            type="checkbox"
            name="cancelado"
            checked={vuelo.cancelado}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Horas de anticipación para abordaje</label>
          <input
            type="number"
            name="horasAnticipacionAbordaje"
            value={vuelo.horasAnticipacionAbordaje}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Aerolínea*</label>
          <select
            name="fk_Aerolinea"
            value={vuelo.fk_Aerolinea}
            onChange={handleChange}
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
            name="fk_CiudadOrigen"
            value={vuelo.fk_CiudadOrigen}
            onChange={handleChange}
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
            name="fk_CiudadDestino"
            value={vuelo.fk_CiudadDestino}
            onChange={handleChange}
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
          <button
            className="btn-atras"
            type="button"
            onClick={() => navigate(-1)}
          >
            Atras
          </button>
          <button type="submit" className="btn-guardar">
            Actualizar Vuelo
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarVuelo;
