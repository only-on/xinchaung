<template>
  <a-button type="primary" @click="openEnv">开启实验环境</a-button>
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
        if (!props.selectedNodes.taskId && (props.courseInfo.type === 'course' && props.courseInfo.courseType === 1) || props.courseInfo.type === 'train') {
          message.warning(`请选择${name}!`);
          return;
        }
        if (!props.limit) {
          message.warning('授权人数为0，无法开启!');
          return;
        }
        if (props.selectedNodes.isHigh) {
          message.warning(`该${name}为高配${name}，无法预启动${name}环境!`);
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
.ant-input-number {
  width: 250px;
}
</style>