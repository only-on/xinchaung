<template>
  <div>
    <common-card title="学生" :border="!isEdit" :showSymbol="true">
      <template #tip>
        <span class="totalInfo">(已选{{pageInfo.total}}人)</span>
      </template>
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
    <!-- 选择学生 :courseId='courseId'  -->
    <addstudent :visable='visable' :studentIds="studentIds" @updateSelectStuVisable="updateSelectStuVisable"></addstudent>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, watch } from "vue";
import CommonCard from "src/components/common/CommonCard.vue";
import Pagination from "src/components/Pagination.vue";
import addstudent from "./addStudent.vue";
import { message } from "ant-design-vue";
import request from 'src/api/index'
const httpExam = (request as any).teacherExamination;
interface Props {
  courseId:any;
  data?:any,
  isEdit?:boolean, // 编辑基本信息里面的
}
const props = withDefaults(defineProps<Props>(), {
  courseId: '',
  data: [],
  isEdit: false
})
const emit = defineEmits<{
  (e: "delete", val: any): void;
  (e: "update:pageInfo", val: any): void;
}>();
const visable = ref<boolean>(false)
var listData = reactive<any>([]); // 表格当前页展示的数据
var allData = reactive<any>([]); // 所有数据
const createChooseData = reactive<any>([]); // 创建的也就是详情返回的学生数据
const showBtn = ref<boolean>(true); // 关联课程则不显示操作按钮，没有关联则显示
const studentIds = reactive<any>([])
const pageInfo = reactive<any>({
  page: 1,
  size: 10,
  total: 0
})
const initialColumns = [
  {
    title: "账号",
    dataIndex: "username",
    key: "username",
    ellipsis: true
  },
  {
    title: "姓名",
    dataIndex: "name",
    key: "name",
    ellipsis: true
  },
  {
    title: "班级",
    dataIndex: "classname",
    key: "classname",
    ellipsis: true
  },
  {
    title: "年级",
    dataIndex: 'grade',
    key: "grade",
  },
  {
    title: "专业",
    dataIndex: "major",
    key: "major",
    ellipsis: true
  },
  {
    title: "学院",
    dataIndex: "department",
    key: "department",
    ellipsis: true
  },
  {
    title: "操作",
    dataIndex: "operation",
    key: "operation",
  }
];
const columns = ref(initialColumns)
const watchNum = ref<number>(0) // 课程id监测的次数
var selectIds = ref<any>([]); // 批量选中的id
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
  studentids.forEach((item:any,index:any) => {
    if (!studentIds.includes(item)) {
      studentIds.push(item)
      allData.push(studentInfo[index])
    }
  })
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
// 获取id
const getIds = (arr:any[]) => {
  if (!arr.length) return []
  return arr.map((item:any) => item.id)
}
const handleData = (sourceData:any[]) => {
  if (!sourceData) return
  allData.length = 0
  allData.push(...sourceData)
  studentIds.length = 0
  let allIds = getIds(sourceData)
  studentIds.push(...allIds)
}
// 关联课程,根据课程id查出课程下的学生
watch(()=>props.courseId, (newVal:any) => {
  columns.value = JSON.parse(JSON.stringify(initialColumns))
  if (newVal) {
    if (!props.isEdit) {
      columns.value.pop()
    }
    showBtn.value = false
    watchNum.value += 1
    httpExam.examsUserList({param:{course_id:newVal}}).then((res:any) => {
      handleData(res?.data.list)
      if (watchNum.value === 1) {
        createChooseData.length = 0
        let data = JSON.parse(JSON.stringify(res.data.list))
        Object.assign(createChooseData,data)
      }
    })
  } else {
    showBtn.value = true
    if (props.isEdit && createChooseData.length) {
      handleData(createChooseData)
    } else {
      // 新增时选择不关联课程，清空之前选择关联课程的学生
      handleData([])
    }
  }
  // 如果是 编辑考试/作业基本信息
  if (props.isEdit) {
    // 课程id为0无关联课程时，显示操作按钮和表格操作列
    if (!newVal) {
      showBtn.value = true
    } else {
      columns.value.pop()
    }
  }
},{deep:true})
// 打开弹框无关联课程时，编辑传入的数据
watch(()=>props.data, newVal => {
  if (newVal && !props.courseId) {
    handleData(newVal)
  }
},{deep:true,immediate:true})
// 监测数据处理分页
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
.totalInfo{
  color: var(--black-85);
  margin-left: -10px;
  font-size: 14px;
  ~span{
    font-size: 14px;
  }
}
</style>
