<template>
  <a-button type="primary" @click="openEnv">开启{{courseInfo.type === 'train' ? '实训' : '实验'}}环境</a-button>
  <a-modal
    v-model:visible="visible"
    title="设置环境数量"
    :ok-button-props="{ disabled: false }"
    :cancel-button-props="{ disabled: false }"
    @ok="handleOk"
    @Cancel="handleCancel"
    cancel-text="取消"
    ok-text="确定"
  >
    <a-input-number v-model:value="openEnvNum" :max="limit" :min="1"  allow-clear autofocus />
    <span class="prompt">*最多开启{{limit}}套环境</span>
  </a-modal>
</template>

<script lang="ts">
  import {defineComponent, ref, toRef, inject, PropType } from 'vue'
  import { message } from 'ant-design-vue'
  import { ICourseInfo } from './typings'
  interface INode {
    taskId: number
    type: string
    grouped: number
    isHigh: boolean
  }
  export default defineComponent({
    props: {
      limit: {
        type: Number
      },
      selectedNodes: {
        type: Object as PropType<INode>,
        default: {}
      },
      courseInfo: {
        type: Object as PropType<ICourseInfo>,
        default: {}
      }
    },
    emits: ['saveTopinst'],
    setup(props, {emit}) {
      // let courseInfo:ICourseInfo = inject('courseInfo')
      
      // 弹框
      const showModal = ref<boolean>(false);
      const visible = ref<boolean>(false);
      let openEnvNum = ref<number>()
      const openEnv = () => {
        let name = props.courseInfo.type === 'train' ? '实训' : '实验'
        // if (!props.selectedNodes.taskId && (props.courseInfo.type === 'course' && props.courseInfo.courseType === 1) || props.courseInfo.type === 'train') {
        if (!props.selectedNodes.taskId && (props.courseInfo.type === 'course' && props.courseInfo.courseType === 1)) {
          message.warning(`请选择${name}!`);
          return;
        }
        if (props.selectedNodes.isHigh) {
          message.warning(`该${name}为高配${name}，无法预启动${name}环境!`);
          return;
        }
        if (!props.limit) {
          message.warning('授权人数为0，无法开启!');
          return;
        }
        let typeList = props.selectedNodes.type.split('-')
        if(typeList[typeList.length - 1] === '4') {
          message.warning('交互编程类不支持开启实验环境!');
          return;
        }
        visible.value = true;
      }
      const handleOk = (e: MouseEvent) => {
        if (openEnvNum.value) {
          visible.value = false;

          emit('saveTopinst',openEnvNum.value)
          openEnvNum.value = undefined
        } else {
          message.warning(`请输入1-${props.limit}的整数!`);
        }
      };
      const handleCancel = (e: MouseEvent) => {
        visible.value = false;
        openEnvNum.value = undefined
      };

      return {
        visible,
        showModal,
        openEnv,
        openEnvNum,
        handleOk,
        handleCancel
      }
    }
  })
</script>

<style lang="less" scoped>
// var(--gray-8): var(--purpleblue-6);
.ant-modal-content {
  .ant-btn {
    height: 30px;
    padding: 5px 10px;
    font-size: 12px;
    line-height: 1.5;
    border-radius: 3px;
    color: var(--white-100);
    background-color: var(--purpleblue-6);
    border-color: var(--gray-8);
  }
  .ant-modal-close-x {
    height: 40px;
    color: var(--white-100);
    line-height: 40px;
  }
  .ant-modal-header {
    background-color: var(--purpleblue-6);
    padding: 0;
    height: 40px;
    /* line-height: 40px; */
    /* font-size: 1.15em; */
    /* font-weight: bold; */
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    border-bottom-color: #f4f4f4;
    .ant-modal-title {
      line-height: 40px;
      font-weight: bold;
      padding-left: 15px;
      color: var(--white-100);
      font-size: 15px;
    }
  }
  .ant-modal-body {
    padding-top: 40px;
    .ant-input-affix-wrapper {
      width: 300px;
    }
    .prompt {
      color: red;
      padding-left: 6px;
    }
  }
}


.ant-btn.ant-btn-primary {
  height: 41px;
  background-color: var(--purpleblue-6);
  // border-color: var(--gray-8);
  color: var(--white-100);
  padding: 0 20px;
  line-height: 41px;
  font-size: 16px;
  float: right;
}
.ant-btn.ant-btn-primary:hover, .ant-btn.ant-btn-primary:focus {
  background-color: var(--gray-8);
  border-color: var(--gray-8);
}
.ant-input-number {
  width: 250px;
}
</style>