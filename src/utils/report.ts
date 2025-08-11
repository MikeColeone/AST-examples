/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
    TraceDataTypeShared,
    TraceDataTypeFunctionEntry,
    TraceDataTypeFunctionReturn,
    TraceDataTypeUseEffect,
    TraceDataTypeUseState,
} from "../type/const";

//入参
export function reportEntryFunction(
  params: TraceDataTypeFunctionEntry | any
): void {
  console.log("reportEntryFunction", params);
}

//出参
export function reportReturnFunction(
  params: TraceDataTypeFunctionReturn | any
): void {
  console.log("reportReturnFunction", params);
}
// 组件数据追踪
export function reportComponentEvent(params: TraceDataTypeShared | any) {
  console.log("reportComponentEvent", params);
}

export function reportComponentProps(params: TraceDataTypeShared | any) {
  console.log("reportComponentProps", params);
}
// useState 数据追踪
export function reportUseState(params: TraceDataTypeUseState | any) {
  console.log("reportUseState", params);
}

export function reportUseEffect(params: TraceDataTypeUseEffect | any): void {
  console.log("reportUseEffect", params);
}

// 模型数据追踪
export function reportModel(params: TraceDataTypeShared | any) {
  console.log("reportModel", params);
}

(globalThis as any).reportEntryFunction = reportEntryFunction;
(globalThis as any).reportUseEffect = reportUseEffect;
(globalThis as any).reportUseState = reportUseState;
(globalThis as any).reportModel = reportModel;
(globalThis as any).reportComponentProps = reportComponentProps;
(globalThis as any).reportComponentEvent = reportComponentEvent;