import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { EChartsOption } from "echarts";
import {
  normalBar,
  multiBar,
  stackedBar,
  lineChart,
  smoothLineChart,
  pieChart,
  ringChart,
} from "../theme/myTheme";

const barData = [120, 200, 150, 80, 70, 110, 130];
const lineData = [150, 230, 224, 218, 135, 147, 260];
const pieData = [
  { value: 335, name: "名称1" },
  { value: 310, name: "名称2" },
  { value: 234, name: "名称3" },
  { value: 135, name: "名称4" },
  { value: 1548, name: "名称5" },
];

const ThemeDemo: React.FC = () => {
  // 创建多个图表容器的ref
  const barRef = useRef<HTMLDivElement>(null);
  const multiBarRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const pieRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 普通柱状图示例
    if (barRef.current) {
      const barChart = echarts.init(barRef.current);
      const option: EChartsOption = {
        ...normalBar,
        title: { text: "普通柱状图 (normalBar)" },
        xAxis: {
          ...normalBar.xAxis,
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        series: { ...normalBar.series, data: barData },
      };
      barChart.setOption(option);
    }

    // 多柱状图示例
    if (multiBarRef.current) {
      const multiBarChart = echarts.init(multiBarRef.current);
      const option: EChartsOption = {
        ...multiBar,
        title: { text: "多柱状图 (multiBar)" },
        xAxis: {
          ...multiBar.xAxis,
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        series: [
          { ...multiBar.series, data: barData, name: "系列1" },
          {
            ...multiBar.series,
            data: barData.map((v) => v * 0.8),
            name: "系列2",
          },
          {
            ...multiBar.series,
            data: barData.map((v) => v * 0.6),
            name: "系列3",
          },
        ],
      };
      multiBarChart.setOption(option);
    }

    // 折线图示例
    if (lineRef.current) {
      const lineChartInstance = echarts.init(lineRef.current);
      const option: EChartsOption = {
        ...smoothLineChart,
        title: { text: "平滑折线图 (smoothLineChart)" },
        xAxis: {
          ...smoothLineChart.xAxis,
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        series: { ...smoothLineChart.series, data: lineData, smooth: true },
      };
      lineChartInstance.setOption(option);
    }

    // 饼图示例
    if (pieRef.current) {
      const pieChartInstance = echarts.init(pieRef.current);
      const option: EChartsOption = {
        ...pieChart,
        title: { text: "饼图" },
        series: { ...pieChart.series, data: pieData },
        legend: {
          ...pieChart.legend,
        },
      };
      pieChartInstance.setOption(option);
    }

    // 环图示例
    // ... existing code ...
    // 环图示例
    if (ringRef.current) {
      const ringChartInstance = echarts.init(ringRef.current);
      const option: EChartsOption = {
        ...ringChart,
        series: {
          ...ringChart.series,
          data: pieData, // 使用与饼图相同的数据
        },
      };
      ringChartInstance.setOption(option);
    }
    // ... existing code ...

    // 响应窗口大小变化
    const handleResize = () => {
      barRef.current && echarts.getInstanceByDom(barRef.current)?.resize();
      multiBarRef.current &&
        echarts.getInstanceByDom(multiBarRef.current)?.resize();
      lineRef.current && echarts.getInstanceByDom(lineRef.current)?.resize();
      pieRef.current && echarts.getInstanceByDom(pieRef.current)?.resize();
      ringRef.current && echarts.getInstanceByDom(ringRef.current)?.resize();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      style={{
        padding: "20px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
        gap: "20px",
      }}
    >
      <div
        ref={barRef}
        style={{
          width: "100%",
          height: "300px",
          border: "1px solid #f0f0f0",
          borderRadius: "8px",
          padding: "10px",
        }}
      ></div>
      <div
        ref={multiBarRef}
        style={{
          width: "100%",
          height: "300px",
          border: "1px solid #f0f0f0",
          borderRadius: "8px",
          padding: "10px",
        }}
      ></div>
      <div
        ref={lineRef}
        style={{
          width: "100%",
          height: "300px",
          border: "1px solid #f0f0f0",
          borderRadius: "8px",
          padding: "10px",
        }}
      ></div>
      <div
        ref={pieRef}
        style={{
          width: "100%",
          height: "300px",
          border: "1px solid #f0f0f0",
          borderRadius: "8px",
          padding: "10px",
        }}
      ></div>
      <div
        ref={ringRef}
        style={{
          width: "100%",
          height: "300px",
          border: "1px solid #f0f0f0",
          borderRadius: "8px",
          padding: "10px",
        }}
      ></div>
    </div>
  );
};

export default ThemeDemo;
