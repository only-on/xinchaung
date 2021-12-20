<template>
  <div class="workbench-main">
    <div class="workbench-head">
      <a-button type="primary" @click="createWorkbench"
        >创建容器({{ limit }}/5)</a-button
      >
    </div>
    <div class="workbench-list-box" v-if="workbenchDataList.length > 0">
      <div
        class="workbench-item"
        v-for="(item, index) in workbenchDataList"
        :key="index"
      >
        <div class="box-border">
          <card
            :content="item"
            :index="index"
            :isPoll="isPoll"
            @deleteFun="deleteFun"
            @openOrCloseFun="openOrCloseFun"
            @enterFun="enterFun"
          />
        </div>
      </div>
    </div>
    <empty v-else />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted, ref } from "vue";
import {
  getWorkbenchApi,
  TgetWorkbench,
  deleteWorkbenchApi,
  closeWorkbenchApi,
  openWorkbenchApi,
  getWorkbenchInfoApi,
  getWorkbenchStatusApi,
} from "../api";
import card from "./card.vue";
import { wsConnect } from "src/request/websocket";
import { message, Modal } from "ant-design-vue";
import storage from "src/utils/extStorage";
import { onBeforeRouteLeave, useRouter} from "vue-router";
import empty from "src/components/Empty.vue";

export default defineComponent({
  components: {
    card,
    empty,
  },
  setup() {
    const router = useRouter();
    const reactiveData: {
      params: TgetWorkbench;
      workbenchDataList: any[];
      limit: number;
      isPoll: boolean;
    } = reactive({
      params: {
        page: 1,
        limit: 12,
        name: "",
        withs: "image,flavor,vm,image.classify",
      },
      workbenchDataList: [],
      limit: 0,
      isPoll: false, // 是否在轮询
    });

    const ws = ref(null);
    let uid = storage.lStorage.get("uid")||storage.lStorage.get("user_id");
    let ws_config=storage.lStorage.get("ws_config")
    let timer: NodeJS.Timer | null = null;
    onBeforeRouteLeave(() => {
      reactiveData.isPoll = false;
      ws.value ? (ws.value as any).close() : "";
      clearInterval(Number(timer));
    });

    onMounted(() => {
      reactiveData.workbenchDataList=[]
        init();
      connectWs();
      
    });

    async function init() {
      await getDataList();
      getWorkbenchStatus(-1);
    }
    // 链接websocker
    function connectWs() {
      ws.value = wsConnect({
        url: "://"+ws_config.host+":"+ws_config.port+"/?uid=" + uid,
        close: (ev: CloseEvent) => {
          if (ev.type === "close") {
            // message.success("ws关闭成功");
          }
        },
        message: (ev: MessageEvent) => {
          let regex = /\{.*?\}/g;

          if (typeof ev.data === "string" && regex.test(ev.data)) {
          }
        },
      });
    }

    // 获取工作台列表
    function getDataList() {
      return new Promise((reslove: any, reject: any) => {
        getWorkbenchApi(reactiveData.params)
          .then((res: any) => {
            reslove(res);
            reactiveData.workbenchDataList = res.data.list;
            reactiveData.limit = res.data.page.totalCount;
          })
          .catch((err) => {
            reject(err);
          });
      });
    }

    // 删除工作台
    function deleteFun(val: any) {
      Modal.confirm({
        title: "确定要删除这个工作台吗？",
        content: "删除后不可恢复",
        okText: "删除",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          deleteWorkbenchApi(val.id).then((res: any) => {
            if (res.code === 1) {
              message.success("删除成功！");
              init();
            } else {
              message.warning(res.msg);
            }
          });
        },
      });
    }
    // 进入工作台
    function enterFun(val: any,index:number) {
      
      
      
      let tags: any[] = val.image.tag;
      let id = val.id;
      let status = val.vm.status;
      if (status === 0) {
        message.warn("请先开启工作台，在重新进入");
        return;
      }
      getWorkbenchInfoApi({id:id}).then((res) => {
        if (res?.code === 1) {
          if (tags.indexOf("Notebook") > -1) {
            const {href}= router.resolve(
              {
                path:"/teacher/Workbench/open-jupyte",
                query:{
                  id:id
                }
              }
            )
            window.open(href,"_blank")
          } else {
            const {href}= router.resolve(
              {
                path:"/teacher/Workbench/open-vnc",
                query:{
                  id:id
                }
              }
            )
            window.open(href,"_blank")
          }
        }
      });
    }
    // 开启、关闭工作台
    function openOrCloseFun(val: any, ind: number) {
      if (!val.vm || val.vm.status === 1) {
        closeWorkbenchApi(val.id)
          .then((res: any) => {
            message.success("关闭成功");
            reactiveData.workbenchDataList[ind].vm.status = 0
          })
          .catch((err) => {
            message.error("关闭失败");
          });
      } else {
        openWorkbenchApi(val.id)
          .then((res) => {
            // console.log(res);
          })
          .catch(() => {
            message.error("开启失败");
          });
        getWorkbenchStatus(ind);
      }
    }

    // 轮询获取工作台状态
    function getWorkbenchStatus(index: number) {
      reactiveData.isPoll = true;
      clearInterval(Number(timer));
      timer = setInterval(() => {
        getWorkbenchStatusApi().then((res: any) => {
          if (res.code === 1) {
            let workbenchStatus = res.data;
            if (index >= 0) {
              if (
                workbenchStatus[index].task_state === null &&
                workbenchStatus[index].status !== "none"
              ) {
                message.success("开启成功");
                for (let i = 0; i < reactiveData.workbenchDataList.length; i++) {
                  reactiveData.workbenchDataList[i].vm.status = 0;
                }
                reactiveData.workbenchDataList[index].vm.status = 1;
                reactiveData.workbenchDataList[index].task_state=workbenchStatus[index].task_state
                reactiveData.isPoll = false;
                clearInterval(Number(timer));
              }
            } else {
              let isLx = true;
              for (let i = 0; i < workbenchStatus.length; i++) {
                if (
                  workbenchStatus.task_state === null &&
                  workbenchStatus[i].status === "none"
                ) {
                  isLx = false;
                }
                if (workbenchStatus[i].status !== "ACTIVE") {
                  reactiveData.workbenchDataList[i].vm.status = 0;
                } else {
                  reactiveData.workbenchDataList[i].vm.status = 1;
                }
                reactiveData.workbenchDataList[i].task_state=workbenchStatus[i].task_state
              }
              if (isLx) {
                reactiveData.isPoll = false;
                clearInterval(Number(timer));
              }
            }
          }
        });
      }, 3000);
    }

    // 创建容器
    function createWorkbench() {
      clearInterval(Number(timer));
      router.push({ path: "/teacher/Workbench/createWorkbench" });
    }

    // 清除定时器
    function clearTimer() {
      clearInterval(Number(timer));
    }
    return {
      ...toRefs(reactiveData),
      enterFun,
      deleteFun,
      openOrCloseFun,
      createWorkbench,
      clearTimer
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
