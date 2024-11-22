import { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import PropTypes from "prop-types";

export default function VerticalBar({ chartData = [] }) {
  const [getChartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  const newChartData = chartData;

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue(
      "--text-color-secondary"
    );
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");
    const data = {
      labels: Object.keys(newChartData?.map((elem) => elem?.data)[0])?.length
        ? Object.keys(newChartData?.map((elem) => elem?.data)[0])
        : ["January", "February", "March", "April", "May", "June", "July"],
      datasets:
        newChartData.map((elem) => {
          return {
            ...elem,
            data: Object.values(elem?.data),
          };
        }) || [],
    };
    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            fontColor: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500,
            },
          },
          grid: {
            display: false,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, [newChartData]);

  return (
    <Chart
      type="bar"
      data={getChartData}
      options={chartOptions}
      style={{ width: "90%" }}
    />
  );
}

VerticalBar.propTypes = {
  AxisLabel: PropTypes.array,
  datasets: PropTypes.arrayOf(PropTypes.object),
};
