<template>
  <div class="listItem">
    <div class="content-title">{{ title }}</div>
    <div class="content-list" v-for="(item, index) in infoList" :key="index">
      <div
        :style="{ background: color1 }"
        :class="
          infoList
            ? infoList.length > 3
              ? 'content-item min-content-item'
              : 'content-item max-content-item'
            : 'content-item max-content-item'
        "
      >
        <span :style="{ border: '1px solid' + circlecolor }">
          <span :style="{ background: circlecolor }">{{ Number(index) + 1 }}</span>
        </span>
        <span v-if="listname == 'knowledge_map_name'" :style="{ color: circlecolor}">{{ item.knowledge_map_name }}</span>
        <span v-else :style="{ color: circlecolor }">{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { defineComponent, onMounted,toRefs, watch } from "vue";
interface Props {
  infoList: any;
  title:any;
  listname:any;
  circlecolor:any;
  color1:any
}
const props = withDefaults(defineProps<Props>(), {
  infoList: () => {},
  title:()=>{},
  listname:()=>{},
  circlecolor:()=>{},
  color1:()=>{},
})
</script>
<style lang="less" scoped>
.content-title {
  font-size: var(--font-size-16);
  color: #050101;
  letter-spacing: 1px;
  font-weight: 700;
  flex-shrink: 0;
  line-height: 45px;
  margin-bottom: 15px;
}
.min-content-item {
  height: 44px;
}
.max-content-item {
  height: 44px;
}
.content-item {
  border-radius: 14px;
  padding-left: 13px;
  display: flex;
  align-items: center;
  margin-bottom:24px;
  font-size: 12px;
  // background: linear-gradient(90deg,rgba(18,144,239,0.12) 24%, rgba(98,126,234,0.00) 78%);
  > span:nth-child(1) {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    display: inline-block;
    line-height: 26px;
    text-align: center;
    padding: 2px;
    margin-right: 14px;
    box-sizing: content-box;
    border: 1px solid #1290ef;
    > span {
      width: 100%;
      height: 100%;
      display: flex;
      border-radius: 50%;
      justify-content: center;
      align-items: center;
      color: var(--white-100);
    }
  }
}
</style>
