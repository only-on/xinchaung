<template>
  <vnc v-if="false"></vnc>
  <jupyter v-if="false"></jupyter>
  <webide v-if="false"></webide>
  <documentOrVideo v-if="true"></documentOrVideo>
  <!--自评、推荐-->
  <a-modal
    :visible="evaluateVisible"
    :title="'推荐实验'"
    class="evaluate-modal"
    :closable="false"
    :footer="null"
    :maskClosable="false"
  >
    <div>
      <img :src="evaluateTopBg" class="evaluate-top-bg" alt="" srcset="" />
      <div class="row-clu">
        <div class="row-title">请您对自己的表现进行评价</div>
        <div class="start-wrap">
          <a-rate v-model:value="startValue" />
        </div>
      </div>
      <div class="row-clu">
        <div class="row-title">数据统计</div>
        <div class="echarts-wrap">
          <div ref="histogramEchart1" id="histogramEchart1" class="data-histogram"></div>
          <!-- <div ref="histogramEchart2" class="data-histogram"></div> -->
        </div>
      </div>
      <div class="row-clu">
        <div class="row-title">拓展知识</div>
        <div>
          {{
            baseInfo?.base_info?.expand_knowledge
              ? baseInfo?.base_info?.expand_knowledge
              : "暂无知识点"
          }}
        </div>
      </div>
      <div
        class="row-clu"
        v-if="evaluateData.recommend && evaluateData.recommend.length > 0"
      >
        <div class="row-title">推荐实验</div>
        <ul>
          <li
            v-for="item in evaluateData.recommend"
            :key="item.id"
            @click="recommend(item)"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>
      <div class="row-clu t-center p-b-20">
        <a-button type="primary" @click="submitEvaluate">确定</a-button>
      </div>
    </div>
  </a-modal>
  
</template>

<script lang="ts" setup>
import { ref, provide, watch, Ref, nextTick,onMounted } from "vue";
import vnc from "./Vnc/newVnc.vue";
import jupyter from "./jupyter/jupyter.vue";
import webide from "./webide/webide.vue";
import documentOrVideo from "./documentOrVideo/documentOrVideo.vue";
import { message } from "ant-design-vue";
import evaluateTopBg from "src/assets/images/vm/self-rating.jpg";
import { useRoute, useRouter } from "vue-router";
import { cloneDeep } from "lodash";
import {histogram} from "./echarts"
import {
  endOperates,
  endExperiment,
  secondToHHMMSS,
  backTo,
  operatesHandle,
  IAction,
  toStudyRecommendExperiment,
  evaluateApi,
} from "src/utils/vncInspect";

const route = useRoute();
const router = useRouter();
const { type, opType, taskId, topoinst_id } = route.query;

const evaluateVisible: Ref<boolean> = ref(false); // 控制自评、推荐显示隐藏
const baseInfo: any = ref({}); // pageinfo接口获取的基本数据
const startValue: Ref<number> = ref(0); // 自评打分
const evaluateData: any = ref({}); // 自评数据
const histogramEchart1: any = ref(null);

let historyLength = history.length; // 记录路由跳转次数

provide("baseInfo", baseInfo); // pageinfo接口获取的基本数据
provide("vmsInfo", ref({})); // 存储vms虚拟机数据
provide("currentOption", ref({})); // 当前开启的虚拟机配置
provide("recommendData", ref([])); // 推荐实验数据
provide("loading", ref(false)); // 虚拟机是否加载中 ture加载中 fasle加载完成
provide("isClose", ref(true)); // 是否是关机状态 true 是，false 否
provide("novncEl", ref(null)); // novnc的Vue实例
provide("currentUuid", ref("")); // 当前uuid
provide("use_time", ref(0)); // 使用时间
provide("taskType", ref("")); // 当前实验类型
provide("sshUrl", ""); // ssh 实验url
provide("currentInterface", ref("vnc")); // 当前是webssh链接还是vnc链接，值：vnc、ssh
provide("initVnc", ref(null)); // 初始换虚拟机链接
provide("ws", ref(null)); // 当前ws实例
provide("currentClickIndex", ref("")); // 当前点击的虚拟机索引
provide("currentVmIndex", ref(0)); // 当前展示的虚拟机索引
provide("currentVm", ref({})); // 当前展示的虚拟机
provide("isScreenRecording", ref(false)); // 是否正在录屏
provide("leftWidth", ref(70)); // 左侧容器宽度
provide("rightWidth", ref(window.innerWidth - 70)); // 右侧容易宽度
provide("evaluateVisible", evaluateVisible); // 控制自评推荐实验modal显示隐藏
provide("initEvaluate", initEvaluate);  // 初始化自评modal图
provide("evaluateData", evaluateData); // 自评数据


// 提交评价
function submitEvaluate() {
  let params: any = {
    type: type,
    opType: opType,
    taskId: taskId,
    score: startValue.value * 20,
  };
  evaluateApi({
    action: "score",
    params: params,
  }).then((res: any) => {
    if (
      baseInfo.value?.base_info?.task_type.type == 4 &&
      baseInfo.value?.base_info?.task_type.programing_type == 0
    ) {
      router.go(historyLength - history.length - 1);
    } else {
      router.go(-1);
    }
    message.success("自评成功");
    // backTo(router, type, 3, routerQuery);
  });
}

// 推荐实验
function recommend(val: {
  id: number;
  name: string;
  recommend_type: "content" | "train";
}) {
  let cloneVal = cloneDeep(val);
  let params: any = {
    recommendType: cloneVal.recommend_type,
    opType: "recommend",
    type: type,
    taskId: cloneVal.id,
  };
  toStudyRecommendExperiment(router, params, { topoinst_id });
}

// 初始推荐
function initEvaluate(){
    nextTick(()=>{
      setTimeout(()=>{
        histogram(histogramEchart1, evaluateData.value);
      },1000)
    })
}

</script>

<style lang="less" scoped>
.evaluate-modal {
  .ant-modal-header {
    display: none;
  }
  .ant-modal-body {
    padding: 0;
  }
  .evaluate-top-bg {
    width: 100%;
  }
  .row-clu {
    padding: 0px 15px 0 15px;
    margin-top: 16px;
  }
  .row-title {
    font-size: 16px;
    font-weight: 600;
  }
  .start-wrap {
    text-align: center;
  }
  .ant-rate {
    font-size: 45px;
  }
  .echarts-wrap {
    display: flex;
  }
  .data-histogram {
    height: 250px;
    width: 50%;
  }
  .t-center {
    text-align: center;
  }
  .p-b-20 {
    padding-bottom: 20px;
  }
}
</style>
