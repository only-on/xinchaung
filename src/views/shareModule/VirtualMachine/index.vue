<template>
  <vnc></vnc>
</template>

<script lang="ts" setup>
import { ref,provide,watch} from "vue";
import vnc from "./Vnc/newVnc.vue"

provide("baseInfo",ref({})) // pageinfo接口获取的基本数据
provide("vmsInfo",ref({})) // 存储vms虚拟机数据
provide("currentOption",ref({})) // 当前开启的虚拟机配置
provide("recommendData",ref([])) // 推荐实验数据
provide('loading',ref(false))  // 虚拟机是否加载中 ture加载中 fasle加载完成
provide('isClose',ref(false))  // 是否是关机状态 true 是，false 否
provide('novncEl',ref(null))  // novnc的Vue实例
provide('currentUuid',ref(""))  // 当前uuid
provide("use_time", ref(0)); // 使用时间
provide("taskType", ref('')); // 当前实验类型
provide("sshUrl", ""); // ssh 实验url
provide("currentInterface", ref('vnc')); // 当前是webssh链接还是vnc链接，值：vnc、ssh
provide("initVnc", ref(null)); // 初始换虚拟机链接
provide("ws", ref(null)); // 当前ws实例
provide("currentClickIndex", ref('')); // 当前点击的虚拟机索引
provide('currentVmIndex',ref(0)); // 当前展示的虚拟机索引
provide('currentVm',ref({})); // 当前展示的虚拟机
provide("isScreenRecording",ref(false)) // 是否正在录屏
provide("leftWidth",ref(70))  // 左侧容器宽度
provide("rightWidth",ref(window.innerWidth - 70)) // 右侧容易宽度

</script>

<style lang="less" scoped>

</style>