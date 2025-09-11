import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginInco.css";
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import Incomelec1 from "./images/Incomelec1.png";
import SkyLane from "./images/SkyLane.jpg";

function LoginInco({ setUser }) {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!correo || !contrasena) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      const res = await axios.post("https://checkpass.parqueoo.com/api/Login", {
        correo: correo,
        contrasena: contrasena,
      });

      // Verifica si hay token en la respuesta = login exitoso
      if (res.data && res.data.token) {
        //localStorage.setItem("token", res.data.token); GUARADA SOLO EL TOKEN
        localStorage.setItem("userData", JSON.stringify(res.data)); //guarda todos los datos
        console.log("Respuesta de login:", res.data);

        setUser(res.data); // si necesitas solo parte de los datos
        navigate("/general/dashboard");
      } else {
        setError("Credenciales inválidas.");
      }
    } catch (err) {
      console.error("Error al hacer login:", err.message);
      setError("Credenciales inválidas o servidor no disponible.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="left-panel">
          <div className="top-section">
            <div className="logo-container">
              <img
                src={Incomelec1}
                alt="Incomelec Logo"
                className="incomelec-logo"
              />
            </div>
          </div>

          <div className="middle-section">
            <div className="branding">
              <div className="branding-text">
                <h2>Bienvenidos a CheckPass</h2>
                <p>
                  Una innovadora solución tecnológica diseñada para transformar
                  la experiencia aeroportuaria.
                </p>
                <button
                  onClick={() =>
                    (window.location.href = "https://www.incomelec.com/")
                  }
                >
                  Explorar
                </button>
              </div>

              <div className="branding-image">
                <img src={SkyLane} alt="CheckPass" />
                <div className="stats">
                  <p>Pasajeros Registrados</p>
                  <h4>35.031</h4>
                </div>
              </div>
            </div>
          </div>

          <div className="bottom-section">
            <div className="info-extra">
              <h3>Acceso Rápido y Fiable</h3>
              <p>
                Reduce los cuellos de botella, mejora la gestión del personal y
                proporciona datos clave para la toma de decisiones estratégicas.
              </p>
            </div>
          </div>
        </div>

        <div className="right-panel">
          <h2>Inicio de Sesión</h2>
          <form className="login-form" onSubmit={handleSubmit}>
            <label>Email</label>
            <div className="input-icon-container">
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="example@gmail.com"
              />
              <MdEmail className="icon" />
            </div>

            <label>Contraseña</label>
            <div className="input-icon-container">
              <input
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                placeholder="@#*%"
              />
              <FaLock className="icon" />
            </div>

            <div className="form-options">
              <label>
                <input type="checkbox" /> Recuérdame
              </label>
              <a href="https">¿Olvidé mi contraseña?</a>
            </div>

            <button type="submit">Sign in</button>
          </form>

          {error && <p className="error-text">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default LoginInco;
