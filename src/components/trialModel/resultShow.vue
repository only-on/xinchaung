<template>
  <div :class="['resultShow','setScrollbar',{'border': border}]">
    <div>
      模型评估结果：
      <span class="resultScore">{{resultInfo.result}}</span>
      过程文件
      <a-button type="link" @click="downLoad(resultInfo.process)" :disabled="!resultInfo.process.path">下载</a-button>
    </div>
    <span>作品说明</span>
    <p>{{resultInfo.detail}}</p>
  </div>
</template>
<script lang="ts" setup>
import {ref} from 'vue'
import {downloadUrl} from 'src/utils/download'
interface Idownload{
  path: string,
  file_name: string
}
interface Props {
  border?:boolean,
  resultInfo: any
}
const props = withDefaults(defineProps<Props>(), {
  border: false,
  resultInfo: {
    result: '',
    detail: '',
    process: {
      path: '',
      file_name: ''
    }
  }
});
const downLoad = (obj:Idownload) => {
  downloadUrl(obj.path, obj.file_name)
}
</script>
<style lang="less" scoped>
.resultShow{
  max-height: 200px;
  overflow: auto;
  &.border{
    background: rgba(0,0,0,0.04);
    border: 1px solid rgba(0,0,0,0.15);
    border-radius: 7px; 
    padding: 20px;
  }
  >div{
    .ant-btn{
      padding: 0;
    }
    .resultScore{
      color: var(--primary-color);
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