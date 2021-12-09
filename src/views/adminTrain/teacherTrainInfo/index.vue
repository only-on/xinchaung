<template>
  <div id="teacherTrainInfo" v-layout-bg>
    <div class="header-search">
      <div class="search-left">
        <a-form-item label="实训名称">
          <a-input @keyup.enter="querySearch" v-model:value="params.name" />
        </a-form-item>
        <a-form-item label="任课教师">
          <a-input @keyup.enter="querySearch" v-model:value="params.teacher" />
        </a-form-item>
        <a-form-item label="实训状态">
          <a-select
            default-value="请选择"
            v-model:value="params.status"
            style="width: 120px"
            @change="handleChange"
          >
            <a-select-option value="jack"> 未开始 </a-select-option>
            <a-select-option value="lucy">进行中</a-select-option>
            <a-select-option value="disabled">已结束</a-select-option>
          </a-select>
        </a-form-item>
        <a-button type="primary" @click="querySearch">查询</a-button>
        <a-button type="primary" @click="clearAll">清空</a-button>
      </div>
      <div class="search-right">
        <a-button type="primary" @click="deleteTrain">删除</a-button>
        <a-button type="primary" @click="clearVideoRecord">删除录像记录</a-button>
      </div>
    </div>
    <a-config-provider>
      <a-table
        :columns="columns"
        :data-source="data"
        rowKey="id"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      >
        <template #name="{ record }">
          <div @click="lookTrainDetail(record.id)" class="purple">
            {{ record.name }}
          </div>
        </template>
        <template #result="{ record }">
          <div @click="lookResult(record.id)" class="purple">查看</div>
        </template>
        <template #action="{ record }">
          <div @click="clearVideoRecord(record.id)" class="purple">清除录像记录</div>
        </template>
      </a-table>
      <template #renderEmpty>
        <div><empty type="tableEmpty"></empty></div>
      </template>
    </a-config-provider>
    <a-modal v-model:visible="visible" title="提示" @ok="handleOk">
      <p>确定要删除吗？</p>
    </a-modal>
  </div>
</template>
<script lang="ts">
import {
  createVNode,
  defineComponent,
  ref,
  reactive,
  onMounted,
  toRefs,
  inject,
  watch,
} from "vue";
import Empty from "src/components/Empty.vue";
import request from "src/api/index";
import { Modal, message } from "ant-design-vue";
import { useRouter } from "vue-router";

interface state {
  data: any[];
  selectedRowKeys: any[];
  params: any;
  visible: boolean;
}
export default defineComponent({
  name: "teacherTrainInfo",
  components: { Empty },
  setup: (props, context) => {
    const router = useRouter();
    const http = (request as any).adminTrain;
    const columns: any = [
      { title: "实训名称", dataIndex: "name", slots: { customRender: "name" } },
      {
        title: "任课教师",
        dataIndex: "creater",
      },
      {
        title: "实训状态",
        dataIndex: "status",
      },
      {
        title: "开始时间",
        dataIndex: "start_times",
      },
      {
        title: "结束时间",
        dataIndex: "end_times",
      },
      {
        title: "操作记录总大小",
        dataIndex: "video_size",
      },
      {
        title: "实训成果",
        dataIndex: "result",
        slots: { customRender: "result" },
      },
      {
        title: "操作",
        key: "action",
        slots: { customRender: "action" },
      },
    ];
    const state: state = reactive({
      data: [{ name: "00" }],
      selectedRowKeys: [],
      params: {
        name: "",
        teacher: "",
        status: undefined,
      },
      visible: false,
    });
    const methods = {
      handleChange(value: any) {
        console.log(value);
      },
      //   获取表格数据
      tableList() {
        http.trainList({ param: state.params }).then((res: any) => {
          state.data = res.data.list;
          // state.data = [{ name: "122", id: "0001" }];
        });
      },
      // 勾选多选框
      onSelectChange(selectedRowKeys: any) {
        state.selectedRowKeys = selectedRowKeys;
      },
      //   查询
      querySearch() {
        methods.tableList();
      },
      clearAll() {
        state.params.name = "";
        state.params.teacher = "";
        state.params.status = undefined;
        methods.tableList();
      },
      //   确认删除
      handleOk() {
        state.visible = false;
      },
      deleteTrain() {
        if (!state.selectedRowKeys.length) {
          message.warning("请选择要操作的实训！");
        } else {
          state.visible = true;
        }
        // http.deleteTrain({urlParams:{train:}}).then((res: any) => {
        //   console.log(res);
        // });
      },
      //   删除录像记录
      clearVideoRecord(id: any) {
        if (id) {
          console.log("删除录像记录");
        } else {
          if (!state.selectedRowKeys.length) {
            message.warning("请选择要操作的实训！");
          } else {
            //   state.visible = true;
            console.log("删除录像记录");
          }
        }
      },
      //   我的实训详情
      lookTrainDetail(id: any) {
        console.log("我的实训详情", id);

        // router.push({
        //   path: "/teacher/teacherTrain/detail",
        //   query: { id: id, currentTab: 0 },
        // });
        router.push({ path: "adminTrain/trainInfo", query: { id: id, currentTab: 0 } });
      },
      //   我的实训查看结果
      lookResult(id: any) {
        console.log("我的实训结果", id);
        router.push({ path: "adminTrain/trainResult", query: { id: id } });
      },
    };
    onMounted(() => {
      methods.tableList();
    });
    return { ...toRefs(state), ...methods, columns };
  },
});
</script>
<style lang="less" scoped>
.header-search {
  display: flex;
  justify-content: space-between;
  .search-left {
    display: flex;
    > div {
      margin-right: 10px;
    }
    > button {
      margin-right: 15px;
    }
  }
  .search-right {
    > button:nth-child(1) {
      margin-right: 10px;
    }
  }
}
.purple {
  color: @theme-color;
}
.purple:hover {
  color: @theme-light-color;
}
</style>
