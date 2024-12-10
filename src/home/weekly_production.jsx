import React, { useEffect, useState } from 'react';
import timeOperationData from "../data/time_operation.json"; // Assuming the JSON file is in the same directory
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const Weekly_Production = () => {
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

      const weekNumber = getWeekNumber(date);
      const year = date.getFullYear();
      const weekYearKey = `${year}-${dateParts[0]}-W${weekNumber}`; 
      if (!acc[weekYearKey]) {
        acc[weekYearKey] = { Fecha: weekYearKey, tiempo: 0 };
      }
      if (current["Tiempo (hh:mm:ss)"]) { // Updated key name here
        acc[weekYearKey].tiempo += convertTimeToSeconds(current["Tiempo (hh:mm:ss)"]); // Updated key name here
      }
      return acc;
    }, {});

    const weeklyData = Object.values(groupData).map(proj => ({
      Fecha: proj.Fecha, 
      tiempo: proj.tiempo / 3600 
    }));

    return aggregateWeeksByMonth(weeklyData);
  };

  const aggregateWeeksByMonth = (weeklyData) => {
    const monthlyData = {};

    weeklyData.forEach((week) => {
      const [year, month] = week.Fecha.split('-').slice(0, 2); 
      const monthKey = `${year}-${month}`; 

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { Fecha: monthKey, semanas: [] };
      }

      monthlyData[monthKey].semanas.push({
        semana: week.Fecha.split('-W')[1], 
        tiempo: week.tiempo
      });
    });

    return Object.values(monthlyData);
  };

  const getWeekNumber = (date) => {
    const startDate = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + startDate.getDay() + 1) / 7);
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

  const processedData = chartData.flatMap(monthData =>
    monthData.semanas.map(semana => ({
      Fecha: monthData.Fecha,
      semana: semana.semana,
      tiempo: semana.tiempo
    }))
  );

  return (
    <div>
      <BarChart
        width={1000}
        height={300}
        data={processedData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <XAxis dataKey="Fecha" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="tiempo" fill="#82ca9d" />
      </BarChart>
    </div>
  );
}

export default Weekly_Production;
