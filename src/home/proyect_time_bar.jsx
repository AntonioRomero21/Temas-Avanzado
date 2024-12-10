import React, { useEffect, useState } from 'react';
import timeOperationData from "../data/time_operation.json"; // Assuming the JSON file is in the same directory
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Project_Time_Bar = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    // Process data from the JSON file
    const chartDataProcessed = processDataForChart(timeOperationData);
    setChartData(chartDataProcessed);
  }, []);

  const processDataForChart = (data) => {
    const groupData = data.reduce((acc, current) => {
      const name = current.Projecto;
      if (!acc[name]) {
        acc[name] = { Projecto: name, tiempo: 0 };
      }
      if (current["Tiempo (hh:mm:ss)"]) { // Updated key name here
        acc[name].tiempo += convertTimeToSeconds(current["Tiempo (hh:mm:ss)"]); // Updated key name here
      }
      return acc;
    }, {});

    const result = Object.values(groupData).map(proj => ({
      Projecto: proj.Projecto,
      tiempo: proj.tiempo / 3600
    }));

    return {
      labels: result.map(item => item.Projecto),
      datasets: [{
        label: 'Tiempo en horas',
        data: result.map(item => item.tiempo),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      }]
    };
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

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14, 
          }
        }
      },
      title: {
        display: true,
        text: 'Project Production on CNC Machine',
        font: { 
          size: 18, 
        }
      },
      tooltip: { 
        bodyFont: {
          size: 14, 
        },
        titleFont: {
          size: 16, 
        }
      }
    },
  };

  return (
    <div style={{ width: '50%', margin: '2px', padding: '2px' }}>
      {chartData.labels.length > 0 && (
        <Bar data={chartData} options={options} />
      )}
    </div>
  );
};

export default Project_Time_Bar;