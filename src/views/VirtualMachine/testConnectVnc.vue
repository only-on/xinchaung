<template>
  <div>
    <a-button type="primary"  @click="createConnect">打开连接</a-button>
    <a-button type="primary"  @click="closeConnect">关闭连接</a-button>
  </div>
</template>

<script lang="ts">
import { defineComponent,ref } from "vue";
import { createExamples, IcreateExamples } from "src/utils/enterVmFront";
import { useRouter } from "vue-router";
import {wsConnect,disconnect} from "src/request/websocket"

export default defineComponent({
  setup() {
    console.log(createExamples);
    const router=useRouter()
    let param: IcreateExamples = {
      type: "train",
      opType: "start",
      taskId: 50223,
    };
    const connect =ref({})
    function createConnect() {
      createExamples(param).then((res) => {
        console.log(res);
        if (res?.status === 1) {
            // router.push({
            //     path:"/vm/vnc"
            // })
          connect.value=  wsConnect("://127.0.0.1:8082/?uid="+res.data.connection_id)
        }
      });
    }

    function closeConnect(){
        disconnect()
    }
    return {
      createConnect,
      closeConnect
    };
  },
});
</script>
