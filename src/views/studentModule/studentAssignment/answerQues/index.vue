<template>
    <div class="answerQues">
        <answer-ques-com type='task' :dataList='dataList'></answer-ques-com>
    </div>
</template>
<script lang="ts" setup>
import {
  ref,
  toRefs,
  onMounted,
  Ref,
  inject,
  computed,
  reactive,
  watch,
  toRaw,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import request from "src/api/index";
import { Modal, message } from "ant-design-vue";
import answerQuesCom from 'src/components/answerQuesCom/index.vue'
const route = useRoute();
const router = useRouter();
var updata = inject("updataNav") as Function;
updata({
  tabs: [{ name: "作业答题", componenttype: 0 }],
  showContent: true,
  componenttype: undefined,
  showNav:false,
});
const dataList:any=reactive({
    title:'单元测验-《大学计算机基础第3版》第3、4章（一）-计算思维、数值与字符编码',
    list:[
        {
            type:1,quesList:[
                {
                    ques:'在旧版分析中也提到，频道的整体设计风格缺乏品牌调性，缺少可以让用户记忆的品牌元素，无法建立对京东国际的品牌认知；并且视觉信息层级混乱，设计规范性差，设计沟通维护成本高。结合前期对用户及竞品的分析，以及一系列设计的探索，因此我们确定将从「品牌强化」及「体验升级」两个方向进行京东国际频道的品牌视觉全新升级。',
                    quesAnswer:[
                      '旧版底部导航图标均为直角处理，会显得生硬，且部分图标的语义并不符合。',
                      '新版图标采取断点式风格，在转角处做圆润倒角处理',
                      '与主站首页风格保持统一的前提下也延续了频道的整体调性。',
                      'configurations.xh'
                    ]
                },
                {
                    ques:'22222在旧版分析中也提到，频道的整体设计风格缺乏品牌调性，缺少可以让用户记忆的品牌元素，无法建立对京东国际的品牌认知；并且视觉信息层级混乱，设计规范性差，设计沟通维护成本高。结合前期对用户及竞品的分析，以及一系列设计的探索，因此我们确定将从「品牌强化」及「体验升级」两个方向进行京东国际频道的品牌视觉全新升级。',
                    quesAnswer:[
                      '22旧版底部导航图标均为直角处理，会显得生硬，且部分图标的语义并不符合。',
                      '22新版图标采取断点式风格，在转角处做圆润倒角处理',
                      '22与主站首页风格保持统一的前提下也延续了频道的整体调性。',
                      '222configurations.xh'
                    ]
                }
            ]
        },
        {
            type:2,quesList:[
                {
                    ques:'判断在旧版分析中也提到，频道的整体设计风格缺乏品牌调性，缺少可以让用户记忆的品牌元素，无法建立对京东国际的品牌认知；并且视觉信息层级混乱，设计规范性差，设计沟通维护成本高。结合前期对用户及竞品的分析，以及一系列设计的探索，因此我们确定将从「品牌强化」及「体验升级」两个方向进行京东国际频道的品牌视觉全新升级。'
                }
            ]
        },
        {
            type:3,quesList:[
                {
                    ques:'解答判断在旧版分析中也提到，频道的整体设计风格缺乏品牌调性，缺少可以让用户记忆的品牌元素，无法建立对京东国际的品牌认知；并且视觉信息层级混乱，设计规范性差，设计沟通维护成本高。结合前期对用户及竞品的分析，以及一系列设计的探索，因此我们确定将从「品牌强化」及「体验升级」两个方向进行京东国际频道的品牌视觉全新升级。',
                    quesAnswer:['q1','222']
                }
            ]
        }
    ]
})
</script>
<style lang="less" scoped>
.answerQues{
    display: flex;
}
</style>