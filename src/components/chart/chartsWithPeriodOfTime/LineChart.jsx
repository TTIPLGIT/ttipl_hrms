import { useState, useEffect } from "react";
import { Chart } from "primereact/chart";

import PropTypes from "prop-types";

export default function LineChart({ chartData = [] }) {
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
            borderColor: elem.backgroundColor,
          };
        }) || [],
    };

    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, [newChartData]);

  return (
    <Chart
      type="line"
      data={getChartData}
      options={chartOptions}
      style={{ width: "90%" }}
    />
  );
}

LineChart.propTypes = {
  AxisLabel: PropTypes.array,
  datasets: PropTypes.arrayOf(PropTypes.object),
};
