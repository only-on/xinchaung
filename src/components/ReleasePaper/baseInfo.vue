<template>
  <a-form layout="vertical" :model="props.formState" :rules="rules" ref="baseInfoFormRef"> 
    <div class="release-exam-info">
      <div class="left">
        <a-form-item :label="props.type+'名称'" name="name">
          <a-input v-model:value="props.formState.name" :placeholder="'请输入'+props.type+'名称'" />
        </a-form-item>
        <a-form-item label="起始时间" name="date">
          <div class="tip">关联课程起止时间为2022/07/07 - 2022/07/07</div>
          <a-range-picker @change="dateChange" v-model:value="props.formState.date" :showTime="{format: 'HH:mm'}" valueFormat="YYYY-MM-DD HH:mm" format="YYYY-MM-DD HH:mm" :disabledDate="disabledDate">
            <template #suffixIcon>
              <calendar-outlined />
            </template>
          </a-range-picker>
        </a-form-item>
      </div>
      <div class="right">
        <a-form-item :label="'关联课程'">
          <cascader v-model:relation="props.formState.relation"></cascader>
        </a-form-item>
      </div>
    </div>
    <a-form-item :label="props.type+'说明'">
      <a-textarea v-model:value="props.formState.desc" :auto-size="{ minRows: 6, maxRows: 8 }" :maxlength="100" :placeholder="'请输入'+props.type+'说明'" />
    </a-form-item>
  </a-form>
</template>
<script lang="ts" setup>
import {ref, reactive, watch, inject, defineExpose} from 'vue'
import { CalendarOutlined  } from '@ant-design/icons-vue';
import moment, { Moment } from 'moment';
import cascader from "./cascader.vue"
interface Props {
  formState: any
  type: string
}
const props = withDefaults(defineProps<Props>(), {
  formState: () => {},
  type: '考试'
});
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
// watch(()=> editInfoData, (newVal:any) => {
//   console.log(newVal)
//   Object.assign(formState, newVal)
// },{deep:true,immediate:true})
defineExpose({
  fromValidate
})
</script>
<style lang="less" scoped>
.release-exam-info{
  display: flex;
  justify-content: space-between;
  .left {
    width: 400px;
    .ant-picker{
      width: 100%;
      border-radius: 20px;
    }
    .tip {
      position: absolute;
      top: -30px;
      left: 76px;
      color: var(--black-25);
    }
  }
  .right {
    width: 300px;
  }
}
</style>