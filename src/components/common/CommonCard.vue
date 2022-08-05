<template>
  <div :class="['cc_container', {'border': border}]" :style="{height: height +'px'}">
    <div class="cc_top">
      <div class="cc_left">
        <span>{{title}}</span>
        <slot name="tip"></slot>
      </div>
      <div class="cc_right">
        <slot name="right"></slot>
      </div>
    </div>
    <div class="cc_content">
      <slot name="content"></slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch ,inject} from "vue";
const props = withDefaults(defineProps<{
  title: string
  border?: boolean
  height?: any
}>(), {
  title: '',
  border: true
})
</script>
<style lang="less" scoped>
.cc{
  &_container{
    background: var(--white-100);
    margin-bottom: 20px;
    &.border{
      border-radius: 10px;
      .cc_top{
        border-bottom: 1px solid var(--black-15);
      }
    }
  }
  &_top{
    display: flex;
    justify-content: space-between;
    padding: 10px 30px;
    color: var(--black-45);
    font-size: 12px;
    .cc_left{
      display: flex;
      align-items: center;
      &>span:first-child{
        font-size: 16px;
        color: var(--black-85);
      }
    }
    :deep(.cc_right)>*{
      margin-left: 10px;
    }
    :deep& span:not(.ant-btn span){
      margin-right: 16px;
    }
  }
  &_content{
    padding: 15px 30px;
    color: var(--black-65);
  }
}
</style>