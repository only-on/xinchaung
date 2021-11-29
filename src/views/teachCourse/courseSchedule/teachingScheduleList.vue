<template>
  <div class="teaching-schedule" v-layout-bg>
    <div class="header">
      <div class="left">
        <div class="change_title">
          <span>{{ changeMonth }}</span>
        </div>
        <a-button-group class="week-group" refs="week">
          <a-button class="change_btn btn-week-prev" @click="prevMonth">
            <span class="iconfont icon-chuansuojiantou-copy"></span>
          </a-button>
          <a-button class="change_btn btn-week-next" @click="nextMonth">
            <span class="iconfont icon-chuansuojiantou"></span>
          </a-button>
        </a-button-group>
        <div class="change_title1">
          <span>{{ changeWeek }}</span>
        </div>
        <a-button-group class="week-group" refs="week">
          <a-button class="change_btn1 btn-week-prev-week" @click="prevWeek">
            <span class="iconfont icon-chuansuojiantou-copy"></span>
          </a-button>
          <a-button class="change_btn1 btn-week-next-week" @click="nextWeek">
            <span class="iconfont icon-chuansuojiantou"></span>
          </a-button>
        </a-button-group>
      </div>
      <div class="center">
        今天：
        <span>{{ centerTime }}</span>
      </div>
      <div class="right">
        <a-button type="primary" @click="environmentalMonitoring" class="monitor">环境监控</a-button>
        <a-button
          type="primary"
          v-if="roleName() === 'admin' && dayTimes.length < 8"
          @click="addTimeSlot"
          class="addDate"
        >
          添加时间段
        </a-button>
      </div>
    </div>
    <div class="table">
      <a-row type="flex">
        <a-col class="table-td table-title flex-center" flex="100px" justify="center" align="center">
          <!-- <a-icon type="history" /> -->
        </a-col>
        <a-col
          class="table-td table-title flex-center"
          flex="auto"
          justify="center"
          align="top"
          v-for="(item, index) in tableWeekName"
          :key="item"
        >
          <div class="flex-center table-th">
            <span class="table-week-name">{{ item }}</span>
            <span class="table-week-date">{{ toDayList(index) }}</span>
          </div>
        </a-col>
      </a-row>
      <div class="table-content">
        <div class="table-time-col">
          <!-- <setting-time-modal ref="settingTime" /> -->
          <div
            class="table-time-list table-td flex-center"
            :class="{ 'table-time-hover': roleName() === 'admin' }"
            v-for="(item, index) in dayTimes"
            :key="item.id"
          >
            <div class="table-time-title flex-center" v-if="item.newTime">
              <div class="table-time-index flex-center">第{{ dateArr[index] }}节</div>
            </div>
            <div class="table-time-title flex-center" v-else>
              <div class="table-time-index flex-center">第{{ dateArr[index] }}节</div>
              <div class="table-time-value">{{ moment(item.start, 'HH:mm').format('HH:mm') }}</div>
              <div class="table-time-value">~</div>
              <div class="table-time-value">{{ moment(item.end, 'HH:mm').format('HH:mm') }}</div>
            </div>
            <div v-if="roleName() === 'admin'" class="table-time-operate flex-center">
              <span class="time-edit" @click="openSettingTimeModal(index)">编辑</span>
              <span class="time-delete" @click="deleteSettingTime(index)" v-if="dayTimes.length === index + 1">
                删除
              </span>
            </div>
          </div>
        </div>
        <a-row type="flex" class="table-body">
          <!-- <modal-confirm ref="modalConfirm" /> -->
          <a-col
            type="flex"
            class="table-col flex-center"
            v-for="(weekVal, weekKey, weekIndex) in tableList"
            flex="1"
            justify="center"
            align="top"
            :key="weekKey"
          >
            <div class="table-td flex-center" v-for="(classVal, classKey, classIndex) in weekVal" :key="classKey">
              <!-- 新增时间段 -->
              <div v-if="classVal.NoData" class="course-no-data flex-center"></div>
              <!-- 过期 -->
              <div v-else-if="compareTime(weekIndex, classIndex )" class="course-overdue flex-center">
                <div class="overdue-box"><div class="overdue"></div></div>
              </div>
              <!-- 管理端当前时间段 -->
              <div v-else-if="compareTime(weekIndex, classIndex, true)" class="current-box flex-center">
                <div class="flex-center top">
                  <div class="number">当前上课人数{{ classVal.total_students }}</div>
                </div>
                <div class="flex-center bottom">
                  <div class="number">自由学习人数{{ classVal.free_onlinenum }}</div>
                </div>
              </div>
              <!-- 有当前教师 -->
              <div v-else-if="classVal.belongs_to_currentteacher" class="teacher-current hover-edit teacher-no">
                <div class="edit-wrap flex-center">
                  <div class="course-name flex-center">{{ classVal.arrangements[0].course_name }}</div>
                  <div
                    class="teacher-operation top"
                    @click="editTeachingSchedule(classVal.arrangements[0].cid, classVal.arrangements[0].start)"
                  >
                    编辑预约
                  </div>
                  <div class="teacher-operation" @click="cancelScheduleConfirm(classVal.arrangements[0].cid)">
                    删除预约
                  </div>
                </div>
                <div class="course-name flex-center">{{ classVal.arrangements[0].course_name }}</div>
                <div class="teacher-course-info flex-center">
                  <div class="stu-number">
                    预约人数{{ classVal.arrangements[0].stu_num }}
                  </div>
                  <div v-if="Number(classVal.arrangements[0].week_recycle) === 1" class="circulate">
                    每周循环至
                    {{ classVal.arrangements[0].end }}
                  </div>
                </div>
              </div>
              <!-- 无当前教师 -->
              <div class="teacher-no flex-center" v-else-if="!classVal.belongs_to_currentteacher">
                <!-- 约满 -->
                <!-- <div v-if="classVal.full" class="course-full flex-center">已约满</div> -->
                <!-- 未约满      classVal.full则已约满  -->
                <div class="course-info flex-center">
                  <div class="course-info-title" :class="!classVal.full ? 'course-info-title-active' : ''">
                    剩余可约人数
                    <span>{{ classVal.left_stunum }}</span>
                  </div>
                  <!-- <div class="course-info-number"></div> -->
                  <div class="course-info-reserved">
                    <a-popover v-if="classVal.arrangements && classVal.arrangements.length">
                      <template v-slot:content>
                        <div v-for="(teaList, index) in classVal.arrangements" :key="index" class="teaList-item">
                          <span class="popover-name">{{ teaList.teacher_name }}</span>
                          <span>(已预约{{ teaList.stu_num }}人)</span>
                        </div>
                      </template>
                      <div>已预约{{ classVal.total_students }}人</div>
                    </a-popover>
                  </div>
                  <div
                    v-if="roleName() !== 'admin' && !classVal.full"
                    class="create-button flex-center"
                    @click="createTeachingSchedule(classVal.left_stunum, weekIndex, classIndex)"
                  >
                    <div>创建排课</div>
                  </div>
                </div>
              </div>
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
  <modal-confirm ref="modalConfirmRef" />
  <setting-time-modal ref="settingTimeModalRef" />
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs, onMounted, provide, inject, watch, nextTick, computed, } from 'vue'
import extStorage from "src/utils/extStorage";
import moment from 'moment'
import { MessageApi } from "ant-design-vue/lib/message";
import request from 'src/api/index'
import { IBusinessResp} from 'src/typings/fetch.d';
import { useRouter, useRoute } from 'vue-router'
import modalConfirm from 'src/components/modalConfirm/ModalConfirm.vue'
import settingTimeModal from './components/settingTimeModal.vue'

export default defineComponent({
  name: '',
  components: { modalConfirm, settingTimeModal },
  props: {},
  emit: [],
  setup() {
    let router = useRouter()
    let route = useRoute()
    var updata = inject("updataNav") as Function;
    updata({tabs:[],navPosition:'outside',navType:false,showContent:false,componenttype:undefined})
    const $message: MessageApi = inject("$message")!;
    const http=(request as any).teachCourse
    
    let weekTime = ref(moment())
    const changeWeek = computed(() => {
      var week = weekTime.value
      return week.format('第' + 'w' + '周')
    })
    const changeMonth = computed(() => {
      var week = weekTime.value
      return week.format('YYYY年MM月')
    })
    function prevWeek() {
      const date = moment(weekTime.value.add(-1, 'w'))
      weekTime.value = date
      getTimeTable(date.format('YYYY-MM-DD'))
    }
    function nextWeek() {
      const date = moment(weekTime.value.add(1, 'w'))
      weekTime.value = date
      getTimeTable(date.format('YYYY-MM-DD'))
    }
    function prevMonth() {
      const date = moment(weekTime.value.add(-1, 'M'))
      weekTime.value = date
      getTimeTable(date.format('YYYY-MM-DD'))
    }
    function nextMonth() {
      const date = moment(weekTime.value.add(1, 'M'))
      weekTime.value = date
      getTimeTable(date.format('YYYY-MM-DD'))
    }
    let isNewData = ref(false)
    // 添加时间段空行
    function addTimeSlot() {
      if (isNewData.value) {
        $message.warn('最多只能添加一条预留时间段', 2)
        return
      }
      dayTimes.push({
        start: '',
        end: '',
        newTime: true
      })
      for (const i in datas.tableList) {
        datas.tableList[i][dayTimes.length + 1] = {
          arrangements: [],
          belongs_to_currentteacher: false,
          free_onlinenum: 0,
          full: false,
          left_stunum: 0,
          total_students: 0,
          NoData: true
        }
      }

      isNewData.value = true
    }
    let dayTimes = reactive<IDaytime[]>([])
    function getLeftTime() {
      http.getLeftTime().then((res: IBusinessResp) => {
        dayTimes.length = 0
        if (res.code == 1) {
          // this.loading = true
          dayTimes.push(...res.data)
        } else {
          $message.warn(res.message)
        }
      })
      .catch((err: any) => {
        $message.error(err.message)
      })
    }
    onMounted(() => {
      getLeftTime()
      getTimeTable(moment(new Date()).format('YYYY-MM-DD'))
    })
    let datas = reactive<ITableList>({
      tableList: {}
    })
    function getTimeTable(data: string) {
      const param = {
        date: data,
      }
      datas.tableList = {}
      http.getTimeTable({param}).then((res: IBusinessResp) => {
        if (res.code === 1) {
          datas.tableList = res.data
        } else {
          $message.error(res.message)
        }
      })
      .catch((err: any) => {
        $message.error(err.message)
      })
    }
    let toDayTime = ref(moment())
    const mapperWeekDate = computed(() => {
      var weekDateMapper = []
      for (let i = 0; i < 7; i++) {
        weekDateMapper.push(moment(toDayTime.value.isoWeekday(i + 1)))
      }
      return weekDateMapper
    })
    function compareTime(weekIndex: number, classIndex: number, hasTime?: boolean) {
      const currentTimeYMD = mapperWeekDate.value[weekIndex].format('YYYY-MM-DD')
      const currentTimeHMS = dayTimes[classIndex].end + ':00'
      if (hasTime) {
        const currentTimeStart = dayTimes[classIndex].start + ':00'
        const currentTimeEnd = dayTimes[classIndex].end + ':00'
        const startUnix = moment(currentTimeYMD + ' ' + currentTimeStart, 'YYYY-MM-DD hh:mm:ss').unix()
        const endUnix = moment(currentTimeYMD + ' ' + currentTimeEnd, 'YYYY-MM-DD hh:mm:ss').unix()
        return startUnix < moment().unix() && moment().unix() < endUnix
      } else {
        return moment(currentTimeYMD + ' ' + currentTimeHMS, 'YYYY-MM-DD hh:mm:ss').unix() < moment().unix()
      }
    }
    // 环境监控
    function environmentalMonitoring() {
      router.push("/teacher/teacherCourse/teachingSchedule/scheduleCreate");
    }
    function toDayList(index: number) {
      return weekTime.value.isoWeekday(index + 1).format('MM.DD')
    }
    let settingTimeModalRef = ref()
    // 编辑时间
    function openSettingTimeModal(index: number, ) {
      settingTimeModalRef.value.showModal({
        dayTime: dayTimes[index], 
        index,
        id: dayTimes[index].id,
        callbackOk: () => {
          getLeftTime()
          getTimeTable(weekTime.value.format('YYYY-MM-DD'))
          isNewData.value = false
        }
      })
    }
    // 删除时间
    function deleteSettingTime(index: number) {
      // 清除新增时间段
      if (dayTimes[index].newTime) {
        isNewData.value = false
        dayTimes.splice(index, 1)
        for(const i in datas.tableList) {
          const dele = Object.keys(datas.tableList[i])
          delete datas.tableList[i][dele[index]]
        }
        return
      }
      modalConfirmRef.value.showModal({
        text: '您确定删除此时间段吗？',
        subText: '执行后无法恢复，请谨慎操作',
        callbackOk: () => {
          http.deleteTimeTable({
            param: {serial_number: dayTimes[index].serial_number}
          }).then((res: IBusinessResp) => {
            if (res.code == 1) {
              $message.success('时间段删除成功')
              getLeftTime()
              getTimeTable(weekTime.value.format('YYYY-MM-DD'))
            } else {
              $message.error(res.message)
            }
          })
        },
      })
    }
    // 编辑预约
    function editTeachingSchedule(id: number, date: string) {
      router.push({
        path: `/teacher/teacherCourse/teachingSchedule/scheduleEdit`,
        query: {id, date}
      })
    }
    let modalConfirmRef = ref()
    // 删除预约
    function cancelScheduleConfirm(id: number) {
      modalConfirmRef.value.showModal({
        text: '您确定要取消此项排课吗？',
        subText: '执行后无法恢复，请谨慎操作',
        callbackOk: () => {
          http.scheduleDelete({param: {id}}).then((res: IBusinessResp) => {
            if (res.code == 1) {
              getLeftTime()
              getTimeTable(weekTime.value.format('YYYY-MM-DD'))
            } else {
              $message.error(res.message)
            }
          })
        },
      })
    }
    // 创建排课
    function createTeachingSchedule(leftStuNum: number, weekIndex: number, classIndex: number) {
      // 创建排课页需要的参数
      const params = {
        leftStuNum: leftStuNum,
        week: weekIndex + 1, // 星期几
        classIndex: classIndex + 1, // 第几节课
        date: mapperWeekDate.value[weekIndex].format('YYYY-MM-DD'), // 日期
        time: dayTimes[classIndex].start + '~' + dayTimes[classIndex].end, // 开课时间1、开始时间，2、结束时间
      }
      router.push({
        path: '/teacher/teacherCourse/teachingSchedule/scheduleCreate',
        query: params,
      })
    }
    watch(
      () => weekTime.value,
      (newVal) => {
        toDayTime.value = newVal
      },
      {deep: true}
    )

    return {
      moment,
      roleName,
      dayTimes,
      dateArr,
      weekTime,
      changeWeek,
      changeMonth,
      prevWeek,
      nextWeek,
      prevMonth,
      nextMonth,
      environmentalMonitoring,
      addTimeSlot,
      centerTime: moment().format('YYYY年MM月DD日'),
      tableWeekName: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      toDayList,
      openSettingTimeModal,
      deleteSettingTime,
      ...toRefs(datas),
      compareTime,
      editTeachingSchedule,
      cancelScheduleConfirm,
      createTeachingSchedule,
      modalConfirmRef,
      settingTimeModalRef,
    }
  },
})
  // 处理权限
  function roleName() {
    // const role = localStorage.getItem('role')
    const { lStorage } = extStorage
    const role = lStorage.get('role')
    if (role) {
      if (role === 1) {
        return 'init'
      } else if (role === 3) {
        return 'teacher'
      } else if (role === 2) {
        return 'admin'
      }
    } else {
      return 'admin'
    }
  }
  let dateArr = [
    '一',
    '二',
    '三',
    '四',
    '五',
    '六',
    '七',
    '八',
    '九',
    '十',
    '十一',
    '十二',
    '十三',
    '十四',
    '十五',
    '十六',
    '十七',
    '十八',
    '十九',
    '二十',
  ]
  interface IArrangements {
    cid: number
    course_name: string
    teacher_name: string
    stu_num: number
    start: string
    end: string
    week_recycle: number
  }
  interface IApplications {
    [key: string]: {
      [key: string]: {
        arrangements: IArrangements[]
        belongs_to_currentteacher: boolean
        free_onlinenum: number
        full: boolean
        left_stunum: number
        total_students: number
        NoData: boolean
      }
    }
  }
  interface ITableList {
    tableList: IApplications
  }
  interface IDaytime {
    id?: number
    start?: string
    end?: string
    hover?: boolean,
    newTime?: boolean,
    serial_number?: number
  }
</script>

<style lang="less" scoped>
  .teaching-schedule {
    height: 100%;
    width: @center-width;
    margin: 0 auto;
    // display: flex;
    background-color: @white;
    border-radius: @border-radius-default;
    padding: 29px 37px;
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .change_title1{
        position: relative;
        left: 65px;
        font-size: 28px;
        font-weight: 600;
      }
      .left {
          // float: left;
        display: flex;
        align-items: center;
        .week-group {
            // padding-left: 20px;            
        }
        .ant-calendar-picker input {
          cursor: pointer;
        }
        .group-picker {
          width: 120px;
          z-index: 1;
          input {
            border-radius: 0;
            text-align: center;
          }
        }
        .ant-btn {
          padding: 0;
          width: 30px;
          .iconfont {
            font-size: 14px;
          }
        }
        .change_btn1{
          left: 65px;
          color: @theme-color;
          background-color: #e2dfff;
          border-radius: 50%;
          margin: 0 9px;
          line-height: 0;
          .anticon{
            line-height: 0;
          }
        }
        .change_btn1:hover{
          color: #fff;
          background-color: @theme-color;
        }
        .change_btn {
          color: @theme-color;
          background-color: #e2dfff;
          border-radius: 50%;
          margin: 0 9px;
          line-height: 0;
          .anticon{
              line-height: 0;
          }
        }
        .change_btn:hover {
          color: #fff;
          background-color: @theme-color;
        }
      }
      .right {
        // float: right;
        .ant-btn {
          text-shadow: none;
        }
        .monitor {
          color: @theme-color;
          background-color: #fff;
          padding: 0 5px;
        }
        .monitor:hover {
          color: #fff;
          background-color: @theme-color;
        }
        .addDate {
          margin-left: 20px;
          padding: 0 5px;
        }
      } 
      .change_title {
        font-size: 28px;
        font-weight: 600;
        color: #000;
      }
      .center {
        // position: absolute;
        // left: 0;
        // right: 0;
        // text-align: center;
        font-size: 24px;
        font-weight: 600;
        color: #000;
        // z-index: 1;
        // pointer-events: none;
        .week {
          padding-left: 20px;
        }
      }
    }
    .table {
      border: 1px solid #EDEDED;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      overflow: hidden;
      margin-top: 20px;
      .table-th {
        flex-direction: column;
        display: flex;
        justify-content: center;
        align-items: center;
        .table-week-name {
          // font-weight: 900;
          color: rgba(77, 77, 77, .45);
          font-size: 17px;
          // padding-right: 10px;
        }
        .table-week-date {
          font-weight: 900;
          font-size: 26px;
          color: #4D4D4D;
        }
      }
      .table-content {
        display: flex;
        height: 575px;
        overflow-y: auto;
        .table-body {
          width: 100%;
        }
        .table-col {
          .table-td{
            border-bottom: none;
          }
          .table-td {
            height: 150px;
            border: 1px solid #e1e1e1;
            &>div {
              width: 100%;
              height: 100%;
              display: flex;
              flex-direction: column;
            }
            .course-overdue {
              background: #fff;
              // color: #C7C7C7;
              .overdue-box {
                padding-top: 16px;
              }
              .overdue {
                width: 72px;
                height: 72px;
                background: url('src/assets/images/teacherSchedule/overdue.png') no-repeat;
                background-size: 100% 100%;
                margin-bottom: 16px;
              }
              .text {
                font-size: 24px;
                color: #000000;
                opacity: 0.1;
                font-size: 24px;
                font-weight: 700;
              }
            }
            .current-box {
              &>div {
                width: 100%;
                flex-direction: column;
                color: #fbd69d;
              }
              .top {
                height: 28px;
                background: #ff8f00;
                border-radius: 4px;
                background: #FF9D00;
                line-height: 28px;
                width: 90%;
                margin: 0 auto;
                margin-bottom: 10px;
                .number {
                  color: #fff;
                  font-size: 14px;
                  font-weight: 600;

                }
              }
              .bottom {
                height: 28px;
                background: #ff8f00;
                border-radius: 4px;
                background: #FF9D00;
                line-height: 28px;
                width: 90%;
                margin: 0 auto;
                margin-top: 10px;
                .number {
                  color: #fff;
                  font-size: 14px;
                  font-weight: 600;
                }
              }
            }
            .course-no-data {
              background: #ffffff;
            }
            .teacher-current {
              position: relative;
              .course-name {
                color: #828282;
              }
              .edit-wrap {
                position: absolute;
                display: none;
                width: 100%;
                height: 100%;
                flex-flow: column;
                // background: rgba(255, 156, 1, .8);
                background: #fff;
                color: #ccc;
                z-index: 1;
                font-size: 20px;
                cursor: pointer;
                .teacher-operation {
                  height: 28px;
                  line-height: 28px;
                  background: @theme-color;
                  border-radius: 4px;
                  color: #fff;
                  font-size: 14px;
                  width: 90%;
                  margin: 0 auto;
                  text-align: center;
                }
                .top {
                  margin: 4px 0 16px 0;
                }
              }
              .edit-wrap>*:hover {
                  // color: #FF7900;
              }
              &.hover-edit:hover .edit-wrap {
                display: flex;
                .anticon-delete {
                  margin-top: 15px;
                  font-size: 22px;
                }
                .teacher-course-info {
                  div::before {
                    left: 0;
                    background: #e1e1e1;
                  }
                }
              }
              &>div {
                height: 82%;
              }
              .course-name {
                font-size: 14px;
                // color: #FF9D00;
                text-align: center;
                // border-bottom: 1px solid #EDEDED;
                // padding: 10px;
                // align-items: end;
                overflow: hidden;
                word-break: break-all;
                display: flex;
                flex-direction: column;
                justify-content: center;
              }
              .teacher-course-info {
                // color: #1D91FF;
                color: rgb(5, 1, 1, .5);
                text-align: left;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                font-size: 12px;
                div {
                  position: relative;
                  margin: 10px 0;
                  padding:5.5px 0px 5.5px 14px;
                  width: 154px;
                  // height: 29px;
                  // opacity: 0.08;
                  background: rgba(185, 185, 185,.08);
                  color: rgba(5, 1, 1,.65);
                  border-left: 3px solid #b4b4b4;
                  border-radius: 0px 5px 5px 0px;
                }
              }
            }
            .teacher-no {
              position: relative;
              .teacher-list {
                position: absolute;
                bottom: 12px;
                .teacher-list-name {
                  border: 1px solid @theme-color;
                  color: @theme-color;
                  border-radius: 50%;
                  font-size: 14px;
                  width: 24px;
                  height: 24px;
                  text-align: center;
                  margin: 0 3px;
                  &.end {
                    background: @theme-color;
                    color: #fff;
                    line-height: 8px;
                    font-size: 22px;
                    overflow: hidden;
                  }
                }
              }
            }
            .course-full {
              background-image: repeating-linear-gradient(-45deg, #F7F7F7, #F7F7F7 15px, #fff 0, #fff 30px);
              color: #C7C7C7;
              font-size: 18px;
              width: 100%;
              height: 100%;
              display: flex;
              flex-direction: column;
            }
            .course-info {
              display: flex;
              flex-direction: column;
              text-align: center;
              color: @theme-color;
              // padding-bottom: 30px;
              padding-bottom: 0px;
              width: 100%;
              height: 100%;
              position: relative;
              // border: 1px solid #e1e1e1;
              &:hover .create-button {
                display: flex;
              }
              .create-button {
                // position: absolute;
                // width: 100px;
                // height: 100px;
                // border-radius: 50%;
                // background: #FF9D00;
                width: 100%;
                height: 100%;
                background-color: #fff;
                display: none;
                cursor: pointer;
                position: absolute;
                &>div {
                  color: #fff;
                  height: 28px;
                  line-height: 28px;
                  width: 90%;
                  margin: 0 auto;
                  background: @theme-color;
                  border-radius: 4px;
                }
              }
              .course-info-title {
                font-size: 14px;
                color: rgb(5, 1, 1, 0.35);
                margin: 0 auto;
                border-radius: 4px;
                padding: 4px 0px;
                margin-bottom: 16px;
                width: 92%;
                background-color: #F5F5F5;
              }
              .course-info-title-active {
                color: @theme-color;
                background-color: #F8EFFF;
              }
              .course-info-reserved {
                height: 28px;
                width: 100%;
                div {
                  background: #fff3e3;
                  border-radius: 4px;
                  line-height: 28px;
                  text-align: center;
                  width: 90%;
                  margin: 0 auto;
                  color: #FF8F00;
                  cursor: pointer;
                }
              }
              .teaList-item {
                padding: 10px 0;
              }
              .course-info-number {
                font-size: 50px;
                font-weight: 600;
                height: 60px;
                line-height: 60px;
              }
            }
          }
        }
      }
      &>div:first-child>.table-td {
        border-bottom: none;
      }
      .table-title {
        padding: 10px;
        background: #F7F7F7;
      }
      .table-time-col {
        width: 100px;
        min-width: 100px;
        display: flex;
        flex-direction: column;
        .table-time-list {
          transition: all .2s;
          flex: 1;
          min-height: 150px;
          border: 1px solid #ededed;
          &.table-time-hover:hover .table-time-title {
            display: none;
          }
          &.table-time-hover:hover .table-time-operate {
            display: flex;
            background-color: rgba(253,250,255,1);
          }
          .table-time-operate {
            width: 100%;
            height: 100%;
            display: flex;
            // color: #fff;
            cursor: pointer;
            font-size: 16px;
            // background: @theme-color;
            background-color: #fff;
            display: none;
            color: @theme-color;
            &>i:hover {
              color: darken(@theme-color, 15);
            }
            .time-delete {
              padding: 10px 0;
            }
            .anticon-delete {
              margin-top: 5px;
              font-size: 19px;
            }
          }
          &>div {
            flex-direction: column;
          }
          .table-time-index {
            // border-radius: 50%;
            // background-color: #ADADAD;
            color: rgb(80, 80, 80, .45);
            font-size: 14px;
            padding-bottom: 10px;
            // width: 20px;
            // height: 20px;
          }
          .table-time-value {
            color: #505050;
            font-size: 16px;
          }
        }
      }
      .table-col {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;

        .table-td {
          width: 100%;
        }
      }
    }
  }
  .flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
