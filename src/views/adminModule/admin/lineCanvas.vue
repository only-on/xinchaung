<template>
  <div class="line-canvas-wrap">
    <div class="line-canvas-head">
      <span>{{ type === "master" ? "控制节点" : "计算节点" }}({{ ip }})</span>
      <a-select v-model:value="currentKey">
        <a-select-option value="hour"> 最近一小时 </a-select-option>
        <a-select-option value="day"> 最近一天 </a-select-option>
        <a-select-option value="week"> 最近一周 </a-select-option>
      </a-select>
    </div>
    <div class="canvas-line" ref="lineEl"></div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  toRefs,
  reactive,
  Ref,
  onMounted,
  nextTick,
  watch,
} from "vue";
import { lineCnvas } from "./canvas";
import { getNodeGraphApi } from "./api";

export default defineComponent({
  props: ["data", "type", "ip"],
  setup(props, { emit }) {
    let type = props.type;
    const lineEl: Ref<HTMLElement> = ref(null) as any;
    const reactiveData = reactive({
      currentKey: "hour",
      data: props.data,
    });
    let lineEcharts: any = null;
    watch(
      () => reactiveData.currentKey,
      async () => {
        method.getNodeGraph().then(() => {
          if (lineEcharts) {
            lineEcharts.dispose();
            lineEcharts = lineCnvas(reactiveData.data, lineEl.value);
          } else {
            lineEcharts = lineCnvas(reactiveData.data, lineEl.value);
          }
        });
      }
    );
    const method = {
      getNodeGraph() {
        return new Promise((resolve: any, reject: any) => {
          const body = new FormData();
          body.append("type", reactiveData.currentKey);
          body.append("kind", type);
          body.append("ip", props.ip);
          getNodeGraphApi(body).then((res: any) => {
            reactiveData.data = res.data;
            resolve();
          });
        });
      },
    };
    onMounted(() => {
      nextTick(() => {
        lineEcharts = lineCnvas(reactiveData.data, lineEl.value);
      });
    });
    return {
      lineEl,
      ...toRefs(reactiveData),
    };
  },
});
</script>

<style lang="less">
.line-canvas-wrap {
  .line-canvas-head {
    display: flex;
    justify-content: space-between;
  }
  .canvas-line {
    height: 300px;
  }
}
</style>
