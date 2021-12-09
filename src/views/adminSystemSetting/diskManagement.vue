<template>
  <div class="disk-management-wrap">
    <div>
      <span
        >磁盘管理设置：单个节点磁盘使用量达到80%,自动清除系统中
        <a-select v-model:value="selectId">
          <a-select-option
            v-for="item in timeSelectData"
            :value="item.value.toString()"
            :key="item.value"
            >{{ item.title }}</a-select-option
          >
        </a-select>
        以前的操作视频</span
      >
      <a-button @click="saveLog" type="primary">保存</a-button>
    </div>
    <div class="c-content-wrap">
      <div class="c-tab">
        <span
          class="c-tab-item"
          :class="key == 1 ? 'active' : ''"
          @click="key = 1"
          >磁盘清理</span
        >
        <span
          class="c-tab-item"
          :class="key == 2 ? 'active' : ''"
          @click="key = 2"
          >磁盘清理记录</span
        >
      </div>
      <div>
        <div class="search-box" v-if="key == 2">
          <label>清理时间：</label>
          <a-date-picker v-model:value="searchForm.startTime" /> ~
          <a-date-picker
            v-model:value="searchForm.endTime"
            :disabled-date="disabledDate"
          />
          <span class="action-btn">
            <a-button type="primary" @click="serach('search')">查询</a-button>
            <a-button type="primary" @click="serach('clear')">清空</a-button>
          </span>
        </div>
        <a-table
          :columns="key == 1 ? columns1 : columns2"
          :data-source="key == 1 ? clearDiskData : clearDiskLogData"
          :rowKey="rowKey"
          :pagination="false"
        >
          <template #action="{ record }"
            ><span class="clear-disk" @click="clearDisk(record)"
              >清理磁盘</span
            ></template
          >
        </a-table>
        <div class="page-box" v-if="key == 2 && total != 0">
          <a-pagination
            :default-current="1"
            :defaultPageSize="10"
            :total="total"
            @change="pageChange"
          />
        </div>
      </div>
      <!-- <div v-if="key == '2'" key="2">啦啦啦1</div> -->
    </div>
  </div>
  <a-modal
    class="clear-model-wrap"
    v-model:visible="visible"
    title="提示"
    @ok="handleOk"
    :width="700"
  >
    <div>
      <span class="clear-title">请选择，清理</span>
      <a-date-picker class="clear-time" v-model:value="clearTime" />
      <span class="clear-date">日期当日及之前的操作视频！</span>
      <div class="clear-hint">(建议不要清除近三个月内的内容！)</div>
    </div>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs, watch } from "vue";
import {
  getSystemLogTimeApi,
  getClearDiskDataApi,
  getClearDiskLogDataApi,
  clearSettingDiskApi,
  saveSystemLogApi,
} from "./api";
import { message } from "ant-design-vue";

const columns1 = [
  {
    title: "类型",
    dataIndex: "type",
  },
  {
    title: "磁盘使用率",
    dataIndex: "dick",
  },
  {
    title: "状态",
    dataIndex: "state",
  },
  {
    title: "告警时间",
    dataIndex: "warn_data",
  },
  {
    title: "操作",
    dataIndex: "host_ip",
    slots: { customRender: "action" },
  },
];
const columns2 = [
  {
    title: "告警内容",
    dataIndex: "warn_content",
  },
  {
    title: "清理时间",
    dataIndex: "clear_time",
  },
  {
    title: "释放空间大小",
    dataIndex: "release_size",
  },
  {
    title: "磁盘清理范围",
    dataIndex: "time_slot",
  },
  {
    title: "操作来源",
    dataIndex: "source_type",
  },
];

type TReactiveData = {
  timeSelectData: any;
  selectId: number | string;
  key: number;
  clearDiskData: any[];
  clearDiskLogData: any[];
  searchForm: any;
  total: number;
  visible: boolean;
  clearTime: string;
  currentRow: any;
};
import moment from "moment";
export default defineComponent({
  setup() {
    const reactiveData: TReactiveData = reactive({
      timeSelectData: {},
      selectId: "",
      key: 1,
      clearDiskData: [],
      clearDiskLogData: [],
      searchForm: {
        startTime: "",
        endTime: "",
        page: 1,
      },
      total: 0,
      visible: false,
      clearTime: "",
      currentRow: {},
    });
    onMounted(() => {
      method.getSystemLogTime();
    });

    const method = {
      // 获取系统日志时间配置
      getSystemLogTime() {
        getSystemLogTimeApi().then((res: any) => {
          console.log(res);

          reactiveData.timeSelectData = res.data.select;
          console.log(reactiveData.timeSelectData);

          reactiveData.selectId = res.data.data.value;
        });
      },
      disabledDate(current: any) {
        return current && current < reactiveData.searchForm.startTime;
      },
      getClearDiskData() {
        getClearDiskDataApi().then((res: any) => {
          reactiveData.clearDiskData = res.data;
        });
      },
      getClearDiskLogData() {
        let parms = {
          startTime: reactiveData.searchForm.startTime?moment(reactiveData.searchForm.startTime).format(
            "YYYY-MM-DD"
          ):"",
          endTime: reactiveData.searchForm.endTime?moment(reactiveData.searchForm.endTime).format(
            "YYYY-MM-DD"
          ):"",
          page: reactiveData.searchForm.page,
        };
        getClearDiskLogDataApi(parms).then((res: any) => {
          reactiveData.clearDiskLogData = res.data.page_data;
          reactiveData.searchForm.page = res.data.page_current;
          reactiveData.total = res.data.page_total_count;
        });
      },
      pageChange(page: number, pageSize: number) {
        reactiveData.searchForm.page = page;
        method.getClearDiskLogData();
      },
      rowKey(row: any) {
        return row.host_ip;
      },
      clearDisk(row: any) {
        console.log(row);
        reactiveData.currentRow = row;
        reactiveData.visible = true;
      },
      handleOk() {
        let params = {
          host_ip: reactiveData.currentRow.host_ip,
          time: moment(reactiveData.clearTime).format("YYYY-MM-DD"),
        };
        clearSettingDiskApi(params).then((res: any) => {
          console.log(res);
          reactiveData.visible = false;
          method.getClearDiskData();
        });
      },
      saveLog() {
        console.log("保存日志");
        saveSystemLogApi({ clearTime: reactiveData.selectId as number }).then(
          () => {
            message.success("保存成功");
          }
        );
      },
      serach(type: string) {
        if (type == "search") {
          method.getClearDiskLogData();
        }
        if (type == "clear") {
            reactiveData.searchForm.startTime=""
            reactiveData.searchForm.endTime=""
             method.getClearDiskLogData();
        }
      },
    };
    watch(
      () => reactiveData.key,
      () => {
        if (reactiveData.key == 1) {
          method.getClearDiskData();
        }
        if (reactiveData.key == 2) {
          reactiveData.searchForm.page = 1;
          method.getClearDiskLogData();
        }
      },
      {
        deep: true,
        immediate: true,
      }
    );
    return {
      ...toRefs(reactiveData),
      ...method,
      columns1,
      columns2,
    };
  },
});
</script>

<style lang="less">
.disk-management-wrap {
  .c-content-wrap {
    margin-top: 30px;
    .c-tab {
      margin-bottom: 16px;
      border-bottom: 1px solid #e9e9e9;
      .c-tab-item {
        display: inline-block;
        padding: 10px 15px;
        cursor: pointer;
        &.active {
          background: @theme-color;
          color: @white;
          border-radius: @border-radius-base;
        }
      }
    }
    .search-box {
      display: flex;
      align-items: center;
      margin-bottom: 25px;
      .ant-calendar-picker-input {
        width: 150px;
        margin: 0 5px;
      }
      .action-btn {
        margin-left: 50px;
        > button {
          margin-right: 20px;
        }
      }
    }
    .clear-disk {
      color: @theme-color;
      cursor: pointer;
    }
  }
}
.ant-modal {
  &.clear-model-wrap {
    .clear-title {
      font-size: 14px;
    }
    .clear-date {
      font-size: 14px;
    }
    .clear-hint {
      margin-top: 20px;
      font-size: 14px;
    }
  }
}
</style>
