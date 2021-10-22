<template>
  <div class="workbench-main">
    <div class="workbench-head">
      <a-button type="primary" @click="createWorkbench">创建容器({{ limit }}/5)</a-button>
    </div>
    <div class="workbench-list-box">
      <div
        class="workbench-item"
        v-for="(item, index) in dataList"
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
import { onBeforeRouteLeave ,useRouter} from "vue-router";


export default defineComponent({
  components: {
    card,
  },
  setup() {
    const router=useRouter()
    const reactiveData: {
      params: TgetWorkbench;
      dataList: any[];
      limit: number;
      isPoll:boolean
    } = reactive({
      params: {
        page: 1,
        limit: 12,
        name: "",
        withs: "image,flavor,vm,image.classify",
      },
      dataList: [],
      limit: 0,
      isPoll:false, // 是否在轮询
    });

    const ws = ref(null);
    let uid = storage.lStorage.get("uid");
    let timer: NodeJS.Timer | null = null;
    
    onBeforeRouteLeave(() => {
      console.log("离开页面");
      reactiveData.isPoll=false
      ws.value ? (ws.value as any).close() : "";
      clearInterval(Number(timer));
    });

    onMounted(() => {
      init();
      connectWs();
    });

   async function init() {
      await getDataList();
      getWorkbenchStatus(-1)
    }
    // 链接websocker
    function connectWs() {
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
      });
    }

    // 获取工作台列表
    function getDataList() {
      return new Promise((reslove: any, reject: any) => {
        getWorkbenchApi(reactiveData.params).then((res: any) => {
          console.log(res);
          reslove(res)
          reactiveData.dataList = res.data.list;
          reactiveData.limit = res.data.page.totalCount;
        }).catch(err=>{
          reject(err)
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
    function enterFun(val: any) {
      let tags: any[] = val.image.tag;
      let id = val.id;
      let status = val.vm.status;
      if (status === 0) {
        message.warn("请先开启工作台，在重新进入");
        return;
      }
      getWorkbenchInfoApi(id).then((res) => {
        if (res?.code === 1) {
          if (tags.indexOf("Notebook") > -1) {
            console.log("跳转notebook");
          } else {
            console.log("跳转vnc");
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
          })
          .catch((err) => {
            message.error("关闭失败");
          });
      } else {
        openWorkbenchApi(val.id)
          .then((res) => {
            console.log(res);
          })
          .catch(() => {
            message.error("开启失败");
          });
          getWorkbenchStatus(ind)
      }
    }

    // 轮询获取工作台状态
    function getWorkbenchStatus(index: number) {
      reactiveData.isPoll=true
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
                for (let i = 0; i < reactiveData.dataList.length; i++) {
                  reactiveData.dataList[i].vm.status = 0;
                }
                reactiveData.dataList[index].vm.status = 1;
                reactiveData.isPoll=false
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
                  reactiveData.dataList[i].vm.status = 0;
                } else {
                  reactiveData.dataList[i].vm.status = 1;
                }
              }
              if (isLx) {
                reactiveData.isPoll=false
                clearInterval(Number(timer));
              }
            }
          }
        });
      }, 3000);
    }

    // 创建容器
    function createWorkbench() {
      router.push({path:"/teacher/Workbench/createWorkbench"})
    }

    return {
      ...toRefs(reactiveData),
      enterFun,
      deleteFun,
      openOrCloseFun,
      createWorkbench
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
