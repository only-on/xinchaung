<template>
  <watermark-icon />
  <watermark-icon
    icon="xuniji"
    title="虚拟机"
    description="4c16G512G"
    :style="{backgroundColor: '#37b7f7'}"
  />
  <watermark-icon
    icon="jiaoshi1"
    title="张老师"
    description="数学很厉害的大帅哥"
    :style="{backgroundColor: '#feba4a'}"
  />
  <watermark-icon
    icon="jiaoshi"
    title="教案"
    description="他的教案很长，有这么长，这么长，都放不下了"
    :style="{backgroundColor: '#f90e27'}"
  />
  <a-row :gutter="24">
    <a-col :span="8">
      <common-card title="基础信息">
        <template #tip>
          <span>共12道题</span>
          <span>共12道题</span>
        </template>
        <template #right>
          <div>
            <span>小题之间可以拖拽排序</span>
            <a-button type="primary">选择题目</a-button>
          </div>
        </template>
        <template #content>
            自定义内容
        </template> 
      </common-card>
    </a-col>
    <a-col :span="8">
      <common-card title="基础信息11"/>
    </a-col>
    <a-col :span="8">
      <common-card title="基础信息11" :border="false"/>
    </a-col>
  </a-row>
  <!-- 测试开始 -->
  {{pageInfo.page}} ------{{pageInfo.size}}
  <Pagination v-model:page="pageInfo.page" v-model:size="pageInfo.size" :total="pageInfo.total" @page-change="pageChange"/>
  <!-- 测试结束 -->
  <antdv-markdown></antdv-markdown>
</template>

<script lang="ts">
import WatermarkIcon from "../common/WatermarkIcon.vue";
import { defineComponent, reactive ,ref,provide} from "vue";
import CommonCard from "../common/CommonCard.vue";
import Pagination from '../Pagination.vue'
export default defineComponent({
  name: "Demo",
  components: {
    WatermarkIcon,
    CommonCard,
    Pagination
  },
  setup () {
    const pageInfo = reactive({
      page: 1,
      size: 10,
      total: 20
    })
    const pageChange = () => {
      console.log(pageInfo)
    }
    return {
      pageInfo,
      pageChange
    }
  }
});
</script>
