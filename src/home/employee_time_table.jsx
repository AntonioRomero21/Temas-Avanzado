import React, { useEffect, useState } from 'react';
import timeOperationData from "../data/time_operation.json"; // Assuming the JSON file is in the same directory

const Employee_Time_Table = () => {
  const [timeOp, setTimeOP] = useState([]);

  useEffect(() => {
    // Load data from the JSON file
    setTimeOP(timeOperationData); 
  }, []);

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

  function convertSecondsToTimeFormat(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  return (
    <div style={{ width: '30%', margin: '5px' }}> 
      <h4 style={{ textAlign: 'center' }}>Production time per employee on CNC</h4>
      <table className="min-w-full table-auto"> 
        <thead>
          <tr>
            <th scope="col" className="px-6 py-3 border-b font-medium text-gray-900">Empleado</th> 
            <th scope="col" className="px-6 py-3 border-b font-medium text-gray-900">Tiempo Total</th> 
            <th scope="col" className="px-6 py-3 border-b font-medium text-gray-900">Porcentaje</th> 
          </tr>
        </thead>
        <tbody>
          {timeOp.length > 0 && Object.values(timeOp.reduce((acc, current) => {
            const name = current.Empleado;
            if (!acc[name]) {
              acc[name] = { Empleado: name, tiempo: 0 };
            }
            if (current["Tiempo (hh:mm:ss)"]) { // Updated key name here
              acc[name].tiempo += convertTimeToSeconds(current["Tiempo (hh:mm:ss)"]); // Updated key name here
            }
            return acc;
          }, {})).map((item, index) => {
            const totalTime = Object.values(timeOp.reduce((acc, current) => {
              if (current["Tiempo (hh:mm:ss)"]) { // Updated key name here
                acc.total = (acc.total || 0) + convertTimeToSeconds(current["Tiempo (hh:mm:ss)"]); // Updated key name here
              }
              return acc;
            }, {})).reduce((a, b) => a + b, 0);

            const percentage = ((item.tiempo / totalTime) * 100).toFixed(1);

            return (
              <tr key={index}>
                <td className="px-6 py-4 border-b">{item.Empleado}</td>
                <td className="px-6 py-4 border-b">{convertSecondsToTimeFormat(item.tiempo)}</td>
                <td className="px-6 py-4 border-b">{percentage}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Employee_Time_Table;