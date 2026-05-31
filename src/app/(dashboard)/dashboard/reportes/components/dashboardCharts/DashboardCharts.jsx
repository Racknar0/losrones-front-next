import React, { useMemo, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import './DashboardCharts.scss';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

// Definidos fuera del componente para evitar errores de hoisting / Temporal Dead Zone en Next.js Fast Refresh
const formatCurrency = (value) =>
  new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(value);

const getChartHeight = (labelsCount) => {
  return Math.max(labelsCount * 22, 350) + 'px';
};

const DashboardCharts = ({ dataSales = [], allProducts = [] }) => {
  const [activePrimaryTab, setActivePrimaryTab] = useState('financial'); // 'financial' | 'rush-hours'
  const [activeTab, setActiveTab] = useState('sold-products'); // 'sold-products' | 'not-sold'

  // 1. Procesar datos para la gráfica de líneas (Financiera)
  const lineChartData = useMemo(() => {
    if (!dataSales || dataSales.length === 0) {
      return { labels: [], revenues: [], costs: [], profits: [] };
    }

    const salesByDate = {};

    dataSales.forEach((sale) => {
      const date = new Date(sale.createdAt);
      const dateStr = date.toLocaleDateString('es-MX', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      if (!salesByDate[dateStr]) {
        salesByDate[dateStr] = {
          revenue: 0,
          cost: 0,
        };
      }

      salesByDate[dateStr].revenue += Number(sale.totalAmount ?? 0);

      if (sale.saleItems) {
        sale.saleItems.forEach((item) => {
          salesByDate[dateStr].cost += Number(item.product?.purchasePrice ?? 0);
        });
      }
    });

    const sortedDates = Object.keys(salesByDate).sort((a, b) => {
      const [dayA, monthA, yearA] = a.split('/').map(Number);
      const [dayB, monthB, yearB] = b.split('/').map(Number);
      return new Date(yearA, monthA - 1, dayA) - new Date(yearB, monthB - 1, dayB);
    });

    const revenues = [];
    const costs = [];
    const profits = [];

    sortedDates.forEach((dateStr) => {
      const rev = salesByDate[dateStr].revenue;
      const cst = salesByDate[dateStr].cost;
      revenues.push(rev);
      costs.push(cst);
      profits.push(Math.max(rev - cst, 0));
    });

    const formattedLabels = sortedDates.map((dateStr) => {
      const [day, month] = dateStr.split('/');
      const months = [
        'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
        'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
      ];
      return `${parseInt(day)} ${months[parseInt(month) - 1]}`;
    });

    return {
      labels: formattedLabels,
      revenues,
      costs,
      profits,
    };
  }, [dataSales]);

  // 2. Procesar datos para la gráfica de Horas Pico (Rush Hours)
  const rushHoursChartData = useMemo(() => {
    if (!dataSales || dataSales.length === 0) {
      return { labels: [], dataset: [] };
    }

    const hourlySales = {};
    dataSales.forEach((sale) => {
      // Extrae la hora local del ticket
      const hour = new Date(sale.createdAt).getHours();
      if (!hourlySales[hour]) {
        hourlySales[hour] = 0;
      }
      hourlySales[hour] += Number(sale.totalAmount ?? 0);
    });

    const hoursArray = Object.keys(hourlySales).map(Number);
    
    // Mapear un rango inteligente continuo desde la primera venta hasta la última
    const minHour = hoursArray.length > 0 ? Math.min(...hoursArray) : 9;
    const maxHour = hoursArray.length > 0 ? Math.max(...hoursArray) : 21;

    const labels = [];
    const data = [];

    for (let h = minHour; h <= maxHour; h++) {
      labels.push(`${h.toString().padStart(2, '0')}:00`);
      data.push(hourlySales[h] || 0); // Si no hubo ventas a esa hora, se pinta 0 para reflejar el "bache" de ventas
    }

    return {
      labels,
      data,
    };
  }, [dataSales]);

  // 3. Procesar datos para la gráfica de Dona (Métodos de Pago)
  const doughnutChartData = useMemo(() => {
    if (!dataSales || dataSales.length === 0) {
      return { labels: [], datasets: [] };
    }

    const counts = {};
    dataSales.forEach((sale) => {
      const method = sale.paymentMethod || 'Otro';
      let label = method;
      if (method.toLowerCase() === 'cash' || method.toLowerCase() === 'efectivo') label = 'Efectivo';
      else if (method.toLowerCase() === 'card' || method.toLowerCase() === 'tarjeta') label = 'Tarjeta';
      else if (method.toLowerCase() === 'transfer' || method.toLowerCase() === 'transferencia') label = 'Transferencia';

      if (!counts[label]) {
        counts[label] = 0;
      }
      counts[label] += Number(sale.totalAmount ?? 0);
    });

    const labels = Object.keys(counts);
    const data = Object.values(counts);

    const colorMap = {
      'Efectivo': '#10B981', // Emerald 500
      'Tarjeta': '#3B82F6', // Blue 500
      'Transferencia': '#F59E0B', // Amber 500
    };

    const backgroundColors = labels.map(label => colorMap[label] || '#9CA3AF');

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColors,
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverOffset: 6,
        },
      ],
    };
  }, [dataSales]);

  // 4. Procesar datos para la gráfica de Productos Vendidos (Todo el catálogo ordenado de mayor a menor)
  const soldProductsChartData = useMemo(() => {
    if (!dataSales || dataSales.length === 0) {
      return { labels: [], datasets: [] };
    }

    const productCounts = {};
    dataSales.forEach((sale) => {
      if (sale.saleItems) {
        sale.saleItems.forEach((item) => {
          const name = item.product?.name || 'Desconocido';
          const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
          if (!productCounts[formattedName]) {
            productCounts[formattedName] = 0;
          }
          productCounts[formattedName]++;
        });
      }
    });

    // Ordenar de mayor a menor
    const sorted = Object.entries(productCounts)
      .sort((a, b) => b[1] - a[1]);

    const labels = sorted.map(entry => entry[0]);
    const data = sorted.map(entry => entry[1]);

    return {
      labels,
      datasets: [
        {
          label: 'Uds. Vendidas',
          data,
          backgroundColor: '#5a3ec8',
          hoverBackgroundColor: '#4932a5',
          borderRadius: 4,
          borderWidth: 0,
          barThickness: 8,
        },
      ],
    };
  }, [dataSales]);

  // 5. Procesar productos Sin Ventas (0 ventas en el periodo)
  const unsoldProductsList = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return [];

    const soldProductIds = new Set();
    dataSales.forEach((sale) => {
      if (sale.saleItems) {
        sale.saleItems.forEach((item) => {
          if (item.product?.id) {
            soldProductIds.add(item.product.id);
          }
        });
      }
    });

    const unsold = allProducts
      .filter((p) => !soldProductIds.has(p.id))
      .map((p) => {
        const stockCount = p.stockunit ? p.stockunit.filter(su => !su.sold && !su.isDeleted).length : 0;
        return {
          id: p.id,
          name: p.name.charAt(0).toUpperCase() + p.name.slice(1),
          code: p.code,
          stock: stockCount,
        };
      })
      .sort((a, b) => b.stock - a.stock); // Mostrar primero los de más stock

    return unsold;
  }, [dataSales, allProducts]);

  const hasData = lineChartData.labels.length > 0;

  // Totales agregados para las tarjetas rápidas del panel de gráficas
  const summary = useMemo(() => {
    const totalRev = lineChartData.revenues.reduce((a, b) => a + b, 0);
    const totalCost = lineChartData.costs.reduce((a, b) => a + b, 0);
    const totalProfit = Math.max(totalRev - totalCost, 0);
    const margin = totalRev > 0 ? ((totalProfit / totalRev) * 100).toFixed(1) : 0;

    return {
      revenue: totalRev,
      cost: totalCost,
      profit: totalProfit,
      margin,
    };
  }, [lineChartData]);

  // CONFIGURACIÓN: Gráfica de líneas (Financiera)
  const lineData = {
    labels: lineChartData.labels,
    datasets: [
      {
        label: 'Ventas (Ingresos)',
        data: lineChartData.revenues,
        borderColor: '#10B981',
        backgroundColor: 'transparent',
        borderWidth: 3,
        tension: 0.35,
        pointBackgroundColor: '#10B981',
        pointHoverRadius: 7,
      },
      {
        label: 'Costos de Compra',
        data: lineChartData.costs,
        borderColor: '#EF4444',
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderDash: [5, 5],
        tension: 0.35,
        pointBackgroundColor: '#EF4444',
        pointHoverRadius: 5,
      },
      {
        label: 'Ganancia Neta (Utilidad)',
        data: lineChartData.profits,
        borderColor: '#3B82F6',
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(59, 130, 246, 0.25)');
          gradient.addColorStop(1, 'rgba(59, 130, 246, 0.01)');
          return gradient;
        },
        borderWidth: 3,
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#3B82F6',
        pointHoverRadius: 7,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#374151',
          font: { size: 13, weight: 'bold', family: "'Inter', sans-serif" },
          usePointStyle: true,
          boxWidth: 8,
        },
      },
      tooltip: {
        backgroundColor: '#1F2937',
        titleFont: { size: 14, weight: 'bold', family: "'Inter', sans-serif" },
        bodyFont: { size: 13, family: "'Inter', sans-serif" },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        grid: { color: '#E5E7EB' },
        ticks: {
          color: '#6B7280',
          font: { family: "'Inter', sans-serif" },
          callback: (value) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(value),
        },
      },
      x: {
        grid: { display: false },
        ticks: { color: '#6B7280', font: { family: "'Inter', sans-serif" } },
      },
    },
  };

  // CONFIGURACIÓN: Gráfica de líneas (Horas Pico)
  const rushHoursData = {
    labels: rushHoursChartData.labels,
    datasets: [
      {
        label: 'Ventas por Hora ($)',
        data: rushHoursChartData.data,
        borderColor: '#5a3ec8', // Royal purple del tema principal
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(90, 62, 200, 0.25)'); // Púrpura translúcido arriba
          gradient.addColorStop(1, 'rgba(90, 62, 200, 0.01)'); // Transparente abajo
          return gradient;
        },
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#5a3ec8',
        pointHoverRadius: 7,
      },
    ],
  };

  const rushHoursOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }, // Se oculta la leyenda para máxima limpieza
      tooltip: {
        backgroundColor: '#1F2937',
        titleFont: { size: 14, weight: 'bold', family: "'Inter', sans-serif" },
        bodyFont: { size: 13, family: "'Inter', sans-serif" },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            let label = 'Vendido: ';
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        grid: { color: '#E5E7EB' },
        ticks: {
          color: '#6B7280',
          font: { family: "'Inter', sans-serif" },
          callback: (value) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(value),
        },
      },
      x: {
        grid: { display: false },
        ticks: { color: '#6B7280', font: { family: "'Inter', sans-serif" } },
      },
    },
  };

  // CONFIGURACIÓN: Dona (Métodos de Pago)
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#374151',
          font: { size: 12, weight: 'bold', family: "'Inter', sans-serif" },
          usePointStyle: true,
          boxWidth: 8,
        },
      },
      tooltip: {
        backgroundColor: '#1F2937',
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            const formattedVal = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
            return `${label}: ${formattedVal} (${percentage}%)`;
          },
        },
      },
    },
  };

  // CONFIGURACIÓN: Barras horizontales
  const barOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        right: 45,
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1F2937',
        callbacks: {
          label: (context) => `Cantidad: ${context.parsed.x} uds.`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: '#6B7280',
          font: { size: 11, family: "'Inter', sans-serif" },
          precision: 0,
        },
      },
      y: {
        grid: { display: false },
        ticks: {
          color: '#1F2937',
          font: { size: 12, weight: '600', family: "'Inter', sans-serif" },
        },
      },
    },
  };

  // PLUGIN NATIVO: Dibuja los números de cantidad a la derecha de cada barra horizontal
  const drawLabelsPlugin = {
    id: 'drawLabels',
    afterDatasetsDraw(chart) {
      const { ctx, data } = chart;
      ctx.save();
      ctx.font = 'bold 11.5px "Inter", sans-serif';
      ctx.fillStyle = '#4B5563';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';

      chart.getDatasetMeta(0).data.forEach((bar, index) => {
        const value = data.datasets[0].data[index];
        const { x, y } = bar;
        ctx.fillText(`${value} ud${value > 1 ? 's' : ''}`, x + 8, y);
      });
      ctx.restore();
    },
  };

  return (
    <div className="dashboard-charts-wrapper">
      {/* 1. GRÁFICA PRINCIPAL (TENDENCIA FINANCIERA O HORAS PICO EN TABS) */}
      <div className="dashboard-charts-card primary-card">
        <div className="charts-header has-tabs">
          <div>
            <h3 className="charts-title">Rendimiento Financiero y Operativo</h3>
            <p className="charts-subtitle">Analiza las tendencias de ventas o identifica las horas pico de tu tienda</p>
          </div>

          <div className="charts-tab-switcher">
            <button
              className={`tab-btn ${activePrimaryTab === 'financial' ? 'active' : ''}`}
              onClick={() => setActivePrimaryTab('financial')}
            >
              Tendencia Financiera
            </button>
            <button
              className={`tab-btn ${activePrimaryTab === 'rush-hours' ? 'active' : ''}`}
              onClick={() => setActivePrimaryTab('rush-hours')}
            >
              Horas Pico
            </button>
          </div>

          {hasData && activePrimaryTab === 'financial' && (
            <div className="charts-quick-summary">
              <div className="summary-item rev">
                <span className="label">Ventas</span>
                <span className="value">{formatCurrency(summary.revenue)}</span>
              </div>
              <div className="summary-item cst">
                <span className="label">Costos</span>
                <span className="value">{formatCurrency(summary.cost)}</span>
              </div>
              <div className="summary-item prf">
                <span className="label">Utilidad</span>
                <span className="value">{formatCurrency(summary.profit)}</span>
              </div>
              <div className="summary-item mgn">
                <span className="label">Margen Neto</span>
                <span className="value margin-badge">{summary.margin}%</span>
              </div>
            </div>
          )}
        </div>

        <div className="chart-container main-chart">
          {hasData ? (
            activePrimaryTab === 'financial' ? (
              <Line data={lineData} options={lineOptions} />
            ) : (
              <Line data={rushHoursData} options={rushHoursOptions} />
            )
          ) : (
            <div className="no-data-placeholder">
              <p>No hay ventas registradas para este periodo o sucursal.</p>
              <span>Intenta seleccionando otro rango de fechas en el calendario.</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. GRÁFICAS SECUNDARIAS (LADO A LADO EN GRID 1/4 y 3/4) */}
      {hasData && (
        <div className="dashboard-secondary-row">
          {/* GRÁFICA: METODOS DE PAGO */}
          <div className="dashboard-charts-card secondary-card">
            <div className="charts-header">
              <div>
                <h3 className="charts-title">Métodos de Pago</h3>
                <p className="charts-subtitle">Distribución de cobros en caja</p>
              </div>
            </div>
            <div className="chart-container secondary-chart">
              <Doughnut data={doughnutChartData} options={doughnutOptions} />
            </div>
          </div>

          {/* PANEL CON PESTAÑAS (TABS) PARA RENDIMIENTO DE PRODUCTOS */}
          <div className="dashboard-charts-card secondary-card">
            <div className="charts-header has-tabs">
              <div>
                <h3 className="charts-title">Rendimiento de Productos</h3>
                <p className="charts-subtitle">Estadísticas detalladas del inventario en el periodo</p>
              </div>

              {/* Selector de pestañas */}
              <div className="charts-tab-switcher">
                <button
                  className={`tab-btn ${activeTab === 'sold-products' ? 'active' : ''}`}
                  onClick={() => setActiveTab('sold-products')}
                >
                  Productos Vendidos ({soldProductsChartData.labels.length})
                </button>
                <button
                  className={`tab-btn ${activeTab === 'not-sold' ? 'active' : ''}`}
                  onClick={() => setActiveTab('not-sold')}
                >
                  Sin Ventas ({unsoldProductsList.length})
                </button>
              </div>
            </div>

            <div className="chart-container secondary-chart scrollable-content-wrapper">
              {/* TAB 1: PRODUCTOS VENDIDOS */}
              {activeTab === 'sold-products' && (
                <div className="chart-scroll-viewport">
                  {soldProductsChartData.labels.length > 0 ? (
                    <div style={{ height: getChartHeight(soldProductsChartData.labels.length), position: 'relative', width: '98%' }}>
                      <Bar data={soldProductsChartData} options={barOptions} plugins={[drawLabelsPlugin]} />
                    </div>
                  ) : (
                    <div className="no-data-placeholder">
                      <p>No hay datos disponibles</p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: SIN VENTAS */}
              {activeTab === 'not-sold' && (
                <div className="unsold-products-list-container">
                  {unsoldProductsList.length > 0 ? (
                    <div className="unsold-list-header">
                      <span className="col-prod">Producto</span>
                      <span className="col-code">Código</span>
                      <span className="col-stock">Stock actual</span>
                    </div>
                  ) : null}
                  <div className="unsold-list-scrollview">
                    {unsoldProductsList.length > 0 ? (
                      unsoldProductsList.map((prod) => (
                        <div className="unsold-item-row" key={prod.id}>
                          <span className="col-prod prod-name" title={prod.name}>{prod.name}</span>
                          <span className="col-code prod-code">{prod.code}</span>
                          <span className="col-stock">
                            <span className={`stock-pill ${prod.stock > 0 ? 'has-stock' : 'no-stock'}`}>
                              {prod.stock} uds.
                            </span>
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="no-data-placeholder">
                        <p>Todos los productos han tenido ventas en este periodo. ¡Excelente!</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardCharts;
