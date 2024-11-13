import { useState, useEffect } from "react";
import { Chart } from "primereact/chart";

import PropTypes from "prop-types";

export default function PieChart({ chartData }) {
  const [getChartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  const newChartData = chartData;

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const data = {
      labels: newChartData?.map((elem) => elem?.label)?.length
        ? newChartData?.map((elem) => elem?.label)
        : // : ["A", "B", "C", "D"],
          ["no data"],
      datasets: [
        {
          data: newChartData?.map((elem) => elem?.data)?.length
            ? newChartData?.map((elem) => elem?.data)
            : // : [540, 325, 702, 90],
              [100],
          backgroundColor: newChartData?.map((elem) => elem?.bgColor)?.length
            ? newChartData?.map((elem) => elem?.bgColor)
            : [
                documentStyle.getPropertyValue("--blue-500"),
                documentStyle.getPropertyValue("--yellow-500"),
                documentStyle.getPropertyValue("--green-500"),
              ],
          hoverBackgroundColor: newChartData?.map((elem) => elem?.bgHoverColor)
            ?.length
            ? newChartData?.map((elem) => elem?.bgHoverColor)
            : [
                documentStyle.getPropertyValue("--blue-400"),
                documentStyle.getPropertyValue("--yellow-400"),
                documentStyle.getPropertyValue("--green-400"),
              ],
        },
      ],
    };
    const options = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
          },
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, [newChartData]);

  return <Chart type="pie" data={getChartData} options={chartOptions} />;
}

PieChart.propTypes = {
  chartArr: PropTypes.array,
  labels: PropTypes.array,
  bgColors: PropTypes.array,
  bgHoverColors: PropTypes.array,
};
