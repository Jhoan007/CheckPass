import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCity } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";

const AgregarCiudad = () => {
  const navigate = useNavigate();

  const [nombreCiudad, setNombreCiudad] = useState("");
  const [codigoIata, setCodigoIata] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nuevaCiudad = {
      nombreCiudad,
      codigoIata,
    };

    try {
      const response = await axios.post(
        "https://checkpass.parqueoo.com/api/Ciudad",
        nuevaCiudad
      );

      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Nueva Ciudad",
          text: "La ciudad fue registrada exitosamente.",
          confirmButtonColor: "#008037",
        });

        // Limpiar campos
        setNombreCiudad("");
        setCodigoIata("");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo crear la ciudad.",
          confirmButtonColor: "#d33",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "Ocurrió un problema al comunicarse con el servidor.",
        confirmButtonColor: "#d33",
      });
    }
  };
  return (
    <div className="form-container">
      <h2><FaCity /> Agregar nueva ciudad</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre Ciudad:</label>
          <input
            type="text"
            value={nombreCiudad}
            onChange={(e) => setNombreCiudad(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Codigo Ciudad:</label>
          <input
            type="text"
            value={codigoIata}
            onChange={(e) => setCodigoIata(e.target.value)}
            required
          />
        </div>
        <div className="button-group">
          <button type="submit" className="btn-save">
            Agregar Ciudad
          </button>
          <button
            type="button"
            className="btn-back"
            onClick={() => navigate(-1)}
          >
            Regresar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgregarCiudad;
