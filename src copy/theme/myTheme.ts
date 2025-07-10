import { EChartsOption } from "echarts";

//封装基础图表样式
const baseTheme: Partial<EChartsOption> = {
  backgroundColor: "transparent",
  grid: {
    left: "24px",
    right: "24px",
    bottom: "24px",
    top: "24px",
    containLabel: true,
  },
  legend: {
    bottom: 0,
  },
  tooltip: {
    show: false,
  },
  xAxis: {
    axisLine: { lineStyle: { color: "#1F232926" } },
    axisLabel: { color: "#646A73", fontSize: 12 },
    splitLine: { show: false },
  },
  yAxis: {
    axisLabel: { color: "#646A73", fontSize: 12 },
    splitLine: { lineStyle: { color: "#1F23291A", type: "dashed" } },
  },
};

//普通柱状图
export const normalBar: EChartsOption = {
  ...baseTheme,
  color: ["#4E83FD"],
  series: {
    type: "bar",
    itemStyle: {
      borderRadius: [4, 4, 0, 0],
      shadowBlur: 4,
      shadowColor: "rgba(0, 0, 0, 0.1)",
    },
    barWidth: "60%",
    barGap: "20%",
  },
};

//多柱状图
export const multiBar: EChartsOption = {
  ...baseTheme,
  color: ["#4E83FD", "#50CEFB", "#935AF6"],

  series: {
    type: "bar",
    itemStyle: {
      borderRadius: [4, 4, 0, 0],
    },
    barWidth: "30%",
    barGap: "20%",
  },
};

//堆积柱状图
export const stackedBar: EChartsOption = {
  ...baseTheme,
  color: ["#935AF6", "#50CEFB", "#4E83FD"],
  series: {
    type: "bar",
    stack: "total",
    itemStyle: {
      borderRadius: [4, 4, 0, 0],
    },
    barWidth: "40%",
    barGap: "10%",
  },
};

//折线图
export const lineChart: EChartsOption = {
  ...baseTheme,
  color: ["#4E83FD"],
  series: {
    type: "line",
    itemStyle: {
      borderRadius: [4, 4, 0, 0],
    },
  },
};
//平滑曲线
export const smoothLineChart: EChartsOption = {
  ...baseTheme,
  color: ["#4E83FD"],
  series: {
    type: "line",
    itemStyle: {
      borderRadius: [4, 4, 0, 0],
    },
  },
};

//环图
export const ringChart: EChartsOption = {
  color: ["#F76964", "#4E83FD", "#50CEFB", "#935AF6", "#FAD355"],
  title: {
    text: "环图",
    subtext: "副标题",
    left: "center",
    top: 20,
    textStyle: { fontSize: 16, fontWeight: "bold" },
    subtextStyle: { fontSize: 12, color: "#646A73" },
  },
  legend: {
    bottom: 0,
    left: "center",
    orient: "horizontal",
    data: ["图例一", "图例二", "图例三", "图例四", "图例五"],
  },
  series: {
    type: "pie",
    radius: ["40%", "70%"],
    center: ["50%", "50%"],
    itemStyle: {
      borderRadius: 4,
      borderColor: "#fff",
      borderWidth: 2,
    },
    label: {
      show: true,
      position: "outside",
      formatter: "{b}: {d}%",
      color: "#333",
      fontSize: 12,
    },
    labelLine: {
      show: true,
      length: 20,
      length2: 30,
      smooth: true,
    },
    silent: false,
  },
  graphic: [
    {
      type: "text",
      left: "center",
      top: "45%",
      style: {
        text: "实际值",
        fontSize: 14,
        fill: "#646A73",
        fontWeight: "normal",
      },
    },
    {
      type: "text",
      left: "center",
      top: "55%",
      style: {
        text: "6820",
        fontSize: 24,
        fill: "#333",
        fontWeight: "bold",
      },
    },
  ],
};

//饼图
export const pieChart: EChartsOption = {
  color: ["#F76964", "#4E83FD", "#50CEFB", "#935AF6", "#FAD355"],
  title: {
    text: "饼图",
    subtext: "副标题",
    left: "center",
    textStyle: { fontSize: 16, fontWeight: "bold" },
    subtextStyle: { fontSize: 12, color: "#646A73" },
  },
  legend: {
    show: true,
    bottom: 0,
    left: "center",
    orient: "horizontal",
    data: ["图例一", "图例二", "图例三", "图例四", "图例五"],
  },
  series: {
    type: "pie",
    radius: "60%",
    center: ["50%", "45%"],
    itemStyle: {
      borderRadius: 4,
      borderColor: "#fff",
      borderWidth: 2,
    },
    label: {
      show: true,
      position: "outside",
      formatter: "{b}: {d}%",
      color: "#333",
      fontSize: 12,
      rich: {
        b: { fontWeight: "normal" },
      },
    },
    labelLine: {
      show: true,
      length: 20,
      length2: 30,
      smooth: true,
    },
  },
};

//普通条形图
export const barChart: EChartsOption = {
  ...baseTheme,
  color: ["#4E83FD"],
  series: {
    type: "bar",
    itemStyle: {
      borderRadius: [4, 4, 0, 0],
    },
  },
};

//横向多条条形图
export const barChartHorizontal: EChartsOption = {
  ...baseTheme,
  color: ["#4E83FD"],
  series: {
    type: "bar",
    itemStyle: {
      borderRadius: [4, 4, 0, 0],
    },
  },
};

//面积图
export const areaChart: EChartsOption = {
  ...baseTheme,
  color: ["#4E83FD"],
  series: {
    type: "line",
    itemStyle: {
      borderRadius: [4, 4, 0, 0],
    },
  },
};

//层叠面积图
export const stackedAreaChart: EChartsOption = {
  ...baseTheme,
  color: ["#4E83FD"],
  series: {
    type: "line",
    itemStyle: {
      borderRadius: [4, 4, 0, 0],
    },
  },
};

//漏斗图
export const funnelChart: EChartsOption = {
  ...baseTheme,
  color: ["#4E83FD"],
  series: {
    type: "funnel",
    itemStyle: {
      borderRadius: [4, 4, 0, 0],
    },
  },
};

//横向漏斗图
export const funnelChartHorizontal: EChartsOption = {
  ...baseTheme,
  color: ["#4E83FD"],
  series: {
    type: "funnel",
    itemStyle: {
      borderRadius: [4, 4, 0, 0],
    },
  },
};

//组合图
export const combinedChart: EChartsOption = {
  ...baseTheme,
  color: ["#4E83FD"],
};

//进度图
export const progressChart: EChartsOption = {
  ...baseTheme,
  color: ["#4E83FD"],
};

export const barThemes = {
  singleColor: normalBar,
  multiColor: multiBar,
  stacked: stackedBar,
};
