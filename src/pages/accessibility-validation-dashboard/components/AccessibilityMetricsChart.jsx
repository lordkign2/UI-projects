import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const AccessibilityMetricsChart = ({ selectedMetric = 'contrast', onMetricChange, setSelectedMetric }) => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Available metrics
  const metrics = [
  {
    id: 'contrast',
    name: 'Contrast Ratios',
    icon: 'BarChart3',
    description: 'Color contrast analysis across palette'
  },
  {
    id: 'compliance',
    name: 'WCAG Compliance',
    icon: 'PieChart',
    description: 'AA/AAA compliance distribution'
  },
  {
    id: 'colorblind',
    name: 'Colorblind Impact',
    icon: 'TrendingUp',
    description: 'Visibility across deficiency types'
  },
  {
    id: 'usage',
    name: 'Color Usage',
    icon: 'Activity',
    description: 'Frequency and context analysis'
  }];


  // Generate mock data based on selected metric
  useEffect(() => {
    setIsLoading(true);

    setTimeout(() => {
      let data = [];

      switch (selectedMetric) {
        case 'contrast':
          data = [
          { name: 'Primary Blue', ratio: 3.2, level: 'FAIL', color: '#2563EB' },
          { name: 'Sky Blue', ratio: 2.8, level: 'FAIL', color: '#0EA5E9' },
          { name: 'Success Green', ratio: 5.1, level: 'AA', color: '#059669' },
          { name: 'Warning Orange', ratio: 4.1, level: 'FAIL', color: '#D97706' },
          { name: 'Error Red', ratio: 6.8, level: 'AA', color: '#DC2626' },
          { name: 'Neutral Gray', ratio: 2.8, level: 'FAIL', color: '#64748B' }];

          break;

        case 'compliance':
          data = [
          { name: 'AAA Compliant', value: 1, count: 1, color: '#059669' },
          { name: 'AA Compliant', value: 2, count: 2, color: '#D97706' },
          { name: 'Non-Compliant', value: 3, count: 3, color: '#DC2626' }];

          break;

        case 'colorblind':
          data = [
          { name: 'Protanopia', affected: 4, total: 6, percentage: 67, severity: 'high' },
          { name: 'Deuteranopia', affected: 3, total: 6, percentage: 50, severity: 'medium' },
          { name: 'Tritanopia', affected: 2, total: 6, percentage: 33, severity: 'low' },
          { name: 'Protanomaly', affected: 2, total: 6, percentage: 33, severity: 'low' },
          { name: 'Deuteranomaly', affected: 3, total: 6, percentage: 50, severity: 'medium' },
          { name: 'Tritanomaly', affected: 1, total: 6, percentage: 17, severity: 'low' }];

          break;

        case 'usage':
          data = [
          { name: 'Primary', usage: 85, contexts: ['Buttons', 'Links', 'Headers'], frequency: 'high' },
          { name: 'Secondary', usage: 45, contexts: ['Backgrounds', 'Borders'], frequency: 'medium' },
          { name: 'Success', usage: 25, contexts: ['Alerts', 'Status'], frequency: 'low' },
          { name: 'Warning', usage: 35, contexts: ['Alerts', 'Badges'], frequency: 'medium' },
          { name: 'Error', usage: 20, contexts: ['Alerts', 'Validation'], frequency: 'low' },
          { name: 'Neutral', usage: 60, contexts: ['Text', 'Icons'], frequency: 'high' }];

          break;

        default:
          data = [];
      }

      setChartData(data);
      setIsLoading(false);
    }, 500);
  }, [selectedMetric]);

  const renderContrastChart = () =>
  <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis
        dataKey="name"
        stroke="var(--color-text-secondary)"
        fontSize={12}
        angle={-45}
        textAnchor="end"
        height={80} />

        <YAxis
        stroke="var(--color-text-secondary)"
        fontSize={12}
        domain={[0, 8]} />

        <Tooltip
        contentStyle={{
          backgroundColor: 'var(--color-popover)',
          border: '1px solid var(--color-border)',
          borderRadius: '8px',
          fontSize: '12px'
        }}
        formatter={(value, name) => [`${value}:1`, 'Contrast Ratio']} />

        <Bar
        dataKey="ratio"
        fill="var(--color-accent)"
        radius={[4, 4, 0, 0]}>

          {chartData?.map((entry, index) =>
        <Cell
          key={`cell-${index}`}
          fill={
          entry?.level === 'AAA' ? 'var(--color-success)' :
          entry?.level === 'AA' ? 'var(--color-warning)' :
          'var(--color-error)'
          } />

        )}
        </Bar>
        {/* Reference lines for WCAG standards */}
        <Bar dataKey={() => 4.5} fill="transparent" stroke="var(--color-warning)" strokeWidth={2} strokeDasharray="5 5" />
        <Bar dataKey={() => 7} fill="transparent" stroke="var(--color-success)" strokeWidth={2} strokeDasharray="5 5" />
      </BarChart>
    </ResponsiveContainer>;


  const renderComplianceChart = () =>
  <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
        data={chartData}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={120}
        paddingAngle={5}
        dataKey="value">

          {chartData?.map((entry, index) =>
        <Cell key={`cell-${index}`} fill={entry?.color} />
        )}
        </Pie>
        <Tooltip
        contentStyle={{
          backgroundColor: 'var(--color-popover)',
          border: '1px solid var(--color-border)',
          borderRadius: '8px',
          fontSize: '12px'
        }}
        formatter={(value, name, props) => [`${props?.payload?.count} colors`, name]} />

      </PieChart>
    </ResponsiveContainer>;


  const renderColorblindChart = () =>
  <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis
        dataKey="name"
        stroke="var(--color-text-secondary)"
        fontSize={12}
        angle={-45}
        textAnchor="end"
        height={80} />

        <YAxis
        stroke="var(--color-text-secondary)"
        fontSize={12}
        domain={[0, 100]}
        tickFormatter={(value) => `${value}%`} />

        <Tooltip
        contentStyle={{
          backgroundColor: 'var(--color-popover)',
          border: '1px solid var(--color-border)',
          borderRadius: '8px',
          fontSize: '12px'
        }}
        formatter={(value) => [`${value}%`, 'Colors Affected']} />

        <Bar
        dataKey="percentage"
        fill="var(--color-accent)"
        radius={[4, 4, 0, 0]}>

          {chartData?.map((entry, index) =>
        <Cell
          key={`cell-${index}`}
          fill={
          entry?.severity === 'high' ? 'var(--color-error)' :
          entry?.severity === 'medium' ? 'var(--color-warning)' :
          'var(--color-success)'
          } />

        )}
        </Bar>
      </BarChart>
    </ResponsiveContainer>;


  const renderUsageChart = () =>
  <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis
        dataKey="name"
        stroke="var(--color-text-secondary)"
        fontSize={12} />

        <YAxis
        stroke="var(--color-text-secondary)"
        fontSize={12}
        domain={[0, 100]}
        tickFormatter={(value) => `${value}%`} />

        <Tooltip
        contentStyle={{
          backgroundColor: 'var(--color-popover)',
          border: '1px solid var(--color-border)',
          borderRadius: '8px',
          fontSize: '12px'
        }}
        formatter={(value) => [`${value}%`, 'Usage Frequency']} />

        <Line
        type="monotone"
        dataKey="usage"
        stroke="var(--color-accent)"
        strokeWidth={3}
        dot={{ fill: 'var(--color-accent)', strokeWidth: 2, r: 6 }}
        activeDot={{ r: 8, stroke: 'var(--color-accent)', strokeWidth: 2 }} />

      </LineChart>
    </ResponsiveContainer>;


  const renderChart = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2 text-text-secondary">
            <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            <span>Loading chart data...</span>
          </div>
        </div>);

    }

    switch (selectedMetric) {
      case 'contrast':return renderContrastChart();
      case 'compliance':return renderComplianceChart();
      case 'colorblind':return renderColorblindChart();
      case 'usage':return renderUsageChart();
      default:return null;
    }
  };

  const selectedMetricData = metrics?.find((m) => m?.id === selectedMetric);

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Accessibility Metrics</h3>
          <p className="text-sm text-text-secondary">{selectedMetricData?.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name={selectedMetricData?.icon || 'BarChart3'} size={20} className="text-text-secondary" />
        </div>
      </div>
      {/* Metric Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {metrics?.map((metric) =>
        <button
          key={metric?.id}
          onClick={() => {
            setSelectedMetric(metric?.id);
            if (onMetricChange) onMetricChange(metric?.id);
          }}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          selectedMetric === metric?.id ?
          'bg-accent text-accent-foreground shadow-soft' :
          'bg-muted text-text-secondary hover:text-text-primary hover:bg-muted/80'}`
          }>

            <Icon name={metric?.icon} size={14} />
            <span>{metric?.name}</span>
          </button>
        )}
      </div>
      {/* Chart Container */}
      <motion.div
        key={selectedMetric}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full">

        {renderChart()}
      </motion.div>
      {/* Chart Legend/Summary */}
      {selectedMetric === 'contrast' && !isLoading &&
      <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-success rounded" />
                <span className="text-text-secondary">AAA (7:1+)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-warning rounded" />
                <span className="text-text-secondary">AA (4.5:1+)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-error rounded" />
                <span className="text-text-secondary">Fail (&lt;4.5:1)</span>
              </div>
            </div>
          </div>
        </div>
      }
      {selectedMetric === 'compliance' && !isLoading &&
      <div className="mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-3 gap-4 text-center">
            {chartData?.map((item, index) =>
          <div key={index} className="flex flex-col items-center space-y-1">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: item?.color }} />
                <span className="text-xs text-text-secondary">{item?.name}</span>
                <span className="text-sm font-medium text-text-primary">{item?.count}</span>
              </div>
          )}
          </div>
        </div>
      }
    </div>);

};

export default AccessibilityMetricsChart;