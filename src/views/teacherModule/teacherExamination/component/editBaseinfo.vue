<template>
  <a-modal :visible="visible" :title="'编辑'+type+'基本信息'" :width="900" @cancel="handleCancel">
    <baseInfo ref="baseInfoRef" :formState="editInfo" :type="type"/>
    {{editInfo.relation}}----
    <template #footer>
      <Submit @submit="handleEdit" @cancel="handleCancel"></Submit>
    </template>
  </a-modal>
</template>
<script lang="ts" setup>
import {ref,reactive, watch} from 'vue'
import baseInfo from './baseInfo.vue'
import { Modal, message } from "ant-design-vue";
import Submit from "src/components/submit/index.vue";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
const http = (request as any).teacherExamination;
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
const getExamDetail = (id:any) => {
  http.examDetail({urlParams:{ID: id}}).then((res:IBusinessResp) => {
    let result = res?.data
    console.log(result.started_at.length)
    Object.assign(editInfo,{
      name: result.name,
      date: [result.started_at, result.closed_at],
      note: result.note,
      course_id: result.course_id,
      relation: result.course_id ? [1, result.course_direction.id, result.course_id] : [0]
    })
  })
}
watch(()=>props.id, newVal => {
  if (newVal) {
    getExamDetail(newVal)
  }
},{immediate:true})
watch(()=>props.visible, newVal => {
  if (newVal) {
    getExamDetail(props.id)
  }
},{deep:true,immediate:true})
const handleEdit = async() => {
  console.log(editInfo)
  await baseInfoRef.value.fromValidate()
  let params = {
    name: editInfo.name,
    course_id: editInfo.relation.length > 1 ?  editInfo.relation[ editInfo.relation.length-1] : 0,
    started_at: editInfo.date[0].length < 19 ? editInfo.date[0] + ':00' : editInfo.date[0],
    closed_at: editInfo.date[1].length < 19 ? editInfo.date[1] + ':00' : editInfo.date[1],
    note: editInfo.note
  }
  http.editExam({urlParams:{ID: props.id},param:params}).then((res:IBusinessResp) => {
    message.success('编辑成功')
    emit('update:visible', false)
    emit('updateInfo')
  })
}
const handleCancel = () => {
  emit('update:visible', false)
}
</script>