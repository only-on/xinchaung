<template>
  <layout :VmData="data" isLeftContentShowType="float">
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
        <iframe src="http://localhost:3000/#/" frameborder="0" style="width:100%;height:100%"></iframe>
    </template>
  </layout>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import layout from "../VmLayout/VmLayout.vue";
import {backTo} from "src/utils/vncInspect";
import {useRoute,useRouter} from "vue-router"

export default defineComponent({
  components: {
    layout,
  },
  setup() {
      const route = useRoute();
      const router = useRouter();
    let navData = [
      { name: "实验指导", key: "guide", icon: "icon-zhidao" },
      { name: "实验习题", key: "exercises", icon: "icon-xiti1" },
      { name: "实验报告", key: "report", icon: "icon-baogao1" },
      { name: "随堂练习", key: "practice", icon: "icon-biji" },
      { name: "随堂论坛", key: "forum", icon: "icon-luntan1" },
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
    function back() {
    //   if (opType === "test" || opType === "prepare") {
    //     endVmEnvirment();
    //   } else {
        backTo(router, type, 3, routerQuery);
    //   }
    }
    return {
      data,
      back
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
