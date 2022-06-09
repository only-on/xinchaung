<template>
  <div class="course-plan-wrap">
    <div class="c-p-header">
      <div class="top-left">
        <div class="top-left-time">
          <a-month-picker
          class="month-picker"
          placeholder="请选择月份"
          format="YYYY年MM月"
          :allowClear="false"
          v-model:value="weekTime"
          @change="monthChange"
        >
          <template #suffixIcon>
            <span>
              <span class="month-suffix-icon icon-zhankai iconfont"></span>
            </span>
          </template>
        </a-month-picker>
        <div class="week-picker">
          <span @click="pre" class="left-btn">&lt;</span>
          <span class="week">{{ changeWeek }}</span>
          <span @click="next" class="right-btn">></span>
        </div>
        </div>
        <div class="tipInfo" v-if="role!== 2"> <span class="icon iconfont icon-zhuyi"></span> 如有冲突可联系管理员</div>
      </div>
      <div class="course-plan-title">
        {{ moment(new Date()).format("YYYY年MM月DD日") }}
        {{ tableWeekName[new Date().getDay() - 1] }}
      </div>
      <div class="top-right">
        <a-button type="primary" @click="toEnvironmental">环境管理</a-button>
        <a-button type="primary" class="add-time-btn" v-if="role == 2&&dayTimes?.length<8" @click="addTimeSlot"
          >添加时间段</a-button
        >
      </div>
    </div>
    <div class="table">
      <a-row type="flex">
        <a-col
          class="table-td table-title flex-center"
          flex="100px"
          justify="center"
          align="center"
        >
          <span class="iconfont icon-shijian"></span>
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
            <span
              class="table-week-name"
              :class="
                currentDate.getFullYear() == new Date(weekTime).getFullYear() &&
                currentDate.getMonth() == new Date(weekTime).getMonth() &&
                toDayList(index) == moment(currentDate).format('MM.DD')
                  ? 'active'
                  : ''
              "
              >{{ item }}</span
            >
            <span class="table-week-date">{{ toDayList(index) }}</span>
          </div>
        </a-col>
      </a-row>
      <div class="table-main setscrollbar2">
        <div class="table-content">
          <div class="table-time-col">
            <!-- <setting-time-modal ref="settingTime" /> -->
            <div
              class="table-time-list table-td flex-center table-left"
              :class="{ 'table-time-hover': role == 2 }"
              v-for="(item, index) in dayTimes"
              :key="item.id"
            >
              <div class="table-time-title flex-center" v-if="item.newTime">
                <div class="table-time-index flex-center">
                  <i>{{ index + 1 }}</i>
                </div>
              </div>
              <div class="table-time-title flex-center" v-else>
                <div class="table-time-index flex-center">
                  <i>{{ index + 1 }}</i>
                </div>
                <div class="table-time-value">
                  {{ moment(item.start, "HH:mm").format("HH:mm") }}
                </div>
                <!-- <div class="table-time-value">~</div> -->
                <div class="table-time-value">
                  {{ moment(item.end, "HH:mm").format("HH:mm") }}
                </div>
              </div>
              <div v-if="role == 2" class="table-time-operate flex-center">
                <span class="time-edit" @click="openSettingTimeModal(index)">编辑</span>
                <span
                  class="time-delete"
                  @click="deleteSettingTime(index)"
                  v-if="dayTimes.length === index + 1"
                >
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
              v-for="(weekVal, weekKey, weekIndex) in datas.tableList"
              flex="1"
              justify="center"
              align="top"
              :key="weekKey"
            >
              <div
                class="table-td flex-center"
                v-for="(classVal, classKey, classIndex) in weekVal"
                :key="classKey"
              >
                <!-- 新增时间段 -->
                <div v-if="classVal.NoData" class="course-no-data flex-center"></div>
                <!-- 过期 -->
                <div
                  v-else-if="compareTime(weekIndex, classIndex)"
                  class="course-overdue flex-center"
                >
                  已过期
                  <!-- <div class="overdue-box"><div class="overdue"></div></div> -->
                </div>
                <!-- 管理端当前时间段 -->
                <div
                  v-else-if="compareTime(weekIndex, classIndex, true)"
                  class="current-box flex-center"
                >
                  <div class="flex-center top">
                    <div class="on-line-text">{{ classVal.total_students }}</div>
                    <div class="on-line-number">当前上课人数</div>
                  </div>
                  <div class="flex-center bottom">
                    <div class="on-line-text">{{ classVal.free_onlinenum }}</div>
                    <div class="on-line-number">自由学习人数</div>
                  </div>
                </div>
                <!-- 有当前教师 -->
                <div
                  v-else-if="classVal.belongs_to_currentteacher&&role!=2"
                  class="teacher-current hover-edit teacher-no"
                > 
                  <div class="edit-wrap flex-center">
                    <!-- <div class="course-name flex-center">
                      {{ classVal.arrangements[0].course_name }}
                    </div> -->
                    <!-- class="teacher-operation top" -->
                    <div
                      @click="
                        editTeachingSchedule(
                          classVal.arrangements[0].cid,
                          classVal.arrangements[0].start
                        )
                      "
                    >
                      编辑
                    </div>
                    <!-- class="teacher-operation" -->
                    <div
                      @click="cancelScheduleConfirm(classVal.arrangements[0].cid)"
                    >
                      删除
                    </div>
                  </div>
                  <div class="course-name flex-center">
                    {{ classVal.arrangements[0].course_name }}
                  </div>
                  <div class="teacher-course-info flex-center">
                    <div class="stu-number">
                      <div class="label">已预约人数</div>
                      <div class="number">{{ classVal.arrangements[0].stu_num }}</div>
                    </div>
                    <div
                      v-if="Number(classVal.arrangements[0].week_recycle) === 1"
                      class="circulate"
                    >
                      每周循环至
                      {{ classVal.arrangements[0].end }}
                    </div>
                  </div>
                </div>
                <!-- 无当前教师 -->
                <div class="teacher-no flex-center" v-else>
                  <!-- 约满 -->
                  <div v-if="classVal.full" class="course-full flex-center">
                    <div class="course-full-leave">
                      <div>已约满</div>
                      <div style="font-size: 12px">如有冲突可联系管理员</div>
                    </div>
                    <div v-if="role == 2" class="course-full-hover">
                      <div class="make-base-list">
                        <div
                          class="make-item-item"
                          v-for="(mit, aindex) in classVal.arrangements"
                        >
                          <span>{{ classVal.arrangements[aindex].teacher_name }}</span>
                          <span
                            >共预约{{ classVal.arrangements[aindex].stu_num }}人
                            <span class="edit-del-btn-wrap">
                              <i
                                @click="adminEdit(classVal.arrangements[aindex])"
                                class="icon-bianji iconfont"
                              ></i>
                              <i
                                @click="adminDel(classVal.arrangements[aindex])"
                                class="icon-shanchu iconfont"
                              ></i>
                            </span>
                          </span>
                        </div>
                      </div>
                      <div class="make-create-btn" @click="
                          createTeachingSchedule(
                            classVal.left_stunum,
                            weekIndex,
                            classIndex
                          )
                        ">创建排课</div>
                    </div>
                  </div>
                  <!-- 未约满      classVal.full则已约满  -->
                  <div v-else class="course-info flex-center">
                    <div class="make-statistics-wrap">
                      <template
                        v-if="
                          role != 2 &&
                          classVal.arrangements &&
                          classVal.arrangements.length
                        "
                      >
                        <!-- <div
                          v-for="(teaList, index) in classVal.arrangements"
                          :key="index"
                          class="teaList-item"
                        >
                          <span class="popover-name">{{ teaList.course_name }}</span>
                          <span class="teaList-item-text">已预约人数</span>
                          <span class="teaList-item-num">{{ teaList.stu_num }}</span>
                        </div> -->
                          <div
                          class="course-info-title"
                          :class="!classVal.full ? 'course-info-title-active' : ''"
                        >
                          <span class="course-info-text">剩余可约人数</span>
                          <span class="course-info-num">{{ classVal.left_stunum }}</span>
                        </div>
                      </template>
                      <div
                        v-else
                        class="course-info-title"
                        :class="!classVal.full ? 'course-info-title-active' : ''"
                      >
                        <span class="course-info-text">剩余可约人数</span>
                        <span class="course-info-num">{{ classVal.left_stunum }}</span>
                      </div>
                    </div>

                    <!-- <div class="course-info-number"></div> -->
                    <!-- <div class="course-info-reserved" v-if="classVal.arrangements && classVal.arrangements.length">
                      <a-popover
                        
                      >
                        <template v-slot:content> -->

                    <!-- </template>
                        <div>已预约{{ classVal.total_students }}人</div>
                      </a-popover> -->
                    <!-- </div> -->
                    <div
                      v-if="!classVal.full && role != 2"
                      class="create-button flex-center"
                    >
                      <div
                        class="create-btn"
                        @click="
                          createTeachingSchedule(
                            classVal.left_stunum,
                            weekIndex,
                            classIndex
                          )
                        "
                        v-if="!classVal.belongs_to_currentteacher"
                      >
                        创建排课
                      </div>
                      <div v-else class="edit-delete-wrap">
                        <span
                          @click="
                            editTeachingSchedule(
                              classVal.arrangements[0].cid,
                              classVal.arrangements[0].start
                            )
                          "
                          >编辑</span
                        >
                        <span @click="cancelScheduleConfirm(classVal.arrangements[0].cid)"
                          >删除</span
                        >
                      </div>
                    </div>
                    <div v-else class="course-make-wrap">
                      <div v-if="role == 2" class="course-full-hover">
                        <template v-if="classVal.arrangements.length > 0">
                          <div class="make-base-list">
                            <div
                              class="make-item-item"
                              v-for="(mit, aindex) in classVal.arrangements"
                            >
                            <div>
                              <span :title="classVal.arrangements[aindex].teacher_name" class="teacher_name">
                              {{classVal.arrangements[aindex].teacher_name}}
                              </span>
                            </div>
                             
                              <span
                                class='subscribe'
                                >共预约
                                {{ classVal.arrangements[aindex].stu_num }}人
                                <span class="edit-del-btn-wrap">
                                  <i
                                  v-if="classVal.arrangements[aindex].teacher_name=='管理员'"
                                    @click="adminEdit(classVal.arrangements[aindex])"
                                    class="icon-bianji iconfont"
                                  ></i>
                                  <i
                                    @click="adminDel(classVal.arrangements[aindex])"
                                    class="icon-shanchu admin-shanchu iconfont"
                                  ></i>
                                </span>
                              </span>
                            </div>
                          </div>
                          <!-- {{classVal.belongs_to_currentteacher}} -->
                          <div :class="classVal.belongs_to_currentteacher?'noclick':'make-create-btn'" 
                          @click="classVal.belongs_to_currentteacher?'':
                          createTeachingSchedule(
                            classVal.left_stunum,
                            weekIndex,
                            classIndex
                          )
                        ">创建排课</div>
                        </template>
                        <div v-else class="a-create-wrap">
                          <div class="make-create-btn" @click="
                          createTeachingSchedule(
                            classVal.left_stunum,
                            weekIndex,
                            classIndex
                          )
                        ">创建排课</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </a-col>
          </a-row>
        </div>
      </div>
    </div>
  </div>
  <setting-time-modal ref="settingTimeModalRef" />
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted, Ref, inject, computed, reactive, watch } from "vue";
import moment, { Moment } from "moment";
import request from "src/api/index";
import extStorage from "src/utils/extStorage";
import { message, Modal } from "ant-design-vue";
import { useRouter } from "vue-router";
import settingTimeModal from "./settingTimeModal.vue";

interface IArrangements {
  cid: number;
  course_name: string;
  teacher_name: string;
  stu_num: number;
  start: string;
  end: string;
  week_recycle: number;
}
interface IApplications {
  [key: string]: {
    [key: string]: {
      arrangements: IArrangements[];
      belongs_to_currentteacher: boolean;
      free_onlinenum: number;
      full: boolean;
      left_stunum: number;
      total_students: number;
      NoData: boolean;
    };
  };
}
interface ITableList {
  tableList: IApplications;
}
interface IDaytime {
  id?: number;
  start?: string;
  end?: string;
  hover?: boolean;
  newTime?: boolean;
  serial_number?: number;
}

// const role = window.XC_ROLE;
const { lStorage } = extStorage
const role = lStorage.get('role')

// 实例化请求
const http = (request as any).coursePlain;
const router = useRouter();
var updata = inject("updataNav") as Function;
updata({
  tabs: [{ name:role==3?"课程安排":"资源预约", componenttype: 0 }],
  // tabs: [],
  showContent: false,
  componenttype: undefined,
  showNav: false,
});

const dayTimes: Ref<any[]> = ref([]);
// top数据
// 初始表头数据
const tableWeekName: string[] = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
const dateArr: string[] = [
  "一",
  "二",
  "三",
  "四",
  "五",
  "六",
  "七",
  "八",
  "九",
  "十",
  "十一",
  "十二",
  "十三",
  "十四",
  "十五",
  "十六",
  "十七",
  "十八",
  "十九",
  "二十",
];

const settingTimeModalRef = ref();
const weekTime: Ref<any> = ref(moment(new Date(), "YYYY-MM"));
const isNewData: Ref<any> = ref(false);
let toDayTime = ref(moment());
const currentDate = new Date();
let datas = reactive<ITableList>({
  tableList: {},
});
const changeWeek = computed(() => {
  var week = weekTime.value;
  return week.format("第" + "w" + "周");
});
const mapperWeekDate = computed(() => {
  var weekDateMapper = [];
  for (let i = 0; i < 7; i++) {
    weekDateMapper.push(moment(toDayTime.value.isoWeekday(i + 1)));
  }
  return weekDateMapper;
});
watch(
  () => weekTime.value,
  (newVal) => {
    toDayTime.value = newVal;
  },
  { deep: true }
);
function getLeftTime() {
  dayTimes.value.length = 0;
  http.getLeftTime().then((res: any) => {
    // this.loading = true
    dayTimes.value.push(...res.data);
  });
}
function getTimeTable(data: string) {
  const param = {
    date: data,
  };
  // datas.tableList = {};
  // console.log("2222");

  http.getTimeTable({ param }).then((res: any) => {
    console.log(res);

    datas.tableList = res.data;
  });
}
function monthChange(date: Moment, dateString: string[]) {
  console.log(date, dateString);
  // const date = moment(weekTime.value.add(-1, "M"));
  // weekTime.value = date;
  getTimeTable(weekTime.value.format("YYYY-MM-DD"));
}

// 上一周
function pre() {
  const date = moment(weekTime.value.add(-1, "w"));
  weekTime.value = date;
  getTimeTable(date.format("YYYY-MM-DD"));
}
// 下一周
function next() {
  const date = moment(weekTime.value.add(1, "w"));
  weekTime.value = date;
  getTimeTable(date.format("YYYY-MM-DD"));
}
// 编辑时间
function openSettingTimeModal(index: number) {
  settingTimeModalRef.value.showModal({
    dayTime: dayTimes.value[index],
    index,
    id: dayTimes.value[index].id,
    callbackOk: () => {
      getLeftTime();
      getTimeTable(weekTime.value.format("YYYY-MM-DD"));
      isNewData.value = false;
    },
  });
}

// 删除时间
function deleteSettingTime(index: number) {
  // 清除新增时间段
  if (dayTimes.value[index].newTime) {
    isNewData.value = false;
    dayTimes.value.splice(index, 1);
    for (const i in datas.tableList) {
      const dele = Object.keys(datas.tableList[i]);
      delete datas.tableList[i][dele[index]];
    }
    return;
  }
  Modal.confirm({
    content: "您确定删除此时间段吗？执行后无法恢复，请谨慎操作",
    okText: "确定",
    cancelText: "取消",
    onOk: () => {
      http
        .deleteTimeTable({
          param: { serial_number: dayTimes.value[index].serial_number },
        })
        .then((res: any) => {
          message.success("时间段删除成功");
          getLeftTime();
          getTimeTable(weekTime.value.format("YYYY-MM-DD"));
        });
    },
  });
}
function compareTime(weekIndex: number, classIndex: number, hasTime?: boolean) {
  const currentTimeYMD = mapperWeekDate.value[weekIndex].format("YYYY-MM-DD");
  if (!dayTimes.value[classIndex]) {
    return;
  }
  const currentTimeHMS = dayTimes.value[classIndex].end + ":00";
  if (hasTime) {
    const currentTimeStart = dayTimes.value[classIndex].start + ":00";
    const currentTimeEnd = dayTimes.value[classIndex].end + ":00";
    const startUnix = moment(
      currentTimeYMD + " " + currentTimeStart,
      "YYYY-MM-DD hh:mm:ss"
    ).unix();
    const endUnix = moment(
      currentTimeYMD + " " + currentTimeEnd,
      "YYYY-MM-DD hh:mm:ss"
    ).unix();
    return startUnix < moment().unix() && moment().unix() < endUnix;
  } else {
    return (
      moment(currentTimeYMD + " " + currentTimeHMS, "YYYY-MM-DD hh:mm:ss").unix() <
      moment().unix()
    );
  }
}

// 创建排课
function createTeachingSchedule(
  leftStuNum: number,
  weekIndex: number,
  classIndex: number
) {
  console.log(dayTimes.value,dayTimes.value[classIndex])
  // 创建排课页需要的参数
  const params = {
    leftStuNum: leftStuNum,
    week: weekIndex + 1, // 星期几
    classIndex: classIndex + 1, // 第几节课
    date: mapperWeekDate.value[weekIndex].format("YYYY-MM-DD"), // 日期
    time: dayTimes.value[classIndex].start + "~" + dayTimes.value[classIndex].end, // 开课时间1、开始时间，2、结束时间
  };
  router.push({
    path: "/teacher/coursePlan/createCoursePlan",
    query: params,
  });
}
// 编辑预约
function editTeachingSchedule(id: number, date: string) {
  router.push({
    path: `/teacher/coursePlan/createCoursePlan?`,
    query: { id, date },
  });
}

// 删除预约
function cancelScheduleConfirm(id: number) {
  Modal.confirm({
    content: "您确定要取消此项排课吗？执行后无法恢复，请谨慎操作",
    okText: "确定",
    cancelText: "取消",
    onOk: () => {
      http.scheduleDelete({ param: { id } }).then((res: any) => {
        getLeftTime();
        getTimeTable(weekTime.value.format("YYYY-MM-DD"));
      });
    },
  });
}
function toDayList(index: number) {
  return weekTime.value.isoWeekday(index + 1).format("MM.DD");
}

// 管理员编辑
function adminEdit(val: any) {
  console.log("adminEdit", val);
  editTeachingSchedule(val?.cid,val?.start)
}
// 管理员删除
function adminDel(val: any) {
  console.log("adminDel", val);
  cancelScheduleConfirm(val?.cid)
}
// 添加时间段空行
function addTimeSlot() {
  if (isNewData.value) {
    message.warn("最多只能添加一条预留时间段", 2);
    return;
  }
  dayTimes.value.push({
    start: "",
    end: "",
    newTime: true,
  });
  for (const i in datas.tableList) {
    datas.tableList[i][dayTimes.value.length + 1] = {
      arrangements: [],
      belongs_to_currentteacher: false,
      free_onlinenum: 0,
      full: false,
      left_stunum: 0,
      total_students: 0,
      NoData: true,
    };
  }

  isNewData.value = true;
}
// 跳转环境管理页面
function toEnvironmental() {
  router.push({
    path: "/teacher/coursePlan/environmental",
  });
}
// 处理权限
function roleName() {
  // const role = localStorage.getItem('role')
  const { lStorage } = extStorage;
  const role = lStorage.get("role");
  if (role) {
    if (role === 1) {
      return "init";
    } else if (role === 3) {
      return "teacher";
    } else if (role === 2) {
      return "admin";
    }
  } else {
    return "admin";
  }
}
onMounted(() => {
  console.log(1111);
  getLeftTime();
  getTimeTable(moment(new Date()).format("YYYY-MM-DD"));
});
</script>

<style lang="less" scoped>
.course-plan-wrap {
  width: var(--center-width);
  margin: 32px auto;
  .table-left {
    display: flex;
    justify-content: center;
    align-items: center;
    .table-time-index {
      text-align: center;
    }
  }
}
.c-p-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .course-plan-title {
    font-size: 26px;
  }
  .top-left {
    // display: flex;
    align-items: center;
    >div:nth-child(1){
      display: flex;
      align-items: center;
    }
  }
}
.month-picker {
  width: 170px;
  display: inline-block;

  :deep(.ant-calendar-picker-input.ant-input) {
    word-spacing: 2px;
    letter-spacing: 2px;
    font-size: 20px !important;
  }
}
.month-suffix-icon {
  cursor: pointer;
}
.week-picker {
  width: 140px;
  height: 34px;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 18px;
  font-size: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 16px;
  .left-btn {
    margin-left: 15px;
    cursor: pointer;
  }
  .right-btn {
    margin-right: 15px;
    cursor: pointer;
  }
}
.table {
  border: 1px solid #ededed;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  // overflow: hidden;
  margin-top: 20px;
  .table-th {
    flex-direction: row;
    display: flex;
    justify-content: center;
    align-items: center;
    .table-week-name {
      // font-weight: 900;
      color: var(--black);
      font-size: 22px;
      // padding-right: 10px;
      &.active {
        color: var(--orangeyellow-6);
      }
    }
    .table-week-date {
      font-weight: 400;
      font-size: 14px;
      color: var(--black-45);
      margin-left: 14px;
    }
  }
  .table-main {
    // height: 575px;
    // overflow-y: auto
  }
  .table-content {
    display: flex;
    .table-body {
      width: 100%;
    }
    .table-col {
      .table-td {
        border-bottom: none;
      }
      .table-td {
        height: 150px;
        border: 1px solid #e1e1e1;
        & > div {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .course-overdue {
          display: flex;
          justify-content: center;
          align-items: center;
          background: var(--black-0-28);
          font-size: 20px;
          // color: #C7C7C7;
          color: var(--black-15);
          .overdue-box {
            padding-top: 16px;
          }
          .overdue {
            width: 72px;
            height: 72px;
            background: url("src/assets/images/teacherSchedule/overdue.png") no-repeat;
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
          display: flex;
          height: 100%;
          align-items: center;
          justify-content: center;
          padding: 8px 0;
          > div {
            display: flex;
            width: 100%;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: var(--black-0-28);
          }
          .on-line-text {
            font-size: 28px;
            color: var(--primary-color);
          }
          .on-line-number {
            font-size: 12px;
            color: var(--black-45);
          }
          .top {
            height: 50%;
            line-height: 28px;
            width: 90%;
            margin-bottom: 4px;
          }
          .bottom {
            height: 50%;
            line-height: 28px;
            width: 90%;
            margin-top: 4px;
          }
        }
        .course-no-data {
          background: var(--white-100);
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
            background: var(--primary-color);
            color: var(--white-100);
            z-index: 1;
            font-size:14px;
            cursor: pointer;
            text-align: center;
            padding:50px;
            .teacher-operation {
              height: 28px;
              line-height: 28px;
              background: var(--purpleblue-6);
              border-radius: 4px;
              color: var(--white-100);
              font-size: 14px;
              width: 90%;
              margin: 0 auto;
              text-align: center;
            }
            .top {
              margin: 4px 0 16px 0;
            }
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
          & > div {
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
            color: rgb(5, 1, 1, 0.5);
            text-align: left;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            font-size: 12px;
            .stu-number{
              width: 100%;
              text-align: center;
              color: var(--primary-color);
              .number{
                font-size:46px;
                font-weight: 500;
              }
            }
            // div {
            //   position: relative;
            //   margin: 10px 0;
            //   padding: 5.5px 0px 5.5px 14px;
            //   width: 154px;
            //   // height: 29px;
            //   // opacity: 0.08;
            //   background: rgba(185, 185, 185, 0.08);
            //   color: rgba(5, 1, 1, 0.65);
            //   border-left: 3px solid #b4b4b4;
            //   border-radius: 0px 5px 5px 0px;
            // }
          }
        }
        .teacher-no {
          position: relative;
          .teacher-list {
            position: absolute;
            bottom: 12px;
            .teacher-list-name {
              border: 1px solid var(--purpleblue-6);
              color: var(--purpleblue-6);
              border-radius: 50%;
              font-size: 14px;
              width: 24px;
              height: 24px;
              text-align: center;
              margin: 0 3px;
              &.end {
                background: var(--purpleblue-6);
                color: var(--white-100);
                line-height: 8px;
                font-size: 22px;
                overflow: hidden;
              }
            }
          }
        }
        .course-full {
          background-image: repeating-linear-gradient(
            -45deg,
            #f7f7f7,
            #f7f7f7 15px,
            var(--white-100) 0,
            var(--white-100) 30px
          );
          color: var(--black-15);
          font-size: 18px;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;

          .make-create-btn {
            width: 112px;
            height: 24px;
            background: #f5f5f5;
            border: 1px solid #d9d9d9;
            border-radius: 13px;
            text-align: center;
            line-height: 24px;
            margin: auto auto 10px auto;
            margin-top: auto;
            cursor: pointer;
          }
          .course-full-leave {
            text-align: center;
          }
          &:hover {
            background: white;
            .course-full-hover {
              display: flex;
            }
            .course-full-leave {
              display: none;
            }
          }
        }
        .course-info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          text-align: center;
          color: var(--purpleblue-6);
          // padding-bottom: 30px;
          padding-bottom: 0px;
          width: 100%;
          height: 100%;
          position: relative;
          // border: 1px solid #e1e1e1;
          &:hover .create-button {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          &:hover {
            .course-make-wrap {
              display: block;
              width: 100%;
              height: 100%;
            }
            .course-full-hover {
              display: flex;
              color: var(--black-45);
              .make-create-btn {
                width: 112px;
                height: 24px;
                background: var(--primary-color);
                border: 1px solid #d9d9d9;
                border-radius: 13px;
                text-align: center;
                line-height: 24px;
                margin: auto auto 10px auto;
                margin-top: auto;
                color: white;
                cursor: pointer;
              }
            }
            .make-statistics-wrap {
              display: none;
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
            // background-color: #f5f5f5;
            display: flex;
            flex-direction: column;
            .course-info-text {
              font-size: 12px;
              margin-bottom:20px;
            }
            .course-info-num {
              font-size: 50px;
              line-height: 1;
            }
          }
          .course-info-title-active {
            color: var(--brightBtn);
            // background-color: var(--purpleblue-1);
          }
          .course-info-reserved {
            height: 28px;
            width: 100%;
            div {
              background: var(--white-100);
              border-radius: 4px;
              line-height: 28px;
              text-align: center;
              width: 90%;
              margin: 0 auto;
              color: #ff8f00;
              cursor: pointer;
            }
          }
          .teaList-item {
            padding: 10px 0;
            display: flex;
            flex-direction: column;
            .popover-name {
              color: var(--black);
            }
            .teaList-item-text {
              font-size: 12px;
              color: var(--primary-color);
              margin-top: 16px;
            }
            .teaList-item-num {
              font-size: 44px;
              color: var(--primary-color);
              line-height: 1;
              margin-top: 4px;
            }
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
  & > div:first-child > .table-td {
    border-bottom: none;
  }
  .table-title {
    padding: 10px;
    background: #f7f7f7;
  }
  .table-time-col {
    width: 100px;
    min-width: 100px;
    display: flex;
    flex-direction: column;
    .table-time-list {
      transition: all 0.2s;
      flex: 1;
      min-height: 150px;
      border: 1px solid #ededed;
      &.table-time-hover:hover .table-time-title {
        display: none;
      }
      &.table-time-hover:hover .table-time-operate {
        display: flex;
        background-color: rgba(226, 223, 255, 0.2);
        justify-content: center;
        align-items: center;
      }
      .table-time-operate {
        width: 100%;
        height: 100%;
        display: flex;
        cursor: pointer;
        font-size: 16px;
        // background: var(--purpleblue-6);
        background-color: var(--white-100);
        display: none;
        color: var(--purpleblue-6);
        & > i:hover {
          color: rgba(var(--purpleblue-6), 0.15);
        }
        .time-delete {
          padding: 10px 0;
        }
        .anticon-delete {
          margin-top: 5px;
          font-size: 19px;
        }
      }
      & > div {
        flex-direction: column;
      }
      .table-time-index {
        // border-radius: 50%;
        // background-color: #ADADAD;
        color: rgb(80, 80, 80, 0.45);
        font-size: 14px;
        padding-bottom: 10px;
        // width: 20px;
        // height: 20px;
        i {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--black-15);
          display: inline-block;
          text-align: center;
          font-style: normal;
          line-height: 18px;
          color: white;
        }
      }
      .table-time-value {
        color: var(--black-25);
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
  .edit-delete-wrap {
    background: var(--primary-color);
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: white;
    > span {
      &:nth-child(1) {
        margin-bottom: 16px;
      }
    }
  }
  .course-full-hover {
    display: none;
    flex-direction: column;
    height: 100%;
    width: 100%;
    .make-base-list {
      // padding: 15px;
      font-size: 12px;
      width: 100%;
      margin-top: 10px;
      .make-item-item {
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: 0 10px;
        cursor: pointer;
        line-height: 20px;
        position: relative;
        .edit-del-btn-wrap {
          display: none;
          right: 10px;
        }
        &:hover {
          background: var(--black-15);
          .edit-del-btn-wrap {
            background: #d9d9d9;
            display: inline-block;
            position: absolute;
            color: var(--brightBtn);
            line-height: 22px;
            vertical-align: text-bottom;
            width:29px;
          }
        }
        > span {
          flex-wrap: nowrap;
          &:first-child {
            width: 40%;
            flex-wrap: nowrap;
            flex-shrink: 0;
          }
        }
      }
    }
  }
  .create-button {
    // position: absolute;
    // width: 100px;
    // height: 100px;
    // border-radius: 50%;
    // background: #FF9D00;
    width: 100%;
    height: 100%;
    background-color: #f2f2f2;
    display: none;
    cursor: pointer;
    position: absolute;
    & > div.create-btn {
      color: var(--white-100);
      height: 28px;
      line-height: 28px;
      width: 90%;
      margin: 0 auto;
      background: var(--primary-color);
      border-radius:20px;
    }
  }
  .a-create-wrap{
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    .make-create-btn{
      margin-top: inherit !important;
    }
  }
}
.add-time-btn{
  margin-left: 20px;
}
.circulate{
  width: 100%;
  text-align: center;
}
.subscribe{
  // margin-right: 20px;
}
.admin-shanchu{
  margin-left: 5px;
}
.noclick{
  cursor: not-allowed;
  color: #828282;
  width: 112px;
  height: 24px;
  background: #f5f5f5;
  border: 1px solid #d9d9d9;
  border-radius: 13px;
  text-align: center;
  line-height: 24px;
  margin: auto auto 10px auto;
  margin-top: auto;
}
.teacher_name{
  display: inline-block;
  width:70px;
  height: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tipInfo{
  width: 200px;
  height: 30px;
  line-height: 30px;
  font-size: 12px;
  color: var(--primary-color);
  .iconfont{
    font-size: 12px;
  }
}
</style>
