# Gráficos y Charts — Referencia Completa

## Selección de Librería

| Caso de uso | Librería recomendada | Por qué |
|------------|---------------------|---------|
| Dashboard React simple | **Recharts** | Ya disponible en artifacts, API declarativa |
| Charts HTML básicos | **Chart.js** | Ligero, muy completo, CDN fácil |
| Charts avanzados / interactivos | **ApexCharts** | Tooltips hermosos, animaciones built-in |
| Visualizaciones custom | **D3.js** | Máxima flexibilidad |
| Científico / 3D | **Plotly** | Soporta 3D, estadísticas |

---

## Recharts (React — disponible en artifacts)

```jsx
import {
  LineChart, BarChart, PieChart, AreaChart, RadarChart,
  Line, Bar, Pie, Area, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell,
  ResponsiveContainer
} from 'recharts';

// Datos de ejemplo
const data = [
  { mes: 'Ene', ventas: 4200, gastos: 2400 },
  { mes: 'Feb', ventas: 5800, gastos: 3100 },
  { mes: 'Mar', ventas: 3900, gastos: 2800 },
  { mes: 'Abr', ventas: 7200, gastos: 3400 },
  { mes: 'May', ventas: 6500, gastos: 4100 },
  { mes: 'Jun', ventas: 8900, gastos: 4800 },
];

// ── Area Chart (el más bonito para tendencias)
<ResponsiveContainer width="100%" height={300}>
  <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
    <defs>
      <linearGradient id="gradVentas" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
      </linearGradient>
    </defs>
    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)"/>
    <XAxis dataKey="mes" stroke="#94a3b8" tick={{ fontSize: 12 }}/>
    <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }}/>
    <Tooltip 
      contentStyle={{ background: '#1e1b4b', border: '1px solid #4f46e5', borderRadius: 8 }}
      labelStyle={{ color: '#a5b4fc' }}
    />
    <Area type="monotone" dataKey="ventas" stroke="#6366f1" fill="url(#gradVentas)" strokeWidth={2}/>
  </AreaChart>
</ResponsiveContainer>

// ── Bar Chart con colores personalizados
const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe'];
<ResponsiveContainer width="100%" height={280}>
  <BarChart data={data} barSize={32}>
    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)"/>
    <XAxis dataKey="mes" axisLine={false} tickLine={false}/>
    <YAxis axisLine={false} tickLine={false}/>
    <Tooltip cursor={{ fill: 'rgba(99,102,241,0.1)' }}/>
    <Bar dataKey="ventas" radius={[6, 6, 0, 0]}>
      {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
    </Bar>
  </BarChart>
</ResponsiveContainer>

// ── Donut Chart
const pieData = [
  { name: 'Producto A', value: 35 },
  { name: 'Producto B', value: 28 },
  { name: 'Producto C', value: 22 },
  { name: 'Otros', value: 15 },
];
<ResponsiveContainer width="100%" height={280}>
  <PieChart>
    <Pie
      data={pieData}
      cx="50%" cy="50%"
      innerRadius={70} outerRadius={110}
      paddingAngle={4}
      dataKey="value"
    >
      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
    </Pie>
    <Tooltip/>
    <Legend />
  </PieChart>
</ResponsiveContainer>

// ── Radar Chart (perfiles, competencias)
const radarData = [
  { skill: 'React', A: 90 }, { skill: 'CSS', A: 85 },
  { skill: 'Node', A: 70 }, { skill: 'SQL', A: 75 }, { skill: 'UX', A: 80 },
];
<ResponsiveContainer width="100%" height={300}>
  <RadarChart data={radarData}>
    <PolarGrid stroke="rgba(99,102,241,0.2)"/>
    <PolarAngleAxis dataKey="skill" tick={{ fill: '#94a3b8', fontSize: 12 }}/>
    <Radar dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3}/>
  </RadarChart>
</ResponsiveContainer>
```

---

## Chart.js (HTML — CDN)

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js"></script>
<canvas id="miChart" width="400" height="200"></canvas>

<script>
// ── Line Chart con gradiente
const ctx = document.getElementById('miChart').getContext('2d');
const gradient = ctx.createLinearGradient(0, 0, 0, 300);
gradient.addColorStop(0, 'rgba(99, 102, 241, 0.4)');
gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');

new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [{
      label: 'Ventas',
      data: [4200, 5800, 3900, 7200, 6500, 8900],
      borderColor: '#6366f1',
      backgroundColor: gradient,
      borderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 8,
      pointBackgroundColor: '#fff',
      pointBorderColor: '#6366f1',
      tension: 0.4,
      fill: true,
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e1b4b',
        titleColor: '#a5b4fc',
        bodyColor: '#e2e8f0',
        borderColor: '#4f46e5',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
      }
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } }
    }
  }
});

// ── Doughnut / Pie
new Chart(document.getElementById('pieChart'), {
  type: 'doughnut',
  data: {
    labels: ['A', 'B', 'C', 'D'],
    datasets: [{
      data: [35, 28, 22, 15],
      backgroundColor: ['#6366f1', '#8b5cf6', '#a78bfa', '#475569'],
      borderWidth: 0,
      hoverOffset: 8,
    }]
  },
  options: {
    cutout: '70%',
    plugins: { legend: { position: 'bottom' } }
  }
});

// ── Bar horizontal
new Chart(document.getElementById('barChart'), {
  type: 'bar',
  data: {
    labels: ['React', 'Vue', 'Angular', 'Svelte'],
    datasets: [{
      data: [67, 18, 9, 6],
      backgroundColor: ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd'],
      borderRadius: 6,
    }]
  },
  options: { indexAxis: 'y', plugins: { legend: { display: false } } }
});
</script>
```

---

## ApexCharts (HTML — charts más hermosos)

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/apexcharts/3.44.0/apexcharts.min.js"></script>
<div id="apexChart"></div>

<script>
const chart = new ApexCharts(document.querySelector("#apexChart"), {
  chart: {
    type: 'area',
    height: 300,
    toolbar: { show: false },
    animations: { enabled: true, easing: 'easeinout', speed: 800 },
    background: 'transparent',
  },
  theme: { mode: 'dark' },
  series: [{ name: 'Ventas', data: [31, 40, 28, 51, 42, 109, 100] }],
  xaxis: { categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'] },
  colors: ['#6366f1'],
  fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.5, opacityTo: 0 } },
  stroke: { curve: 'smooth', width: 2 },
  dataLabels: { enabled: false },
  grid: { borderColor: 'rgba(255,255,255,0.08)' },
  tooltip: { theme: 'dark' },
});
chart.render();
</script>
```

---

## KPI Cards con Contador Animado

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/countup.js/2.6.2/countUp.umd.js"></script>

<div class="kpi-grid">
  <div class="kpi-card">
    <span class="kpi-label">Ingresos</span>
    <span class="kpi-value" id="kpi1">0</span>
    <span class="kpi-suffix">USD</span>
    <span class="kpi-change positive">+12.5% ↑</span>
  </div>
</div>

<script>
// Iniciar contadores al cargar
document.addEventListener('DOMContentLoaded', () => {
  new countUp.CountUp('kpi1', 128450, { 
    duration: 2.5, 
    separator: ',',
    prefix: '$'
  }).start();
});
</script>
```

---

## Mini Sparkline (CSS puro — sin JS)

```css
/* Usar SVG inline para sparklines */
```
```html
<svg viewBox="0 0 100 30" class="sparkline">
  <polyline
    points="0,25 16,20 33,22 50,10 66,15 83,5 100,8"
    fill="none" stroke="#6366f1" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round"
  />
</svg>
```

---

## Gauge / Medidor Circular (CSS puro)

```css
.gauge {
  --value: 72; /* porcentaje */
  width: 120px; height: 120px;
  border-radius: 50%;
  background: conic-gradient(
    #6366f1 calc(var(--value) * 1%), 
    rgba(255,255,255,0.1) 0
  );
  display: grid; place-items: center;
  font-size: 1.5rem; font-weight: 700;
}
.gauge::after { content: attr(data-label); }
```
```html
<div class="gauge" style="--value: 72" data-label="72%"></div>
```
