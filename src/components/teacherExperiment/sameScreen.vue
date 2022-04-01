<template>
  <div class="same-screen-box" v-if="screenStatus">
    <div class="same-screen-left">
      <div class="md-top">
        <a-button type="primary" @click="quitScreen">
          <span class="icon-tuichu-copy iconfont"></span>
          退出同屏
        </a-button>
        <span class="hint">或按[ESC]可退出同屏模式</span>
      </div>
      <div class="md-box">
        <antdv-markdown v-model="detail"  class="markdown__editor"/>
      </div>
    </div>
    <div class="same-screen-right">
      <div class="vm-top">
        <div class="vm-base-left">
          <a-select class="ip-select" v-model:value="hostIp" @change="ipChange">
            <a-select-option v-for="(item, index) in screenInfo" :key="index" :value="item.uuid">
              {{ item.ip }}
            </a-select-option>
          </a-select>
        </div>
        <div class="vm-base-center">
          <span class="font-size-16">远程连接信息</span>
          <span>用户名：{{ currentVmInfo.ssh_user }}</span>
          <span>密码：{{ currentVmInfo.ssh_pass }}</span>
          <span>
            {{
              currentVmInfo.classify === 'Linux'
                ? `ssh端口：${currentVmInfo.ssh_port}`
                : `rdp端口：${currentVmInfo.rdp_port}`
            }}
          </span>
        </div>
        <div class="vm-base-right">
          <span class="font-size-16">数据集目录：</span>
          <span>/simpledata</span>
        </div>
      </div>
      <div class="vm-box">
        <vue-no-vnc
          background="rgb(40,40,40)"
          :options="vmOptions"
          refName="refName"
          ref="novncEl"
        />
        <!-- <connect-vnc ref="vnc" :config="vncConnectOption" :loading="loading" v-model="vncConnectSucceed" /> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, watch, onMounted, toRefs, nextTick, PropType, provide } from 'vue'
import VueNoVnc from "src/components/noVnc/noVnc.vue";
type TvncConnectOption={
  vmOptions:any
}
export default defineComponent({
  components: {
    "vue-no-vnc":VueNoVnc
  },
  props: {
    screenStatus: Boolean,
    modelValue: String ,
    screenInfo: {
      type: Array as PropType<IVmInfo[]>,
      default: []
    }
  },
  setup(props, {emit}) {
    let detail = ref(props.modelValue)
    const vncLoading=ref(false)
    provide("vncLoading",vncLoading)
    function quitScreen() {
      emit('update:screenStatus', false)
      emit('update:modelValue', detail.value)
    }
    onMounted(() => {
      nextTick(() => {
        document.addEventListener('keyup', (e: any) => {
          if (e.keyCode === 27) {
            if (props.screenStatus === true) {
              console.log('退出键')
              quitScreen()
            }
          }
        })
      })
    })
    let currentVmInfo = reactive<IVmInfo>({
      ip: '',
      uuid: '',
      ssh_user: '',
      ssh_pass: '',
      classify: '',
      ssh_port: '',
      rdp_port: '',
      base_ip: ''
    })
    const vncConnectOption:TvncConnectOption = reactive({
       vmOptions: {
        password: "", // vncpassword
        wsUrl: "", // "ws://192.168.101.150:8888/websockify?vm_uuid=c417fb05-c2f4-4cc9-9791-ecac23c448c5"
      },
    })
    function ipChange(val: string) {
      vncLoading.value=false
      if (currentVmInfo.uuid === val) {
        return
      }
      props.screenInfo.forEach((item: any) => {
        if (item.uuid === val) {
          currentVmInfo = Object.assign(currentVmInfo, item)
          vncConnectOption.vmOptions.wsUrl="ws://"+item.base_ip+":8888/websockify?vm_uuid="+item.uuid
          // ;(this.$refs as any).vnc.startNoVnc()
        }
      })
    }
    let hostIp = ref()
    function init() {
      if (props.screenInfo.length > 0) {
        vncLoading.value=false
        currentVmInfo = Object.assign(currentVmInfo, props.screenInfo[0])
        hostIp.value = props.screenInfo[0].ip
        vncConnectOption.vmOptions.wsUrl="ws://"+props.screenInfo[0].base_ip+":8888/websockify?vm_uuid="+props.screenInfo[0].uuid
        vncConnectOption.vmOptions.password = 'vncpassword'
        // ;(this.$refs as any).vnc.startNoVnc()
      }
    }
    // watch(
    //   () => props.modelValue,
    //   (newVal) => {
    //     console.log(newVal)
    //     detail.value = newVal
    //   },
    //   {deep: true}
    // )
    return {
      quitScreen,
      detail,
      ipChange,
      currentVmInfo,
      hostIp,
      init,
      ...toRefs(vncConnectOption),
    }
  }
})
interface IVmInfo {
  ip: string
  uuid: string
  ssh_user: string
  ssh_pass: string
  classify: string
  ssh_port: string
  rdp_port: string
  base_ip: string
}
</script>

<style lang="less" scoped>
.same-screen-box {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #040515;
  z-index: 1111;
  display: flex;
  flex-direction: row;

  .same-screen-left {
    width: 33.333%;
    display: flex;
    flex-direction: column;

    .md-top {
      height: 54px;
      flex-shrink: 0;
      background: #ececec;
      line-height: 54px;
      padding-left: 23px;
      .ant-btn {
        .iconfont {
          margin-right: 4px;
        }
      }

      .hint {
        margin-left: 23px;
        color: var(--brightBtn);
      }
    }

    .md-box {
      height: 100%;
      width: 100%;
      background: #ffffff;
    }
    :deep(.mark__container) {
      height: 882px;
    }
    :deep(.mark__body) {
      .mark__preview, .mark__editor {
        min-width: 50%;
      }
    }
  }

  .same-screen-right {
    width: 66.6666%;
    .vm-top {
      height: 54px;
      flex-shrink: 0;
      background: #2c2e45;
      line-height: 54px;
      padding: 0 54px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .vm-base-left {
        .ant-select {
          border: 1px solid var(--cyan-100);
          color: var(--cyan-100);
          :deep(.ant-select-selector) {
            border: 1px solid var(--cyan-100);
            color: var(--cyan-100);
            background: rgba(0, 0, 0, 0);
          }
          &.ant-select-open :deep(.ant-select-selection-item) {
            color: var(--cyan-100);
          }
          :deep(.ant-select-arrow) {
            color: var(--cyan-100);
          }
        }
      }
      .vm-base-center {
        color: #ffffff;
        span {
            margin-left: 40px;
        }
      }
      .vm-base-right {
        color: #ffffff;
      }
      .ip-select {
        width: 160px;
        height: 32px;
      }
    }
    .vm-box {
      height: 100%;
      width: 100%;
      background-image: url("../../../../../assets/img/vm/vm-bg.jpg");
      background-repeat: no-repeat;
    }
  }
}
.font-size-16 {
  font-size: var(--font-size-16);
}
</style>
