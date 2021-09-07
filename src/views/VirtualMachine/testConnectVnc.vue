<template>
  <div>
    type：<a-input v-model:value="param.type" style="width: 250px"></a-input>
    opType：<a-input
      v-model:value="param.opType"
      style="width: 250px"
    ></a-input>
    taskId：<a-input
      v-model:value="param.taskId"
      style="width: 250px"
    ></a-input>
    <a-button type="primary" @click="createConnect">打开连接</a-button>
    <!-- <a-button type="primary"  @click="closeConnect">关闭连接</a-button> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs } from "vue";
import { createExamples } from "src/utils/enterVmFront";
import { useRouter } from "vue-router";
import { wsConnect, disconnect } from "src/request/websocket";
import { openVm, IEnvirmentsParam } from "src/utils/vmInspect";

type TReactiveData = {
  param: IEnvirmentsParam;
};
export default defineComponent({
  setup() {
    const router = useRouter();
    const reactiveData: TReactiveData = reactive({
      param: {
        type: "train",
        opType: "start",
        taskId: 50227,
      },
    });
    const connect = ref({});
    const { param } = toRefs(reactiveData);
    async function createConnect() {
      const createEnvirments: any = await openVm(param.value);
      console.log(createEnvirments);
      if (createEnvirments.data.data.connection_id) {
        router.push({
          path: "/vm/vnc",
          query: {
            connection_id: createEnvirments.data.data.connection_id,
            opType: createEnvirments.query.opType,
            type: createEnvirments.query.type,
            taskId: createEnvirments.query.taskId,
            topoinst_uuid:createEnvirments.data.data.topoinst_uuid,
          },
        });
      }
    }

    function closeConnect() {
      disconnect();
    }
    return {
      createConnect,
      closeConnect,
      ...toRefs(reactiveData),
    };
  },
});
</script>
