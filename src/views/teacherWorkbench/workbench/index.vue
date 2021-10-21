<template>
  <div class="workbench-main">
    <div class="workbench-head">
      <a-button type="primary">创建容器({{ limit }}/5)</a-button>
    </div>
    <div class="workbench-list-box">
      <div
        class="workbench-item"
        v-for="(item, index) in dataList"
        :key="index"
      >
        <div class="box-border">
          <card :content="item" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted,ref } from "vue";
import { getWorkbenchApi, TgetWorkbench } from "../api";
import card from "./card.vue";
import { wsConnect } from "src/request/websocket";
import {message} from "ant-design-vue"
import storage from "src/utils/extStorage"
import {onBeforeRouteLeave} from "vue-router"

export default defineComponent({
  components: {
    card,
  },
  setup() {
    const reactiveData: {
      params: TgetWorkbench;
      dataList: any[];
      limit: number;
    } = reactive({
      params: {
        page: 1,
        limit: 12,
        name: "",
        withs: "image,flavor,vm,image.classify",
      },
      dataList: [],
      limit: 0,
    });

    const ws=ref(null)
    let uid=storage.lStorage.get("uid")
    onBeforeRouteLeave(() => {
      console.log("离开页面");
      ws.value ? (ws.value as any).close() : "";
    });

    onMounted(() => {
      getDataList();
      connectWs();
    });

    function  connectWs() {
       ws.value = wsConnect({
        url: "://192.168.101.150:9035/?uid=" + uid,
        close: (ev: CloseEvent) => {
          if (ev.type === "close") {
            message.success("ws关闭成功");
          }
        },
        message: (ev: MessageEvent) => {
          console.log(ev);
          console.log(typeof ev.data);
          let regex = /\{.*?\}/g;

          if (typeof ev.data === "string" && regex.test(ev.data)) {
            console.log(JSON.parse(ev.data));
          }
        },
      })
    }
    function getDataList() {
      getWorkbenchApi(reactiveData.params).then((res: any) => {
        console.log(res);
        reactiveData.dataList = res.data.list;
        reactiveData.limit = res.data.page.totalCount;
      });
    }
    return {
      ...toRefs(reactiveData),
    };
  },
});
</script>

<style lang="less">
.workbench-main {
  padding: 0 2px;
  .workbench-head {
    display: flex;
    justify-content: end;
  }
  .workbench-list-box {
    display: flex;
    flex-wrap: wrap;
    .workbench-item {
      width: 33.333333%;
      margin-top: 25px;
      height: 314px;

      &:nth-of-type(3n + 1) {
        padding-right: 20px;
      }
      &:nth-of-type(3n + 2) {
        padding: 0 10px;
      }
      &:nth-of-type(3n + 3) {
        padding-left: 20px;
      }
      .box-border {
        width: 100%;
        height: 100%;
        border-radius: 10px;
        box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.24);
      }
    }
  }
}
</style>
