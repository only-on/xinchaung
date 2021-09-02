<template>
  <div>
    type：<a-input v-model:value="type" style="width:250px"></a-input>
    opType：<a-input v-model:value="opType" style="width:250px"></a-input>
    taskId：<a-input v-model:value="taskId" style="width:250px"></a-input>
    <a-button type="primary"  @click="createConnect">打开连接</a-button>
    <!-- <a-button type="primary"  @click="closeConnect">关闭连接</a-button> -->
  </div>
</template>

<script lang="ts">
import { defineComponent,ref,reactive,toRefs } from "vue";
import { createExamples, IcreateExamples } from "src/utils/enterVmFront";
import { useRouter } from "vue-router";
import {wsConnect,disconnect} from "src/request/websocket"

export default defineComponent({
  setup() {
    const router=useRouter()
    const param: IcreateExamples = reactive({
      type: "train",
      opType: "start",
      taskId: 50227,
    });
    const connect =ref({})
    function createConnect() {
     
      createExamples(param).then((res) => {
        console.log(res);
        if (res?.status === 1) {
            // router.push({
            //     path:"/vm/vnc"
            // })
             router.push({path:"/vm/vnc",query:{
               connection_id:res.data.connection_id
             }})
          // connect.value=  wsConnect("://127.0.0.1:8082/?uid="+res.data.connection_id)
        }
      });
    }

    function closeConnect(){
        disconnect()
    }
    return {
      createConnect,
      closeConnect,
      ...toRefs(param)
    };
  },
});
</script>
