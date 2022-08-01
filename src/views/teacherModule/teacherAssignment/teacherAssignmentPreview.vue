<template>
  <div class="teacherAssignmentPreview">
    <div class="info flexCenter">
      <div class="title">单元测验-《大学计算机基础第3版》第3、4章（一）-计算思维、数值与字符编码</div>
      <div class="explain">作业/考试说明</div>
      <div class="explainText">交互设计本质上就是设计产品的使用方式的过程，账号怎么填写；表单怎么导出；数据怎么筛选；列表怎么排序等等。针对每个功能的使用方式，都可以花很长的时间去考虑其合理性。一个项目的交互，就是这个项目所有功能使用方式的总和。</div>
      <!-- <div>无说明文字</div> -->
    </div>
    <TopicDisplay />
  </div>
</template>
<script lang="ts" setup>
import {
  defineComponent,
  ref,
  onMounted,
  reactive,
  Ref,
  inject,
  computed,
  toRefs,
  watch,
  defineExpose,
  defineProps,
  withDefaults,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { Modal, message } from "ant-design-vue";
import TopicDisplay from 'src/components/TopicDisplay/index.vue'
const router = useRouter();
const route = useRoute();
const { editId } = route.query;
const http = (request as any).teacherAssignment;
var configuration: any = inject("configuration");
var updata = inject("updataNav") as Function;
updata({
  tabs: [{ name: "作业预览", componenttype: 0 }],
  showContent: true,
  componenttype: undefined,
  showNav: true,
});
// interface Props {
//   defaultConfig: any;
//   imageList:string
// }
// const props = withDefaults(defineProps<Props>(), {
//   defaultConfig: () => {},
//   imageList:'',
// });

// const emit = defineEmits<{
//   (e: "selectedImage", val: any): void;
// }>();

</script>
<style scoped lang="less">
.teacherAssignmentPreview{
  padding: 32px 40px;
  .info{
    flex-direction: column;
    padding-bottom: 32px;
    .title{
      margin: 0 auto;
      font-size: 18px;
      color: var(--black-85);
      margin-bottom: 56px;
    }
    .explainText{
      padding: 16px 30px 24px;
    }
  }
  
}
</style>
