<template>
  <a-modal 
    :visible="isShow" 
    title="禁用帐号" 
    @ok="handleOk"
    @cancel="handleCancel"
    class="disable-modal"
  > 
    <div>
      <h2 class="time-lable">请选择禁用时间段</h2>
      <div class="select-time-wrap">
        <span>
          <a-date-picker
            v-model:value="beginTime"
            placeholder="请选择开始时间"
            show-time
            format="YYYY-MM-DD HH:mm:ss"
            :disabled-date="disabledDate"
            disabled
          />
        </span>
        <span>~</span>
        <span>
          <a-date-picker
            v-model:value="endTime"
            placeholder="请选择结束时间"
            show-time
            format="YYYY-MM-DD HH:mm:ss"
            :disabled-date="disabledDate"
          />
        </span>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs, onMounted, provide, inject, watch, nextTick, PropType } from 'vue'
import moment, {Moment} from 'moment'
import request from 'src/api/index'
import { IBusinessResp } from 'src/typings/fetch.d'
import { MessageApi } from "ant-design-vue/lib/message";

export default defineComponent({
  name: 'forbiddenModal',
  components: {},
  props: {},
  emits: [],
  setup(props, {emit}) {
    const http=(request as any).teachCourse
    const $message: MessageApi = inject("$message")!;

    let beginTime = ref<Moment>(moment(new Date()))
    let endTime = ref<Moment>()
    let isShow = ref<boolean>(false)
    let callbackOk = () => {}
    let ids = ref<string>('')
    function openModal(options: {callbackOk: () => void, ids: string}) {
      beginTime.value = moment(new Date())
      isShow.value = true
      callbackOk = options.callbackOk
      ids.value = options.ids
    }
    const handleOk = () => {
      if (!endTime.value) {
        $message.error('请选择时间', 3)
        return
      }
      if (moment(beginTime.value).unix() > moment(endTime.value).unix()) {
        $message.error('结束时间必须大于开始时间', 3)
        return
      }
      let param = {
        ids: ids.value,
        start_time: beginTime.value.format('YYYY-MM-DD HH:mm:ss'),
        end_time: endTime.value?.format('YYYY-MM-DD HH:mm:ss')
      }
      http.forbiddenUser({param}).then((res: IBusinessResp) => {
        $message.success('禁用成功', 3)
        beginTime.value = moment(new Date())
        endTime.value = undefined
        isShow.value = false
        callbackOk()
      })
    }
    const handleCancel = () =>{
      // emit('update:isShow', false)
      isShow.value = false
      beginTime.value = moment(new Date())
      endTime.value = undefined
    }
    function disabledDate(current: any) {
      return current && moment(current).add(1, 'days') < moment()
    }
    return {
      openModal,
      isShow,
      handleOk,
      handleCancel,
      disabledDate,
      beginTime,
      endTime,
    }
  },
})
</script>

<style lang="less" scoped>
.disable-modal .ant-modal-content {  
  .ant-modal-body {
    .time-lable {
      font-size: 16px;
      font-weight: 400;
      text-align: left;
      color: #7e7e7e;
      letter-spacing: 1px;
    }
  }
  .ant-modal-footer {
    text-align: center;
  }
}
</style>
