import { useState, useEffect } from "react";
import { Chart } from "primereact/chart";

import PropTypes from "prop-types";

export default function PolarArea({ chartData }) {
  const [chart, setChart] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  const newChartData = chartData;

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");
    const data = {
      labels: newChartData?.map((elem) => elem?.label)?.length
        ? newChartData?.map((elem) => elem?.label)
        : ["A", "B", "C", "D"],
      datasets: [
        {
          data: newChartData?.map((elem) => elem?.data)?.length
            ? newChartData?.map((elem) => elem?.data)
            : [540, 325, 702, 205],
          backgroundColor: newChartData?.map((elem) => elem?.bgColor)?.length
            ? newChartData?.map((elem) => elem?.bgColor)
            : [
                documentStyle.getPropertyValue("--blue-500"),
                documentStyle.getPropertyValue("--yellow-500"),
                documentStyle.getPropertyValue("--green-500"),
                documentStyle.getPropertyValue("--orange-500"),
              ],
          hoverBackgroundColor: newChartData?.map((elem) => elem?.bgHoverColor)
            ?.length
            ? newChartData?.map((elem) => elem?.bgHoverColor)
            : [
                documentStyle.getPropertyValue("--blue-400"),
                documentStyle.getPropertyValue("--yellow-400"),
                documentStyle.getPropertyValue("--green-400"),
                documentStyle.getPropertyValue("--orange-500"),
              ],
        },
      ],
    };
    const options = {
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        r: {
          grid: {
            color: surfaceBorder,
          },
        },
      },
    };

    setChart(data);
    setChartOptions(options);
  }, [newChartData]);

  return (
    <div className="card flex justify-content-center">
      <Chart type="polarArea" data={chart} options={chartOptions} />
    </div>
  );
}

PolarArea.propTypes = {
  chartArr: PropTypes.array,
  labels: PropTypes.array,
  bgColors: PropTypes.array,
  bgHoverColors: PropTypes.array,
};
