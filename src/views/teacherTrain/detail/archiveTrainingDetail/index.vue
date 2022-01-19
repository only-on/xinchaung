<template>
  <div class="archiveTrainingDetail">
    <div class="archiveHeader">
      <div class="search">
        <a-input class="searchInput" placeholder='学号' v-model:value="searchInfo.name" @keyup.enter="query">
           <template #prefix>
            <img src="src/assets/images/screenicon/Group7.png" />
            </template>
        </a-input>
        <a-input class="searchInput" placeholder='姓名' v-model:value="searchInfo.nick" @keyup.enter="query">
          <template #prefix>
            <img src="src/assets/images/screenicon/Group6.png" />
            </template>
        </a-input>
        <div v-if="role !== '2'">
          <a-input class="searchInput" placeholder='班级' v-model:value="searchInfo.class" @keyup.enter="query">
            <template #prefix>
            <img src="src/assets/images/screenicon/Group8.png" />
            </template>
          </a-input>
        </div>
        <a-button type="primary" class="search-btn" @click="query">查询</a-button>
        <a-button type="primary" @click="clear">清空</a-button>
      </div>
      <a-button v-if="role !== '2'" type="primary">导出成绩</a-button>
    </div>
    <evaluate-table
      :role="role"
      :tableList="tableList"
      :total="page.total"
      @pageChange="pageChange"
      :trainId="trainId"
    >
    </evaluate-table>
  </div>
</template>
<script lang="ts">
interface IsearchInfo {
  id: number;
  limit: number;
  page: number;
  withs: string;
  name: string;
  nick: string;
  class: string;
}
interface Ipage {
  page: number;
  pageSize: number;
  total: number;
}
interface Istate {
  searchInfo: IsearchInfo;
  tableList: any[];
  page: Ipage;
}
import { defineComponent, onMounted, reactive, toRefs, watch } from "vue";
import uploadImage from "../../components/uploadImage/uploadImage.vue";
import request from "src/api/index";
// import requestFile from 'src/api/modules/'
import { cloneDeep } from "lodash";
import evaluateTable from "../../evaluateComponent/evaluateTable.vue";
import { mapState } from "vuex";
export default defineComponent({
  name: "archiveTrainingDetail",
  props: ["propTrainDetailInfo", "trainId", "role"],
  components: { uploadImage, evaluateTable },
  setup(props, context) {
    const http = (request as any).teacherTrain;
    const state: Istate = reactive({
      searchInfo: {
        id: props.trainId,
        limit: 0,
        page: 0,
        withs: "user,userProfile",
        name: "",
        nick: "",
        class: "",
      },
      tableList: [],
      page: {
        page: 1,
        pageSize: 10,
        total: 0,
      },
    });
    const methods = {
      getResourceList() {
        http.assessmentList({ param: state.searchInfo }).then((res: any) => {
          console.log(res);
          state.tableList = res.data.list;
          state.page.total = res.data.page.totalCount;
        });
        console.log(state.searchInfo);
      },
      pageChange(page: number) {
        state.page.page = page;
        methods.getResourceList();
      },
      query() {
        methods.getResourceList();
      },
      clear() {
        state.searchInfo.name = "";
        state.searchInfo.nick = "";
        state.searchInfo.class = "";
        methods.getResourceList();
      },
    };
    onMounted(() => {
      methods.getResourceList();
    });
    return { ...toRefs(state), ...methods };
  },
});
</script>
<style lang="less" scoped>
.archiveTrainingDetail {
  .archiveHeader {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .search {
      display: flex;
    }
    .searchInput {
      width: 190px;
      margin-right: 20px;
    }
    .searchInput:nth-child(3) {
      margin-right: 20px;
    }
    .search-btn {
      margin-right: 20px;
      margin-left: 20px;
    }
  }
}
</style>
