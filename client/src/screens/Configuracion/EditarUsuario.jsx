import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaSave, FaUserFriends } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2"; 

const EditarUsuario = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    correo: "",
    rol: "",
    rolNombre: "",
    activo: true,
  });

  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const res = await axios.get(
          `https://checkpass.parqueoo.com/api/Usuario/${id}`
        );
        const usuario = res.data;

        setFormData({
          nombres: usuario.nombres,
          apellidos: usuario.apellidos,
          correo: usuario.correo,
          rol: usuario.rolId?.toString() || "",
          rolNombre: usuario.rolNombre || "",
          activo: usuario.activo,
        });
      } catch (err) {
        console.error("Error al obtener usuario:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron obtener los datos del usuario.",
        });
      }
    };

    const fetchRoles = async () => {
      try {
        const res = await axios.get("https://checkpass.parqueoo.com/api/Rol");
        setRoles(res.data);
      } catch (err) {
        console.error("Error al obtener roles:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar los roles disponibles.",
        });
      }
    };

    fetchUsuario();
    fetchRoles();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "rol") {
      const selectedRol = roles.find((r) => r.id_Rol === parseInt(value));
      setFormData((prev) => ({
        ...prev,
        rol: value,
        rolNombre: selectedRol?.rolNombre || "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`https://checkpass.parqueoo.com/api/Usuario/${id}`, {
        id_Usuario: parseInt(id, 10),
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        correo: formData.correo,
        activo: formData.activo,
        rolId: parseInt(formData.rol, 10),
        rolNombre: formData.rolNombre,
      });

      await Swal.fire({
        icon: "success",
        title: "Actualizado",
        text: "El usuario fue actualizado correctamente.",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/configuracion/usuariosregistrados");
    } catch (error) {
      const backendErrors = error.response?.data?.errors;

      if (backendErrors) {
        const firstKey = Object.keys(backendErrors)[0];
        const errorMsg = backendErrors[firstKey][0];

        Swal.fire({
          icon: "error",
          title: "Error de Validación",
          text: errorMsg || "Verifica los datos del formulario.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo actualizar el usuario. Intenta de nuevo.",
        });
      }
    }
  };

  return (
    <div className="usuario-wrapper">
      <div className="usuario-box">
        <h2 className="titulo-tabla">
          {" "}
          <FaUserFriends /> Editar Usuario
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
              />
            </div>

            <div className="form-group">
              <label>Apellidos</label>
              <input
                type="text"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Correo</label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Rol</label>
              <select name="rol" value={formData.rol} onChange={handleChange}>
                <option value="">Seleccione</option>
                {roles.map((rol) => (
                  <option key={rol.id_Rol} value={rol.id_Rol}>
                    {rol.rolNombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="checkbox-group">
              <label>Activo</label>
              <input
                type="checkbox"
                name="activo"
                checked={formData.activo}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-buttons">
            <button
              type="button"
              className="btn-back"
              onClick={() => navigate(-1)}
            >
              ← Cancelar
            </button>
            <button type="submit" className="btn-save">
              <FaSave /> Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarUsuario;
