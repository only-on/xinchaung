<template>
  <div>
    <!-- <a-button type="primary" @click="createConnect">打开连接</a-button> -->
    <a-button type="primary" @click="closeConnect">关闭连接</a-button>
    <!-- <a-button type="primary"  @click="closeConnect(1)">关闭连接</a-button> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { createExamples, IcreateExamples } from "src/utils/enterVmFront";
import { useRoute, useRouter } from "vue-router";
import { wsConnect, disconnect } from "src/request/websocket";
import { message } from "ant-design-vue";

export default defineComponent({
  setup() {
    console.log(createExamples);
    const route = useRoute();
    const router = useRouter();
    const connection_id = route.query.connection_id;
    const connect = ref({});
    const connect1 = ref({});
    onMounted(() => {
      connect.value = wsConnect({
        url: "://192.168.101.150:9035/?uid=" + connection_id,
        close: (ev: CloseEvent) => {
          if (ev.type === "close") {
            message.success("关闭成功");
               router.push({path:"/vm/test"})
          }
        },
      });
    });
    function createConnect() {
      //     connect1.value=  wsConnect({url:"://127.0.0.1:8082/?uid=+1",close:(ev:CloseEvent)=>{
      //       if (ev.type==="close") {
      //           message.success("关闭成功")
      //         //    router.push({path:"/vm/test"})
      //       }
      //   }})
    }

    function closeConnect(v: any) {
      // if (v===1) {
          ( connect.value as any).close()
      // }else{
      //     ( connect1.value as any).close()
      // }
    }
    return {
      createConnect,
      closeConnect,
    };
  },
});
</script>
