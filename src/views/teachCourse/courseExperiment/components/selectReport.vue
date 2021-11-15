<template>
  <div class="select-report-box">
    <a-input-search
      v-model:value="getParams.name"
      placeholder="请输入关键字"
      class="search-box"
      @search="onSearch"
    />
    <a-table
      :dataSource="dataSource"
      :columns="columns"
      :pagination="false"
      :rowKey="rowKey"
    >
      <template #action="{ text }">
        <span class="select-btn" @click="select(text)">选择</span>
      </template>
    </a-table>
    <a-pagination
      class="page-box"
      v-model:current="getParams.page"
      v-model:pageSize="getParams.pageSize"
      :total="total"
      @change="pageChange"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs, inject } from "vue";
import { getReportListApi, saveReportTemplateApi } from "../api";
import { message } from "ant-design-vue";
import {useRoute} from "vue-router"
import { number } from "echarts";
export default defineComponent({
  props: ["type"],
  setup(props, { emit }) {
    const columns = [
      {
        dataIndex: "file_name",
        title: "模板名称",
      },
      {
        dataIndex: "type",
        title: "模板类型",
        customRender: ({ text }: any) => {
          return text === "file" ? "离线报告" : "在线报告";
        },
      },
      {
        dataIndex: "id",
        title: "操作",
        slots: {
          customRender: "action",
        },
      },
    ];
    const route =useRoute()
    const experiment_id: any = props.type==='course'?'':inject("experiment_id");
    const course_id=route.query.course_id as any as number
    const reactiveData = reactive({
      dataSource: [],
      getParams: {
        name: "",
        page: 1,
        pageSize: 10,
      },
      total: 0,
    });
    onMounted(() => {
      getReportList();
    });
    const rowKey = (row: any) => {
      return row.id;
    };
    // 获取实验报告
    function getReportList() {
      getReportListApi(reactiveData.getParams).then((res: any) => {
        console.log(res);
        reactiveData.dataSource = res.data.list;
        reactiveData.total = res.data.page.totalCount;
        reactiveData.getParams.page = res.data.page.currentPage;
        reactiveData.getParams.pageSize = res.data.page.perPage;
      });
    }
    function pageChange(page: number, pageSize: number) {
      reactiveData.getParams.page = page;
      reactiveData.getParams.pageSize = pageSize;
      getReportList();
    }
    // 查询
    function onSearch() {
      reactiveData.getParams.page = 1;
      reactiveData.getParams.pageSize = 10;
      getReportList();
    }
    // 选择
    function select(val: any) {
      console.log(val);
      let param = {
        owner_type: props.type==='course'?'course':"cc_mid",
        owner_id: props.type==='course'?Number(course_id):experiment_id.value,
        template_id: val,
      };
      saveReportTemplateApi(param).then((res: any) => {
        console.log(res);
        message.success("模板更换成功");
        emit("close", true);
      });
    }
    return {
      ...toRefs(reactiveData),
      columns,
      pageChange,
      onSearch,
      select,
      rowKey,
    };
  },
});
</script>

<style lang="less">
.select-report-box {
  .search-box {
    margin-bottom: 20px;
    width: 300px;
  }
  .page-box {
    text-align: center;
    margin-top: 30px;
  }
  .select-btn {
    color: @theme-color;
    &:hover {
      color: rgba(@theme-color, 0.8);
      cursor: pointer;
    }
  }
}
</style>
