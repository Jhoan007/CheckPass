import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ActivarPasillo = () => {
  const [ipPasillo, setIpPasillo] = useState("");
  const [activo, setActivo] = useState(false);
  const navigate = useNavigate();

  // Validación de formato IPv4
  const validarIP = (ip) => {
    const regexIP =
      /^(25[0-5]|2[0-4][0-9]|1?[0-9]{1,2})(\.(25[0-5]|2[0-4][0-9]|1?[0-9]{1,2})){3}$/;
    return regexIP.test(ip);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!ipPasillo.trim()) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "El campo IP del pasillo es obligatorio.",
    });
    return;
  }

  if (!validarIP(ipPasillo)) {
    Swal.fire({
      icon: "error",
      title: "IP inválida",
      text: "Por favor ingresa una dirección IP válida (formato IPv4).",
    });
    return;
  }

  try {
    // Verificar si la IP ya existe
    const { data } = await axios.get("https://checkpass.parqueoo.com/api/Pasillo");

    const ipExiste = data.some((pasillo) => pasillo.ipPasillo === ipPasillo);

    if (ipExiste) {
      Swal.fire({
        icon: "warning",
        title: "IP ya registrada",
        text: "La IP ingresada ya está registrada. No se puede duplicar.",
      });
      return;
    }

    //Si no existe, enviar el POST
    const response = await axios.post(
      "https://checkpass.parqueoo.com/api/Pasillo",
      {
        ipPasillo,
        activo,
      }
    );

    if (response.status === 201) {
      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Pasillo registrado correctamente.",
      });
      setIpPasillo("");
      setActivo(false);
    }
  } catch (error) {
    console.error("Error al registrar el pasillo:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo procesar la solicitud. Intenta de nuevo.",
    });
  }
};


  return (
    <div className="form-container">
      <h3>Activar / Desactivar Pasillo</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>IP del Pasillo:</label>
          <input
            type="text"
            value={ipPasillo}
            onChange={(e) => setIpPasillo(e.target.value)}
            required
          />
        </div>

        <div className="checkbox-group">
          <label htmlFor="activo">Activo</label>
          <input
            type="checkbox"
            checked={activo}
            onChange={() => setActivo(!activo)}
          />
        </div>

        <div className="button-group">
          <button
            type="button"
            className="btn-back"
            onClick={() => navigate(-1)}
          >
            Regresar
          </button>
          <button type="submit" className="btn-save">
            Guardar pasillo
          </button>
        </div>
      </form>
    </div>
  );
};

export default ActivarPasillo;
