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
            <a-switch v-model:checked="form[item.key]" />
          </div>
          <span>{{item.tips}}</span>
        </li>
      </ul>
    <template #footer>
      <Submit @submit="saveSetting" @cancel="cancelSetting"></Submit>
    </template>
  </a-modal>
</template>
<script lang="ts" setup>
import {ref,reactive,watch} from 'vue'
import Submit from "src/components/submit/index.vue";
import {initialData} from '../utils'
const props = defineProps({
  visible: Boolean,
  data: {
    type: Object,
    default: {}
  }
})
const emit = defineEmits<{
  (e: "update:visible", val: boolean): void;
  (e: "save", val:any): void;
}>();
const modelVisible = ref<boolean>(false)
watch(()=>props.visible, newVal => {
  modelVisible.value = newVal
  if (newVal) {
     Object.assign(form, props.data)
  }
})
const form = reactive(JSON.parse(JSON.stringify(initialData)))
const settingList = reactive([
  {
    key: 'topic_chaotic',
    title: '题目顺序随机打乱',
    tips: '选中，则学生答题时，题目顺序按照题型随机显示'
  },
  {
    key: 'options_chaotic',
    title: '选项顺序随机打乱',
    tips: '选中，则学生答题时，选项顺序随机显示'
  },
  {
    key: 'no_copy',
    title: '学生不可复制粘贴内容',
    tips: '选中，则学生答题时，不可复制粘贴内容'
  },
  {
    key: 'no_switch',
    title: '页签切换≥5次自动交卷',
    tips: '选中，则每次切换，学生端会有提示，页签切换≥5次后平台会强制交卷'
  },
  {
    key: 'no_quit',
    title: '禁止退出浏览器',
    tips: ''
  },
  {
    key: 'face_verify',
    title: '考试前人脸身份验证',
    tips: '选中，则学生参加考试前将会要求调用摄像头并完成拍照采集，教师/助教审核通过后学生并开启手机 录制视频则可以开始考试)如开启，教师/助教可以在该考试中的详情页中对学生人脸身份进行审核。'
  },
  {
    key: 'dystropic',
    title: '考生行为异常探测',
    tips: '选中，则摄像头监控学生答题行为情况，若出现明显异常的作弊行为则成绩作废'
  }
])
const saveSetting = () => {
  modelVisible.value = false
  emit('update:visible', false)
  emit('save', form)
}
const cancelSetting = () => {
  modelVisible.value = false
  emit('update:visible', false)
}
watch(() =>props.data, newVal => {
  if (newVal) {
    Object.assign(form, newVal)
  }
},{deep:true,immediate:true})

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