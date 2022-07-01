<template>
  <a-modal
    class="disable-student-wrap"
    v-model:visible="visable"
    @cancel="cancel"
    @ok="ok"
    :maskClosable="false"
    :footer="null"
    :closable="false"
  >
    <div class="disable-student-box">
      <div v-if="!isAutoRemove">
        <p>抱歉，您的登录权限已被禁用，禁用时间段为</p>
        <p>{{ currentData.start_time }}至{{ currentData.end_time }}</p>
      </div>
      <div v-else>
        <p>{{currentData.msg}}</p>
      </div>
      <p v-if="isSaveEnv">您是否要保存当前实验环境？</p>
      <p>（倒计时 {{ time }}s）</p>
      <div class="footer-action-btn-wrap">
        <a-button type="default" @click="cancel">取消</a-button>
        <a-button type="primary" @click="ok" v-if="isSaveEnv">保存</a-button>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, inject, computed, toRefs } from "vue";
import extStorage from "src/utils/extStorage";
import request from "src/api/index";
import { operatesHandle } from "src/utils/vncInspect";
import {clearAllCookies} from "../../../../utils/cookieHelper";
import store from 'src/store';
import { IWmc } from "src/typings/wmc";

export default defineComponent({
  props: ["visable", "data", "opType", "type", "uuid", "taskId", "current", 'isAutoRemove'],
  emits: ["update:visable"],
  setup(props, { emit }) {
    const time = ref(30);
    let timer: any = null;
    const baseInfo: any = inject("baseInfo", ref({}));
    const taskType: any = inject("taskType");
    onMounted(() => {
      timers();
    });
    const isSaveEnv = computed(() => {
      let boolean = false
      if (
        baseInfo.value?.current?.is_teamed==1&&baseInfo.value?.current?.is_lead==1 ||
        baseInfo.value?.current?.is_teamed!=1&&(taskType.value===1||taskType.value===2||taskType.value===5)
      ) {
        boolean = true
      }
      return boolean
    })
    function timers() {
      clearTimeout(timer);
      timer = setTimeout(() => {
        time.value--;
        timers();
        if (time.value == 0) {
          clearTimeout(timer);
          ok();
        }
      }, 1000);
    }
    function cancel() {
      clearTimeout(timer);
      loginOut();
    }
    function ok() {
      clearTimeout(timer);
      if (!isSaveEnv.value) {
        loginOut();
      } else {
        if (!props.type) {
          loginOut();
        } else {
          VmOperatesHandle("saveKvm").then((res:any) => {
            loginOut();
          });
        }
      }
    }
    function loginOut() {
      (request as any).common.loginOut().then((res: any) => {
        extStorage.lStorage.clean();
        clearAllCookies();
        if (store.state.longWs) {
          (store.state.longWs as IWmc).close();
        }
        let url = `${window.origin}/#/login`;
        window.location.href = url;
      });
    }
    // 操作虚拟机
    function VmOperatesHandle(actionType: string) {
      let params: any = {
        action: actionType,
        params: {
          type: props.type,
          opType: props.opType,
          uuid: props.uuid,
          taskId: props.taskId,
        },
      };
      return new Promise((resolve: any, reject: any) => {
        operatesHandle(params)
          .then((res:any) => {
            resolve(res);
          })
          .catch((err:any) => {
            reject(err);
          });
      }).catch();
    }
    return {
      currentData: props.data,
      time,
      cancel,
      ok,
      isSaveEnv,
      ...toRefs(props)
    };
  },
});
</script>

<style lang="less" scoped>
.footer-action-btn-wrap{
  text-align: right;
  >button{
    &:last-child{
      margin-left: 15px;
    }
  }
}
</style>
