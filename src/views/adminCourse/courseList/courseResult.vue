<template>
  <div class="a-course-result-wrap" v-layout-bg style="height:100%">
    <a-config-provider>
      <a-table
        class="course-content-wrap"
        :columns="columns"
        :data-source="dataList"
        :pagination="false"
        :rowKey="rowKey"
      >
        <template #result="{ text }"
          ><span class="a-link" @click="actionLog(text)"
            >操作记录</span
          ></template
        >
        <template #action="{ text }">
          <div class="action-table">
            <span class="a-link" @click="clearVideoLog(text)"
              >清除录像记录</span
            >
          </div></template
        >
      </a-table>
      <template #renderEmpty>
        <div><empty type="tableEmpty"></empty></div>
      </template>
    </a-config-provider>
    <div class="page-box" v-if="total != 0">
      <a-pagination
        v-model:current="params.page"
        v-model:pageSize="params.limit"
        :total="total"
        @change="pageChange"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs,inject } from "vue";
import { lookCourseResultApi } from "../api";
import { useRoute } from "vue-router";
import Empty from "src/components/Empty.vue";
const columns = [
  {
    title: "账号",
    ellipsis: true,
    width: 150,
    dataIndex: "account",
  },
  {
    title: "姓名",
    dataIndex: "user_name",
    width: 150,
  },
  {
    title: "实验名称",
    dataIndex: "content_name",
    ellipsis: true,
  },
  {
    title: "章节名称",
    dataIndex: "chapter_name",
  },
  {
    title: "操作记录总大小",
    dataIndex: "file_size",
    align: "center",
  },
  {
    title: "课程成果",
    dataIndex: "id",
    align: "center",
    slots: { title: "id", customRender: "result" },
  },
  {
    title: "操作",
    dataIndex: "id",
    align: "center",
    width: 200,
    slots: { title: "id", customRender: "action" },
  },
];
export default defineComponent({
  components: {
    empty: Empty,
  },
  setup() {
    const route = useRoute();
    var updata=inject('updataNav') as Function
    updata({tabs:[],navPosition:'outside',navType:false,showContent:true,componenttype:undefined,showNav:true,backOff:false,showPageEdit:false})

    const reactiveData = reactive({
      dataList: [],
      course_id: route.query.course_id as any as number,
      params: {
        page: 1,
        limit: 10,
      },
      total: 0,
    });
    const method = {
      lookCourseResult() {
        lookCourseResultApi(reactiveData.params, {
          course_id: reactiveData.course_id,
        }).then((res: any) => {
          console.log(res);
          reactiveData.dataList = res.data.list;
          reactiveData.params.page = res.data.page.currentPage;
          reactiveData.params.limit = res.data.page.perPage;
          reactiveData.total = res.data.page.totalCount;
        });
      },
      rowKey(row: any) {
        return row.content_name+row.file_size;
      },
      pageChange(page: number, pageSize: number) {
        reactiveData.params.page = page;
        reactiveData.params.limit = pageSize;
        method.lookCourseResult();
      },
      actionLog(id: number) {
        console.log(id);
      },
      clearVideoLog(id: number) {
        console.log(id);
      },
    };
    onMounted(() => {
      method.lookCourseResult();
    });
    return {
      ...method,
      ...toRefs(reactiveData),
      columns,
    };
  },
});
</script>

<style lang="less">
.a-course-result-wrap{
    .page-box{
        margin-top: 25px;
        text-align: center;
    }
}
</style>
