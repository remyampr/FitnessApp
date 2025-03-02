// First, install Chart.js: npm install chart.js
import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

function TrainerRevenueChart({ monthlyRevenue }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    const ctx = chartRef.current.getContext('2d');
    
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: monthlyRevenue.map(item => item.month),
        datasets: [{
          label: 'Monthly Revenue',
          data: monthlyRevenue.map(item => item.revenue),
          backgroundColor: '#570df8', // primary color in daisy UI
          borderRadius: 6,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `$${context.raw}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return '$' + value;
              }
            }
          }
        }
      }
    });
    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [monthlyRevenue]);

  return (
    <div className="bg-base-100 p-4 rounded-box shadow">
      <h3 className="font-bold mb-4">Monthly Revenue</h3>
      <canvas ref={chartRef}></canvas>
    </div>
  );
}





const monthLabels = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  
  function TrainerRevenueChart({ monthlyRevenue }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
  
    useEffect(() => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      
      const ctx = chartRef.current.getContext('2d');
      
      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: monthlyRevenue.map(item => monthLabels[item.month]), // Convert month index to name
          datasets: [{
            label: 'Monthly Revenue',
            data: monthlyRevenue.map(item => item.revenue),
            backgroundColor: '#570df8',
            borderRadius: 6,
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) => `$${context.raw}`,
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => `$${value}`,
              }
            }
          }
        }
      });
  
      return () => {
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }
      };
    }, [monthlyRevenue]);
  
    return (
      <div className="bg-base-100 p-4 rounded-box shadow">
        <h3 className="font-bold mb-4">Monthly Revenue</h3>
        <canvas ref={chartRef}></canvas>
      </div>
    );
  }
  
  export default TrainerRevenueChart;
  