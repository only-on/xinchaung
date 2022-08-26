<template>
  <div :class="['resultShow','setScrollbar',{'border': border}]">
    <div>
      结果文件
      <a-button type="link">下载</a-button>
      过程文件
      <a-button type="link">下载</a-button>
    </div>
    <span>作品说明</span>
    <p>{{resultInfo.remark}}</p>
    <!-- <p>在旧版分析中也提到，频道的整体设计风格缺乏品牌调性，缺少可以让用户记忆的品牌元素，无法建立对京东国际的品牌认知；并且视觉信息层级混乱。</p> -->
  </div>
</template>
<script lang="ts" setup>
interface Props {
  border?:boolean,
  resultInfo: {
    remark: string
  }
}
const props = withDefaults(defineProps<Props>(), {
  border: false,
  resultInfo: {
    remark: ''
  }
});
</script>
<style lang="less" scoped>
.resultShow{
  max-height: 200px;
  overflow: auto;
  &.border{
    background: rgba(0,0,0,0.04);
    border: 1px solid rgba(0,0,0,0.15);
    border-radius: 7px; 
    padding: 20px 0;
  }
  >div{
    .ant-btn{
      padding: 0;
    }
    .ant-btn:first-child{
      margin-right: 100px;
    }
  }
  >span{
    display: inline-block;
    margin: 15px 0 5px;
  }
  >p{
    line-height: 24px;
  }
}
</style>