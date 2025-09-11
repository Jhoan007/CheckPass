import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import { FaSave, FaUserFriends } from "react-icons/fa";
import axios from "axios";

const CrearUsuario = () => {
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    correo: "",
    rol: "",
    contrasena: "",
    confirmarContrasena: "",
  });

  const [roles, setRoles] = useState([]); // Nuevo estado para roles
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Llamar a la API de roles al cargar el componente
    const fetchRoles = async () => {
      try {
        const res = await axios.get("https://checkpass.parqueoo.com/api/Rol");
        setRoles(res.data); 
      } catch (err) {
        console.error("Error al obtener roles:", err);
      }
    };

    fetchRoles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { nombres, apellidos, correo, rol, contrasena, confirmarContrasena } =
      formData;

    if (
      !nombres ||
      !apellidos ||
      !correo ||
      !rol ||
      !contrasena ||
      !confirmarContrasena
    ) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (contrasena !== confirmarContrasena) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      setError("");
      const res = await axios.post(
        "https://checkpass.parqueoo.com/api/Usuario",
        {
          nombres,
          apellidos,
          correo,
          contrasena,
          confirmarContrasena,
          activo: true,
          rolId: parseInt(rol, 10),
        }
      );

      alert(res.data.message || "Usuario creado exitosamente");
      navigate(-1);
    } catch (error) {
      const backendErrors = error.response?.data?.errors;
      if (backendErrors) {
        const firstKey = Object.keys(backendErrors)[0];
        const firstMessage = backendErrors[firstKey][0];
        setError(firstMessage);
      } else {
        const msg = error.response?.data?.message || "Error al crear usuario";
        setError(msg);
      }
    }
  };

  return (
    <div className="usuario-wrapper">
      <div className="usuario-box">
        <h2 className="titulo">
          <FaUserFriends className="sidebar-icon" /> Creación Usuarios
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Nombres</label>
              <input
                type="text"
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Apellidos</label>
              <input
                type="text"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Correo</label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Rol</label>
              <select
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione</option>
                {roles.map((rol) => (
                  <option key={rol.id_Rol} value={rol.id_Rol}>
                    {rol.rolNombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Contraseña</label>
              <input
                type="password"
                name="contrasena"
                value={formData.contrasena}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Confirmar Contraseña</label>
              <input
                type="password"
                name="confirmarContrasena"
                value={formData.confirmarContrasena}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {error && <div className="error">{error}</div>}

          <div className="form-buttons">
            <button
              type="button"
              className="btn-back"
              onClick={() => navigate(-1)}
            >
              ← Regresar
            </button>
            <button type="submit" className="btn-save">
              {" "}
              <FaSave className="crearUser-icon" /> Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearUsuario;
