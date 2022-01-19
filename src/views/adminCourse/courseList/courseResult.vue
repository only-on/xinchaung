<template>
  <div class="a-course-result-wrap" v-layout-bg style="height: 100%">
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
      <page
        v-model:current="params.page"
        v-model:pageSize="params.limit"
        :total="total"
        @change="pageChange"
      />
    </div>
  </div>
  <a-modal
    v-model:visible="visible"
    :width="1000"
    class="video-show-modal"
    title="课程成果"
    @ok="closeModal"
    @cancel="closeModal"
  >
    <div class="video-show-content">
      <video
        class="video-left"
        v-if="videoUrl"
        :src="videoUrl"
        controls
      ></video>
      <div class="video-right">
        <div class="action-log-title">操作记录</div>
        <div class="video-item" :title="videoName">
          <span class="icon-yunhang iconfont"></span>
          {{ videoName }}
        </div>
      </div>
    </div>
  </a-modal>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs, inject } from "vue";
import { lookCourseResultApi, deleteVideoLogApi } from "../api";
import { useRoute } from "vue-router";
import Empty from "src/components/Empty.vue";
import page from "src/components/page/page.vue"
import { message, Modal } from "ant-design-vue";
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
    dataIndex: "course_result",
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
    page
  },
  setup() {
    const isDev = process.env.NODE_ENV == "development" ? true : false;
    const route = useRoute();
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

    const reactiveData = reactive({
      dataList: [],
      course_id: route.query.course_id as any as number,
      params: {
        page: 1,
        limit: 10,
      },
      total: 0,
      visible: false,
      videoUrl: "",
      videoName: "",
    });
    const method = {
      lookCourseResult() {
        lookCourseResultApi(reactiveData.params, {
          course_id: reactiveData.course_id,
        }).then((res: any) => {
          reactiveData.dataList = res.data.list;
          reactiveData.params.page = res.data.page.currentPage;
          reactiveData.params.limit = res.data.page.perPage;
          reactiveData.total = res.data.page.totalCount;
        });
      },
      rowKey(row: any) {
        return row.content_name + row.file_size;
      },
      pageChange(page: number, pageSize: number) {
        reactiveData.params.page = page;
        reactiveData.params.limit = pageSize;
        method.lookCourseResult();
      },
      actionLog(course_result: string) {
        reactiveData.visible = true;

        reactiveData.videoName = method.getVideoName(course_result);
        reactiveData.videoUrl = isDev
          ? "/proxyPrefix" + course_result
          : course_result;
      },
      clearVideoLog(id: number) {
        if (!id) {
          message.warn("请选择要删除的数据");
          return;
        }
        Modal.confirm({
          title: "提示",
          content: "确认删除该条数据吗？",
          onOk: () => {
            deleteVideoLogApi({ video_id: id }).then((res: any) => {
              message.success("删除成功");
              method.lookCourseResult();
            });
          },
        });
      },
      closeModal() {
        reactiveData.videoUrl = "";
        reactiveData.videoName = "";
        reactiveData.visible = false;
      },
      getVideoName(name: string) {
        const arr = name.split("/");
        return arr[arr.length - 1];
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
.a-course-result-wrap {
  .page-box {
    margin-top: 25px;
    text-align: center;
  }
}
.video-show-content {
  display: flex;
  flex-direction: row;
  background: #303030;
  .video-left {
    flex: 1;
    min-width: 0;
  }
  .video-right {
    width: 280px;
    flex-shrink: 0;
    padding: 30px 15px;
    .action-log-title {
      color: var(--white-100);
      font-size: 18px;
    }
    .video-item {
      color: var(--white-100);
      background: #194e6f;
      padding: 5px 15px;
      font-size: 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
