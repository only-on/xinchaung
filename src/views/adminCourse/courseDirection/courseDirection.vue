<template>
  <div v-layout-bg class="a-course-direction-wrap">
    <div class="a-action-top">
      <label>课程方向：</label>
      <a-input class="course-direction-name" v-model:value="params.name" />
      <a-button type="primary" @click="searchData">查询</a-button>
      <a-button type="primary" @click="clearData">清空</a-button>
      <a-button type="primary" class="add-btn" @click="openAddModal"
        >添加</a-button
      >
    </div>
    <div>
      <a-config-provider>
        <a-table
          class="course-content-wrap"
          :columns="columns"
          :data-source="dataList"
          :pagination="false"
          :rowKey="rowKey"
        >
          <template #action="{ text }">
            <div class="action-table">
              <span
                class="iconfont icon-shanchu a-link"
                @click="deleteData(text)"
              ></span></div
          ></template>
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
  </div>
  <a-modal v-model:visible="visible" title="添加课程方向" @ok="handleOk">
      <div class="add-course-direction-modal">
          <label>课程方向：</label>
          <a-input v-model:value="name"/>
      </div>
  </a-modal>
</template>

<script lang="ts">
import { message } from "ant-design-vue";
import {
  defineComponent,
  inject,
  onMounted,
  reactive,
  toRefs,
} from "vue";
import { getCourseDirectionListApi,addCourseDirectionApi ,deleteCourseDirectionApi} from "../api";

const columns = [
  {
    title: "课程方向",
    dataIndex: "name",
    align: "center",
  },
  {
    title: "操作",
    dataIndex: "id",
    align: "center",
    slots: { title: "id", customRender: "action" },
  },
];
export default defineComponent({
  setup() {
    const reactiveData = reactive({
      params: {
        name: "",
        page: 1,
        limit: 10,
      },
      total: 0,
      dataList: [],
      visible:false,
      name:""
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
    const method = {
      getDataList() {
        let params = {
          "search[name]": reactiveData.params.name,
          page: reactiveData.params.page,
          limit: reactiveData.params.limit,
        };
        getCourseDirectionListApi(params).then((res: any) => {
          reactiveData.dataList = res.data.list;
          reactiveData.params.page = res.data.page.currentPage;
          reactiveData.params.limit = res.data.page.perPage;
          reactiveData.total = res.data.page.totalCount;
        });
      },
      rowKey(row: any) {
        return row.id;
      },
      deleteData(id: number) {
        if (!id) {
            return
        }
        deleteCourseDirectionApi({category_id:id}).then((res:any)=>{
            message.success("删除成功")
            method.getDataList();
        })
      },
      pageChange(page: number, pageSize: number) {
        reactiveData.params.page = page;
        reactiveData.params.limit = pageSize;
        method.getDataList();
      },
      searchData() {
        reactiveData.params.page = 1;
        reactiveData.params.limit = 10;
        method.getDataList();
      },
      clearData() {
        reactiveData.params.page = 1;
        reactiveData.params.limit = 10;
        reactiveData.params.name = "";
        method.getDataList();
      },
      openAddModal(){
          reactiveData.name=""
          reactiveData.visible=true
      },
      handleOk(){
          if (!reactiveData.name) {
              message.warn("请输入课程方向名称")
              return
          }
          addCourseDirectionApi({name:reactiveData.name}).then(()=>{
              message.success("新增成功")
              method.getDataList();
              reactiveData.visible=false
          })
      }
    };
    onMounted(() => {
      method.getDataList();
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
.a-course-direction-wrap {
  .a-action-top {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .course-direction-name {
      width: 200px;
    }
    > button {
      margin-left: 20px;
    }
    .add-btn {
      margin-left: auto;
    }
  }
  .page-box {
    text-align: center;
    margin-top: 20px;
  }
}
.add-course-direction-modal{
    display: flex;
    label{
        flex-shrink: 0;
    }
}
</style>
