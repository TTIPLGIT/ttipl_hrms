import DoughnutChart from "../chartsWithoutPeriodOfTime/Doughnut";
import PieChart from "../chartsWithoutPeriodOfTime/Pie";
import PolarArea from "../chartsWithoutPeriodOfTime/PolarArea";
import HorizontalBar from "../chartsWithPeriodOfTime/HorizontalBar";
import LineChart from "../chartsWithPeriodOfTime/LineChart";
import RadarChart from "../chartsWithPeriodOfTime/Radar";
import StackedBar from "../chartsWithPeriodOfTime/StackedBar";
import VerticalBar from "../chartsWithPeriodOfTime/VerticalBar";
import ComboChart from "../chartWithPeriodOfTimeAndTypes/ComboOfBarAndLine";
import styles from "../styles.module.css";

export default function CommonChart({ name = "Dashboard" }) {
  const charts = [
    {
      chartType: "pie",
      name: "Pie",
      chartData: [
        { data: 20, label: "Saran", bgColor: "red", bgHoverColor: "pink" },
        { data: 21, label: "Aakash", bgColor: "blue", bgHoverColor: "#0044ff" },
        { data: 22, label: "RP", bgColor: "green", bgHoverColor: "#008844" },
      ],
    },
    {
      chartType: "doughNut",
      name: "DoughNut",
      chartData: [
        { data: 1, label: "One", bgColor: "red", bgHoverColor: "" },
        { data: 2, label: "Two", bgColor: "blue", bgHoverColor: "" },
        { data: 3, label: "Three", bgColor: "green", bgHoverColor: "" },
      ],
    },
    {
      chartType: "radar",
      name: "Radar",

      chartData: [
        {
          label: "My First dataset",
          backgroundColor: "#4CD07D",
          data: {
            jan: 65,
            feb: 59,
            mar: 80,
            Apr: 81,
            may: 56,
            jun: 55,
            jul: 40,
          },
        },
        {
          label: "My Second dataset",
          backgroundColor: "#3B82F6",
          data: {
            jan: 28,
            feb: 48,
            mar: 40,
            Apr: 19,
            may: 86,
            jun: 27,
            jul: 90,
          },
        },
        {
          label: "My Third dataset",
          backgroundColor: "#EEC137",
          data: {
            jan: 70,
            feb: 60,
            mar: 50,
            Apr: 40,
            may: 50,
            jun: 60,
            jul: 70,
          },
        },
      ],
    },
    {
      chartType: "vertical",
      name: "Line",
      chartData: [
        {
          label: "My First dataset",
          backgroundColor: "#4CD07D",
          data: {
            jan: 65,
            feb: 59,
            mar: 80,
            Apr: 81,
            may: 56,
            jun: 55,
            jul: 40,
          },
        },
        {
          label: "My fourth dataset",
          backgroundColor: "#00227D",
          data: {
            jan: 65,
            feb: 59,
            mar: 80,
            Apr: 81,
            may: 56,
            jun: 55,
            jul: 40,
          },
        },
        {
          label: "My Second dataset",
          backgroundColor: "#3B82F6",
          data: {
            jan: 28,
            feb: 48,
            mar: 40,
            Apr: 19,
            may: 86,
            jun: 27,
            jul: 90,
          },
        },
        {
          label: "My Third dataset",
          backgroundColor: "#EEC137",
          data: {
            jan: 70,
            feb: 60,
            mar: 50,
            Apr: 40,
            may: 50,
            jun: 60,
            jul: 70,
          },
        },
      ],
    },

    {
      chartType: "combo",
      name: "Combo",
      chartData: [
        {
          type: "line",
          label: "My First dataset",
          backgroundColor: "#4CD07D",
          data: {
            jan: 65,
            feb: 59,
            mar: 80,
            Apr: 81,
            may: 56,
            jun: 55,
            jul: 40,
          },
        },
        {
          type: "bar",
          label: "My Second dataset",
          backgroundColor: "#3B82F6",
          data: {
            jan: 28,
            feb: 48,
            mar: 40,
            Apr: 19,
            may: 86,
            jun: 27,
            jul: 90,
          },
        },
        {
          type: "bar",
          label: "My Third dataset",
          backgroundColor: "#EEC137",
          data: {
            jan: 70,
            feb: 60,
            mar: 50,
            Apr: 40,
            may: 50,
            jun: 60,
            jul: 70,
          },
        },
      ],
    },
  ];

  return (
    <div className={`${styles.chartWrapper} grid justify-content-evenly`}>
      <p className={` ${styles.name} col-12`}>{name}</p>
      {charts?.map((elem, index) => {
        if (elem?.chartType === "pie") {
          return (
            <div
              key={index}
              className={`col-12 my-3 mx-1  md:col-5 lg:col-5 xl:col-3   ${styles.chart}`}
            >
              <p className={styles.chartName}>{elem?.name}</p>
              <PieChart chartData={elem?.chartData} />
            </div>
          );
        }
        if (elem?.chartType === "doughNut") {
          return (
            <div
              key={index}
              className={`col-12  my-3 mx-1  md:col-5   lg:col-5 xl:col-3   ${styles.chart}`}
            >
              <p className={styles.chartName}>{elem?.name}</p>

              <DoughnutChart chartData={elem?.chartData} />
            </div>
          );
        }
        if (elem?.chartType === "radar") {
          return (
            <div
              key={index}
              className={`col-12 my-3 mx-1 md:col-5 lg:col-10 xl:col-5  ${styles.chart}`}
            >
              <p className={styles.chartName}>{elem?.name}</p>
              <RadarChart chartData={elem?.chartData} />
            </div>
          );
        }
        if (elem?.chartType === "polar") {
          return (
            <div
              key={index}
              className={`col-12  my-3 mx-1 md:col-5 lg:col-5 xl:col-3 ${styles.chart}`}
            >
              <p className={styles.chartName}>{elem?.name}</p>
              <PolarArea chartData={elem?.chartData} />
            </div>
          );
        }
        if (elem?.chartType === "vertical") {
          return (
            <div
              key={index}
              className={`col-12  my-3 mx-1  md:col-10 lg:col-10 xl:col-5 ${styles.chart}`}
            >
              <p className={styles.chartName}>{elem?.name}</p>
              <VerticalBar chartData={elem?.chartData} />
            </div>
          );
        }
        if (elem?.chartType === "horizontal") {
          return (
            <div
              key={index}
              className={`col-12   my-3 mx-1  md:col-10 lg:col-10 xl:col-5 ${styles.chart}`}
            >
              <p className={styles.chartName}>{elem?.name}</p>
              <HorizontalBar chartData={elem?.chartData} />
            </div>
          );
        }
        if (elem?.chartType === "stacked") {
          return (
            <div
              key={index}
              className={`col-12  my-3 mx-1  md:col-10 lg:col-10 xl:col-5  ${styles.chart}`}
            >
              <p className={styles.chartName}>{elem?.name}</p>
              <StackedBar chartData={elem?.chartData} />
            </div>
          );
        }
        if (elem?.chartType === "line") {
          return (
            <div
              key={index}
              className={`col-12  my-3 mx-1  md:col-10 lg:col-10 xl:col-5 ${styles.chart}`}
            >
              <p className={styles.chartName}>{elem?.name}</p>
              <LineChart chartData={elem?.chartData} />
            </div>
          );
        }
        if (elem?.chartType === "combo") {
          return (
            <div
              key={index}
              className={`col-12  my-3 mx-1  md:col-10 lg:col-10 xl:col-5 ${styles.chart}`}
            >
              <p className={styles.chartName}>{elem?.name}</p>
              <ComboChart chartData={elem?.chartData} />
            </div>
          );
        }
      })}
    </div>
  );
}
