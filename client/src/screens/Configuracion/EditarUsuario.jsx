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
    rol: null, // guardamos solo el id del rol
    activo: true,
  });

  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Traemos roles y usuario en paralelo
        const [rolesRes, usuarioRes] = await Promise.all([
          axios.get("https://checkpass.parqueoo.com/api/Rol"),
          axios.get(`https://checkpass.parqueoo.com/api/Usuario/${id}`),
        ]);

        const rolesData = rolesRes.data;
        setRoles(rolesData);

        const usuario = usuarioRes.data;

        // Buscar el rol correspondiente
        const rolEncontrado = rolesData.find(
          (r) => r.rolNombre === usuario.nombreRol
        );

        setFormData({
          nombres: usuario.nombres || "",
          apellidos: usuario.apellidos || "",
          correo: usuario.correo || "",
          rol: rolEncontrado ? rolEncontrado.id_Rol : null,
          activo: usuario.activo ?? true,
        });
      } catch (err) {
        console.error("Error al obtener datos:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar los datos del usuario o roles.",
        });
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "rol"
          ? parseInt(value, 10) || null
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.rol) {
      Swal.fire({
        icon: "warning",
        title: "Falta el rol",
        text: "Por favor selecciona un rol válido.",
      });
      return;
    }

    try {
      await axios.put(`https://checkpass.parqueoo.com/api/Usuario/${id}`, {
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        correo: formData.correo,
        activo: formData.activo,
        id_Rol: formData.rol,
      });

      await Swal.fire({
        icon: "success",
        title: "Actualizado",
        text: "El usuario fue actualizado correctamente.",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/configuracion/usuariosregistrados");
    } catch (error) {
      const errors = error.response?.data?.errors;
      if (errors) {
        const field = Object.keys(errors)[0];
        const message = errors[field][0];
        Swal.fire({
          icon: "error",
          title: "Error de Validación",
          text: message || "Revisa los datos del formulario.",
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
              <select
                name="rol"
                value={formData.rol ?? ""}
                onChange={handleChange}
              >
                <option value="">Seleccione</option>
                {roles.length > 0 ? (
                  roles.map((rol) => (
                    <option key={rol.id_Rol} value={rol.id_Rol}>
                      {rol.rolNombre}
                    </option>
                  ))
                ) : (
                  <option disabled>Cargando roles...</option>
                )}
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
