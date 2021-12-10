<template>
  <div class="systemAlarm" v-layout-bg>
    <div class="searchParams">
      <div>
        <span class="inputLable">节点名称: </span>
        <a-select class="select" default-value="" @change="handleChange">
          <a-select-option value="jack"> Jack </a-select-option>
        </a-select>
      </div>
      <div>
        <span class="inputLable">告警类型: </span>
        <a-select class="select" default-value="" @change="handleChange">
          <a-select-option value="jack"> Jack </a-select-option>
        </a-select>
      </div>
      <div>
        <span class="inputLable"> 告警状态: </span>
        <a-select class="select" default-value="" @change="handleChange">
          <a-select-option value="jack"> Jack </a-select-option>
        </a-select>
      </div>
      <div class="time">
        <span class="inputLable"> 告警时间： </span>
        <a-date-picker class="time" placeholder="开始日期" valueFormat="YYYY-MM-DD" />
        <span>~</span>
        <a-date-picker placeholder="结束日期" valueFormat="YYYY-MM-DD" />
      </div>
      <div>
        <a-button type="primary">查询</a-button>
      </div>
      <div>
        <a-button type="primary">清空</a-button>
      </div>
    </div>
    <div>
      <a-config-provider>
        <a-table :columns="columns" :data-source="data"> </a-table>
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
interface state {
  data: any[];
}
const columns = [
  {
    title: "节点类型",
    dataIndex: "name",
  },
  {
    title: "IP地址",
    dataIndex: "age",
  },
  {
    title: "告警类型",
    dataIndex: "address",
  },
  {
    title: "告警内容",
    dataIndex: "address",
  },
  {
    title: "告警时间",
    dataIndex: "address",
  },
  {
    title: "告警状态",
    dataIndex: "address",
  },
];
export default defineComponent({
  name: "systemAlarm",
  components: {},
  setup: (props, context) => {
    const http = (request as any).adminSystemManage;
    const state: state = reactive({
      data: [],
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
      handleChange() {},

      getSystemAlarmList() {
        const fd = new FormData();
        fd.append("query[type]", "");
        fd.append("query[state]", "");
        fd.append("query[begintime]", "");
        fd.append("query[endtime]", "");
        http.systemAlarmList({ param: fd }).then((res: any) => {
          console.log(res);
        });
      },
    };
    onMounted(() => {
      methods.getSystemAlarmList();
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
  .select {
    width: 85px;
  }
}
</style>
