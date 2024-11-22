import DoughnutChart from "../../../components/chart/chartsWithoutPeriodOfTime/Doughnut";
import PieChart from "../../../components/chart/chartsWithoutPeriodOfTime/Pie";
import PolarArea from "../../../components/chart/chartsWithoutPeriodOfTime/PolarArea";
import HorizontalBar from "../../../components/chart/chartsWithPeriodOfTime/HorizontalBar";
import LineChart from "../../../components/chart/chartsWithPeriodOfTime/LineChart";
import RadarChart from "../../../components/chart/chartsWithPeriodOfTime/Radar";
import StackedBar from "../../../components/chart/chartsWithPeriodOfTime/StackedBar";
import VerticalBar from "../../../components/chart/chartsWithPeriodOfTime/VerticalBar";
import ComboChart from "../../../components/chart/chartWithPeriodOfTimeAndTypes/ComboOfBarAndLine";
import styles from "./styles.module.css";
import { protectedCall } from "../../../services/userService";
import { useEffect, useState } from "react";

export default function Dashboard({ name = "Dashboard" }) {
  const [dataCounts, setDataCounts] = useState({
    noOfEmp: 0,
    noOfComplaints: [],
    noOfRequirement: [],
    noOfApplicants: [],
    noOfSelectedApplicant: [],
  });

  useEffect(() => {
    const fetchData = async (url, key) => {
      try {
        const count = await protectedCall(url);
        setDataCounts((prevData) => ({ ...prevData, [key]: count }));
      } catch (error) {
        console.error(`Error fetching ${key}:`, error);
      }
    };

    fetchData("api/dashboard/active-employees/count", "noOfEmp");
    fetchData("api/dashboard/open-complaints/count", "noOfComplaints");
    fetchData("api/dashboard/open-requirements/count", "noOfRequirement");
    fetchData("api/dashboard/open-applicant/count", "noOfApplicants");
    fetchData(
      "api/dashboard/open-selectedapplicant/count",
      "noOfSelectedApplicant"
    );
  }, []);

  function getColorByStatus(status) {
    switch (status) {
      case "open":
        return "#C9190B";
      case "closed":
        return "#4CB140";
      case "in progress":
        return "#F0AB00";
      default:
        return "gray"; // Default color for unknown statuses
    }
  }

  function getHoverColorByStatus(status) {
    switch (status) {
      case "open":
        return "lightcoral";
      case "closed":
        return "lightgreen";
      case "in progress":
        return "lightgoldenrodyellow";
      default:
        return "lightgray"; // Default hover color for unknown statuses
    }
  }

  const charts = [
    {
      chartType: "pie",
      name: "Complaints",
      chartData: dataCounts.noOfComplaints?.map((item) => ({
        data: item?.count,
        label: item?.status,
        bgColor: getColorByStatus(item.status),
        bgHoverColor: getHoverColorByStatus(item.status),
      })),
    },

    {
      chartType: "doughNut",
      name: "",
      chartData: [
        { data: 1, label: "One", bgColor: "red", bgHoverColor: "" },
        { data: 2, label: "Two", bgColor: "blue", bgHoverColor: "" },
        { data: 3, label: "Three", bgColor: "green", bgHoverColor: "" },
      ],
    },
    {
      chartType: "radar",
      name: "",

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

  const data = [
    { title: "Employees", count: dataCounts.noOfEmp },
    { title: "Requirements", count: dataCounts.noOfRequirement },
    { title: "Applicants", count: dataCounts.noOfApplicants },
    { title: "Selected", count: dataCounts.noOfSelectedApplicant },
    { title: "On Boarding", count: 0 },
  ];

  return (
    <div className={`${styles.chartWrapper} grid justify-content-evenly`}>
      <p className={` ${styles.name}  col-12`}>{name}</p>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          padding: "20px",
          backgroundColor: "#f9f9f9",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
        }}
        className="w-full"
      >
        {data.map((item, index) => (
          <div
            key={index}
            style={{
              width: "220px",
              height: "100px",
              textAlign: "center",
              borderRadius: "8px",
              borderLeft: "5px solid #1E90FF",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "5px", // Adds spacing between items
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h2 className="my-0" style={{ margin: 0 }}>
                {item.count}
              </h2>
              <p className="my-0" style={{ margin: 0 }}>
                {item.title}
              </p>
            </div>
          </div>
        ))}
      </div>

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
