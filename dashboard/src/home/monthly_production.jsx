import React, { useEffect, useState } from 'react';
import timeOperationData from "../data/time_operation.json";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
  ResponsiveContainer,
} from 'recharts';

const Monthly_Production = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Process data from the JSON file
    const chartDataProcessed = processDataForChart(timeOperationData);
    setChartData(chartDataProcessed);
  }, []); 

  const processDataForChart = (data) => {
    const groupData = data.reduce((acc, current) => {
      const dateStr = current.Fecha;
      const dateParts = dateStr.split('/').map(Number);
      const date = new Date(dateParts[2], dateParts[0] - 1, dateParts[1]); 

      const monthYearKey = date.toLocaleString('default', { month: 'long', year: 'numeric' });

      if (!acc[monthYearKey]) {
        acc[monthYearKey] = { Fecha: monthYearKey, tiempo: 0 };
      }
      if (current["Tiempo (hh:mm:ss)"]) { // Updated key name here
        acc[monthYearKey].tiempo += convertTimeToSeconds(current["Tiempo (hh:mm:ss)"]); // Updated key name here
      }
      return acc;
    }, {});

    const result = Object.values(groupData).map(proj => ({
      Fecha: proj.Fecha,
      tiempo: proj.tiempo / 3600
    }));

    result.sort((a, b) => new Date(a.Fecha) - new Date(b.Fecha));

    return result;
  };

  function convertTimeToSeconds(time) {
    const parts = time.split(':');
    let seconds = 0;
    if (parts.length === 3) {
      seconds += parseInt(parts[0]) * 3600;
      seconds += parseInt(parts[1]) * 60;
      seconds += parseFloat(parts[2]);
    } else if (parts.length === 2) {
      seconds += parseInt(parts[0]) * 60;
      seconds += parseFloat(parts[1]);
    }
    return seconds;
  }

  return (
    <div>
      <h4 style={{ textAlign: 'center' }}>Monthly Production CNC Machine</h4>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={chartData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Fecha" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="tiempo"
            stroke="#82ca9d"
            fill="#82ca9d"
            name="Horas de producción"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Monthly_Production;