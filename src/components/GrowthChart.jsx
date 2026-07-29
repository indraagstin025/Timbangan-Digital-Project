import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChartIcon, InfoCircledIcon } from '@radix-ui/react-icons';

export function GrowthChart({ data }) {
  const [selectedRange, setSelectedRange] = useState('6m');
  const [activeMetric, setActiveMetric] = useState('berat');
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Filter data based on range
  const getFilteredData = () => {
    switch (selectedRange) {
      case '7d':
        return data.slice(-7);
      case '30d':
        return data.slice(-12); // Simulated sub-set
      case '6m':
      default:
        return data;
    }
  };

  const chartData = getFilteredData();

  // ── Empty state: tidak ada data sama sekali
  if (!chartData || chartData.length === 0) {
    return (
      <div id="growth-chart-container" className="bg-white dark:bg-black rounded-lg p-4 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col h-full items-center justify-center min-h-[300px] transition-colors duration-300">
        <div className="text-center space-y-3">
          <div className="text-4xl">📊</div>
          <div className="font-bold text-sm text-gray-900 dark:text-white">Belum Ada Data Penimbangan</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 max-w-xs">
            Tambahkan minimal <strong>1 data penimbangan</strong> menggunakan tombol
            <strong> "+ Input Penimbangan Manual"</strong> di atas, lalu grafik akan otomatis muncul.
          </div>
        </div>
      </div>
    );
  }

  // Determine min and max values for scaling
  const values = chartData.map((d) => (activeMetric === 'berat' ? d.beratRataRata : d.adgRataRata));
  const rawMax = Math.max(...values);
  const rawMin = Math.min(...values);
  // Jika hanya 1 titik, beri padding 10% atas dan bawah agar titik tidak mepet tepi
  const maxVal = chartData.length === 1 ? rawMax * 1.15 : rawMax * 1.05;
  const minVal = chartData.length === 1 ? rawMin * 0.85 : rawMin * 0.95;
  const valRange = maxVal - minVal || 1; // Hindari division by zero jika semua nilai sama

  // Chart dimensions
  const svgWidth = 700;
  const svgHeight = 320;
  const paddingLeft = 55;
  const paddingRight = 20;
  const paddingTop = 30;
  const paddingBottom = 40;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  // Calculate coordinates — jika hanya 1 titik, letakkan di tengah
  const points = chartData.map((d, index) => {
    const val = activeMetric === 'berat' ? d.beratRataRata : d.adgRataRata;
    const xRatio = chartData.length === 1 ? 0.5 : index / (chartData.length - 1);
    const x = paddingLeft + xRatio * chartWidth;
    const y = paddingTop + chartHeight - ((val - minVal) / valRange) * chartHeight;
    return { x, y, data: d };
  });

  // Generate SVG Path
  const linePath = points.reduce((path, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = points[i - 1];
    const cpX1 = prev.x + (p.x - prev.x) / 2;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (p.x - prev.x) / 2;
    const cpY2 = p.y;
    return `${path} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p.x} ${p.y}`;
  }, '');

  // Generate Area Path (for gradient fill under the line)
  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`
    : '';

  // Y-axis ticks
  const tickCount = 5;
  const yTicks = Array.from({ length: tickCount }).map((_, i) => {
    const val = minVal + (i / (tickCount - 1)) * valRange;
    const y = paddingTop + chartHeight - (i / (tickCount - 1)) * chartHeight;
    return { val, y };
  });

  return (
    <div id="growth-chart-container" className="bg-white dark:bg-black rounded-lg p-4 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col h-full transition-colors duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 dark:border-gray-800 pb-3 mb-3 transition-colors duration-300">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-300">
              <BarChartIcon className="w-3.5 h-3.5 text-emerald-500" />
            </span>
            <h3 className="font-bold text-[11px] text-gray-900 dark:text-white font-sans transition-colors duration-300">Kurva Pertumbuhan</h3>
          </div>
          <p className="text-[9px] text-gray-500 font-sans mt-0.5">Analisis rata-rata populasi</p>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Metric Switcher */}
          <div className="flex bg-gray-50 dark:bg-gray-900 p-0.5 rounded-lg text-xs font-semibold mr-1 border border-gray-200 dark:border-gray-800 transition-colors duration-300">
            <button
              id="metric-berat"
              type="button"
              onClick={() => { setActiveMetric('berat'); setHoveredIndex(null); }}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                activeMetric === 'berat'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-xs border border-gray-300 dark:border-gray-700'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Berat (Kg)
            </button>
            <button
              id="metric-adg"
              type="button"
              onClick={() => { setActiveMetric('adg'); setHoveredIndex(null); }}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                activeMetric === 'adg'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-xs border border-gray-300 dark:border-gray-700'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              ADG (Kg/H)
            </button>
          </div>

          {/* Timeframe selector */}
          <div className="flex bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-0.5 rounded-lg text-xs font-semibold transition-colors duration-300">
            {['7d', '30d', '6m'].map((range) => (
              <button
                id={`range-${range}`}
                key={range}
                type="button"
                onClick={() => { setSelectedRange(range); setHoveredIndex(null); }}
                className={`px-2.5 py-1.5 rounded-md transition-all cursor-pointer ${
                  selectedRange === range
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {range === '7d' ? '7 Hari' : range === '30d' ? '30 Hari' : '6 Bulan'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chart Canvas */}
      <div className="relative flex-1 min-h-[300px] w-full select-none overflow-x-auto">
        <div className="min-w-[700px] h-[300px] relative">
          <svg
            id="livestock-growth-svg"
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-full overflow-visible"
          >
          {/* Gradients */}
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="adgGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines & Y Axis values */}
          {yTicks.map((tick, idx) => (
            <g key={idx} className="opacity-70">
              <line
                x1={paddingLeft}
                y1={tick.y}
                x2={svgWidth - paddingRight}
                y2={tick.y}
                className="stroke-gray-200 dark:stroke-gray-700 transition-colors duration-300"
                strokeWidth="1"
                strokeDasharray={idx === 0 ? '0' : '3 3'}
              />
              <text
                x={paddingLeft - 10}
                y={tick.y + 4}
                textAnchor="end"
                className="fill-gray-500 dark:fill-gray-400 font-mono text-[10px] font-medium transition-colors duration-300"
              >
                {activeMetric === 'berat'
                  ? `${Math.round(tick.val)} Kg`
                  : `${tick.val.toFixed(2)}`}
              </text>
            </g>
          ))}

          {/* X Axis Timeline Labels */}
          {points.map((p, idx) => {
            if (selectedRange === '30d' && idx % 2 !== 0) return null;
            return (
              <text
                key={idx}
                x={p.x}
                y={svgHeight - 12}
                textAnchor="middle"
                className="fill-gray-500 dark:fill-gray-400 font-sans text-[10px] font-medium transition-colors duration-300"
              >
                {p.data.tanggal}
              </text>
            );
          })}

          {/* Area Gradient (underneath spline) */}
          {points.length > 0 && (
            <path
              d={areaPath}
              fill={activeMetric === 'berat' ? 'url(#chartGradient)' : 'url(#adgGradient)'}
              className="transition-all duration-500 ease-out"
            />
          )}

          {/* Path Line (Spline) */}
          {points.length > 0 && (
            <path
              d={linePath}
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="transition-all duration-500 ease-out"
            />
          )}

          {/* Highlight Column Hover Line */}
          {hoveredIndex !== null && points[hoveredIndex] && (
            <line
              x1={points[hoveredIndex].x}
              y1={paddingTop}
              x2={points[hoveredIndex].x}
              y2={paddingTop + chartHeight}
              stroke="#4b5563"
              strokeWidth="1"
              strokeDasharray="3 3"
              className="pointer-events-none"
            />
          )}

          {/* Interactive Circle Nodes */}
          {points.map((p, idx) => (
            <g key={idx}>
              <circle
                cx={p.x}
                cy={p.y}
                r="18"
                className="fill-transparent cursor-pointer"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredIndex === idx ? '5' : '3.5'}
                fill="#10b981"
                stroke="#ffffff"
                strokeWidth={hoveredIndex === idx ? '2.5' : '1.5'}
                className="pointer-events-none shadow-sm transition-all duration-200"
              />
            </g>
          ))}
        </svg>

        {/* Absolute-positioned Tooltip Bubble */}
        <AnimatePresence>
          {hoveredIndex !== null && points[hoveredIndex] && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.1 }}
              style={{
                position: 'absolute',
                left: `${(points[hoveredIndex].x / svgWidth) * 100}%`,
                top: `${(points[hoveredIndex].y / svgHeight) * 100 - 15}%`,
                transform: 'translate(-50%, -100%)',
              }}
              className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs rounded-md p-3 shadow-md pointer-events-none z-30 min-w-[155px] border border-gray-200 dark:border-gray-800 transition-colors duration-300"
            >
              <p className="font-semibold text-gray-500 dark:text-gray-400 text-[10px] uppercase tracking-wider mb-1 font-sans">
                {points[hoveredIndex].data.tanggal}
              </p>
              <div className="space-y-1 font-mono">
                <div className="flex justify-between items-center gap-4">
                  <span className="text-gray-500 dark:text-gray-400 font-sans">Rata-rata Berat:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {points[hoveredIndex].data.beratRataRata} Kg
                  </span>
                </div>
                <div className="flex justify-between items-center gap-4">
                  <span className="text-gray-500 dark:text-gray-400 font-sans">Rata-rata ADG:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    +{points[hoveredIndex].data.adgRataRata.toFixed(2)} Kg/H
                  </span>
                </div>
              </div>
              <div className="w-2 h-2 bg-white dark:bg-gray-900 rotate-45 absolute bottom-[-4px] left-1/2 -translate-x-1/2 border-r border-b border-gray-200 dark:border-gray-800 transition-colors duration-300" />
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>

      {/* Analytics Card Bottom Banner */}
      <div className="mt-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 flex items-start gap-3 transition-colors duration-300">
        <InfoCircledIcon className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
        <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-sans transition-colors duration-300">
          <span className="font-bold text-gray-900 dark:text-white transition-colors duration-300">Penjelasan Tren:</span> Grafik menunjukkan tren pertumbuhan berat berkelanjutan. Tingkat pertumbuhan harian (<span className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">ADG / Average Daily Gain</span>) berada pada kisaran optimal <span className="font-semibold text-emerald-600 dark:text-emerald-500 font-mono transition-colors duration-300">+0.81 Kg/hari</span>, dipicu oleh formula pakan konsentrat pakan bernutrisi tinggi jenis protein 16%.
        </div>
      </div>
    </div>
  );
}
