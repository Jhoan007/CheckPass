import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "../../App.css";
import { FaArrowLeft, FaSave } from "react-icons/fa";

const CrearPasajeroProgramado = () => {
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [restriccion, setRestriccion] = useState(false);
  const [fkNacionalidad, setFkNacionalidad] = useState("");
  const [fkTipoDocumento, setFkTipoDocumento] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nuevoPasajero = {
      nombres,
      apellidos,
      numeroDocumento,
      restriccion,
      fkNacionalidad: parseInt(fkNacionalidad),
      fkTipoDocumento: parseInt(fkTipoDocumento),
    };

    try {
      const response = await axios.post(
        "https://checkpass.parqueoo.com/api/PasajeroProgramado",
        nuevoPasajero
      );

      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Pasajero programado creado",
          text: "El pasajero fue registrado exitosamente.",
          confirmButtonColor: "#008037",
        });

        // Limpiar campos
        setNombres("");
        setApellidos("");
        setNumeroDocumento("");
        setRestriccion(false);
        setFkNacionalidad("");
        setFkTipoDocumento("");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo crear el pasajero.",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div className="form-container-pasajero">
      <h3>Crear pasajero programado</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group-col">
            <label>Nombres:</label>
            <input
              type="text"
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
              required
            />
          </div>
          <div className="form-group-col">
            <label>Apellidos:</label>
            <input
              type="text"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group-col">
            <label>Documento:</label>
            <input
              type="text"
              value={numeroDocumento}
              onChange={(e) => setNumeroDocumento(e.target.value)}
              required
            />
          </div>
          <div className="form-group-col">
            <label>Tipo de Documento:</label>
            <select
              value={fkTipoDocumento}
              onChange={(e) => setFkTipoDocumento(e.target.value)}
              required
            >
              <option value="">Seleccione</option>
              <option value="1">Cédula</option>
              <option value="2">Pasaporte</option>
              {/* Agrega más si es necesario */}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group-col">
            <label>Nacionalidad:</label>
            <select
              value={fkNacionalidad}
              onChange={(e) => setFkNacionalidad(e.target.value)}
              required
            >
              <option value="">Seleccione</option>
              <option value="1">Colombiana</option>
              <option value="2">Venezolana</option>
              {/* Agrega más si es necesario */}
            </select>
          </div>
          <div className="form-group-col checkbox-row">
            <label htmlFor="restriccion">Tiene restricción:</label>
            <input
              type="checkbox"
              checked={restriccion}
              onChange={() => setRestriccion(!restriccion)}
              id="restriccion"
            />
          </div>
        </div>

        <div className="button-group">
          <button
            type="button"
            className="btn-back"
            onClick={() => navigate("general/dashboard")}
          >
            <FaArrowLeft /> Regresar
          </button>
          <button type="submit" className="btn-save">
            <FaSave /> Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearPasajeroProgramado;
