import React, { useEffect, useState } from 'react';
import icon from "../assets/icons/cnc-machine.svg";
import timeOperationData from "../data/time_operation.json"; // Assuming the JSON file is in the same directory

// Asegúrate de que haya suficiente contraste entre primaryColor y el color del texto
export const primaryColor = '#3498db'; 

export const getTimeMachine = (machine) => {
  try {
    const tiempos = timeOperationData.filter(item => item.Maquina === machine);

    if (tiempos.length === 0) {
      return '0 hr:00 min:00 s';
    }

    return sumTime(tiempos);
  } catch (error) {
    console.error("Error en getTimeMachine:", error);
    return "Error al calcular el tiempo"; // O un valor por defecto que prefieras
  }
};

const sumTime = (tiempos) => {
  let totalHours = 0;
  let totalMinutes = 0;
  let totalSeconds = 0;

  tiempos.forEach(dataTime => {
    const tiempo = dataTime['Tiempo (hh:mm:ss)'];

    const [hours, minutes, seconds] = tiempo.split(':').map(Number);

    totalHours += hours;
    totalMinutes += minutes;
    totalSeconds += seconds;
  });

  totalMinutes += Math.floor(totalSeconds / 60);
  totalSeconds = totalSeconds % 60;

  totalHours += Math.floor(totalMinutes / 60);
  totalMinutes = totalMinutes % 60;

  const formattedTime = `${totalHours > 0 ? `${totalHours} hr :` : ''}${totalMinutes.toString().padStart(2, '0')} min :${totalSeconds.toString().padStart(2, '0')} sg`;

  return formattedTime;
};

const AnalyticInfoCard = ({ svgSrc, title, count, textcolor }) => {
  return (
    <div style={{ padding: '15px', flex: '1 1 200px', flexDirection: 'column', textAlign: 'center' }}>
      <figure role="figure" aria-labelledby={`cnc-machine-title-${title}`}> 
        <img src={svgSrc} alt={title} style={{ width: '30px', height: '50px' }} />
      </figure>
      <h3 id={`cnc-machine-title-${title}`} style={{ color: textcolor }}>{title}</h3> 
      <p style={{ color: textcolor }}>{count}</p>
    </div>
  );
};

const Cnc_Time = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const promises = ['1', '2', '3', '4'].map(machine => getTimeMachine(machine));
        const results = await Promise.all(promises);
        setData(results);
      } catch (err) {
        setError(err);
        console.error("Error fetching data:", err); 
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (error) {
    return <div>Error: {error.message}</div>; 
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}> 
      {data.map((timeTotal, index) => (
        <AnalyticInfoCard
          key={index}
          color={primaryColor}
          svgSrc={icon}
          title={`CNC Machine #${index + 1}`}
          count={timeTotal}
          textcolor="black" 
        />
      ))}
    </div>
  );
};

export default Cnc_Time;