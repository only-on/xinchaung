<template>
  <div class="same-screen-box" v-if="screenStatus">
    <div class="same-screen-left">
      <div class="md-top">
        <a-button type="primary" @click="quitScreen">
          <span class="icontuichu iconfont"></span>
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
          <span>远程连接信息</span>
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
        <div class="vm-base-right">数据集目录：/simpledata</div>
      </div>
      <div class="vm-box">
        <!-- <connect-vnc ref="vnc" :config="vncConnectOption" :loading="loading" v-model="vncConnectSucceed" /> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, inject, reactive, watch, onMounted, toRefs, nextTick, PropType } from 'vue'
import AntdvMarkdown from "@xianfe/antdv-markdown/src/index.vue";
export default defineComponent({
  components: {AntdvMarkdown},
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
    let vncConnectOption = reactive({
      protocol: '',
      host: '',
      port: '',
      path: '',
      password: ''
    })
    function ipChange(val: string) {
      if (currentVmInfo.uuid === val) {
        return
      }
      props.screenInfo.forEach((item: any) => {
        if (item.uuid === val) {
          currentVmInfo = Object.assign(currentVmInfo, item)
          vncConnectOption.host = item.base_ip
          vncConnectOption.path = `websockify/?vm_uuid=${item.uuid}`
          // ;(this.$refs as any).vnc.startNoVnc()
        }
      })
    }
    let hostIp = ref()
    function init() {
      if (props.screenInfo.length > 0) {
        currentVmInfo = Object.assign(currentVmInfo, props.screenInfo[0])
        hostIp.value = props.screenInfo[0].ip
        vncConnectOption.protocol = 'ws'
        vncConnectOption.host = props.screenInfo[0].base_ip
        vncConnectOption.port = '8888'
        vncConnectOption.path = `websockify/?vm_uuid=${props.screenInfo[0].uuid}`
        vncConnectOption.password = 'vncpassword'
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
      vncConnectOption,
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

      .hint {
        margin-left: 23px;
        color: #A499AE;
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
</style>
