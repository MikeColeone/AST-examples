//布局
export const layoutThemes = {
  backgroundColor: [
    "#F8F9FA",
    "#FFFFFF",
    "linear-gradient(to right, #E4EEFC, #F2F4FF)",
  ],
  //正常
  normal: {
    padding: "24px",
    gap: "20px",
    item: {
      color: "#A3F0E6",
      borderRadius: "12px",
    },
  },
  //紧凑
  compact: {
    padding: "20px",
    gap: "12px",
    item: {
      color: "#A3F0E6",
      borderRadius: "12px",
    },
  },
  //宽松
  loose: {
    padding: "40px",
    gap: "24px",
    item: {
      color: "#A3F0E6",
      borderRadius: "12px",
    },
  },
};

//卡片格式
export const card = {
  padding: "20px",
  borderRadius: "12px",
  backgroundColor: "#FFFFFF",
  item: {
    backgroundColor: ["#F54A45", "#D9D9D9"],
  },
};
//导航栏
export const nav = {
  header: {
    tabs: {
      color: "#FFFFFF",
      active: {
        color: "#1F232914",
      },
    },
  },
  sidebar: {},
  breadcrumb: {},
};

//交互容器
export const interactionContainer = {
  tabs: {
    // 基础样式
    base: {
      height: "48px",
      padding: "0 16px",
      fontSize: "14px",
      fontWeight: 500,
      gap: "24px",
    },
    // 线条型Tabs
    line: {
      color: "#646A73",
      active: {
        color: "#4E83FD",
        borderBottom: "2px solid #4E83FD",
        fontWeight: 600,
      },
      disabled: {
        color: "#C9CDD4",
        cursor: "not-allowed",
      },
    },
    // 卡片型Tabs
    card: {
      backgroundColor: "#F2F4FF",
      borderRadius: "8px",
      color: "#646A73",
      active: {
        backgroundColor: "#FFFFFF",
        color: "#4E83FD",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        borderRadius: "6px",
      },
      closable: {
        marginLeft: "8px",
        hoverColor: "#F54A45",
      },
    },
    // 视图型Tabs
    view: {
      color: "#646A73",
      active: {
        color: "#4E83FD",
        borderLeft: "3px solid #4E83FD",
        paddingLeft: "13px",
      },
    },
  },
  //弹窗
  modal: {
    title: {
      fontSize: 16,
      color: "#1F2329",
    },
    height: "176px",
    input: {
      item1: {
        width: "420px",
      },
      item2: {
        width: "600px",
      },
      item3: {
        width: "840px",
      },
      item4: {
        width: "1080px",
      },
    },
    normalModal: {
      width: "420px",
      height: "158px",
      text: {},
      item1: {
        width: "420px",
      },
      item2: {
        width: "600px",
      },
      item3: {
        width: "840px",
      },
      item4: {
        width: "1080px",
      },
      item5: {
        width: "1280px",
      },
    },
  },
};

//数据输入
export const dataInput = {
  filterBar: {},
  form: {},
};
//数据展示
export const showData = {
  dataTable: {},
  kanbanBoard: {},
  treeViews: {},
  metricCards: {},
  list: {},
};

import {
  EChartsOption,
  BarSeriesOption,
  LineSeriesOption,
  PieSeriesOption,
} from "echarts";

const baseTheme: Partial<EChartsOption> = {
  backgroundColor: "#FFFFFF",
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

const normalBarSeries: BarSeriesOption = {
  type: "bar",
  itemStyle: {
    borderRadius: [4, 4, 0, 0] as [number, number, number, number],
    shadowBlur: 4,
    shadowColor: "rgba(0, 0, 0, 0.1)",
  },
  barWidth: "60%",
  barGap: "20%",
};

const multiBarSeries: BarSeriesOption = {
  type: "bar",
  itemStyle: {
    borderRadius: [4, 4, 0, 0] as [number, number, number, number],
  },
  barWidth: "30%",
  barGap: "20%",
};

const lineSeries: LineSeriesOption = {
  type: "line",
  itemStyle: {
    borderRadius: [4, 4, 0, 0] as [number, number, number, number],
  },
};

const pieSeries: PieSeriesOption = {
  type: "pie",
  itemStyle: {
    borderRadius: [4, 4, 0, 0] as [number, number, number, number],
  },
};

export const charts = {
  // 普通柱状图
  normalBar: {
    ...baseTheme,
    color: ["#4E83FD"],
    series: normalBarSeries,
  },

  // 多柱状图
  multiBar: {
    ...baseTheme,
    color: ["#4E83FD", "#50CEFB", "#935AF6"],
    series: multiBarSeries,
  },

  // 折线图
  lineChart: {
    ...baseTheme,
    color: ["#4E83FD"],
    series: lineSeries,
  },

  // 饼图
  pieChart: {
    ...baseTheme,
    color: ["#4E83FD"],
    series: pieSeries,
  },
};
