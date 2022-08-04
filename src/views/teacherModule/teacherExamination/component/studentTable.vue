<template>
  <common-card title="学生">
    <template #right>
      <a-button type="primary" v-if="showBtn" @click="batchDel">移除</a-button>
      <a-button type="primary" @click="handleSelect" :disabled="!showBtn">选择学生</a-button>
    </template>
    <template #content>
      <a-config-provider>
        <a-table
          :columns="columns"
          :data-source="listData"
          row-key="id"
          :row-selection="{ onChange: handleChange }"
          :pagination="false"
        >
          <template v-slot:bodyCell="{ column, record, index }">
            <template v-if="column.dataIndex === 'operation'">
              <a-button type="link" @click="handleDel(record, index)">移除</a-button>
            </template>
          </template>
        </a-table>
        <template #renderEmpty>
          <Empty type="tableEmpty" />
        </template>
      </a-config-provider>
      <Pagination
        v-model:page="pageInfo.page"
        v-model:size="pageInfo.size"
        :total="pageInfo.total"
        @page-change="getListData"
      />
    </template>
  </common-card>
  <!-- 选择学生 -->
  <addstudent :visable='visable' :courseId='500060' @updateSelectStuVisable="updateSelectStuVisable" :type="1"></addstudent>
</template>
<script lang="ts" setup>
import { ref, reactive, watch } from "vue";
import CommonCard from "src/components/common/CommonCard.vue";
import Pagination from "src/components/Pagination.vue";
import addstudent from "src/views/teacherModule/teachCourse/component/common/addStudent/index.vue";
import { message } from "ant-design-vue";

const props = defineProps({
  courseId: {
    required: false,
    default: ''
  }
});
const emit = defineEmits<{
  (e: "delete", val: any): void;
  (e: "update:pageInfo", val: any): void;
}>();
const visable = ref<boolean>(false)
var listData = reactive<any>([]); // 表格当前页展示的数据
var allData = reactive<any>([]); // 所有数据
const showBtn = ref<boolean>(false); // 关联课程则不显示操作按钮，没有关联则显示
const studentIds = reactive<any>([])
const pageInfo = reactive({
  page: 1,
  size: 10,
  total: 0
})
const columns = [
  {
    title: "账号",
    dataIndex: "username",
    key: "username",
  },
  {
    title: "姓名",
    dataIndex: ['user_profile', 'name'],
    key: "name",
  },
  {
    title: "班级",
    dataIndex: "classes",
    key: "classes",
  },
  {
    title: "年级",
    dataIndex: ['user_profile', 'grade'],
    key: "grade",
  },
  {
    title: "专业",
    dataIndex: ['user_profile', 'major'],
    key: "major",
  },
  {
    title: "学院",
    dataIndex: ['user_profile', 'department'],
    key: "department",
  },
  {
    title: "操作",
    dataIndex: "operation",
    key: "operation",
  },
];
var selectIds = ref<any>([]); // 批量选中的id
const tableTotal = ref();
// 处理分页数据
const getListData = () => {
  listData.length = 0;
  if (pageInfo.total === pageInfo.size){
    pageInfo.page = 1
  }
  let showData = allData.filter(
    (item: any, index: any) =>
      index < pageInfo.page * pageInfo.size &&
      index >= pageInfo.size * (pageInfo.page - 1)
  );
  listData.push(...showData)
};
const handleSelect= () => {
  visable.value = true
}
const updateSelectStuVisable = (value:any, studentids:any, studentInfo?:any) => {
  visable.value = false;
  if (studentInfo) {
    allData.push(...studentInfo)
    studentIds.push(...studentids)
  }
}
const handleChange = (selectedRowKeys: (string | number)[]) => {
  selectIds.value = selectedRowKeys;
};
const handlePage = (index: number) => {
  // 当前点击的下标
  let currentIndex = (pageInfo.page - 1) * pageInfo.size + index;
  // 当前页第一条数据的下标
  let startInedx = (pageInfo.page - 1) * pageInfo.size;
  // 当前点击的下标 === 表格的最后一条 并且是当前页的第一条
  if (
    currentIndex === pageInfo.total - 1 &&
    currentIndex === startInedx
  ) {
    return pageInfo.page === 1 ? 1 : pageInfo.page - 1;
  }
};
// 单个移除
const handleDel = (record: any, index: any) => {
  // 当前点击的下标
  if (handlePage(index)) {
    pageInfo.page = handlePage(index);
  }
  allData.forEach((item:any,index:any) => {
    if (item.id === record.id) {
      allData.splice(index,1)
      studentIds.splice(index,1)
    }
  })
};
// 批量删除
const batchDel = () => {
  if (!selectIds.value.length) {
    message.warning('请选择要移除的学生')
    return
  }
  selectIds.value.forEach((item:any) => {
    let idIndex = studentIds.indexOf(item)
    if (idIndex !== -1) {
      studentIds.splice(idIndex, 1)
      allData.splice(idIndex,1)
    }
  })
}
watch(()=>props.courseId, newVal => {
  console.log('courseId', newVal)
  if (newVal) {
    showBtn.value = false
  } else {
    showBtn.value = true
  }
},{immediate:true})
watch(()=>allData,newVal => {
  pageInfo.total = newVal.length
  getListData()
},{deep:true,immediate:true})

defineExpose({
  studentIds
})
</script>
<style lang="less" scoped>
.ant-table {
  .ant-btn {
    padding-left: 0;
  }
}
.ant-pagination{
  margin-top: 20px;
}
</style>
