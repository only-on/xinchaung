<template>
  <div :class="['cc_container', {'border': border}]" :style="{height: height +'px'}">
    <div class="cc_top">
      <div class="cc_left">
        <span :class="['title',{'showSymbol': showSymbol}]">{{title}}</span>
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
  height?: any,
  showSymbol?: boolean
}>(), {
  title: '',
  border: true,
  showSymbol: false
})
const fontSize = props.showSymbol ? '14px' : '16px'
const marginLeft = props.showSymbol ? '10px' : '0'
</script>
<style lang="less" scoped>
.cc{
  &_container{
    background: var(--white-100);
    margin-bottom: 20px;
    &.border{
      border-radius: 10px;
      .cc_top{
        padding: 10px 30px;
        border-bottom: 1px solid var(--black-15);
      }
      .cc_content{
        padding: 15px 30px;
        margin-top: 0;
      }
    }
  }
  &_top{
    display: flex;
    justify-content: space-between;
    color: var(--black-45);
    font-size: 12px;
    padding: 0;
    .cc_left{
      display: flex;
      align-items: center;
      &>span:first-child{
        font-size: v-bind('fontSize');
        margin-left: v-bind('marginLeft');
        color: var(--black-85);
        position: relative;
        &.showSymbol{
          &::before{
            content: '*';
            display: block;
            position: absolute;
            top: 0;
            left: -8px;
            color: var(--red-5);
          }
        }
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
    padding: 0;
    color: var(--black-65);
    margin-top: 10px;
  }
}
</style>