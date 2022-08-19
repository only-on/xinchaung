<template>
  <a-modal class="editModal" :visible="visible" :title="'编辑'+type+'基本信息'" :width="900" @cancel="handleCancel">
   showCascader {{showCascader}}
    <baseInfo ref="baseInfoRef" v-model:formState="editInfo" :type="type" :isEdit="true" :showCascader="showCascader"/>
    <template #footer>
      <Submit @submit="handleEdit" @cancel="handleCancel" :loading="loading"></Submit>
    </template>
  </a-modal>
</template>
<script lang="ts" setup>
import {ref,reactive, watch,Ref} from 'vue'
import baseInfo from './baseInfo.vue'
import { Modal, message } from "ant-design-vue";
import Submit from "src/components/submit/index.vue";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import {formatTime} from '../utils'
const httpExam = (request as any).teacherExamination;
const httpAssignment = (request as any).teacherAssignment;
interface Props {
  type: any;
  id: any;
  visible: boolean
}
const props = withDefaults(defineProps<Props>(), {
  type: '',
  id: '',
  visible: false
})
const emit = defineEmits<{
  (e: "update:visible", val: any): void;
  (e: "updateInfo"): void;
}>();
const editInfo = reactive<any>({})
const baseInfoRef = ref()
const showCascader = ref<boolean>(true) // 是否显示关联课程组件。编辑基本信息，详情返回课程id为0则不显示
const getDetail = (id:any) => {
  console.log(props.type)
  let request = {
    '作业': httpAssignment.assignmentDetail, // 作业
    '考试': httpExam.examDetail // 考试
  }
  request[props.type]({urlParams:{ID: id}}).then((res:IBusinessResp) => {
    let result = res?.data
    if (!result) return
    if (!result.course_id) {
      showCascader.value = false
    }
    Object.assign(editInfo,{
      name: result.name,
      date: [result.started_at, result.closed_at],
      note: result.note,
      course_id: result.course_id,
      relation: result.course_id ? [1, result.course_direction.name, result.course_info.name] : [0],
      students_info: result.students_info,
    })
  })
}
watch(()=>props.visible, newVal => {
  if (newVal) {
    getDetail(props.id)
  }
},{deep:true,immediate:true})
var loading:Ref<boolean> = ref(false);
const handleEdit = async() => {
  await baseInfoRef.value.fromValidate()
  console.log(baseInfoRef.value.studentIds)
  let params = {
    name: editInfo.name,
    course_id: editInfo.course_id,
    started_at: formatTime(editInfo.date[0]),
    closed_at: formatTime(editInfo.date[1]),
    note: editInfo.note,
    student_ids: baseInfoRef.value.studentIds,
  }
  console.log(params)
  loading.value=true
  let request = {
    '作业': httpAssignment.editAssignment, // 作业
    '考试': httpExam.editExam // 考试
  }
  request[props.type]({urlParams:{ID: props.id},param:params}).then((res:IBusinessResp) => {
    loading.value=false
    message.success('编辑成功')
    emit('update:visible', false)
    emit('updateInfo')
  }).catch((err:any)=>{
    loading.value=false
  })
}
const handleCancel = () => {
  emit('update:visible', false)
}
</script>
<style lang="less" scoped>
:deep(.editModal){
  .ant-modal-body{
    height:750px;
    overflow: auto;
  }
}
</style>