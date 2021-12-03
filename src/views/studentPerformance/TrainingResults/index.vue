<template>
  <div id="TrainingResults">
    <div class="searchInput">
      <a-input-search
        style="width: 503px; padding: 8px 5px 8px 30px"
        placeholder="请输入实训名称关键字查询"
        @keyup.enter="onSearch"
        @search="onSearch"
      />
    </div>
    <div v-if="traningResult.length" class="content-list">
      <div class="item-list" v-for="(item, i) in traningResult" :key="i">
        <div class="item-img">
          <img :src="item.url" />
        </div>
        <div class="item-info">
          <h3>{{ item.train.name }}</h3>
          <div>起止时间:{{ item.train.between_time }}</div>
          <div class="train-status">实训状态:{{ item.train.state }}</div>
          <div class="train-table">
            <a-table
              class="trainResultTable"
              :columns="columns"
              :data-source="[item]"
              :bordered="true"
              :pagination="false"
              rowKey="id"
            >
              <template #used_time="{ record }">
                <div v-if="record.is_release">{{ record.used_time }}</div>
                <div v-else>--</div>
              </template>
              <template #report="{ record }">
                <div @click="toLookResult(record.report, 'report')">查看</div>
              </template>
              <template #notes="{ record }">
                <div @click="toLookResult(record.notes, 'note')">查看</div>
              </template>
              <template #video="{ record }">
                <div @click="toLookResult(record.video, 'video')">查看</div>
              </template>
              <template #final_score="{ record }">
                <div v-if="record.is_release">{{ record.final_score }}</div>
                <div v-else>待教师评分</div>
              </template>
              <template #rank="{ record }">
                <div v-if="record.is_release">{{ record.rank }}</div>
                <div v-else>待教师评分</div>
              </template>
              <template #max_score="{ record }">
                <div v-if="record.is_release">{{ record.max_score }}</div>
                <div v-else>待教师评分</div>
              </template>
            </a-table>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="no-search-data">
      <div v-if="ifTip" class="loading">
        <a-spin tip="加载中...">
          <div class="spin-content"></div>
        </a-spin>
      </div>
      <empty v-else></empty>
    </div>
    <div>
      <a-modal
        :title="title"
        :footer="null"
        :visible="visableDetail"
        @ok="detailOk"
        @cancel="detailCancel"
      >
        <div>
          <component :is="componentName" :detailInfo="detailInfo"></component>
        </div>
      </a-modal>
    </div>
  </div>
</template>
<script lang="ts">
import { message } from "ant-design-vue";
import { defineComponent, onMounted, reactive, toRefs, Ref, ref } from "vue";
import request from "../../../api";
import Note from "../components/note.vue";
import Empty from "src/components/Empty.vue";
import Exper from "../components/exper.vue";
import Report from "../components/report.vue";
import Video from "../components/video.vue";
interface pageingType {
  currentPage?: number;
  pageCount?: number;
  perPage?: number;
  totalCount?: number;
}
interface paramsType {
  relate_id?: number;
  type: string;
  keyword?: string;
  limit?: number;
  page?: number;
}
interface State {
  traningResult: any[];
  pagingData: pageingType;
  columns: any[];
  ifTip: boolean;
  params: paramsType;
  title: string;
  componentName: any;
  detailInfo: any;
}
export default defineComponent({
  name: "TrainingResults",
  components: { Empty, Exper, Report, Video, Note },
  setup: () => {
    const infoRequest = (request as any).studentPerformance;
    var visableDetail: Ref<boolean> = ref(false);
    const state: State = reactive({
      traningResult: [],
      pagingData: {},
      columns: [
        {
          title: "花费时间",
          key: "used_time",
          dataIndex: "used_time",
          slots: { customRender: "used_time" },
        },
        {
          title: "实训报告",
          dataIndex: "report",
          slots: { customRender: "report" },
        },
        {
          title: "实训结果",
          dataIndex: "notes",
          slots: { customRender: "notes" },
        },
        {
          title: "操作视频",
          dataIndex: "video",
          slots: { customRender: "video" },
        },
        {
          title: "实训成绩",
          dataIndex: "final_score",
          slots: { customRender: "final_score" },
        },
        {
          title: "班级排名",
          dataIndex: "rank",
          slots: { customRender: "rank" },
        },
        {
          title: "班级最高分",
          dataIndex: "max_score",
          slots: { customRender: "max_score" },
        },
      ],
      ifTip: false,
      params: {
        type: "train",
      },
      title: "",
      componentName: "",
      detailInfo: "",
    });
    function getData(value?: any, ifSearch?: boolean) {
      state.ifTip = true;
      // infoRequest.trainingResults(ifSearch?{
      //    param:{keyword:value}
      // }:'')
      // .then((res:any)=>{
      // if(res.status==1){
      //     console.log(res.data)
      //     state.traningResult=res.data.list
      //     state.pagingData=res.data.page
      // }else{
      //         message.error(res.msg)
      //     }
      //   state.ifTip=false
      // })

      infoRequest.experimentalResults({ param: state.params }).then((res: any) => {
        state.ifTip = false;
        state.traningResult = res.data.list;
        state.pagingData = res.data.page;
      });
    }
    function onSearch(value: string) {
      state.params.keyword = value;
      getData(value, true);
    }
    function detailOk() {
      visableDetail.value = false;
    }
    function detailCancel() {
      visableDetail.value = false;
    }
    function toLookResult(data: any, type: any) {
      console.log(data, "data");
      if (data) {
        visableDetail.value = true;
        state.componentName = type;
        state.detailInfo = data;
        switch (type) {
          case "note":
            state.title = "实训结果";
            return;
          case "exper":
            state.title = "实验习题";
            return;
          case "video":
            state.title = "操作视频";
            return;
          case "report":
            state.title = "实验报告";
            return;
        }
      } else {
        switch (type) {
          case "exper":
            message.warning("实验习题为空！");
            return;
          case "video":
            message.warning("操作视频为空！");
            return;
          case "report":
            message.warning("暂无实验报告！");
            return;
          case "note":
            message.warning("暂无实训结果！");
            return;
        }
      }
    }
    function lookResult(id: any, type: any) {
      infoRequest.studentResults({ param: { id: id, type: type } }).then((res: any) => {
        console.log(res);
        if (res.data) {
          switch (type) {
            case "exper":
              state.title = "实验习题";
              return;
            case "video":
              state.title = "操作视频";
              return;
            case "report":
              state.title = "实验报告";
              return;
          }
          visableDetail.value = true;
          state.componentName = type;
          state.detailInfo = res.data;
        } else {
          switch (type) {
            case "exper":
              message.warning("实验习题为空！");
              return;
            case "video":
              message.warning("操作视频为空！");
              return;
            case "report":
              message.warning("暂无实验报告！");
              return;
          }
        }
      });
    }
    onMounted(() => {
      getData();
    });
    return {
      onSearch,
      ...toRefs(state),
      visableDetail,
      detailOk,
      detailCancel,
      lookResult,
      toLookResult,
    };
  },
});
</script>
<style lang="less">
#TrainingResults {
  font-size: 14px;
  .loading {
    padding: 245px;
  }
  .spin-content {
    padding: 30px;
  }
  .searchInput {
    height: 100px;
    line-height: 100px;
  }
  .content-list {
    padding: 14px;
    border-bottom: 1px solid #ddd;
    margin-bottom: 16px;
    background-color: white;
    .item-list {
      display: flex;
      padding: 14px;
      margin: 0 0 16px;
      .item-img {
        width: 290px;
        height: 168px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .item-info {
        margin-left: 30px;
        h3 {
          width: 800px;
          font-size: 16px;
          font-weight: 700;
          color: #333;
          cursor: pointer;
        }
        .train-status {
          margin-bottom: 15px;
        }
        .train-table {
          width: 800px;
        }
      }
    }
  }
  .trainResultTable {
    tr:nth-child(1) {
      td:nth-child(1) {
        color: black;
      }
      td:nth-child(2) {
        color: @theme-color;
      }
      td:nth-child(2):hover {
        color: #a86cdc;
      }
      td:nth-child(3) {
        color: @theme-color;
      }
      td:nth-child(3):hover {
        color: #a86cdc;
      }
      td:nth-child(4) {
        color: @theme-color;
      }
      td:nth-child(4):hover {
        color: #a86cdc;
      }
      td:nth-child(5) {
        color: red;
        font-weight: bold;
      }
      td:nth-child(6) {
        color: red;
        font-weight: bold;
      }
      td:nth-child(7) {
        color: red;
        font-weight: bold;
      }
    }
  }
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    padding: 8px;
    text-align: center;
    font-size: 14px;
  }
  .ant-table-thead > tr > th {
    background-color: #f6f0fa;
  }
  .ant-table-bordered .ant-table-thead > tr > th,
  .ant-table-bordered .ant-table-tbody > tr > td {
    border-right: 1px solid white;
  }
  .ant-table-thead
    > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)
    > td,
  .ant-table-tbody
    > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)
    > td,
  .ant-table-thead
    > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)
    > td,
  .ant-table-tbody
    > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)
    > td {
    background: white;
  }
}
</style>
