<template>
  <div class="schedule-create" v-layout-bg>
    <a-form :model="form" ref="ruleForm" :rules="rule">
      <a-row>
        <a-col :span="18">
          <a-form-item
            label="预约课程名称："
            :label-col="{ span: 3 }"
            :wrapper-col="{ span: 14 }"
            name="course_name"
          >
            <a-input v-model:value="form.course_name" placeholder="请输入您预约的课程名称" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="`${checkDate ? 2 : 2}`" class="schedule-header-time-choose">
          <a-form-item name="week_recycle">
            <a-checkbox :checked="checkDate" @change="handleChangeWeekRecycle">每周循环</a-checkbox>
          </a-form-item>
        </a-col>
        <a-col span="22">
          <a-form-item
            v-if="checkDate"
            label="循环时段："
            :label-col="{ span: 2 }"
            :wrapper-col="{ span: 20 }"
            class="choose-date-picker"
            name="endDate"
          >
            <div class="dataBox">
              <a-date-picker format="YYYY-MM-DD" disabled :value="momentStartDate()" />
              <span class="division">～</span>
              <a-date-picker v-model:value="form.endDate" format="YYYY-MM-DD" :disabled-date="disabledDate" />
            </div>
          </a-form-item>
        </a-col>
      </a-row>
      <div class="listTitle">
        <div class="title flex_center">
          <h3 class="">排课成员列表</h3>
          <div class="addStudent">
            <a-button type="primary" @click="addStudentOrClass('student')">添加学生</a-button>
            <a-button type="primary" @click="addStudentOrClass('class')">添加班级</a-button>
          </div>
        </div>
        <div class="retain flex_center">
          <div class="divider-text-right">
            <span class="has-choose-text">已选<span>{{ selectedNumTextNew }}</span>人</span>
            <span class="choose-text">还可选<span>{{ leftStuNum ? leftNumText : '0' }}</span>人</span>
          </div>
          <a-form-item name="teacher_occupied">
            <a-checkbox
              :disabled="leftNumText === 0 && teacherOccupied === 0 ? true : false"
              v-model:checked="form.teacher_occupied"
              @change="handleChangeTeacherOccupied"
            >
              保留老师上课时可登录系统名额
            </a-checkbox>
            <span class="tips">注：保留后老师将占用一个授权名额</span>
          </a-form-item>
        </div>
      </div>
      <div class="table-content">
        <!-- <a-divider dashed /> -->
        <a-config-provider>
          <template #renderEmpty>
            <Empty type="tableEmpty" :height="200"></Empty>
          </template>
          <div class="schedule-main-content-table">
            <div class="schedule-main-content-table-title">
              <a-tabs v-model:activeKey="selectName" class="selectName">
                <a-tab-pane v-for="item in ['已选学生', '已选班级']" :key="item" :tab="item" />
              </a-tabs>
            </div>
            <a-table
              v-if="selectName === '已选班级'"
              rowKey="class_id"
              :columns="selectedClassesColumns"
              :data-source="selectedClassesData"
              :bordered="true"
              :pagination="false"
              size="middle"
              :scroll="{ y: 280 }"
            >
              <template v-slot:action="{record}">
                <a-popconfirm
                  v-if="selectedClassesData.length"
                  title="确定移除吗?"
                  @confirm="() => onDeleteClass(record.class_id)"
                >
                  <span class="iconfont icon-yichu"></span>
                </a-popconfirm>
              </template>
            </a-table>
            <a-table
              v-if="selectName === '已选学生'"
              rowKey="stu_id"
              :columns="selectedStudentsColumns"
              :data-source="selectedStudentsData"
              bordered
              :pagination="false"
              size="middle"
              :scroll="{ y: 280 }"
            >
              <template #action="{record}">
                <a-popconfirm
                  v-if="selectedStudentsData.length"
                  title="确定移除吗?"
                  @confirm="() => onDeleteStudent(record.stu_id)"
                >
                  <span class="iconfont icon-yichu"></span>
                </a-popconfirm>
              </template>
            </a-table>
          </div>
        </a-config-provider>
      </div>
      <a-form-item :wrapper-col="{ span: 6, offset: 10 }">
        <a-button type="primary" @click="handleReset">取消</a-button>
        <a-button type="primary" html-type="submit" @click="handleSubmit">保存</a-button>
      </a-form-item>
    </a-form>
  </div>
  <select-stu-class v-model:visible="visible" v-model:activeName="activeName"></select-stu-class>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs, onMounted, provide, inject, watch, nextTick, PropType, computed } from 'vue'
import moment, { Moment } from 'moment'
import { useRouter, useRoute } from 'vue-router'
import selectStuClass from './components/selectStuClass.vue'
import { MessageApi } from "ant-design-vue/lib/message";
import request from 'src/api/index'
import { IBusinessResp} from 'src/typings/fetch.d';

export default defineComponent({
  name: 'schedule-create',
  components: { selectStuClass },
  props: {},
  emit: [],
  setup() {
    const $message: MessageApi = inject("$message")!;
    const http=(request as any).teachCourse
    var updata = inject("updataNav") as Function;
    updata({tabs:[],navPosition:'outside',navType:false,showContent:false,componenttype:undefined})
    let router = useRouter()
    let route = useRoute()
    // let week: any = route.query.weekIndex
    let startDate: any = route.query.date
    let serialNumber: any = route.query.classIndex
    // let time: any = route.query.timeQuantum
    let {week, time} = route.query

    let checkDate = ref<boolean>(false)
    let form = reactive<IForm>({
      course_name: '',
      week_recycle: false,
      teacher_occupied: true,
      endDate: undefined
    })
    let ruleForm:any = ref(null)
    // 选中的学生和班级
    let selectedIds = reactive<ISelectedIds>({
      class: [],
      student: [],
    })

    let visible = ref(false)
    let activeName = ref('student')
    let selectName = ref('已选学生')
    let selectedClassesData = reactive<ITableList[]>([])  // 选择的班级
    let selectedStudentsData = reactive<ITableList[]>([])  // 选择的学生
    let teacherOccupied = ref(1)
    let leftStuNum = ref(route.query.leftStuNum)
    let selectedNum = ref(0)
    let {id, date} = route.query
    onMounted(() => {
      if (id) {
        getDetails()
      }
    })
    //获取详情
    function getDetails() {
      selectedClassesData.length = 0
      selectedStudentsData.length = 0
      const param = {
        id,
        date,
      }
      http.scheduleDetail({param})
        .then((res: IBusinessResp) => {
          const { data } = res
          startDate = data.start
          serialNumber = data.serial_number
          time = data.peroid_start + '~' + data.peroid_end
          checkDate.value = data.week_recycle === '1' ? true : false
          // selectedNum = data.stu_num
          leftStuNum.value = data.total_num

          const { detail } = data
          selectedClassesData.push(...detail['classes'])
          selectedStudentsData.push(...detail['users'])
          if (detail['classes'].length && !detail['users'].length) {
            selectName.value = '已选班级'
          }

          selectedIds['class'] = selectedClassesData.map((item: ITableList) => item.class_id)
          selectedIds['student'] = selectedStudentsData.map((item: ITableList) => item.stu_id)

          form.course_name = data.course_name
          form.week_recycle = data.week_recycle === '1' ? true : false
          form.endDate = moment(data.end)
          form.teacher_occupied = data.teacher_occupied === '1' ? true : false
          checkDate.value = data.week_recycle === '1' ? true : false
          teacherOccupied.value = form.teacher_occupied ? 1 : 0
        })
    }
    //校验排课学生和班级是否有交集
    function onCrossvalidation(data: any) {
      if (leftNumText.value === 0) {
        $message.warn('可选人数为0！')
        return false
      }
      let param
      const _data = data
      if (activeName.value == 'class') {
        if (data.stu_num > leftNumText.value) {
          $message.warn('当前资源紧张，无法进行预约！')
          return false
        }
        param = {
          classIds: [data.class_id],
          stuIds: selectedStudentsData.map((item: ITableList) => item.stu_id),
        }
      } else {
        param = {
          classIds: selectedClassesData.map((item: ITableList) => item.class_id),
          stuIds: [data.stu_id],
        }
      }
      http.classStuIntersect({param})
        .then((res: IBusinessResp) => {
          const { data } = res
          if (data.intersection === true) {
            /* 有交集 */
            if (activeName.value == 'class') {
              $message.warn(`该班级已经包含学生${data.intersect_stu},请取消对学生的选择`)
              return
            } else {
              $message.warn(`班级中已包含该学生${_data.name}`)
              return
            }
          } else {
            if (activeName.value == 'class') {
              selectedClassesData.unshift(_data)
              // setSelectClassIds(true, _data.class_id)
              selectedIds['class'].push(_data.class_id)
            } else {
              selectedStudentsData.unshift(_data)
              selectedIds['student'].push(_data.stu_id)
            }
          }
        })
    }
    provide('onCrossvalidation', onCrossvalidation)
    provide('selectedIds', selectedIds)

    // 添加学生/班级
    function addStudentOrClass(type: string) {
      visible.value = true
      activeName.value = type
      selectName.value = type === 'student' ? '已选学生' : '已选班级'
    }
    // 删除班级
    function onDeleteClass(id: number) {
      selectedClassesData.forEach((v, k) => {
        if (v.class_id === id) {
          selectedClassesData.splice(k, 1)
        }
      })
      selectedIds['class'].forEach((v, k) => {
        if (v === id) {
          selectedIds['class'].splice(k, 1)
        }
      })
    }
    // 删除学生
    function onDeleteStudent(id: number) {
      selectedStudentsData.forEach((v, k) => {
        if (v.stu_id === id) {
          selectedStudentsData.splice(k, 1)
        }
      })
      selectedIds['student'].forEach((v, k) => {
        if (v === id) {
          selectedIds['student'].splice(k, 1)
        }
      })
    }
    // 保存
    function handleSubmit () {
      ruleForm.value.validate().then(() => {
        if (selectedClassesData.length === 0 && selectedStudentsData.length === 0) {
          $message.warn('请选择班级或选择学生')
          return
        }
        let param = {
          courseName: form.course_name,
          endDate: checkDate.value ? form.endDate?.format('YYYY-MM-DD') : '',
          peroid: serialNumber,
          startDate: startDate,
          teacherOccupied: form.teacher_occupied ? 1 : 0,
          weekRecycle: checkDate.value ? 1 : 0,
          stuIds: selectedIds['student'],
          classIds: selectedIds['class'],
        }
        if (id !== 'undefined' && id) {
          http.scheduleUpdate({
            param: {params: Object.assign(param, {id})}
          }).then((res: IBusinessResp) => {
            $message.success('修改成功！')
            router.go(-1)
          })
          return
        }
        http.createSchedule({param: {params: param}}).then((res: IBusinessResp) => {
          $message.success('创建成功！')
          router.go(-1)
        })
      })
    }
    //取消
    function handleReset() {
      ruleForm.value.resetFields()
      router.go(-1)
    }
    let rule = {
      course_name: [{ validator: validateClassName, trigger: 'blur' }],
      endDate: [{ required: true, message: '请选择结束日期', trigger: 'change', type: 'object' }],
    }
    // 课程名称校验
    function validateClassName(rule: any, val: any, callback: any) {
      if (val.trim().length === 0 || !val) {
        return Promise.reject('请输入您预约的课程名称');
      }
      if (val.length > 12) {
        return Promise.reject('课程名称长度最多12个字')
      }
      return Promise.resolve();
    }
    function disabledDate(current: any) {
      return startDate && current && moment(current) < moment(startDate)
    }
    function momentStartDate() {
      return startDate ? moment(startDate) : ''
    }
    function handleChangeWeekRecycle(e: { target: { checked: any } }) {
      checkDate.value = e.target.checked
      form.week_recycle = e.target.checked
    }
    let selectedNumTextNew = computed(() => {
      let num = 0
      if (selectedClassesData.length > 0) {
        selectedClassesData.forEach((v: any) => {
          num += Number(v.stu_num)
        })
      }
      return num + Number(selectedStudentsData.length) + Number(teacherOccupied.value)
    })
    let leftNumText = computed(() => {
      return Number(leftStuNum.value) - Number(selectedNumTextNew.value) - Number(selectedNum.value)
    })
    function handleChangeTeacherOccupied(e: { target: { checked: any } }) {
      if (e.target.checked) {
        teacherOccupied.value = 1
      } else {
        teacherOccupied.value = 0
      }
    }
    return {
      ruleForm,
      form,
      rule,
      checkDate,
      disabledDate,
      momentStartDate,
      handleChangeWeekRecycle,
      handleSubmit,
      handleReset,
      visible,
      activeName,
      selectedClassesData,
      selectedStudentsData,
      selectName,
      selectedNumTextNew,
      leftNumText,
      leftStuNum,
      teacherOccupied,
      handleChangeTeacherOccupied,
      selectedClassesColumns,
      selectedStudentsColumns,
      onDeleteStudent,
      addStudentOrClass,
      onDeleteClass,
    }
  },
})
interface ITableList {
  class_id?: number
  stu_id?: number
  classname?: string
  stu_num?: number
  stu_no?: number
  name?: string
  sex?: string
  department?: string
  class_name?: string
}
const selectedClassesColumns = [
  {
    title: '班级名称',
    dataIndex: 'classname',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '人数',
    dataIndex: 'stu_num',
    align: 'center',
  },
  {
    title: '操作',
    // width: '20%',
    align: 'center',
    slots: { customRender: 'action' },
  },
]
const selectedStudentsColumns = [
  {
    title: '学号',
    dataIndex: 'stu_no',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '姓名',
    dataIndex: 'name',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '性别',
    dataIndex: 'sex',
    align: 'center',
  },
  {
    title: '院系',
    dataIndex: 'department',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '班级',
    dataIndex: 'class_name',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '操作',
    // width: '20%',
    align: 'center',
    slots: { customRender: 'action' },
  },
]
interface ISelectedIds {
  class: (number|undefined)[],
  student: (number|undefined)[],
}

interface IForm {
  course_name: string
  week_recycle: boolean
  teacher_occupied: boolean
  endDate: Moment | undefined
}
</script>

<style lang="less" scoped>
.ft14 {
  font-size: 14px;
}
.schedule-create {
  height: 100%;
  width: var(--center-width);
  margin: 0 auto;
  // display: flex;
  background-color: var(--white-100);
  border-radius: var(--border-radius-default);
  padding: 33px 40px;
  :deep(.ant-form) {
    .ant-form-item-label {
      text-align: left;
      & > label {
        // .ft14()
      }
    }
    label {
      // .ft14()
    }
    .ant-input {
      // .ft14()
    }
    .ant-btn {
      margin: 0 8px;
    }
  }
  .listTitle {
    .flex_center {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .title {
      padding: 20px;
      h3 {
        color: #050101;
        font-size: 18px;
        font-weight: 550;
        font-family: PingFang HK, PingFang HK-Medium;
        margin-left: -19px;
      }
    }
    .retain {
      padding: 0px 30px;
      background:rgba(var(--purpleblue-1), 0.2);
      border: 1px solid rgba(var(--purpleblue-6), 0.5);
      .ant-row {
        margin: 0;

      }
      .ant-form-item {
        padding: 8px 0;
      }
      .divider-text-right {
        font-size: 16px;
        .has-choose-text {
          padding-right: 20px;
          span {
            font-size: 18px;
            color: var(--purpleblue-6);
          }
        }
        .choose-text {
          span {
            font-size: 18px;
            color: var(--purpleblue-6);
          }
        }
      }
    }
    .tips {
      font-size: 14px;
      color: rgba(0,0,0,.65);
    }
  }
  .table-content {
    padding-bottom: 30px;
  }
  .schedule-main-content-table {
    .schedule-main-content-table-title {
      color: #333;
      padding: 26px 0 11px 0;
      .ant-tabs {
        height: 52px;
      }
    }
  }
  .choose-date-picker {
    .division {
      padding: 0 20px;
    }
  }
}
:deep(.ant-tabs-bar) {
  border-bottom: 1px solid #e8e8e8;
}
.table-border-color {
  border-color: #e8e8e8;
}
:deep(.ant-table) {
  .ant-table-header {
    overflow-y: hidden!important;
  }
  .ant-table-header > table {
    .table-border-color();
    .ant-table-thead>tr>th {
      .table-border-color();
      border-right: none;
      &:last-child {
        border-right: 1px solid #e8e8e8;
      }
    }
  }
  .ant-table-placeholder {
    .table-border-color();
    height: 280px;
  }
  .ant-table-body > table {
    .table-border-color();
    .ant-table-tbody > tr > td {
      .table-border-color();
    }
  }
  .ant-table-scroll {
    overflow: hidden;
  }
  &.ant-table-bordered.ant-table-fixed-header .ant-table-scroll .ant-table-header.ant-table-hide-scrollbar2 .ant-table-thead > tr:only-child > th:last-child {
    border-right: 1px solid #e8e8e8;
  }
  &.ant-table-fixed-header > .ant-table-content > .ant-table-scroll > .ant-table-body {
    overflow: auto!important;
  }
}
</style>
