import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';

import Layout from './components/Layout';
import LoginInco from './components/LoginInco';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// GENERAL
import Dashboard from './screens/General/Dashboard';
import Estadisticas from './screens/General/Estadisticas';
import Actividad from './screens/General/Actividad';

// VUELOS
import CrearVuelo from './screens/Vuelos/CrearVuelo';
import EditarVuelo from './screens/Vuelos/EditarVuelo';
import Vuelo from './screens/Vuelos/Vuelo';
import AsignarPasajero from'./screens/Vuelos/AsignarPasajero';
import AsignarPasillo from './screens/Vuelos/AsignarPasillo';
import ListaVuelos from './screens/Vuelos/ListarVuelos';

// PASAJEROS
import CrearPasajero from './screens/Pasajeros/CrearPasajero';
import ActivarPasillo from './screens/Pasajeros/ActivarPasillo';
import PasajerosNuevo from './screens/Pasajeros/Nuevo';

// REPORTES
import ReporteDiario from './screens/Reportes/Diario';
import ReporteMensual from './screens/Reportes/Mensual';
import ReporteExportar from './screens/Reportes/Exportar';

// CIUDADES
import CiudadesListado from './screens/Ciudades/Listado';
import CiudadesAgregarCiudad from './screens/Ciudades/AgregarCiudad';
import CiudadesPopulares from './screens/Ciudades/Populares';

// CONFIGURACION
import ConfiguracionCrearUsuario from './screens/Configuracion/CrearUsuario';
import ConfiguracionGestorModulos from './screens/Configuracion/GestorModulos';
import ConfiguracionEditarUsuario from './screens/Configuracion/EditarUsuario';
import ConfiguracionUsuariosRegistrados from './screens/Configuracion/UsuariosRegistrados';

//AUDITORIA
import AuditoriaAuditoria from './screens/Auditoria/Auditoria';



function AppWrapper() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = () => {
    localStorage.removeItem("userData"); // <-- Esto es necesario
    setUser(null);
    navigate('/');
  };
  // PARA MANTENER SESION INICIADA AL GUARDAR EL TOKEN Y DATOS
  useEffect(() => {
  const savedUser = localStorage.getItem("userData");

  if (savedUser) {
    const parsed = JSON.parse(savedUser);
    const token = parsed.token;

    // Decodificar el token
    const base64Payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(base64Payload));

    const now = Math.floor(Date.now() / 1000); // tiempo actual en segundos

    // Verificar expiración
    if (decodedPayload.exp && decodedPayload.exp > now) {
      setUser(parsed); // Token válido, restaurar sesión
    } else {
      // Token expirado: cerrar sesión
      localStorage.removeItem("userData");
      setUser(null);
      navigate('/'); // redirigir al login
    }
  }
}, [navigate]);


  return (
    <Routes>
      {/* Página de inicio / login */}
      <Route
        path="/"
        element={
          !user ? <LoginInco setUser={setUser} /> : <Navigate to="/general/dashboard" />
        }
      />

      {/* Si el usuario está autenticado */}
      {user && (
        <Route
          path="*"
          element={
            <div className="app">
              <Navbar toggleSidebar={toggleSidebar} user={user} />
              <div className="layout">
                <Sidebar
                  isOpen={sidebarOpen}
                  toggleSidebar={toggleSidebar}
                  handleLogout={handleLogout}
                />
                <main className={`content ${sidebarOpen ? 'sidebar-open' : ''}`}>
                  <Routes>
                    {/* GENERAL */}
                    <Route path="/general/dashboard" element={<Layout><Dashboard /></Layout>} />
                    <Route path="/general/estadisticas" element={<Layout><Estadisticas /></Layout>} />
                    <Route path="/general/actividad" element={<Layout><Actividad /></Layout>} />

                    {/* VUELOS */}
                    <Route path="/vuelos/:id" element={<Layout><Vuelo /></Layout>} />
                    <Route path="/vuelos/editar/:id" element={<Layout><EditarVuelo /></Layout>} />
                    <Route path="/vuelos/crearvuelo" element={<Layout><CrearVuelo/></Layout>} />
                    <Route path="/vuelos/asignarpasajero" element={<Layout><AsignarPasajero /></Layout>} />
                    <Route path="/vuelos/asignarpasillo" element={<Layout><AsignarPasillo /></Layout>} />
                    <Route path="/vuelos/listarvuelos" element={<Layout><ListaVuelos/></Layout>} />
  
                    {/* PASAJEROS */}
                    <Route path="/pasajeros/crearpasajero" element={<Layout><CrearPasajero /></Layout>} />
                    <Route path="/pasajeros/activarpasillo" element={<Layout><ActivarPasillo/></Layout>} />
                    <Route path="/pasajeros/nuevo" element={<Layout><PasajerosNuevo /></Layout>} />

                    {/* REPORTES */}
                    <Route path="/reportes/diario" element={<Layout><ReporteDiario /></Layout>} />
                    <Route path="/reportes/mensual" element={<Layout><ReporteMensual /></Layout>} />
                    <Route path="/reportes/exportar" element={<Layout><ReporteExportar /></Layout>} />

                    {/* CIUDADES */}
                    <Route path="/ciudades/listado" element={<Layout><CiudadesListado /></Layout>} />
                    <Route path="/ciudades/agregarciudad" element={<Layout><CiudadesAgregarCiudad /></Layout>} />
                    <Route path="/ciudades/populares" element={<Layout><CiudadesPopulares /></Layout>} />

                    {/* CONFIGURACIÓN */}
                    <Route path="/configuracion/crearusuario" element={<Layout><ConfiguracionCrearUsuario /></Layout>} />
                    <Route path="/configuracion/gestormodulos" element={<Layout><ConfiguracionGestorModulos /></Layout>} />
                    <Route path="/configuracion/editarusuario/:id" element={<Layout><ConfiguracionEditarUsuario /></Layout>} />
                    <Route path="/configuracion/usuariosregistrados" element={<Layout><ConfiguracionUsuariosRegistrados /></Layout>} />

                    {/* AUDITORIA*/}
                    <Route path='/auditoria/auditoria' element={<Layout><AuditoriaAuditoria/></Layout>} />

                    {/* Ruta sí esta logueado */}
                    <Route path="*" element={<Navigate to="/general/dashboard" />} />

                    

                  </Routes>
                </main>
              </div>
            </div>
          }
        />
      )}

      {/* Redirección si no está logueado y accede a cualquier ruta */}
      {!user && (
        <Route path="*" element={<Navigate to="/" />} />
      )}
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
