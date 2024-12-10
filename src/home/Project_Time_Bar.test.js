import { render } from '@testing-library/react';
import Project_Time_Bar, { processDataForChart, convertTimeToSeconds } from "./proyect_time_bar.jsx"; // Adjust the path if needed

describe('Project_Time_Bar Component', () => {
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


        data: [2.25, 2],
        backgroundColor: 'rgba(75, 192, 192, 0.6)'
      }]
    };
    const result = processDataForChart(testData);
    console.log(result); // Registrar la salida real de la función
    expect(result).toEqual(expectedData);
  });

  it('convertTimeToSeconds should convert time string to seconds correctly', () => {
    expect(convertTimeToSeconds('01:30:00')).toBe(5400);
    expect(convertTimeToSeconds('00:15:30')).toBe(930);
    expect(convertTimeToSeconds('10:00:00')).toBe(36000);
  });

  it('should render the chart', () => {
    render(<Project_Time_Bar />);
    // Agrega aserciones para verificar que los elementos se renderizan correctamente
    // expect(screen.getByText('Project Production on CNC Machine')).toBeInTheDocument();
  });

  it('should handle empty data', () => {
    const testData = [];
    const expectedData = {
      labels: [],
      datasets: [{
        label: 'Tiempo en horas',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)'
      }]
    };
    expect(processDataForChart(testData)).toEqual(expectedData);
  });
  it('should handle invalid time format', () => {
    const testData = [
      { Projecto: 'Proyecto A', 'Tiempo (hh:mm:ss)': '1:30' },
    ];
    const expectedData = {
      labels: ['Proyecto A'],
      datasets: [{
        label: 'Tiempo en horas',
        data: [0],
        backgroundColor: 'rgba(75, 192, 192, 0.6)'
      }]
    };

    expect(processDataForChart(testData)).toEqual(expectedData);
  });

  it('should handle missing time data', () => {
    const testData = [
      { Projecto: 'Proyecto A', 'Tiempo (hh:mm:ss)': null },
    ];
    const expectedData = {
      labels: ['Proyecto A'],
      datasets: [{
        label: 'Tiempo en horas',
        data: [0],
        backgroundColor: 'rgba(75, 192, 192, 0.6)'
      }]

    };
    expect(processDataForChart(testData)).toEqual(expectedData);
  });
});