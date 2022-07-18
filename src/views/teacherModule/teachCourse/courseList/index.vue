<template>
  <search-add
    @searchFn="searchFn"
    @handleMenuClick="handleMenuClick"
    :isShowAdd="isShowAdd"
    :isReset="resetKeyword"
  />
  <classify
    :list="currentTab === 1 ? publicClassifyList : classifyList"
    @change="classifyChange"
  />
  <a-spin :spinning="loading" size="large" tip="Loading...">
    <div class="flexCenter mainBox">
      <div
        class="itemBox"
        v-for="(v, k) in courseList"
        @click="courseDetail(v)"
        :key="v"
      >
        <div
          class="item"
          :class="[1, 2, 5, 6, 9, 10].includes(k) ? 'midItem' : ''"
        >
          <div class="coverBox">
            <div
              class="cover"
              :style="v.url ? `background-image: url(${v.url});` : ''"
            >
              <div class="top flexCenter">
                <div
                  v-if="currentTab === 0"
                  class="state"
                  :class="v.state == 3 ? 'state-ing' : ''"
                >
                  {{ `${["已结束", "未开始", "进行中"][v.state - 1]}` }}
                </div>
                <div v-if="currentTab === 1" class="flexCenter user">
                  <template v-if="v.is_authorized">
                    <span
                      class="img"
                      :style="`background-image: url(${v.portrait});`"
                    ></span>
                    <span
                      class="userName"
                      :title="v.is_init ? '系统内置' : v.profile_name"
                      >{{ v.is_init ? "系统内置" : v.profile_name }}</span
                    >
                  </template>
                  <template v-else>
                    <span class="">未授权</span>
                  </template>
                  <!-- // is_authorized -->
                </div>
              </div>
              <div class="tabBox" v-if="v.tags && v.tags.length">
                <!-- :style="`background-image: url(${v.avatar});`" -->
                <!-- <span>标签1/标签2/</span> -->
                <span class="single_ellipsis" :title='v.tags && v.tags.length ? `${v.tags.join(" / ")}` : ""'>{{
                  v.tags && v.tags.length ? `${v.tags.join(" / ")}` : ""
                }}</span>
              </div>
            </div>
          </div>
          <div class="info">
            <div class="name single_ellipsis" :title="v.name">{{ v.name }}</div>
            <div class="date flexCenter">
              <span class="single_ellipsis">实验:{{ v.content_total }}</span>
              <span class="single_ellipsis">课时:{{ v.class_total }}</span>
              <span class="single_ellipsis">
                <template v-if="currentTab === 0">
                  学生:{{ v.student_total }}
                </template>
              </span>
            </div>
            <div
              class="createDate flexCenter"
              v-if="currentTab === 0 && v.start_time && v.end_time"
            >
              <span
                >{{ v.start_time.split(" ")[0] }} -
                {{ v.end_time.split(" ")[0] }}</span
              >
            </div>
          </div>
          <!-- 遮罩 -->
          <div
            class="flexCenter Projection"
            v-if="currentTab === 0 || (currentTab === 1 && v.is_authorized)"
          >
            <span class="text" @click.stop="multiplexing(v)">复用</span>
            <span
              class="text"
              v-if="currentTab === 0 && v.state === 2"
              @click.stop="deleteFun(v)"
              >删除</span
            >
            <!-- <span class="text text2" v-if="currentTab === 0  && v.state===1" @click.stop="archives(v)">{{v.loading?'生成中。。。':'学情归档'}}</span> -->
            <a-button
              type="link"
              v-if="currentTab === 0 && v.state === 1"
              @click.stop="archives(v)"
              :loading="v.loading"
              >{{ v.loading ? "生成中..." : "学情归档" }}</a-button
            >
          </div>
        </div>
      </div>
      <div v-if="!courseList.length && !loading" class="kong">
        <Empty :type="EmptyType" :text="EmptyText" />
        <a-button
          v-if="EmptyText && currentTab === 0"
          type="primary"
          @click="handleMenuClick"
          >创建课程</a-button
        >
      </div>
      <a-pagination
        v-if="totalCount > 12"
        v-model:current="searchInfo.page"
        :pageSize="searchInfo.limit"
        :total="totalCount"
        @change="pageChange"
      />
    </div>
  </a-spin>

  <!-- <a-modal v-model:visible="Visible"  :title="`课程归档`" class="setupVisible" :width="490">
    <div class="title">课程已归档并为您导出了该课程归档数据文件</div>
    <div class="file">
      <span class="img" :style="`background-image: url(${getFileTypeIcon(activeCourse.name)});`"></span>
      <span>{{activeCourse.name}}</span>
    </div>
    <template #footer>
      <Submit @submit="Save" @cancel="cancel" :okText="'下载'"></Submit>
    </template>
  </a-modal> -->
  <a-drawer
    :title="'课程归档文件下载'"
    class="setupVisible"
    :destroyOnClose="true"
    :visible="Visible"
    width="640"
    @close="cancel"
  >
    <div class="fileList">
      <div class="file flexCenter">
        <div class="flexCenter">
          <span
            class="img"
            :style="`background-image: url(${getFileTypeIcon('test.xls')});`"
          ></span>
          <span>学生成绩.xls</span>
        </div>
        <a-button type="link" @click="Save('score')">下载</a-button>
      </div>
      <div class="file flexCenter">
        <div class="flexCenter">
          <span
            class="img"
            :style="`background-image: url(${getFileTypeIcon('zip')});`"
          ></span>
          <span>实验报告.zip</span>
        </div>
        <a-button type="link" @click="Save('report')">下载</a-button>
      </div>
      <div class="file flexCenter">
        <div class="flexCenter">
          <span
            class="img"
            :style="`background-image: url(${getFileTypeIcon('zip')});`"
          ></span>
          <span>学生录屏.zip</span>
        </div>
        <a-button type="link" @click="Save('video')">下载</a-button>
      </div>
      <div class="file flexCenter" v-show="false">
        <div class="title">学生录屏</div>
        <a-button type="link" @click="Save('video')">批量下载</a-button>
      </div>
    </div>
    <div class="tableContent" v-show="false">
      <a-spin :spinning="RecordingScreen.loading" size="large" tip="Loading...">
        <a-config-provider>
          <a-table
            :columns="columns"
            :data-source="RecordingScreen.list"
            :pagination="{
              hideOnSinglePage: false,
              total: RecordingScreen.total,
              pageSize: 10,
              current: RecordingScreen.page,
              onChange: onChange,
            }"
            :row-selection="{
              selectedRowKeys: RecordingScreen.selectedRowKeys,
              onChange: onSelectChange,
            }"
            rowKey="name"
          >
            <template #operation="{ record }">
              <a-button type="link" @click="Save('video', record)"
                >下载</a-button
              >
            </template>
          </a-table>
          <template #renderEmpty>
            <div><Empty type="tableEmpty" /></div>
          </template>
        </a-config-provider>
      </a-spin>
    </div>
  </a-drawer>
</template>

<script lang="ts" setup>
import Submit from "src/components/submit/index.vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import classify from "src/components/classify/index.vue";
import searchAdd from "src/components/searchAdd/searchAdd.vue";
import {
  defineComponent,
  ref,
  onMounted,
  reactive,
  Ref,
  inject,
  computed,
  toRefs,
  watch,
  defineExpose,
  createVNode,
} from "vue";
import { getFileType, getFileTypeIcon, readFile } from "src/utils/getFileType";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { Modal, message } from "ant-design-vue";
import { useRouter, useRoute } from "vue-router";
import { downloadUrl } from "src/utils/download";
const router = useRouter();
const env = process.env.NODE_ENV == "development" ? true : false;
const route = useRoute();
const http = (request as any).teachCourse;
var configuration: any = inject("configuration");
var updata = inject("updataNav") as Function;
updata({
  tabs: [
    { name: "我的教学", componenttype: 0 },
    { name: "公开课程", componenttype: 1 },
  ],
  showContent: true,
  componenttype: undefined,
  showNav: false,
});
interface ISearchInfo {
  is_public: number;
  name: string;
  limit: number;
  page: number;
}
var courseList: any[] = reactive([{ id: 1 }]);
var loading: Ref<boolean> = ref(false);
var totalCount: Ref<number> = ref(0);
const currentTab = ref<number>(0);
const isShowAdd = ref<boolean>(true);
const searchInfo = reactive<ISearchInfo>({
  is_public: 0,
  name: "",
  limit: 12,
  page: 1,
});
const resetKeyword = ref<boolean>(false);
watch(
  () => {
    return configuration.componenttype;
  },
  (val) => {
    // console.log(val)
    val = Number(val);
    currentTab.value = val;
    searchInfo.is_public = currentTab.value;
    searchInfo.page = 1;
    totalCount.value = 0;
    searchInfo.name = "";

    labelSearch.state = 0;
    labelSearch.year = 0;
    labelSearch.CourseDirection = 0;
    labelSearch.CareerDirection = 0;
    resetKeyword.value = !resetKeyword.value;

    classifyList.forEach((v: any) => {
      v.value = 0;
    });
    publicClassifyList.forEach((v: any) => {
      v.value = 0;
    });
    if (val === 1 || val === 0) {
      initData();
    }
    isShowAdd.value = val === 0;
    // console.log(isShowAdd.value)
  }
);
/**
 * 标签操作
 */
// let list1=
const classifyList: any = reactive([
  {
    title: "课程状态",
    value: 0,
    keyName: "state",
    data: [
      { name: "全部", value: 0 },
      { name: "未开始", value: 2 },
      { name: "进行中", value: 3 },
      { name: "已结束", value: 1 },
    ],
  },
  {
    title: "开课年份",
    value: 0,
    keyName: "year",
    data: [
      { name: "全部", value: 0 },
      // { name: "2022年", value: 1 },
      // { name: "2021年", value: 2 },
      // { name: "2019年", value: 3 },
      // { name: "2018年", value: 4 },
      // { name: "2017年", value: 5 },
      { name: "近5-10年", value: 6 },
      { name: "10年以前", value: 7 },
    ],
  },
]);
let data: any = new Date();
let couYear: number = data.getFullYear();
let arr: any = [];
for (let i = 0; i < 5; i++) {
  arr.push({ name: `${couYear - i}年`, value: `${i + 1}` });
}
classifyList[1].data.splice(1, 0, ...arr);
const publicClassifyList: any = reactive([
  {
    title: "课程方向",
    value: 0,
    keyName: "CourseDirection",
    data: [
      { name: "全部", value: 0 },
      // { name: "机器学习", value: 1 },
      // { name: "深度学习", value: 2 },
      // { name: "计算机学习", value: 3 },
    ],
  },
  {
    title: "职业方向",
    value: 0,
    keyName: "CareerDirection",
    data: [
      { name: "全部", value: 0 },
      // { name: "大数据工程师", value: 1 },
      // { name: "深度学习训练师", value: 2 },
      // { name: "视觉工程师", value: 3 },
    ],
  },
]);
const labelSearch: any = reactive({
  state: 0,
  year: 0,
  CourseDirection: 0,
  CareerDirection: 0,
});
const classifyChange = (obj: any) => {
  Object.assign(labelSearch, obj);
  searchInfo.page = 1;
  initData();
};
const searchFn = (key: string) => {
  searchInfo.name = key;
  searchInfo.page = 1;
  initData();
};
const EmptyType: any = computed(() => {
  let str = "";
  if (currentTab.value === 0) {
    if (
      labelSearch.state === 0 &&
      labelSearch.year === 0 &&
      searchInfo.name === ""
    ) {
      str = "empty";
    } else {
      str = "searchEmpty";
    }
  }
  if (currentTab.value === 1) {
    if (
      labelSearch.CourseDirection === 0 &&
      labelSearch.CareerDirection === 0 &&
      searchInfo.name === "" &&
      loading.value === false
    ) {
      str = "empty";
    } else {
      str = "searchEmpty";
    }
  }
  // console.log(str);
  return str;
});
const EmptyText = computed(() => {
  if (
    !courseList.length &&
    !loading.value &&
    EmptyType.value === "empty" &&
    currentTab.value === 0 &&
    loading.value === false
  ) {
    return "暂无课程，点击下方按钮创建课程吧！";
  } else {
    // return '抱歉暂未搜到相关数据'
    return "";
  }
});
const initData = () => {
  // return
  // const param = currentTab.value ? Object.assign({}, {...searchInfo}, {myexper: true}) : Object.assign({}, {...searchInfo})
  // const param: ISearchInfo = Object.assign({...labelSearch}, {...searchInfo})
  const param: any = {
    ...searchInfo,
    type: 1,
    state: labelSearch.state ? labelSearch.state : "",
    year: labelSearch.year ? labelSearch.year : "",
    tags: "",
  };
  if (searchInfo.is_public === 1) {
    // param.tags=[]
    let arr = [];
    labelSearch.CourseDirection ? arr.push(labelSearch.CourseDirection) : "";
    labelSearch.CareerDirection ? arr.push(labelSearch.CareerDirection) : "";
    param.tags = arr.join(",");
  }
  loading.value = true;
  courseList.length = 0;
  totalCount.value = 0;
  http
    .getCourseList({ param })
    .then((res: IBusinessResp) => {
      if (!res) return;
      const { list, page } = res.data;
      list.forEach((v: any) => {
        v.is_authorizedText = v.is_authorized ? "" : "Unauthorized";
      });
      courseList.push(...list);
      totalCount.value = page.totalCount;
      loading.value = false;
      // console.log(courseList);
    })
    .catch((err: any) => {
      loading.value = false;
    });
};
const pageChange = async (current: any, pageSize: any) => {
  searchInfo.page = current;
  const { query, path } = route;
  // await router.replace({
  //   path: path,
  //   query: { ...query, page: current },
  // });
  initData();
};
const handleMenuClick = ({ key }: { key: string }) => {
  // router.push("/teacher/teacherExperimentResourcePool/CreateExperiment?key="+key);
  router.push({
    path: "/teacher/teacherCourse/CreateCourse",
    query: { currentTab: 0 },
  });
};

const courseDetail = (val: any) => {
  router.push({
    path: "/teacher/teacherCourse/Detail",
    query: {
      currentTab: currentTab.value,
      courseId: val.id,
      is_authorizedText: val.is_authorizedText,
      // vvvvvvvvv
    },
  });
};
const deleteFun = (val: any) => {
  Modal.confirm({
    title: "确认删除吗？",
    icon: createVNode(ExclamationCircleOutlined),
    content: "删除后不可恢复",
    okText: "确认",
    cancelText: "取消",
    onOk() {
      http
        .deleteCourseItem({ urlParams: { courseId: val.id } })
        .then((res: any) => {
          message.success("删除成功"); //
          initData();
        });
    },
  });
};
const multiplexing = (val: any) => {
  router.push({
    path: "/teacher/teacherCourse/CreateCourse",
    query: { currentTab: 0, EditId: val.id }, // currentTab=0   为了让复用第二步 和创建时一致
    // query: { currentTab:currentTab.value,EditId:val.id}
  });
  // router.push({ path: "/teacher/teacherCourse/CreateCourse"});    //  courseCreate
};
// 归档
var Visible: Ref<boolean> = ref(false);
var activeCourse: any = reactive({
  name: "测试课程名称.xls",
});
const archives = (val: any) => {
  val.loading = true;
  http.Getarchives({ urlParams: { courseId: val.id } }).then((res: any) => {
    // RecordingScreen.downData
    let { data } = res;
    data.forEach((v: any) => {
      RecordingScreen.downData[v.export_type] = v;
    });
    // console.log(RecordingScreen)
    activeCourse.name = val.name;
    Visible.value = true;
    val.loading = false;
  });
};
const Save = (val: string, data?: any) => {
  // downloadUrl(url,activeCourse.name)
  let obj = RecordingScreen.downData[val];
  if (
    !obj ||
    (obj && (obj["status"] !== "finished" || obj["file_path"] === ""))
  ) {
    message.warning("暂无该数据");
    return;
  }
  if (obj["status"] === "finished" && obj["file_path"]) {
    let url = `${env ? "/proxyPrefix" : ""}${obj["file_path"]}`;
    downloadUrl(url, obj["fileName"]);
    // const a = document.createElement("a");
    // a.href = url;
    // a.download = obj['fileName'];
    // a.click();
  }
  // Visible.value=false
};
const cancel = () => {
  Visible.value = false;
};
// 课程归档
const columns = [
  {
    title: "实验名称",
    dataIndex: "name",
    align: "center",
  },
  {
    title: "操作",
    dataIndex: "operation",
    align: "center",
    slots: { customRender: "operation" },
  },
];
const RecordingScreen: any = reactive({
  downData: {},
  loading: false,
  limit: 10,
  page: 1,
  total: 0,
  list: [],
});
const GetRecordingScreen = () => {
  return;
  let obj = {
    ...RecordingScreen,
  };
  RecordingScreen.list.length = 0;
  RecordingScreen.loading = true;
  http.getAllCourseStudent({ param: { ...obj } }).then((res: any) => {
    let { list, page } = res.data;
    RecordingScreen.total = page.totalCount;
    RecordingScreen.list.push(...list);
    RecordingScreen.loading = false;
  });
};
const onSelectChange = (selectedRowKeys: any, selectedRows: any) => {
  RecordingScreen.selectedRowKeys = selectedRowKeys;
  // RecordingScreen.selectedRows = selectedRows;
};
const onChange = (page: any, pageSize: any) => {
  RecordingScreen.page = page;
  GetRecordingScreen();
};
onMounted(() => {
  if (!Number(route.query.currentTab)) {
    currentTab.value = 0;
    configuration.componenttype = 0;
  } else {
    currentTab.value = 1;
    configuration.componenttype = 1;
  }
  searchInfo.is_public = currentTab.value;
  http.courseCategory().then((res: IBusinessResp) => {
    const { data } = res;
    data.map((v: any) => {
      v.value = v.name;
    });
    publicClassifyList[0].data.push(...data);
  });
  http.vocationDirection().then((res: IBusinessResp) => {
    const { data } = res;
    data.map((v: any) => {
      v.value = v.name;
    });
    publicClassifyList[1].data.push(...data);
  });
  initData();
});
</script>
<style scoped lang="less">
.mainBox {
  flex-wrap: wrap;
  .itemBox{
    
    &:not(:nth-of-type(4n)){
      .item{
        margin-right: 12px;
      }
    }
    &:nth-of-type(4n){
      .item{
        margin-left: 12px;
      }
    }
  }
  .item {
    cursor: pointer;
    width: 282px;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 2rem;
    box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.07);
    border-radius: 6px;
    background-color: #fff;
    position: relative;
    .coverBox {
      position: relative;
      //  cursor: pointer;
      width: 282px;
      height: 150px;
      border-radius: 6px 6px 0 0;
      .cover {
        border-radius: 6px 6px 0 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;
        height: 100%;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-image: url(src/assets/images/teacherCourse/defaultCover.jpg);
        .top {
          .state {
            background-color: rgba(0, 0, 0, 0.5);
            color: var(--white-70);
            padding: 3px 14px;
            // opacity: .5;
            &.state-ing {
              color: #37e6ae;
              // opacity: 1;
            }
          }
          .user {
            padding: 3px 10px 3px 3px;
            border-top-left-radius: 6px;
            border-bottom-right-radius: 6px;
            color: var(--white);
            background-color: rgba(0, 0, 0, 0.5);
            justify-content: center;
            .img {
              width: 20px;
              height: 20px;
              border-radius: 50%;
              // src/assets/images/admin/home/env3.png
              background-image: url("src/assets/images/user/teacher.png");
              background-size: 100% 100%;
              background-repeat: no-repeat;
              margin: 0 6px;
              &.initImg {
                background-image: url("src/assets/images/admin/home/env3.png");
              }
            }
            .userName {
              flex: 1;
              text-align: center;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }
        .tabBox {
          background-color: rgba(0, 0, 0, 0.5);
          span {
            display: inline-block;
            color: var(--white-85);
            padding: 1px 6px;
          }
        }
      }
    }
    .info {
      padding: 0 10px;
      .name {
        color: var(--black-85);
        font-size: 16px;
        padding: 10px 0;
      }
      .date {
        padding-bottom: 10px;
        justify-content: space-between;
        span {
          color: var(--black-45);
          // padding-right: 2rem;
        }
      }
      .createDate {
        border-top: 1px solid #f0f0f0;
        height: 44px;
        line-height: 44px;
        color: var(--black-45);
        justify-content: space-between;
      }
    }

    .Projection {
      flex-direction: column;
      justify-content: center;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      transition: 0.3s;
      transform: rotateY(90deg);
      background: rgba(0, 0, 0, 0.7);
      border-radius: 6px 6px 0px 0px;
      .text,
      .ant-btn-link {
        color: var(--white);
        padding: 10px 14px;
      }
      .text:hover,
      .ant-btn-link:hover {
        color: var(--primary-color);
      }
      .ant-btn-loading {
        color: var(--primary-color);
      }
    }
    &:hover {
      .Projection {
        transform: rotateY(0deg);
      }
    }
  }
  .midItem {
    margin: 0 12px 2rem;
  }
  // .item:hover,.midItem:hover{
  // box-shadow: 0px 3px 6px 0px rgba(0,0,0,0.14);
  // position: relative;
  // top: -4px;
  // transition: all 0.3s;
  // }
  .itemBox:hover {
    .item,
    .midItem {
      box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.14);
      position: relative;
      top: -4px;
      transition: all 0.3s;
    }
  }
}
.kong {
  margin: 0 auto;
  width: 100%;
  text-align: center;
}
.setupVisible {
  color: var(--black-65);
  .fileList {
    .file {
      justify-content: space-between;
      border-bottom: 1px dashed rgba(0, 0, 0, 0.14);
      padding: 12px 0;
      .img {
        width: 32px;
        height: 32px;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        margin-right: 10px;
      }
      .title {
        color: rgba(0, 0, 0, 0.85);
        font-size: 16px;
      }
    }
  }
}
</style>
