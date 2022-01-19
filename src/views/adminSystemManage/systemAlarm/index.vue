<template>
  <div class="systemAlarm" v-layout-bg>
    <div class="searchParams">
      <div class="item custom_select node_name">
        <!-- <span class="inputLable">节点名称: </span> -->
        <a-select
          class="select"
          v-model:value="param.type"
          placeholder="节点名称"
          @change="handleChange"
        >
          <a-select-option v-for="item in types" :key="item" :value="item">
            {{ item }}
          </a-select-option>
        </a-select>
      </div>
      <div class="item custom_select alarm_type">
        <!-- <span class="inputLable">告警类型: </span> -->
        <a-select
          class="select"
          v-model:value="param.php_type"
          placeholder="告警类型"
          @change="handleChange"
        >
          <a-select-option v-for="item in php_types" :key="item" :value="item">
            {{ item }}
          </a-select-option>
        </a-select>
      </div>
      <div class="item custom_select alarm_state">
        <!-- <span class="inputLable"> 告警状态: </span> -->
        <a-select
          class="select"
          v-model:value="param.state"
          placeholder="告警状态"
          @change="handleChange"
        >
          <a-select-option v-for="item in states" :key="item" :value="item">
            {{ item }}
          </a-select-option>
        </a-select>
      </div>
      <!-- <div class="time">
        <span class="inputLable"> 告警时间： </span>
        <a-date-picker
          class="time"
          v-model:value="param.begintime"
          placeholder="开始日期"
          valueFormat="YYYY-MM-DD"
        />
        <span>~</span>
        <a-date-picker
          class="time"
          v-model:value="param.endtime"
          placeholder="结束日期"
          valueFormat="YYYY-MM-DD"
          @change="handleChange"
        />
      </div> -->
      <div>
        <a-range-picker
          class="range_time"
          v-model:value="range_time"
          valueFormat="YYYY-MM-DD"
          @change="handleChange"
        >
          <template #suffixIcon>
            <ClockCircleOutlined />
          </template>
        </a-range-picker>
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
        <a-table
          :columns="columns"
          :data-source="data"
          bordered
          :pagination="{
            hideOnSinglePage: true,
          }"
          :loading="loading"
        >
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
import { ClockCircleOutlined } from "@ant-design/icons-vue";

interface state {
  data: any[];
  loading: boolean;
  range_time: any[];
  param: {
    type: any;
    php_type: any;
    state: any;
    begintime: string;
    endtime: string;
  };
}
const columns = [
  {
    title: "节点类型",
    dataIndex: "node_type",
  },
  {
    title: "IP地址",
    dataIndex: "ip",
  },
  {
    title: "告警类型",
    dataIndex: "warn_type",
  },
  {
    title: "告警内容",
    dataIndex: "content",
  },
  {
    title: "告警时间",
    dataIndex: "created_at",
  },
  {
    title: "告警状态",
    dataIndex: "state",
  },
];
export default defineComponent({
  name: "systemAlarm",
  components: { ClockCircleOutlined },
  setup: (props, context) => {
    const http = (request as any).adminSystemManage;
    const state: state = reactive({
      range_time: [],
      data: [],
      loading: false,
      param: {
        type: undefined,
        php_type: undefined,
        state: undefined,
        begintime: "",
        endtime: "",
      },
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
    const types: string[] = ["主节点", "重节点"];
    const php_types: string[] = ["CPU", "磁盘", "内存"];
    const states: string[] = ["低风险", "中风险", "高风险"];
    const methods = {
      handleChange() {
        state.param.begintime = state.range_time[0];
        state.param.endtime = state.range_time[1];
        methods.getSystemAlarmList();
      },
      getSystemAlarmList() {
        state.loading = true;
        console.log(
          state.range_time,
          state.param.begintime,
          state.param.endtime,
          "jjjjjjjj"
        );
        const fd = new FormData();
        // fd.append("query[type]", state.param.type === undefined ? state.param.type : "");
        // fd.append(
        //   "query[state]",
        //   state.param.state === undefined ? state.param.state : ""
        // );
        fd.append("query[type]", state.param.type);
        fd.append("query[php_type]", state.param.php_type);
        fd.append("query[state]", state.param.state);
        fd.append("query[begintime]", state.param.begintime);
        fd.append("query[endtime]", state.param.endtime);
        http.systemAlarmList({ param: fd }).then((res: any) => {
          console.log(res);
          state.loading = false;
          state.data = res.data.list;
        });
      },
      search() {
        methods.getSystemAlarmList();
      },
      clear() {
        state.param.type = undefined;
        state.param.php_type = undefined;
        state.param.state = undefined;
        state.param.begintime = "";
        state.param.endtime = "";
        methods.getSystemAlarmList();
      },
    };
    onMounted(() => {
      methods.getSystemAlarmList();
    });
    return { ...toRefs(state), columns, ...methods, types, php_types, states };
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
    width: 150px;
  }
  // .select {
  //   width: 100px;
  // }
}
// :deep(.ant-input:placeholder-shown) {
//   width: 175px;
// }
// :deep(.ant-calendar-picker-input.ant-input) {
//   width: 175px;
// }

.item {
  display: flex;
  align-items: center;
  margin-right: 22px;
  :deep(.ant-select-selector) {
    width: 200px;
    height: 35px;
    padding-left: 30px;
    align-items: center;
  }
  :deep(.ant-input) {
    padding-left: 26px;
  }
}
.node_name {
  :deep(.ant-select-selector)::before {
    content: "";
    position: absolute;
    left: 8px;
    top: 10px;
    background: url(src/assets/images/screenicon/Group6.png) no-repeat;
    width: 17px;
    height: 17px;
  }
}
.alarm_type {
  :deep(.ant-select-selector)::before {
    content: "";
    position: absolute;
    left: 8px;
    top: 10px;
    background: url(src/assets/images/screenicon/Group3.png) no-repeat;
    width: 17px;
    height: 17px;
  }
}
.alarm_state {
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
.range_time {
  width: 300px;
}
:deep(.ant-table-pagination.ant-pagination) {
  float: none;
  text-align: center;
}
</style>
