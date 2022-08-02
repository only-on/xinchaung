<template>
  <a-modal v-model:visible="modelVisible" title="学生防作弊设置" class="settingModal" :width="700" @cancel="cancelSetting">
      <div class="tips flexCenter">
        <span class="iconfont icon-zhuyi"></span>
        <span>建议学生考试时打开设置</span>
      </div>
      <ul>
        <li v-for="(item,index) in settingList" :key="index">
          <div class="flexCenter">
            <span>{{item.title}}</span>
            <a-switch v-model:checked="item.bindAttr" />
          </div>
          <span>{{item.tips}}</span>
        </li>
      </ul>
    <template #footer>
      <Submit @submit="saveSetting" @cancel="cancelSetting" :loading="settingLoading"></Submit>
    </template>
  </a-modal>
</template>
<script lang="ts" setup>
import {ref,reactive,watch} from 'vue'
import Submit from "src/components/submit/index.vue";
const props = defineProps({
  visible: Boolean,
  editInfo: {
    type: Object,
    require: false,
    default: {}
  }
})
const emit = defineEmits<{
  (e: "update:visible", val: boolean): void;
}>();
const modelVisible = ref<boolean>(false)
const settingLoading = ref<boolean>(false)
watch(()=>props.visible, newVal => {
  modelVisible.value = newVal
})
const form = reactive({
  questionOrder: false,
  optionOrder: false,
  canPaste: false,
  autoSubmit: false,
  disableExit: false,
  faceVerification: false,
  behaviorDetech: false
})
const settingList = reactive([
  {
    bindAttr: form.questionOrder,
    title: '题目顺序随机打乱',
    tips: '选中，则学生答题时，题目顺序按照题型随机显示'
  },
  {
    bindAttr: form.optionOrder,
    title: '选项顺序随机打乱',
    tips: '选中，则学生答题时，选项顺序随机显示'
  },
  {
    bindAttr: form.canPaste,
    title: '学生不可复制粘贴内容',
    tips: '选中，则学生答题时，不可复制粘贴内容'
  },
  {
    bindAttr: form.autoSubmit,
    title: '页签切换≥5次自动交卷',
    tips: '选中，则每次切换，学生端会有提示，页签切换≥5次后平台会强制交卷'
  },
  {
    bindAttr: form.disableExit,
    title: '禁止退出浏览器',
    tips: ''
  },
  {
    bindAttr: form.faceVerification,
    title: '考试前人脸身份验证',
    tips: '选中，则学生参加考试前将会要求调用摄像头并完成拍照采集，教师/助教审核通过后学生并开启手机 录制视频则可以开始考试)如开启，教师/助教可以在该考试中的详情页中对学生人脸身份进行审核。'
  },
  {
    bindAttr: form.behaviorDetech,
    title: '考生行为异常探测',
    tips: '选中，则摄像头监控学生答题行为情况，若出现明显异常的作弊行为则成绩作废'
  }
])
const saveSetting = () => {
  modelVisible.value = false
  settingLoading.value = true
  emit('update:visible', false)
}
const cancelSetting = () => {
  modelVisible.value = false
  emit('update:visible', false)
}

</script>
<style lang="less" scoped>
.settingModal{
  .tips{
    padding: 0 1rem;
    font-size: 12px;
    background: linear-gradient(90deg,rgba(0,0,0,0.04), rgba(84,84,84,0.04));
    color: var(--black-45);
    &>span:first-child{
      margin-right: 4px;
    }
  }
  ul{
    padding: 1rem;
    li{
      margin-bottom: 20px;
      div{
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;
        &>span{
          color: var(--black-65);
        }
      }
      &>span{
        font-size: 12px;
        color: var(--black-25);
      }
    }
  }
}
</style>