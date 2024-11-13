import { useState, useEffect } from "react";
import { Chart } from "primereact/chart";

import PropTypes from "prop-types";

export default function RadarChart({ chartData = [] }) {
  const [getChartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  const newChartData = chartData;

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue(
      "--text-color-secondary"
    );

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
            backgroundColor: "rgba(111,111,111,0.2)",
          };
        }) || [],
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
            color: textColorSecondary,
          },
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, [newChartData]);

  return (
    <Chart
      type="radar"
      data={getChartData}
      options={chartOptions}
      style={{ width: "90%" }}
    />
  );
}

RadarChart.propTypes = {
  AxisLabel: PropTypes.array,
  datasets: PropTypes.arrayOf(PropTypes.object),
};
