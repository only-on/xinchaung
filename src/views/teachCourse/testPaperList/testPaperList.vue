<template>
  <div v-layout-bg style="height: 100%" class="test-paper-list">
    <div>
      <a-input-search
        placeholder="请输入测试卷名称"
        v-model:value="params.name"
        style="width: 767px; height: 40px; margin-bottom: 39px"
        @keyup.enter="searchCourseFUp"
        @search="searchCourseFUp"
      />
    </div>
    <template v-if="testPaperList.length > 0">
      <div class="card-box">
        <div class="card-item create-card">
          <div class="create-btn" @click="createExam">
            <span class="icon-chuangjian iconfont"></span>
            <span class="create-text">创建随堂测试题</span>
          </div>
        </div>
        <testpaper-card
          class="card-item"
          v-for="(item, index) in testPaperList"
          v-model:value="testPaperList[index]"
          :key="index"
          @selectStu="selectStu"
          @editTest="editTest"
          @deleteTest="deleteTest"
        ></testpaper-card>
      </div>
      <div class="page-box">
        <page
          v-model:current="params.page"
          v-model:pageSize="params.limit"
          :total="totalCount"
          :isShowNum="11"
          @change="pageChange"
        />
      </div>
    </template>
    <template v-else>
      <empty :text="emptyText" :type="'empty'" />
      <div style="text-align: center" v-if="emptyType==='empty'">
        <a-button @click="createExam" type="primary">创建试卷</a-button>
      </div>
    </template>
  </div>
  <a-modal
    :visible="stuModalVisiable"
    @cancel="cancelStuModal"
    @ok="okStuModal"
    :width="700"
  >
    <template #title>选学生</template>
    <div class="stu-no-choice">
      <div class="stu-left-choice">
        <div>
          <span
            >{{ selectedNoStuRowKeys.length }}/{{
              searchNoStudata.length
            }}</span
          >
          <span>学生列表</span>
        </div>
        <div>
          <a-input-search
            placeholder="请输入学号或者姓名"
            style="width: 100%"
            v-model:value="NameLeft"
            @search="searchStu('left')"
          />
        </div>
        <a-table
          class="stu-list-table scrollbar2"
          :row-selection="{
            selectedRowKeys: selectedNoStuRowKeys,
            onChange: onSelectNoStuChange,
          }"
          :columns="noStuColumns"
          :data-source="searchNoStudata"
          :rowKey="NoSturowKey"
          :pagination="false"
        />
      </div>
      <div class="stu-center-choice">
        <span
          class="icon iconfont icon-jiantou-copy-copy"
          :class="selectedNoStuRowKeys.length > 0 ? 'selected' : 'no-selected'"
          style="
            color: #000;
            font-size: 18px;
            line-height: 24px;
            text-align: center;
          "
          @click="removeStu('left')"
        ></span>
        <span
          class="iconfont icon-jiantou-copy"
          :class="selectedStuRowKeys.length > 0 ? 'selected' : 'no-selected'"
          style="
            color: #000;
            font-size: 18px;
            line-height: 24px;
            text-align: center;
          "
          @click="removeStu('right')"
        ></span>
      </div>
      <div class="stu-right-choice">
        <div>
          <span
            >{{ selectedStuRowKeys.length }}/{{ searchSelectData.length }}</span
          >
          <span>学生列表</span>
        </div>
        <div>
          <a-input-search
            placeholder="请输入学号或者姓名"
            style="width: 100%"
            v-model:value="NameRight"
            @search="searchStu('right')"
          />
        </div>
        <a-table
          class="stu-list-table scrollbar2"
          :row-selection="{
            selectedRowKeys: selectedStuRowKeys,
            onChange: onSelectStuChange,
          }"
          :columns="noStuColumns"
          :data-source="searchSelectData"
          :rowKey="NoSturowKey"
          :pagination="false"
        />
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, inject, ref, toRefs, reactive, onMounted, watch } from "vue";
import {
  getTestPaperListApi,
  getStudentListApi,
  updateStudentSelectApi,
  deleteFollowApi,
} from "./api";
import { useRoute, useRouter } from "vue-router";
import testPaperCard from "./testPaperCard.vue";
import _ from "lodash";
import { Modal, message } from "ant-design-vue";
import empty from "src/components/Empty.vue";
import page from "src/components/page/page.vue"

export default defineComponent({
  components: {
    "testpaper-card": testPaperCard,
    empty,
    page
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const course_id = route.query.course_id as any as number;
    var updata = inject("updataNav") as Function;
    const NoSturowKey = (row: any) => {
      return row.user_id + ",," + row.user_number + ",," + row.user_name;
    };
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
    const noStuColumns = [
      {
        title: "学号",
        dataIndex: "user_number",
      },
      {
        title: "姓名",
        dataIndex: "user_name",
      },
    ];
    onMounted(() => {
      init();
    });
    let paper_id = -1;
    const reactiveData = reactive({
      params: {
        page: 1,
        limit: 11,
        course_id: course_id,
        name: "",
        type:"test"
      },
      testPaperList: [],
      totalCount: 0,
      stuModalVisiable: false,
      pushData: [],
      noStudata: [],
      searchNoStudata: [],
      selectedNoStuRowKeys: [],
      selectedStuRowKeys: [],
      selectStuData: [],
      searchSelectData: [],
      NameLeft: "",
      NameRight: "",
      emptyText: "您还未创建随测，可点击下方按钮进行创建。",
      emptyType: "empty",
    });
    watch(()=>reactiveData.params.name,()=>{
      if (reactiveData.params.name) {
        reactiveData.emptyType="searchEmpty"
        reactiveData.emptyText="暂未搜到相关数据"
      }else{
        reactiveData.emptyType="empty"
        reactiveData.emptyText="您还未创建随测，可点击下方按钮进行创建。"
      }
    })
    function init() {
      reactiveData.params = {
        page: 1,
        limit: 11,
        course_id: course_id,
        name: "",
        type:"test"
      };
      getTestPaperList();
    }
    function getTestPaperList() {
      getTestPaperListApi(reactiveData.params).then((res: any) => {
        reactiveData.testPaperList = res.data.list;
        reactiveData.totalCount = res.data.page.totalCount;
      });
    }
    // 查询
    function searchCourseFUp() {
      reactiveData.params.page = 1;
      reactiveData.params.limit = 15;
      getTestPaperList();
    }

    // page发生变化时
    function pageChange(page: number, pageSize: number) {
      reactiveData.params.page = page;
      reactiveData.params.limit = pageSize;
      getTestPaperList();
    }

    // 打开选择学生modal
    function selectStu(id: number) {
      reactiveData.stuModalVisiable = true;
      paper_id = id;
      reactiveData.selectedNoStuRowKeys = [];
      reactiveData.selectedStuRowKeys = [];
      reactiveData.NameLeft = "";
      reactiveData.NameRight = "";
      getStudentList({ paper_id: id });
    }

    // 关闭选择学生modal
    function cancelStuModal() {
      reactiveData.stuModalVisiable = false;
    }
    // 确认学生modal
    function okStuModal() {
      let no_relation_student: any[] = [];
      let relation_student: any[] = [];
      reactiveData.searchNoStudata.forEach((item: any) => {
        no_relation_student.push(item.user_id);
      });
      reactiveData.searchSelectData.forEach((item: any) => {
        relation_student.push(item.user_id);
      });
      let params = {
        paper_id: paper_id,
        no_relation_student: no_relation_student.join(","),
        relation_student: relation_student.join(","),
      };
      updateStudentSelectApi(params).then(() => {
        reactiveData.stuModalVisiable = false;
      });
    }

    // 搜索未选择的学生
    function searchStu(type: string) {
      // 左边搜索
      if (type === "left") {
        (reactiveData.searchNoStudata as any) = _.filter(
          reactiveData.noStudata,
          (item: any) => {
            return (
              item.user_name.indexOf(reactiveData.NameLeft) >= 0 ||
              item.user_number.indexOf(reactiveData.NameLeft) >= 0
            );
          }
        );
      }
      // 右边搜索
      if (type === "right") {
        (reactiveData.searchSelectData as any) = _.filter(
          reactiveData.selectStuData,
          (item: any) => {
            return (
              item.user_name.indexOf(reactiveData.NameRight) >= 0 ||
              item.user_number.indexOf(reactiveData.NameRight) >= 0
            );
          }
        );
      }
    }

    // 选择学生
    function onSelectNoStuChange(selectedRowKeys: any) {
      reactiveData.selectedNoStuRowKeys = selectedRowKeys;
    }

    // 选择已选择学生
    function onSelectStuChange(selectedRowKeys: any) {
      reactiveData.selectedStuRowKeys = selectedRowKeys;
    }
    function getStudentList(params: { paper_id: number }) {
      getStudentListApi(params).then((res: any) => {
        reactiveData.noStudata = res.data.no_relation_student || [];
        reactiveData.searchNoStudata = res.data.no_relation_student || [];
        reactiveData.selectStuData = res.data.relation_student || [];
        reactiveData.searchSelectData = res.data.relation_student || [];
      });
    }
    // 移动
    function removeStu(type: string) {
      // 向右移动
      if (type === "left") {
        let userIdArry: any = [];
        reactiveData.selectedNoStuRowKeys.forEach((item: any) => {
          let arr = item.split(",,");
          userIdArry.push(arr[0]);
          let temp = {
            user_id: arr[0],
            user_name: arr[2],
            user_number: arr[1],
          };
          (reactiveData.searchSelectData as any).push(temp);
        });
        (reactiveData.searchNoStudata as any) = _.filter(
          reactiveData.searchNoStudata,
          (item: any) => {
            return !userIdArry.includes(item.user_id);
          }
        );
        reactiveData.selectedNoStuRowKeys = [];
      }
      // 向左移动
      if (type === "right") {
        let userIdArry: any = [];
        reactiveData.selectedStuRowKeys.forEach((item: any) => {
          let arr = item.split(",,");
          userIdArry.push(arr[0]);
          let temp = {
            user_id: arr[0],
            user_name: arr[2],
            user_number: arr[1],
          };
          (reactiveData.searchNoStudata as any).push(temp);
        });
        (reactiveData.searchSelectData as any) = _.filter(
          reactiveData.searchSelectData,
          (item: any) => {
            return !userIdArry.includes(item.user_id);
          }
        );
        reactiveData.selectedStuRowKeys = [];
      }
      reactiveData.noStudata = reactiveData.searchNoStudata;
      reactiveData.selectStuData = reactiveData.searchSelectData;
    }

    // 编辑
    function editTest(paper_id: number) {
      router.push({
        path: "/teacher/teacherCourse/createTestPaper",
        query: {
          paper_id: paper_id,
          course_id:course_id
        },
      });
    }
    // 删除
    function deleteTest(paper_id: number) {
      Modal.confirm({
        title: "删除测试卷",
        content: "你确定要删除当前试卷吗？",
        onOk() {
          deleteFollowApi({
            paper_id: paper_id,
          }).then((res: any) => {
            message.success("删除成功");
            init();
          });
        },
      });
    }
    function createExam() {
      router.push({
        path: "/teacher/teacherCourse/createTestPaper",
        query:{
          course_id:course_id
        }
      });
    }
    return {
      noStuColumns,
      ...toRefs(reactiveData),
      searchCourseFUp,
      pageChange,
      selectStu,
      cancelStuModal,
      okStuModal,
      searchStu,
      onSelectNoStuChange,
      NoSturowKey,
      onSelectStuChange,
      removeStu,
      editTest,
      deleteTest,
      createExam,
    };
  },
});
</script>

<style lang="less">
.test-paper-list {
  .card-box {
    display: flex;
    flex-wrap: wrap;
    .create-card {
      box-sizing: border-box;
      opacity: 1;
      background: var(--white-100);
      border-radius: 7px;
      box-shadow: 0 2px 4px 0 var(--black-0-7);
      border: 1px dashed var(--purpleblue-6);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .create-btn {
        color: var(--purpleblue-6);
        cursor: pointer;
        .iconfont {
          font-size: 70px;
          text-align: center;
          display: block;
        }
        .create-text {
          font-size: 20px;
          font-weight: 400;
        }
      }
    }
    .card-item {
      &:nth-child(4n + 1) {
        margin-right: 1.33333%;
      }
      &:nth-child(4n + 2) {
        margin-right: 1.33333%;
      }
      &:nth-child(4n + 3) {
        margin-right: 1.33333%;
      }
    }
  }
  .page-box {
    margin-top: 20px;
    text-align: center;
  }
}
.stu-no-choice {
  display: flex;
  justify-content: space-around;
  .stu-left-choice,
  .stu-right-choice {
    width: 45%;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 10px 15px;
    > div {
      &:nth-child(1) {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }
      &:nth-child(2) {
        margin: 15px 0;
      }
    }
  }
  .stu-center-choice {
    width: 10%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    > span {
      width: 36px;
      height: 30px;
      margin-top: 15px;
      &.selected {
        background: var(--purpleblue-6);
        pointer-events: all;
        cursor: pointer;
      }
      &.no-selected {
        background: #d9d9d9;
        pointer-events: none;
      }
    }
  }
  .stu-right-choice {
    width: 45%;
  }
  .stu-list-table {
    height: 334px;
    overflow-y: auto;
  }
}
</style>
