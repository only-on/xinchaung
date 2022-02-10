<template>
  <div class="adminSystemLog" v-layout-bg>
    <div class="searchParams">
      <div>
        <span class="inputLable"> 操作类型: </span>
        <a-select
          class="input"
          v-model:value="opertype"
          default-value="请选择"
          @change="handleChange"
        >
          <a-select-option
            v-for="(item, index) in operateType"
            :key="index.toString()"
            :value="item"
          >
            {{ item }}
          </a-select-option>
        </a-select>
      </div>
      <div>
        <span class="inputLable"> 操作行为: </span>
        <a-input
          class="input"
          @keyup.enter="search"
          v-model:value="query.operation_type"
        ></a-input>
      </div>
      <div>
        <span class="inputLable"> IP地址: </span>
        <a-input @keyup.enter="search" class="input" v-model:value="query.ip"></a-input>
      </div>
      <div class="time">
        <span class="inputLable"> 操作时间： </span>
        <a-date-picker
          v-model:value="query.begintime"
          class="time"
          placeholder="开始日期"
          valueFormat="YYYY-MM-DD"
        />
        <span>~</span>
        <a-date-picker
          @change="handleChange"
          v-model:value="query.endtime"
          placeholder="结束日期"
          valueFormat="YYYY-MM-DD"
        />
      </div>
      <div>
        <a-button type="primary" @click="search">查询</a-button>
      </div>
      <div>
        <a-button type="primary" @click="clear">清空</a-button>
      </div>
    </div>
    <div>
      <a-config-provider>
        <a-table :columns="columns" :data-source="data" rowKey="id"> </a-table>
        <template #renderEmpty>
          <div><empty type="tableEmpty"></empty></div>
        </template>
      </a-config-provider>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, onMounted, toRefs, inject, watch } from "vue";
import request from "src/api/index";
import { stat } from "fs";
interface state {
  opertype: any;
  data: any[];
  query: {
    type: any;
    operation_type: string;
    ip: string;
    begintime: string;
    endtime: string;
  };
  operateType: string[];
}
const columns = [
  {
    title: "id",
    dataIndex: "id",
  },
  {
    title: "用户名",
    dataIndex: "user_name",
  },
  {
    title: "操作类型",
    dataIndex: "type",
  },
  {
    title: "操作行为",
    dataIndex: "operation_type",
  },
  {
    title: "IP地址",
    dataIndex: "ip",
  },
  {
    title: "操作时间",
    dataIndex: "created_at",
  },
];
export default defineComponent({
  name: "adminSystemLog",
  components: {},
  setup: (props, context) => {
    const http = (request as any).adminSystemManage;
    const state: state = reactive({
      opertype: undefined,
      data: [],
      query: {
        type: "",
        operation_type: "",
        ip: "",
        begintime: "",
        endtime: "",
      },
      operateType: [
        "登录",
        "退出",
        "添加",
        "删除",
        "编辑",
        "回帖",
        "修改设置",
        "开始学习",
        "继续学习",
        "重修",
        "练习",
        "结束实验",
        "开始实训",
        "继续实训",
        "结束实训",
        "保存学习进度",
        "开始录制视频",
        "停止录制视频",
        "发帖",
        "删帖",
        "提交",
      ],
    });
    var updata = inject("updataNav") as Function;
    updata({
      tabs: [],
      navPosition: "outside",
      navType: false,
      showContent: true,
      componenttype: undefined,
      showNav: true,
      backOff: false,
      showPageEdit: false,
    });
    const methods = {
      getSystemList() {
        state.query.type = state.opertype === undefined ? "" : state.opertype;
        http.systemLogList({ param: { query: state.query } }).then((res: any) => {
          console.log(res);
          state.data = res.data.list;
        });
      },
      search() {
        methods.getSystemList();
      },
      clear() {
        state.opertype = undefined;
        state.query.type = "";
        state.query.operation_type = "";
        state.query.ip = "";
        state.query.begintime = "";
        state.query.endtime = "";
        methods.getSystemList();
      },
      handleChange() {
        methods.getSystemList();
      },
    };
    onMounted(() => {
      methods.getSystemList();
    });
    return { ...toRefs(state), columns, ...methods };
  },
});
</script>
<style lang="less" scoped>
.searchParams {
  display: flex;
  flex-wrap: wrap;
  > div {
    margin-right: 20px;
    margin-bottom: 20px;
    .inputLable {
      font-weight: bold;
    }
  }
  .input {
    width: 165px;
  }
}
</style>
