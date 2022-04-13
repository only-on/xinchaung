<template>
  <layout :navData="navData" isLeftContentShowType="line">
    <template v-slot:right
      >{{ sshUrl }}
      <template v-if="currentInterface === 'ssh'">
        <iframe id="sshIframe" :src="sshUrl" frameborder="0"></iframe>
      </template>
      <template v-else>
        <div class="vncloading" v-if="loading">
          <div class="word">
            <div class="loading">
              <img :src="loadingGif" alt="" srcset="" />
              <span>虚拟机加载中，请稍后...</span>
            </div>
          </div>
        </div>
        <vue-no-vnc
          background="rgb(40,40,40)"
          :options="currentOption"
          refName="refName"
          ref="novncEl"
          @clipboard="clipboard"
        />
      </template>
    </template>
  </layout>
</template>

<script lang="ts" setup>
import {inject,ref,onMounted} from "vue"
import loadingGif from "src/assets/images/vmloading.gif";
import VueNoVnc from "src/components/noVnc/noVnc.vue";
import layout from "../VmLayout/newLayout.vue"
import {
  getVmBaseInfo,
  } from "src/utils/vncInspect";

import {
  onBeforeRouteLeave,
  useRoute,
  useRouter,
  LocationQuery,
  LocationQueryValue,
  onBeforeRouteUpdate,
} from "vue-router";

const route= useRoute()
const {opType,type,taskId}=route.query
const currentOption=inject("currentOption",ref({password:"", wsUrl:"", userName:""}))
const loading=inject("loading",ref(true))
const sshUrl=inject("sshUrl",ref(""))
const currentInterface=inject("currentInterface",ref('vnc'))
const baseInfo=inject("baseInfo",ref({}))
const taskType:any=inject("taskType")
const use_time:any=inject("use_time")
 const navData = [
      { name: "指导", key: "guide", icon: "icon-zhidao" },
      { name: "笔记", key: "experimental-note", icon: "icon-biji" },
      { name: "报告", key: "report", icon: "icon-baogao" },
      { name: "问答", key: "forum", icon: "icon-wenda" },
    ];
function clipboard() {
    
}
// 获取虚拟机基本信息pageinfo
    function getVmBase() {
      return new Promise((resolve: any, reject: any) => {
        let params:any = {
          opType: opType,
          type: type,
          taskId: taskId,
        };
        getVmBaseInfo(params).then((res: any) => {
          baseInfo.value = res.data;
          if (!res.data.current) {
            resolve();
            return;
          }

          taskType.value = res.data.base_info.task_type.type;

          if (!taskType.value) {
            use_time.value = res.data.current.used_time;
          } else {
            use_time.value = res.data.current.remaining_time;
          }
          resolve();
        });
      });
    }

    onMounted(() => {
        getVmBase()
    })
</script>
<style lang="less">
.vm-layout {
  .vm-content-right {
    .vncloading {
      position: relative;
      height: 100%;
      text-align: center;
      background: radial-gradient(#010b24, #010b24);
      .word {
        width: 100%;
        height: 100%;
        bottom: 0;
        color: #fff;
        left: 0;
        margin: auto;
        right: 0;
        position: absolute;
        // text-shadow: 0 0 10px rgba(117, 121, 224, 0.5),
        //   0 0 5px rgba(117, 121, 224, 0.5);
        // top: 50%;
        // transform: translateY(-50%);
        background-color: var(--black-2);
        .loading {
          position: absolute;
          top: 50%;
          left: 50%;
          img {
            margin-right: 8px;
          }
        }
      }
      color: var(--white-100);
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .vnc-box {
      height: calc(100% - 46px);
      background: radial-gradient(#010b24, #010b24);
    }
    .tab-btn {
      height: 46px;
      line-height: 46px;
      background-color: var(--black-100);
      color: var(--white-100);
      text-align: center;
    }
  }
}
#sshIframe {
  width: 100%;
  height: 100%;
}
</style>
