<template>
  <div class="deviceManage" v-layout-bg>
    <div class="searchParams">
      <div class="searchLeft">
        <div>
          <!-- <span class="inputLable">设备IP: </span> -->
          <a-input
            @keyup.enter="search"
            v-model:value="params.ip"
            placeholder="IP地址"
            class="input"
          >
            <template #prefix>
              <img src="src/assets/images/screenicon/Group2.png" /> </template
          ></a-input>
        </div>
        <div class="item custom_select dev_type">
          <!-- <span class="inputLable"> 设备类型: </span> -->
          <a-select
            class="select"
            v-model:value="type"
            placeholder="设备类型"
            @change="handleChange"
          >
            <a-select-option
              v-for="item in types"
              :key="item.action_type"
              :value="item.action_type"
            >
              {{ item.tag }}
            </a-select-option>
          </a-select>
        </div>
        <div class="item custom_select dev_state">
          <!-- <span class="inputLable"> 设备状态: </span> -->
          <a-select
            class="select"
            v-model:value="status"
            placeholder="设备状态"
            @change="handleChange"
          >
            <a-select-option
              v-for="item in statuses"
              :key="item.ssh_state"
              :value="item.ssh_state"
              >{{ item.tag }}</a-select-option
            >
          </a-select>
        </div>
        <div>
          <a-button type="primary" @click="search">查询</a-button>
        </div>
        <div>
          <a-button type="primary" @click="clear">清空</a-button>
        </div>
      </div>

      <div>
        <a-button type="primary" @click="doSimJetSoft">一键关机</a-button>
      </div>
    </div>
    <div>
      <a-config-provider>
        <a-table
          :columns="columns"
          :data-source="data"
          rowKey="ip"
          bordered
          :pagination="{
            hideOnSinglePage: true,
          }"
          :loading="loading"
        >
          <template #action_type="{ record }">
            <div>
              {{ record.action_type === "control" ? "控制节点" : "计算节点" }}
            </div>
          </template>
          <template #ssh_state="{ record }">
            <div class="ssh_state">
              <div :class="record.ssh_state === 'up' ? 'on' : 'off'"></div>
              {{ record.ssh_state === "up" ? "运行" : "关闭" }}
            </div>
          </template>
          <template #action="{ record }">
            <div v-if="record.ssh_state === 'up'" class="action">
              <span class="purple" @click="nodeOpera(record.ip, record.node_type, 'stop')"
                >关机</span
              >
              <span
                class="purple"
                @click="nodeOpera(record.ip, record.node_type, 'restart')"
                >重启</span
              >
            </div>
            <div class="action" v-else>--</div>
          </template>
        </a-table>
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
import { Modal, message } from "ant-design-vue";

interface state {
  data: any[];
  type: any;
  status: any;
  loading: boolean;
  params: {
    ip: string;
    type: any;
    status: any;
  };
}
const columns = [
  {
    title: "设备IP",
    dataIndex: "ip",
  },
  {
    title: "设备类型",
    dataIndex: "action_type",
    slots: { customRender: "action_type" },
  },
  {
    title: "设备状态",
    dataIndex: "ssh_state",
    slots: { customRender: "ssh_state" },
  },
  {
    title: "操作",
    dataIndex: "action",
    width: 120,
    align: "center",
    slots: { customRender: "action" },
  },
];
export default defineComponent({
  name: "deviceManage",
  components: {},
  setup: (props, context) => {
    const http = (request as any).adminSystemManage;
    const state: state = reactive({
      data: [],
      loading: false,
      type: undefined,
      status: undefined,
      params: {
        ip: "",
        type: "",
        status: "",
      },
    });
    const types = [
      { action_type: "control", tag: "控制节点" },
      { action_type: "slave", tag: "计算节点" },
    ];
    const statuses = [
      { ssh_state: "up", tag: "运行" },
      { ssh_state: "down", tag: "关闭" },
    ];
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
      getDeviceList() {
        state.loading = true;
        state.params.type = state.type === undefined ? "" : state.type;
        state.params.status = state.status === undefined ? "" : state.status;
        http.systemDeviceList({ param: state.params }).then((res: any) => {
          console.log(res);
          state.loading = false;
          state.data = res.data;
        });
      },
      handleChange() {
        methods.getDeviceList();
      },
      search() {
        methods.getDeviceList();
      },
      clear() {
        state.params.ip = "";
        state.type = undefined;
        state.status = undefined;
        state.params.type = "";
        state.params.status = "";
        methods.getDeviceList();
      },

      doSimJetSoft() {
        Modal.confirm({
          title: "提示",
          content: "确定要关闭服务器吗？",
          okText: "确认",
          cancelText: "取消",
          onOk: () => {
            http.simJetSoft().then((res: any) => {
              console.log(res);
            });
          },
        });
      },
      nodeOpera(ip: any, node_type: any, action: any) {
        Modal.confirm({
          title: "提示",
          content: action === "restart" ? "确定要重启吗？" : "确定要关机吗？",
          okText: "确认",
          cancelText: "取消",
          onOk: () => {
            http
              .deviceNodeOperation({
                param: { ip: ip, node_type: node_type, action: action },
              })
              .then((res: any) => {
                methods.getDeviceList();
              });
          },
        });
      },
    };
    onMounted(() => {
      methods.getDeviceList();
    });
    return { ...toRefs(state), columns, ...methods, types, statuses };
  },
});
</script>
<style lang="less" scoped>
.searchParams {
  display: flex;
  justify-content: space-between;
  .searchLeft {
    display: flex;
    > div {
      margin-right: 20px;
      margin-bottom: 20px;
      .inputLable {
        font-weight: bold;
      }
    }
  }
  .input {
    width: 165px;
  }
  // .select {
  //   width: 120px;
  // }
}
.action {
  display: flex;
  justify-content: center;
  > span:nth-child(1) {
    margin-right: 20px;
  }
}
.purple {
  color: var(--primary-color);
}
.purple:hover {
  color: var(--primary-3);
}
.on {
  border-radius: 50px;
  width: 10px;
  height: 10px;
  background: green;
  display: inline-block;
  margin-right: 5px;
  box-shadow: 0 0 5px green;
}
.off {
  border-radius: 50px;
  width: 10px;
  height: 10px;
  background: var(--gray-5);
  display: inline-block;
  margin-right: 5px;
  box-shadow: 0 0 5px var(--gray-5);
}
.item {
  display: flex;
  align-items: center;
  margin-right: 22px;
  :deep(.ant-select-selector) {
    width: 240px;
    height: 35px;
    padding-left: 30px;
    align-items: center;
  }
  :deep(.ant-input) {
    padding-left: 26px;
  }
}
.dev_type {
  :deep(.ant-select-selector)::before {
    content: "";
    position: absolute;
    left: 8px;
    top: 10px;
    background: url(src/assets/images/screenicon/Group3.png) no-repeat;
    width: 15px;
    height: 15px;
  }
}
.dev_state {
  :deep(.ant-select-selector)::before {
    content: "";
    position: absolute;
    left: 8px;
    top: 10px;
    background: url(src/assets/images/screenicon/Group4.png) no-repeat;
    width: 17px;
    height: 17px;
  }
}
:deep(.ant-table-pagination.ant-pagination) {
  float: none;
  text-align: center;
}
</style>
