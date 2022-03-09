<template>
  <div class="heat-map">
    <div class="components-title">热力图</div>
    <div class="map-content"></div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  reactive,
  Ref,
  inject,
  watch,
  toRefs,
} from "vue";
import { ILabelList } from "./../forumnTyping.d";
export default defineComponent({
  name: "HeatMap",
  setup: (props, { emit }) => {
    let hotLabelList: ILabelList[] = inject('hotLabelList') as any
    return {hotLabelList};
  },
});
</script>

<style scoped lang="less">
.heat-map {
  margin-top: 40px;
  .map-content {
    height: 166px;
    background-color: var(--primary-3);
    margin-top: 16px;
  }
}
</style>
