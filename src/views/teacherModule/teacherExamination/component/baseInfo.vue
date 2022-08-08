<template>
  <a-form layout="vertical" :model="formState" :rules="rules" ref="baseInfoFormRef"> 
    <div class="info">
      <div class="left">
        <a-form-item :label="type+'名称'" name="name">
          <a-input v-model:value="formState.name" :placeholder="'请输入'+type+'名称'" />
        </a-form-item>
        <a-form-item label="起始时间" name="date">
          <a-range-picker @change="dateChange" v-model:value="formState.date" :showTime="{format: 'HH:mm'}" valueFormat="YYYY-MM-DD HH:mm" format="YYYY-MM-DD HH:mm" :disabledDate="disabledDate">
            <template #suffixIcon>
              <calendar-outlined />
            </template>
          </a-range-picker>
        </a-form-item>
      </div>
      <div class="right">
        <a-form-item label="关联课程">
          <cascader v-model:relation="formState.relation"></cascader>
        </a-form-item>
      </div>
    </div>
    <a-form-item :label="type+'说明'">
      <a-textarea v-model:value="formState.note" :auto-size="{ minRows: 6, maxRows: 8 }" :maxlength="100" :placeholder="'请输入'+type+'说明'" />
    </a-form-item>
  </a-form>
</template>
<script lang="ts" setup>
import {ref, reactive, watch, inject, defineExpose} from 'vue'
import { CalendarOutlined  } from '@ant-design/icons-vue';
import moment, { Moment } from 'moment';
import cascader from "src/components/ReleasePaper/cascader.vue"
import { AnyARecord } from 'dns';
const props =withDefaults(defineProps<{
  formState:any
  editInfo?: any,
  type: string,
}>(), {
  formState: {},
  editInfo: {},
  type: '考试',
})
const rules = {
  name: [
    { required: true, message: `请输入名称`, trigger: "blur" },
    { max: 20, message: `名称最多20个字符`, trigger: "blur" },
  ],
  date: {required: true, message: `请选择起始时间`}
}
const baseInfoFormRef = ref()
const dateChange = () => {}
const disabledDate=(current: Moment)=>{
  return current && current <= moment().endOf('day').subtract(1, "days");
}
const fromValidate = () => {
  return new Promise((resolve: any, reject: any) => {
    baseInfoFormRef.value.validate().then(() => {
      resolve()
    })
  })
}
// watch(()=> props.editInfo, (newVal:any) => {
//   console.log(newVal)
//   if (newVal) {
//     Object.assign(formState, newVal)
//   }
// },{deep:true,immediate:true})
defineExpose({
  fromValidate
})
</script>
<style lang="less" scoped>
.info{
  display: flex;
  justify-content: space-between;
  .left,.right{
    width: 40%;
    .ant-picker{
      width: 100%;
      border-radius: 20px;
    }
  }
}
</style>