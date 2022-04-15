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
      <p>抱歉，您的登录权限已被禁用，禁用时间段为</p>
      <p>{{ currentData.start_time }}至{{ currentData.end_time }}</p>
      <p>您是否要保存当前实验环境？</p>
      <p>（倒计时 {{ time }}s）</p>
      <div class="footer-action-btn-wrap">
        <a-button type="default" @click="cancel">取消</a-button>
        <a-button type="primary" @click="ok">保存</a-button>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import extStorage from "src/utils/extStorage";
import request from "src/api/index";
import { operatesHandle } from "src/utils/vncInspect";

export default defineComponent({
  props: ["visable", "data", "opType", "type", "uuid", "taskId", "current"],
  emits: ["update:visable"],
  setup(props, { emit }) {
    console.log(props.data);
    const time = ref(30);
    let timer: any = null;
    onMounted(() => {
      timers();
    });
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
      loginOut();
    }
    function ok() {
      console.log(props.current);
      if (props.current && props.current.is_teamed == 1) {
        loginOut();
      } else {
        if (!props.type) {
          loginOut();
        } else {
          VmOperatesHandle("saveKvm").then((res) => {
            loginOut();
          });
        }
      }
    }
    function loginOut() {
      (request as any).common.loginOut().then((res: any) => {
        extStorage.lStorage.clean();
        let url = `${window.origin}/site/login`;
        console.log(url);
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
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      }).catch();
    }
    return {
      currentData: props.data,
      time,
      cancel,
      ok,
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
