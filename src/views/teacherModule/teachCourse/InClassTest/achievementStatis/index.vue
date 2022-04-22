<template>
  <a-modal
    :width="700"
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
      <a-table :columns="columns" :data-source="data"> </a-table>
    </div>
  </a-modal>
</template>
<script lang="ts" setup>
import { defineComponent, ref, toRef, inject, reactive, toRefs, onMounted } from "vue";
import request from 'src/api/index'
const http = (request as any).teacherInclassTest;
const columns: any = ref("");
const data: any = ref("");
const statis:any=ref('')
columns.value = [
  { title: "学号", dataIndex: "username", key: "username" },
  {
    title: "姓名",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "班级",
    dataIndex: "classname",
    key: "classname",
  },
  {
    title: "成绩",
    key: "score_total",
    dataIndex: "score_total",
  },
  {
    title: "答错",
    key: "wrong_answers_number",
    dataIndex: "wrong_answers_number",
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
  http.achivelist({urlParams:{content_id:props.experitId}}).then((res:any)=>{
    data.value=res.data.list
  })
}
onMounted(()=>{
  getStatisticGrands()
  getAchiveList()
})
</script>
<style lang="less" scoped>
.achievement {
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
}
</style>
