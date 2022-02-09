<template>
  <div class="classical__asset-folder" @click="handleClick">
    <div class="classical__asset-main">
      <div class="classical__asset-title">{{ title }}</div>
    </div>
    <div class="classical__asset-right">
      <ul>
        <li><span class="iconfont icon-shijian"/><span class="classical__asset-item">{{ date }}</span></li>
        <li><span class="iconfont icon-cunchuzhi"/><span class="classical__asset-item">{{ size }}</span></li>
        <li><span class="iconfont icon-wenjian"/><span class="classical__asset-item">{{ count }}</span></li>
        <li v-if="powerType===1"><span class="iconfont icon-shanchu" @click.stop="deleteData"/></li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import {defineComponent,watch} from "vue";

export default defineComponent({
  name: "AssetFolder",
  emits: ["click",'deleteItem'],
  props: {
    title: {
      type: String,
      default: ''
    },
    date: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: ''
    },
    count: {
      type: String,
      default: ''
    },
    powerType:{
      type:Number,
      default:1
    }
  },
  setup(props, {emit}) {
    const handleClick = function () {
      emit('click')
    }
    const deleteData=function(){
      console.log('删除')
      emit('deleteItem',)
    }
    return {handleClick,deleteData}
  }
});
</script>
<style lang="less">
.classical__asset-folder {
  border: 1px solid var(--gray-5);
  border-radius: var(--border-radius-default);
  padding: var(--padding-sm);
  display: flex;
  justify-content: space-between;
  // https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Box_Model/Mastering_margin_collapsing
  // 相同块元素之间，在垂直方向上，其margin会叠加，css这样设计的意义在于避免产生双倍边距
  margin: var(--margin-md) 0px;
  color: var(--black-25);
  cursor: pointer;
  transition: all 0.5s ease;

  &:hover {
    box-shadow: 0 0 5px 3px hsv(0, 0, 85%);;
  }

  .classical__asset-title {
    font-size:var(--font-size-16);
    color: var(--black-85);
  }

  .classical__asset-right {
    font-size:var(--font-size-14);
    ul {
      margin: 0;
      padding: 0;
      .iconfont{
        font-size:var(--font-size-14);
      }
      .icon-shanchu:hover{
        color: var(--primary-color);
      }
      li {
        display: inline-block;
        margin-right: var(--margin-md);

        .classical__asset-item {
          margin-left: var(--margin-xss);
        }

        &:not(:last-child) {
          width: 120px;
        }
      }
    }
  }
}
</style>
