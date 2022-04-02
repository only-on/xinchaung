<template>
  <a-modal 
    v-model:visible="visible" 
    :title="edit ? '设置时间段' : '添加时间段'"
    @ok="handleOk"
  >
    <div class="time-wrap">
      <span class="time-name">开始时间：</span>
      <a-time-picker :disabledHours="disabledPicker" v-model:value="startTime" format="HH:mm" />
    </div>
    <div class="time-wrap">
      <span class="time-name">结束时间：</span>
      <a-time-picker v-model:value="endTime" format="HH:mm" />
    </div>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs, inject } from 'vue'
import moment, {Moment} from 'moment'
import { message } from "ant-design-vue";
import request from 'src/api/index'
interface IOptions {
  callbackOk: () => void, 
  dayTime: any, 
  index: number,
  id: number
}
export default defineComponent({
  name: 'settingTimeModal',
  setup() {
    const http=(request as any).teachCourse
    const visible = ref<boolean>(false)
    const edit = ref<boolean>(false)
    const options = reactive({
      dayTime: {}, 
      index: 0,
      id: undefined,
      callbackOk: () => {},
    })
    const startTime = ref<Moment>()
    const endTime = ref<Moment>()

    const showModal = (option: IOptions) => {
      Object.assign(options, option)
      visible.value = true
      if (option.dayTime.newTime) {
        startTime.value = undefined
        endTime.value = undefined
        edit.value = false
      } else {
        if (option.dayTime) {
          startTime.value = moment(option.dayTime.start, 'HH:mm')
          endTime.value = moment(option.dayTime.end, 'HH:mm')
        }
        edit.value = true
      }
    }

    const handleOk = (e: MouseEvent) => {
      let param = {
        start: moment(startTime.value).format('HH:mm'),
        end: moment(endTime.value).format('HH:mm'),
      }
      if (edit.value) {
        http.updateTimeTable({
          param: Object.assign(param, {id: options.id})
        }).then((res: any) => {
          message.success('更新时间段成功')
          options.callbackOk()
          visible.value = false
        })
        return
      }
      http.setTimeTable({
        param: Object.assign(param, {serial_number: options.index + 1})
      }).then((res: any) => {
        message.success('新增时间段成功')
        options.callbackOk()
        visible.value = false
      })
    }
    function disabledPicker() {
      return [2, 3]
    }
    return {
      showModal,
      visible,
      ...toRefs(options),
      handleOk,
      edit,
      startTime,
      endTime,
      disabledPicker
    }
  },
})
</script>

<style lang="less" scoped>
.ant-modal-body {
  .time-wrap {
    text-align: center;
    padding: 10px 0;
  }
}
</style>
