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
import moment from 'moment'
import { MessageApi } from "ant-design-vue/lib/message";
import request from 'src/api/index'
import { IBusinessResp} from 'src/typings/fetch.d';
interface IOptions {
  callbackOk: () => void, 
  dayTime: any, 
  index: number,
  id: number
}
export default defineComponent({
  name: 'settingTimeModal',
  setup() {
    const $message: MessageApi = inject("$message")!;
    const http=(request as any).teachCourse
    const visible = ref<boolean>(false)
    const edit = ref<boolean>(false)
    const options = reactive({
      dayTime: {}, 
      index: 0,
      id: undefined,
      callbackOk: () => {},
    })
    const startTime = ref()
    const endTime = ref()

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
        }).then((res: IBusinessResp) => {
           if (res.code == 1) {
            $message.success('更新时间段成功')
            options.callbackOk()
            visible.value = false
          } else {
            $message.warn(res.message)
          }
        })
        return
      }
      http.setTimeTable({
        param: Object.assign(param, {serial_number: options.index + 1})
      }).then((res: IBusinessResp) => {
        if (res.code == 1) {
          $message.success('新增时间段成功')
          options.callbackOk()
          visible.value = false
        } else {
          $message.warn(res.message)
        }
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
