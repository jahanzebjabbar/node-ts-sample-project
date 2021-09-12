import React from 'react';
import { Line } from 'react-chartjs-2';
import { i18n } from 'src/i18n';

const data = {
  labels: [
    '.1',
    '.2',
    '.2',
    '.2',
    '.2',
    '.2',
    '.2',
  ],
  datasets: [
    {
      label: 'DownLink',
      fill: false,
      lineTension: 0.1,
      borderColor: '#36A2EB',
      backgroundColor: '#36A2EB',
      pointBorderColor: '#36A2EB',
      pointBackgroundColor: '#36A2EB',
      pointHoverBackgroundColor: '#36A2EB',
      pointHoverBorderColor: '#36A2EB',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBorderWidth: 2,
      pointRadius: 2,
      pointHitRadius: 10,
      data: [0, 40, 0, 0, 0, 0, 0],
    },
    {
      label: 'UpLink',
      fill: false,
      lineTension: 0.1,
      borderColor: '#EC932F',
      backgroundColor: '#EC932F',
      pointBorderColor: '#EC932F',
      pointBackgroundColor: '#EC932F',
      pointHoverBackgroundColor: '#EC932F',
      pointHoverBorderColor: '#EC932F',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBorderWidth: 2,
      pointRadius: 2,
      pointHitRadius: 10,
      data: [0, 0, 0, 0, 0, 40, 0],
    },
  ],
};

const options = {
  scales: {
    xAxes: [
      {
        display: true,
      },
    ],
    yAxes: [
      {
        display: true,
      },
    ],
  },
};

export default function DashboardLineChart(props) {
  return <Line data={data} options={options} />;
}
