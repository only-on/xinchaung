<template>
  <div class="exam-content-box">
    <div class="search-box">
      <a-radio-group
        v-model:value="searchExamParams.status"
        button-style="solid"
        @change="typeChange"
      >
        <a-radio-button value=""> 全部 </a-radio-button>
        <a-radio-button value="1"> 进行时 </a-radio-button>
        <a-radio-button value="2"> 未开始 </a-radio-button>
        <a-radio-button value="3"> 已结束 </a-radio-button>
      </a-radio-group>
      <a-input-search
        placeholder="请输入考试名称关键搜索"
        size="small"
        v-model:value="searchExamParams.name"
        @search="onSearch"
      />
    </div>
    <div class="exam-content-list" v-if="examData?examData.list.length>0:[]">
      <div
        class="exam-content-item"
        v-for="(item, index) in examData?.list"
        :key="Number(index)"
      >
        <div class="exam-item-card">
          <div class="exam-card-head">
            <span class="card-item-header-title">{{ item.name }}</span>
            <span class="card-item-header-status" :class="item.status===1?'has-ing':'has-end'">{{
              examStatus(item.status)
            }}</span>
          </div>
          <div class="exam-card-content">
            <p>日期：{{ item.start_day?item.start_day:'' }}</p>
            <p>时间：{{ item?.times }}</p>
            <div class="exam-action-card">
              <router-link :to="'/studentExam/look?exam_id=' + item?.id"
                >查看成绩</router-link
              >
              <span class="teacher-name"
                ><i class="user-icon"></i>{{ item.teacher }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="page-box" v-if="examData&&examData.list.length>0">
      <a-pagination
        :total="examData?.page?.totalCount"
        v-model:current="searchExamParams.page"
        v-model:pageSize="searchExamParams.limit"
        @change="pageSizeChange"
      />
    </div>
    <div v-if="examData&&examData.list.length===0" style="margin-top:15px">
      <empty/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs, PropType, watch } from "vue";
import { IexamData, IExamListParams,IExamListParam } from "../studentExam.type";
import {examStatus} from "./exam.util"
import empty from "src/components/Empty.vue"

export default defineComponent({
  components:{
    'empty':empty
  },
  props: {
    examData: {
      type: Object as PropType<IexamData>,
      require: true,
    },
    params: {
      type: Object as PropType<IExamListParam>,
      require: false,
      default: () => {
        return {
          limit: 20,
          name: "",
          page: 1,
          status: "",
        };
      },
    },
  },
  setup(props, { emit }) {
    const visible = ref<boolean>(false);
    const examData:any = props.examData;
    const reactiveData = reactive({
      searchExamParams: props.params,
    });

    const showModal = () => {
      visible.value = true;
    };
    const closeModal = () => {
      visible.value = false;
    };

    function onSearch() {
      emit("search", reactiveData.searchExamParams);
    }

    function typeChange() {
      emit("search", reactiveData.searchExamParams);
    }

    function pageSizeChange() {
      emit("search", reactiveData.searchExamParams);
    }

    
    return {
      onSearch,
      visible,
      showModal,
      closeModal,
      ...toRefs(reactiveData),
      typeChange,
      pageSizeChange,
      examStatus
    };
  },
});
</script>


<style lang="less">
.exam-content-box {
  margin-top: 24px;
  .search-box {
    display: flex;
    flex-direction: row;
    .ant-radio-group {
    }
    .ant-input-search {
      margin-left: auto;
      width: 500px;
    }
  }
  .exam-content-list {
    display: flex;
    flex-wrap: wrap;
    > div {
      width: 33.33%;
      height: 205px;
      margin-top: 24px;
      &:nth-of-type(3n + 1) {
        padding-right: 20px;
      }
      &:nth-of-type(3n + 2) {
        padding-left: 10px;
        padding-right: 10px;
      }
      &:nth-of-type(3n + 3) {
        padding-left: 20px;
      }
      > div.exam-item-card {
        background: var(--white-100);
        height: 100%;
        box-shadow: 0px 1px 7px 1px var(--black-0-7);
        border-radius: var(--border-radius-default);
        display: flex;
        flex-direction: column;

        .exam-card-head {
          background: linear-gradient(310deg, rgba(rgba(var(--royalpurple-7),.2)), rgba(var(--primary-color),0.92));
          border-radius: var(--border-radius-default) var(--border-radius-default) 0px 0px;
          /* height: 54px; */
          line-height: 44px;
          padding: 0 16px;
          color: #fff;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-shrink: 0;
          .card-item-header-title {
            font-size: 18px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            cursor: default;
          }
          .card-item-header-status {
            font-size: 12px;
            height: 20px;
            line-height: 20px;
            border-radius: 8px;
            width: 62px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            cursor: default;
            text-align: center;
            &.has-end {
              background-color: rgba(185, 169, 199, 0.8);
              color: #e6e6e6;
            }
            &.has-ing {
              background-color: rgba(28,225,104, 0.8);
              color: #e6e6e6;
            }
          }
        }
        .exam-card-content {
          flex: 1;
          padding: 24px 16px 16px 16px;
          background-image: url("../../../assets/images/exam/exam-img.png");
          background-repeat: no-repeat;
          background-position: 95% center;
          .exam-action-card {
            margin-top: 20px;
            > a {
              color: var(--primary-color);
              font-size: 14px;
              margin-left: 20px;
            }
            .teacher-name {
              margin-left: 20px;
              color: rgba(#050101, 0.45);
              font-size: 14px;
              .user-icon {
                display: inline-block;
                background-image: url("../../../assets/images/exam/teacher.png");
                background-size: 100%;
                width: 24px;
                height: 24px;
                vertical-align: sub;
                margin-right: 3px;
              }
            }
          }
        }
      }
    }
  }
  .page-box {
    text-align: center;
    margin-top: 40px;
  }
}
</style>