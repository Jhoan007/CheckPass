import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import { FaSave, FaUserFriends, FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";

const CrearUsuario = () => {
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    correo: "",
    rol: "",
    contrasena: "",
    confirmarContrasena: "",
  });

  const [roles, setRoles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await axios.get("https://checkpass.parqueoo.com/api/Rol");
        setRoles(res.data);
      } catch (err) {
        console.error("Error al obtener roles:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar los roles. Intenta de nuevo.",
        });
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

    // Validaciones antes de enviar
    if (
      !nombres ||
      !apellidos ||
      !correo ||
      !rol ||
      !contrasena ||
      !confirmarContrasena
    ) {
      Swal.fire({
        icon: "warning",
        title: "Campos requeridos",
        text: "Todos los campos son obligatorios.",
      });
      return;
    }

    if (contrasena !== confirmarContrasena) {
      Swal.fire({
        icon: "warning",
        title: "Contraseñas no coinciden",
        text: "La confirmación debe ser igual a la contraseña.",
      });
      return;
    }

    try {
      // Llamada a la API
      const res = await axios.post("https://checkpass.parqueoo.com/api/Usuario", {
        nombres,
        apellidos,
        correo,
        contrasena,
        confirmarContrasena,
        activo: true,
        rolId: parseInt(rol, 10),
      });

      await Swal.fire({
        icon: "success",
        title: "Usuario creado",
        text: res.data.message || "El usuario fue creado exitosamente.",
        confirmButtonColor: "#3085d6",
      });

      navigate(-1); // Regresa a la página anterior
    } catch (error) {
      console.error("Error en creación:", error.response?.data);

      const backendErrors = error.response?.data?.errors;
      if (backendErrors) {
        const firstKey = Object.keys(backendErrors)[0];
        const firstMessage = backendErrors[firstKey][0];
        Swal.fire({
          icon: "error",
          title: "Error de validación",
          text: firstMessage,
          confirmButtonColor: "#d33",
        });
      } else {
        const msg = error.response?.data?.message || "Error al crear el usuario.";
        Swal.fire({
          icon: "error",
          title: "Error",
          text: msg,
          confirmButtonColor: "#d33",
        });
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

          <div className="form-buttons">
            <button
              type="button"
              className="btn-back"
              onClick={() => navigate("general/dashboard")}
            >
              <FaArrowLeft /> Regresar
            </button>
            <button type="submit" className="btn-save">
              <FaSave className="crearUser-icon" /> Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearUsuario;
