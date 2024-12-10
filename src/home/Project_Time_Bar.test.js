import { render, screen } from '@testing-library/react';
import Project_Time_Bar, { processDataForChart, convertTimeToSeconds } from './Project_Time_Bar'; // Ajusta la ruta si es necesario

describe('Project_Time_Bar Component', () => {
  // Prueba para processDataForChart
  it('processDataForChart should process data correctly', () => {
    const testData = [
      { Projecto: 'Proyecto A', 'Tiempo (hh:mm:ss)': '01:30:00' },
      { Projecto: 'Proyecto B', 'Tiempo (hh:mm:ss)': '02:00:00' },
      { Projecto: 'Proyecto A', 'Tiempo (hh:mm:ss)': '00:45:00' }
    ];
    const expectedData = {
      labels: ['Proyecto A', 'Proyecto B'],
      datasets: [{
        label: 'Tiempo en horas',
        data: [2.25, 2], // 2.25 horas para Proyecto A (1.5 + 0.75)
        backgroundColor: 'rgba(75, 192, 192, 0.6)'
      }]
    };
    expect(processDataForChart(testData)).toEqual(expectedData);
  });

  // Prueba para convertTimeToSeconds
  it('convertTimeToSeconds should convert time string to seconds correctly', () => {
    expect(convertTimeToSeconds('01:30:00')).toBe(5400);
    expect(convertTimeToSeconds('00:15:30')).toBe(930);
    expect(convertTimeToSeconds('10:00:00')).toBe(36000);
  });

  // Prueba para renderizar el componente
  it('should render the chart', () => {
    render(<Project_Time_Bar />);
    // Puedes usar screen.debug() para ver el HTML renderizado
    // y agregar aserciones para verificar que los elementos se renderizan correctamente
    // Ejemplo: 
    // expect(screen.getByText('Project Production on CNC Machine')).toBeInTheDocument();
  });
});