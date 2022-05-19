<template>
  <div style="height:100%">
    <vue-no-vnc
      background="rgb(40,40,40)"
      :options="vmOptions"
      refName="refName"
      ref="novncEl"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs,provide,ref } from "vue";
import VueNoVnc from "src/components/noVnc/noVnc.vue";
import { useRoute } from "vue-router";
import { getVmConnectSetting } from "src/utils/seeting";

export default defineComponent({
  components: {
    "vue-no-vnc": VueNoVnc,
  },
  setup() {
    const route = useRoute();
    const { wsUrl } = route.query;
    const uuidLoading=ref(true)
    const vncLoadingV=ref(false)
    provide("provide",uuidLoading)
    provide("loading",vncLoadingV)
    const reactiveData:{vmOptions:any} = reactive({
      vmOptions: {
        password: getVmConnectSetting.VNCPASS, // vncpassword
        wsUrl: wsUrl, // "ws://192.168.101.150:8888/websockify?vm_uuid=c417fb05-c2f4-4cc9-9791-ecac23c448c5"
      },
    });
    return {
      ...toRefs(reactiveData),
      provide
    };
  },
});
</script>

