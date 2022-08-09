<template>
  <div class="teacherExaminationAchievement">
    <div class="achievementLeft">
        <Outline :title="headerObj.title" :explain="headerObj.explain" :explainText="headerObj.explainText" />
        <TopicDisplay :purpose="'achievement'" />
    </div>
    <div class="achievementRight">
        <ScoreRanking />
        <div class="caozuo flexCenter">
          <a-button  type="primary"> 上一人 </a-button>
          <a-button  type="primary"> 下一人 </a-button>
        </div>
        <div class="ViolationRecord">
          <div class="title">违规记录</div>
          <div class="itemBox textScrollbar">
            <div class="item" v-for="(v,k) in 12">
              <div class="time">2022/07/19 14:00:32</div>
              <a-tooltip placement="top">
                <template #title>
                  <span>异常行为概述文字显示在这里异常行为概述文字显示在这里</span>
                </template>
                <div class="text single_ellipsis">异常行为概述文字显示在这里异常行为概述文字显示在这里</div>
              </a-tooltip>
              <!-- <div class="text single_ellipsis">异常行为概述文字显示在这里异常行为概述文字显示在这里</div> -->
            </div>
          </div>
        </div>
    </div>
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
import Outline from 'src/components/TopicDisplay/outline.vue'
import ScoreRanking from 'src/components/scoreRanking/index.vue'
const router = useRouter();
const route = useRoute();
const { editId } = route.query;
const http = (request as any).teacherAssignment;
var configuration: any = inject("configuration");
var updata = inject("updataNav") as Function;
updata({
  tabs: [{ name: "成绩详情", componenttype: 0 }],
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
const headerObj:any=reactive({
  title:'单元测验-《大学计算机基础第3版》第3、4章（一）-计算思维、数值与字符编码',
  explain:'作业/考试说明',
  explainText:'交互设计本质上就是设计产品的使用方式的过程，账号怎么填写；表单怎么导出；数据怎么筛选；列表怎么排序等等。针对每个功能的使用方式，都可以花很长的时间去考虑其合理性。一个项目的交互，就是这个项目所有功能使用方式的总和。',
})
</script>
<style scoped lang="less">
    .teacherExaminationAchievement{
        display: flex;
        justify-content: space-between;
        .achievementLeft{
            width: 944px;
        }
        .achievementRight{
            width: 240px;
          .caozuo{
            margin-top: 20px;
            justify-content: space-between;
          }
        }
    }
    .ViolationRecord{
      margin-top: 40px;
      width: 240px;
      background-color: var(--white);
      .title{
        text-align: center;
        padding: 15px 0;
        border-bottom: 1px solid rgba(0,0,0,0.15);
      }
      .itemBox{
        padding:16px;
        height: 650px;
        overflow-y: auto;
        .item{
          margin-bottom: 20px;
          .time{
            font-size: 12px;
            color:var(--black-45);
          }
          .text{
            // font-size: 14px;
          }
        }
      }
    }
</style>
