<template>
  <a-modal
    :width="800"
    cancelText="关闭"
    title="成绩统计"
    :visible="props.modalVisable"
    @ok="handleOk"
    @cancel="handleCancel"
    :okButtonProps="okButtonProps"
  >
    <div class="achievement">
      <div class="header">
        <div class="headerLeft">
          <span>已提交<span class="number">{{statis.student_submitted_count}}</span>/{{statis.students_count}}人</span>
          <span>最高得<span class="number">{{statis.max_score}}</span>分</span>
          <span>最低得<span class="number">{{statis.min_score}}</span>分</span>
          <span>平均得<span class="number">{{statis.avg_score}}</span>分</span>
        </div>
        <div class="headerRight">
          <span>共 <span class="number">{{statis.questions_count}}</span>题</span>
          <span>总分 <span class="number">{{statis.scores}}</span>分</span>
        </div>
      </div>
      <a-spin :spinning="loading" size="large" tip="Loading...">
        <a-config-provider>
          <a-table :columns="columns" :data-source="data" 
            :pagination="
              tableData.total > 10
                ? {
                    hideOnSinglePage: false,
                    showSizeChanger: true,
                    total: tableData.total,
                    current: tableData.page,
                    pageSize: tableData.limit,
                    onChange: onChange,
                    onShowSizeChange: onShowSizeChange,
                  }
                : false
            "> 
            <template v-slot:bodyCell="{column,record}">
              <template v-if="column.dataIndex === 'score_total'">
                  <span v-if="record.score_total==null">--</span>
                  <span v-else>{{record.score_total}}</span>
              </template>
              <template v-if="column.dataIndex === 'wrong_answers_number'">
                  <span v-if="record.wrong_answers_number==null">--</span>
                  <span v-else>{{record.wrong_answers_number}}</span>
              </template>
            </template>
          </a-table>
          <template #renderEmpty>
            <div><Empty type="tableEmpty" /></div>
          </template>
        </a-config-provider>
      </a-spin>
    </div>
  </a-modal>
</template>
<script lang="ts" setup>
import { defineComponent, ref, toRef, inject, reactive, Ref, onMounted } from "vue";
import request from 'src/api/index'
const http = (request as any).teacherInclassTest;
const columns: any = ref("");
const data: any = ref("");
var loading: Ref<boolean> = ref(false);
const statis:any=ref('')
const tableData: any = reactive({
  total: 0,
  page: 1,
  limit: 10,
  selectedRowKeys:[]
});
columns.value = [
  { title: "学号", dataIndex: "username", key: "username" },
  {
    title: "姓名",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "班级",
    dataIndex: "class_name",
    key: "class_name",
  },
  {
    title: "成绩",
    key: "score_total",
    dataIndex: "score_total"
  },
  {
    title: "答错",
    key: "wrong_answers_number",
    dataIndex: "wrong_answers_number"
  },
];

data.value = [];
interface Props {
  modalVisable: boolean;
  experitId:any;
}
const props = withDefaults(defineProps<Props>(), {
  modalVisable: false,
  experitId:''
});
const formRef = ref<any>("null");
const emit = defineEmits<{ (e: "updateVisable", val: any,val1:any): void }>();
function updateVisable() {
  emit("updateVisable", false,false);
}
const okButtonProps: any = ref("");
okButtonProps.value = { style: { display: "none" } };
function handleOk() {
  updateVisable();
}
function handleCancel() {
  updateVisable();
}
function getStatisticGrands(){
  http.achiveStatistics({urlParams:{content_id:props.experitId}}).then((res:any)=>{
    statis.value=res.data;
  })
}
function getAchiveList(){
  loading.value = true;
  http.achivelist({urlParams:{content_id:props.experitId},param:{limit:tableData.limit,page:tableData.page}}).then((res:any)=>{
    data.value=res.data.list
    tableData.total=res.data.page.totalCount
    loading.value = false
  }).catch(()=>{
    loading.value = false
  })
}
function onChange(page: any, pageSize: any) {
  tableData.page=page
  getAchiveList()
}
function onShowSizeChange(current: any, size: any) {
  tableData.page=1
  tableData.limit=size
  getAchiveList()
}
onMounted(()=>{
  getStatisticGrands()
  getAchiveList()
})
</script>
<style lang="less" scoped>
.achievement {
  min-height: 400px;
  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    .headerLeft > span {
      margin-right: 10px;
    }
    .headerRight > span {
      margin-left: 10px;
    }
    .number {
      color: var(--primary-color);
    }
  }
  :deep(.ant-pagination){
    width: 100%;
    text-align: center;
  }
}
</style>
