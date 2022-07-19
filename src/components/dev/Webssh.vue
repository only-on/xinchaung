<template>
  <div class="webssh-demo">
    <a-form layout="inline">
      <a-form-item label="虚拟机ssh ip">
        <a-input v-model:value="vmHost" />
      </a-form-item>
      <a-form-item label="虚拟机ssh 端口">
        <a-input v-model:value="vmPort" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="handleConnect">连接</a-button>&nbsp;
        <a-button type="default" @click="handleReconnect">重新连接</a-button>
      </a-form-item>
    </a-form>
    <web-ssh
      v-if="createXterm"
      @wsConnected="wsConnected"
      @wsDisconnected="wsDisconnected"
      @wsError="wsError"
      @sniffing="sniffing"
      @sniffFailed="sniffFailed"
      @sniffNoWorker="sniffNoWorker"
      @sniffSuccessful="sniffSuccessful"
      :wssh-server-ws-url="wsshServerWsUrl"
      :host="vmHost"
      :port="vmPort"
      :reconnect="reconnect"
    ></web-ssh>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { message } from "ant-design-vue";
import webSsh from "src/components/webSsh/index.vue";

const WS_INIT = 0; // ws连接前的初始状态
const WS_CONNECTED = 1; // ws连接成功
const WS_DISCONNECTED = 2; // ws连接断开
const WS_ERROR = 3; // ws连接遇到错误

const SNIFF_INIT = 0; // ssh检测开始前的初始状态
const SNIFFING = 1; // ssh检测成功
const SNIFF_FAILED = 2; // ssh检测失败
const SNIFF_NO_WORKER = 3; // ssh服务worker不足
const SNIFF_SUCCESSFUL = 4; // ssh服务检测成功

const wsshServerWsUrl = "127.0.0.1:8888";
const vmHost = ref("192.168.101.221");
const vmPort = ref(21457);
const reconnect = ref(false);
const wsState = ref(WS_INIT);
const sniffState = ref(SNIFF_INIT);
const createXterm = ref(false);

const wsConnected = () => {
  console.log("[WebsshDemo] connected");
  wsState.value = WS_CONNECTED;
};
const wsDisconnected = (args: any) => {
  console.log("[WebsshDemo] disconnected", args);
  wsState.value = WS_DISCONNECTED;
};
const wsError = () => {
  console.log("[WebsshDemo] error");
  wsState.value = WS_ERROR;
};
const sniffFailed = () => {
  console.log("[WebsshDemo] sniffFailed");
  sniffState.value = SNIFF_FAILED;
};

const sniffNoWorker = () => {
  console.log("[WebsshDemo] sniffNoWorker");
  sniffState.value = SNIFF_NO_WORKER;
};

const sniffSuccessful = () => {
  console.log("[WebsshDemo] sniffSuccessful");
  sniffState.value = SNIFF_SUCCESSFUL;
};

const sniffing = () => {
  console.log("[WebsshDemo] sniffing");
  sniffState.value = SNIFFING;
};

/**
 * 重连，重连只能发生在连接已断开、连接错误的情况发生时
 */
const handleReconnect = () => {
  if (wsState.value !== WS_DISCONNECTED && wsState.value !== WS_ERROR) {
    message.warn("ws还未连接或已连接成功，不可重连！");
    return;
  }
  reconnect.value = !reconnect.value;
};

const handleConnect = () => {
  if (wsState.value !== WS_INIT) {
    message.warn("只能在ws初始未连接状态下连接！");
    return;
  }
  createXterm.value = true;
};
</script>
<style lang="less">
.webssh-demo {
  width: 100%;
  height: 800px;
  margin-top: 20px;
}
</style>
