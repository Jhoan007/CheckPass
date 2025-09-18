import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../App.css";

import {
  FaPlaneDeparture,
  FaPlaneArrival,
  FaExclamationTriangle,
  FaBell,
} from "react-icons/fa";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

// REGISTRO CHART
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler
);

// DATOS DEL GRÁFICO (SIMULADOS, puedes reemplazar por reales)
const chartData = {
  labels: ["12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
  datasets: [
    {
      label: "Flujo de Pasajeros",
      data: [10, 20, 15, 25, 18, 30],
      fill: true,
      backgroundColor: "rgba(75,192,192,0.2)",
      borderColor: "rgba(75,192,192,1)",
      tension: 0.4,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "top" },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const Dashboard = () => {
  const navigate = useNavigate();

  const [vuelos, setVuelos] = useState([]);
  const [cancelados, setCancelados] = useState(0);
  const [vuelosNacionales, setVuelosNacionales] = useState(0);
  const [vuelosInternacionales, setVuelosInternacionales] = useState(0);
  const [pasillos, setPasillos] = useState([]);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        // Vuelos
        const resVuelos = await axios.get(
          "https://checkpass.parqueoo.com/api/ProgramacionVuelo"
        );
        const vuelosData = resVuelos.data;
        setVuelos(vuelosData);

        // Cancelados
        const vuelosCancelados = vuelosData.filter((v) => v.cancelado);
        setCancelados(vuelosCancelados.length);
        
        // Tipo de vuelos
        const vuelosNac = vuelosData.filter((v) => !v.esInternacional).length;
        const vuelosInt = vuelosData.filter((v) => v.esInternacional).length;
        setVuelosNacionales(vuelosNac);
        setVuelosInternacionales(vuelosInt);

        // Pasillos
        const resPasillos = await axios.get(
          "https://checkpass.parqueoo.com/api/Pasillo"
        );
        setPasillos(resPasillos.data);
      } catch (error) {
        console.error("Error al cargar datos del dashboard:", error);
      }
    };

    fetchDatos();
  }, []);

  // Calcular pasillos inactivos
  const pasillosInactivos = pasillos.filter((p) => !p.activo).length;

  const formatearHora = (fecha) => {
    const fechaUtc = fecha.endsWith("Z") ? fecha : fecha + "Z";
    const date = new Date(fechaUtc);
    return date.toLocaleString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="dashboard">
      {/* TARJETAS ESTADÍSTICAS */}
      <div className="stats-cards">
        <div className="card">
          <div className="card-header">
            <FaExclamationTriangle className="icon red" />
            <span>Vuelos Cancelados</span>
          </div>
          <h2>
            {cancelados}/{vuelos.length}
          </h2>
          <p className="green">↑ 15% Última hora</p>
        </div>

        <div className="card">
          <div className="card-header">
            <FaBell className="icon yellow" />
            <span>Tipo de Vuelos</span>
          </div>
          <h2>
            {vuelosNacionales} NAL / {vuelosInternacionales} INTL
          </h2>
          <p className="green">↑ 5% Mejora</p>
        </div>

        <div className="card">
          <div className="card-header">
            <FaPlaneDeparture className="icon green" />
            <span>Vuelos</span>
          </div>
          <h2>{vuelos.length}</h2>
          <p className="red">↓ 2% Disminución hoy</p>
        </div>

        <div className="card">
          <div className="card-header">
            <FaPlaneArrival className="icon red" />
            <span>Pasillos Inactivos</span>
          </div>
          <h2>{pasillosInactivos}</h2>
          <p className="green">↑ 5% Mejora</p>
        </div>
      </div>

      {/* TABLA + GRAFICO */}
      <div className="dashboard-content-row">
        {/* TABLA DE VUELOS */}
        <div className="table-section">
          <h3>Vuelos por Aerolínea</h3>
          <table>
            <thead>
              <tr>
                <th>Vuelo</th>
                <th>Salida</th>
                <th>Llegada</th>
                <th>Origen</th>
                <th>Destino</th>
                <th>Aerolínea</th>
                <th>Tipo</th>
              </tr>
            </thead>
            <tbody>
              {vuelos.map((vuelo) => (
                <tr
                  key={vuelo.id_Programacion}
                  onClick={() => navigate(`/vuelos/${vuelo.id_Programacion}`)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{vuelo.numeroVuelo}</td>
                  <td>{formatearHora(vuelo.salida)}</td>
                  <td>{formatearHora(vuelo.llegada)}</td>
                  <td>{vuelo.ciudadOrigen || "—"}</td>
                  <td>{vuelo.ciudadDestino || "—"}</td>
                  <td>{vuelo.aerolineaNombre || "—"}</td>
                  <td>
                    <span
                      className={`status ${
                        vuelo.esInternacional ? "danger" : "success"
                      }`}
                    >
                      {vuelo.esInternacional ? "Internacional" : "Nacional"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* GRAFICO */}
        <div className="chart-section">
          <h3>Flujo de Pasajeros</h3>
          <div className="chart-container">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
