<template>
  <a-modal 
    :visible="isShowLook" 
    title="查看" 
    :footer=null
    :width="600"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <ul>
      <li>
        <span>帐号：</span>
        <span>{{lookDetail.username}}</span>
      </li>
      <li>
        <span>姓名：</span>
        <span>{{lookDetail.name}}</span>
      </li>
      <li>
        <span>性别：</span>
        <span>{{lookDetail.sex}}</span>
      </li>
      <li>
        <span>所属教师：</span>
        <span>{{lookDetail.teacher}}</span>
      </li>
      <li>
        <span>状态：</span>
        <span>{{lookDetail.status}}</span>
      </li>
      <li>
        <span>创建时间：</span>
        <span>{{lookDetail.createTime}}</span>
      </li>
      <li>
        <span>更新时间：</span>
        <span>{{lookDetail.updateTime}}</span>
      </li>
    </ul>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs, onMounted, provide, inject, watch, nextTick, PropType } from 'vue'
import { ITableList } from './typings'

export default defineComponent({
  name: '',
  components: {},
  props: {
    isShowLook: Boolean,
    lookDetail: {
      type: Object as PropType<ITableList>,
      default: {}
    }
  },
  emits: ['update:isShowLook'],
  setup(props, {emit}) {
    const handleOk = () => {

    }
    const handleCancel = () =>{
      emit('update:isShowLook', false)
    }
    return {
      ...toRefs(props),
      // formState,
      handleOk,
      handleCancel,
    }
  },
})
</script>

<style lang="less" scoped>
  .ant-modal-body {
    li {
      height: 50px;
      line-height: 50px;
      border-bottom: 1px dashed #e7e7e7;
      display: flex;
      span:nth-child(1) {
        text-align: right;
        width: 150px;
        display: inline-block;
        font-size: 14px;
        box-sizing: border-box;
      }
      span:nth-child(2) {
        flex: 1;
        font-size: 14px;
        padding-left: 30px;
      }
    }
  }
</style>
