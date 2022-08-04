<template>
  <a-modal v-model:visible="modelVisible" :title="'编辑'+type+'基本信息'" :width="900">
    <baseInfo ref="baseInfoRef"/>
    <template #footer>
      <Submit @submit="handleSubmit" @cancel="handleCancel"></Submit>
    </template>
  </a-modal>
</template>
<script lang="ts" setup>
import {ref,reactive,inject,watch} from 'vue'
import baseInfo from './baseInfo.vue'
import Submit from "src/components/submit/index.vue";
const props = defineProps({
  visible: Boolean,
})
const emit = defineEmits<{
  (e: "update:visible", val: boolean): void;
  (e: "save", val: any): void;
}>();
const type= inject('type')
const modelVisible = ref(props.visible)
const baseInfoRef = ref<any>()
const handleSubmit = async () => {
  await baseInfoRef.value.fromValidate()
  modelVisible.value = false
  emit('update:visible', false)
  emit('save', baseInfoRef.value.formState)
}
const handleCancel = () => {
  modelVisible.value = false
  emit('update:visible', false)
}
watch(()=>props.visible, newVal =>{
  modelVisible.value = newVal
})

</script>