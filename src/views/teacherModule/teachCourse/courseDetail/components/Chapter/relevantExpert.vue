<template>
  <h3 class="courseH3">相关实验</h3>
  <div class="relevant">
    <div class="item" v-for="v in 5" :key="v">
      <div class="text">{{'基于入侵检测的告警分析-外网'}}</div>
      <div class="number">{{'127人学过'}}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted ,Ref} from "vue";
interface Props {
  list: any;
}
const props = withDefaults(defineProps<Props>(), {
  list: ()=> [],  
});
</script>

<style lang="less" scope>
  .courseH3{
    margin-bottom: 1rem;
    // color: var(--blue-6-2);
  }
  .relevant{
    .item{
      margin-bottom: 1rem;
      .text{
        color: var(--primary-color);
        letter-spacing: 0.34px;
      }
      .number{
        color: var(--black-45);
      }
    }
  }
</style>