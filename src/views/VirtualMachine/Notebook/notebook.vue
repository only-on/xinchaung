<template>
  <layout :VmData="data" :reportId='reportTemid' isLeftContentShowType="float">
    <template #header>
      <div class="vm-header-student">
        <div class="vm-header-left">
          <a-button type="primary" @click="back">返回</a-button>
        </div>

        <div class="vm-header-title">实验名称</div>
        <div class="vm-header-right">
          <span class="vm-time">
            <span class="icon-shijian1 iconfont"></span>
            <span>实验剩余时间: 00 时 00 分 0 秒 </span>
          </span>
          <a-button class="delayed-btn">延时</a-button>
          <span class="vm-action-box">
            <a-button type="primary">保存进度</a-button>
            <a-button type="danger">结束实验</a-button>
          </span>
        </div>
      </div>
    </template>
    <template #right>
        <iframe :src="'http://'+noteUrl" frameborder="0" style="width:100%;height:100%"></iframe>
    </template>
  </layout>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive ,ref,toRefs,provide,Ref} from "vue";
import layout from "../VmLayout/VmLayout.vue";
import {backTo,getVmBaseInfo} from "src/utils/vncInspect";
import {useRoute,useRouter,onBeforeRouteLeave} from "vue-router"
import {wsConnect} from "src/request/websocket"
import {message} from "ant-design-vue"
import storage from "src/utils/extStorage"
export default defineComponent({
  components: {
    layout,
  },
  setup() {
      const route = useRoute();
      const router = useRouter();
      let role = storage.lStorage.get("role");
    let navData = role===4?[
      { name: "实验指导", key: "guide", icon: "icon-zhidao" },
      { name: "实验习题", key: "exercises", icon: "icon-xiti1" },
      { name: "实验报告", key: "report", icon: "icon-baogao1" },
      { name: "随堂练习", key: "practice", icon: "icon-biji" },
      { name: "随堂论坛", key: "forum", icon: "icon-luntan1" },
    ]:[
      { name: "实验指导", key: "guide", icon: "icon-zhidao" },
    ];
    let vmQuery = route.query as any;
    const {
      opType,
      connection_id,
      topoinst_uuid,
      taskId,
      type,
      topoinst_id,
      routerQuery,
    }: any = vmQuery;
    const data = reactive(navData);
    const wsVmConnect = ref(null);
    let timer:NodeJS.Timer|null =null
    const reactiveData:any=reactive({
      allInfo:{}
    })

    const {allInfo} = toRefs(reactiveData)
    let vmBaseInfo:any={}
    let vm_uuid=""
    const noteUrl=ref("")
    const use_time: Ref<number> = ref(900);
    let taskType=ref("")
    var reportTemid:Ref<any>=ref(0)
    provide("allInfo", allInfo);
    // provide("novncEl",novncEl)
    provide("uuid",vm_uuid)
    provide("use_time",use_time)
    provide("taskType",taskType)
    onMounted(()=>{
      initWs()
      getTaskInfoData()
    })
    onBeforeRouteLeave(() => {
      clearInterval(Number(timer));
      console.log("离开页面");
      wsVmConnect.value ? (wsVmConnect.value as any).close() : "";
    });

    function initWs() {
      wsVmConnect.value = wsConnect({
        url: "://192.168.101.150:9035/?uid=" + connection_id,
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
            if (
              JSON.parse(ev.data).data.vms &&
              JSON.parse(ev.data).data.vms.length > 0
            ) {
              vmBaseInfo = JSON.parse(ev.data).data.vms[0];
              vm_uuid = vmBaseInfo.uuid;
              noteUrl.value=vmBaseInfo.base_ip+":"+vmBaseInfo.note_port
            }
          }
        },
      });
    }

    // 获取实验详情
    function getTaskInfoData() {
      let params = {
        type: type,
        opType: opType,
        taskId: taskId,
      };
      getVmBaseInfo(params).then((res: any) => {
        console.log(res);
        allInfo.value = res.data;
        console.log(res.data.current.used_time);

        use_time.value = res.data.current.used_time;
        console.log(allInfo);
        taskType.value = res.data.base_info.task_type.name;
        reportTemid.value=res?.data.current.id
      });
    }
    function back() {
    //   if (opType === "test" || opType === "prepare") {
    //     endVmEnvirment();
    //   } else {
        backTo(router, type, 3, routerQuery);
    //   }
    }
    return {
      data,
      back,
      noteUrl,
      provide,
      reportTemid
    };
  },
});
</script>

<style lang="less">
.vm-layout {
  .vm-header {
    .vm-header-student {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      height: 100%;
      padding: 0 43px;
      .vm-header-left {
        > button {
          margin-right: 20px;
        }
      }
      .vm-header-title {
        color: @white;
      }
      .vm-header-right {
        .delayed-btn {
          background: @warning-color;
          color: @white;
          border: none;
          &:hover {
            background: rgba(#faad14, 0.8);
          }
        }
        .vm-time {
          color: @warning-color;
          margin: 0 10px;
          .iconfont {
            margin-right: 3px;
            font-size: 12px;
          }
        }
        .vm-action-box {
          margin-left: 25px;
          > button {
            margin-left: 20px;
          }
        }
      }
    }
  }
}
</style>
