import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUserTie, FaSave } from "react-icons/fa";
import "../../App.css";

const Auditoria = () => {
  const [registros, setRegistros] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://checkpass.parqueoo.com/api/Vuelo/detalles")
      .then((res) => {
        setRegistros(res.data);
      })
      .catch((err) => {
        console.error("Error al obtener registros de auditoría:", err);
      });
  }, []);

  return (
    <div className="tabla-contenedor">
      <h2 className="titulo-tabla">
        <FaUserTie /> Auditoría
      </h2>

      <div className="tabla-scroll-vertical">
        <table className="tabla-vuelos">
          <thead>
            <tr>
              <th>Vuelo#</th>
              <th>Fecha</th>
              <th>Nombre</th>
              <th>Apellidos</th>
              <th>Ciudad Origen</th>
              <th>Ciudad Destino</th>
              <th>IP Pasillo</th>
            </tr>
          </thead>
          <tbody>
            {registros.length > 0 ? (
              registros.map((item, index) => (
                <tr key={index}>
                  <td>{item.numeroVuelo}</td>
                  <td>{item.fecha}</td>
                  <td>{item.nombres}</td>
                  <td>{item.apellidos}</td>
                  <td>{item.ciudadOrigen}</td>
                  <td>{item.ciudadDestino}</td>
                  <td>{item.ipPasillo}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No hay registros de auditoría disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
      </div>
    </div>
  );
};

export default Auditoria;
