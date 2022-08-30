<template>
  <div :class="['resultShow','setScrollbar',{'border': border}]">
    <div>
      评估结果
      <a-button type="link" @click="checkResult()">查看</a-button>
      过程文件
      <a-button type="link" @click="downLoad(resultInfo.process)">下载</a-button>
    </div>
    <span>作品说明</span>
    <p>{{resultInfo.detail}}</p>
  </div>
  <!-- 查看评估结果 -->
  <a-modal :visible="checkVisible" title="评估结果" :width="700" @cancel="handleCancel" :footer="null">
    <div>
      评估结果
    </div>
  </a-modal>
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
    remark: ''
  }
});
const checkVisible = ref<boolean>(false)
const checkResult = () => {
  checkVisible.value = true
}
const handleCancel = () => {
  checkVisible.value = false
}
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