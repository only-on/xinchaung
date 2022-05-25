<template>
  <div class="studentCourseList">
    <search-add @searchFn="searchFn" :isShowAdd="false"></search-add>
    <classify :list="classifyList" @change="classifyChange"></classify>
    <a-spin :spinning="loading" size="large" tip="Loading...">
      <div class="flexCenter mainBox">
        <div class="itemBox" v-for="(v, k) in courseList" @click="courseDetail(v)" :key="v" >
          <div class="item" :class="[1,2,5,6,9,10].includes(k)?'midItem':''">
            <div class="coverBox">
              <div class="cover" :style="v.url?`background-image: url(${v.url});`:''">
                <div class="top flexCenter">
                  <template v-if="v.is_authorized">
                    <div class="state" :class="v.state==3?'state-ing':''">{{`${['已结束','未开始','进行中'][v.state-1]}`}}</div>
                  </template>
                  <template v-else>
                    <div class="state">未授权</div>
                  </template>
                </div>
                <div class="tabBox">
                  <!-- <span>标签1/标签2/</span> -->
                    <span>{{(v.tags && v.tags.length)?`${v.tags.join(' / ')}`:''}}</span>
                </div>
              </div>
            </div>
            <div class="info">
              <div class="name">{{v.name}}</div>
              <div class="date flexCenter">
                <div class="flexCenter user">
                  <div class="img" :class="v.is_init?'initImg':''"></div>
                  <div class="userName single_ellipsis">{{v.teacher}}</div>
                </div>
                <span>实验:{{v.content_total}}</span>
                <span>课时:{{v.class_total}}</span>
              </div>
              <div class="createDate flexCenter" v-if="v.start_time && v.end_time">
                <span>{{v.start_time.split(' ')[0]}} - {{v.end_time.split(' ')[0]}}</span>
              </div>
              <div class="progress flexCenter">
                <div class="left flexCenter">
                  <span class="yixue">已学</span>
                  <a-progress :title="`已学习${v.progress}`" :percent="v.progress" />
                </div>
                <div @click.stop="viewAchievement(v)">
                  <span class="viewAchievement" v-if="v.state!==2">查看成绩</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Empty v-if="!courseList.length && !loading" :type="EmptyType"/>
        <a-pagination
          v-if="totalCount > 12"
          v-model:current="searchInfo.page"
          :pageSize="searchInfo.limit"
          :total="totalCount"
          @change="pageChange"
        />
      </div>
    </a-spin>
    <a-modal v-model:visible="Visible"  :title="`课程归档`" class="setupVisible" :width="490">
      <div class="title">课程已归档并为您导出了该课程归档数据文件</div>
      <div class="file">
        <span class="img" :style="`background-image: url(${getFileTypeIcon(activeCourse.name)});`"></span>
        <span>{{activeCourse.name}}</span>
      </div>
      <template #footer>
        <Submit @submit="Save" @cancel="cancel" :okText="'下载'"></Submit>
      </template>
    </a-modal>
  </div>
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
import { getFileType,getFileTypeIcon,readFile } from 'src/utils/getFileType'
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { Modal, message } from "ant-design-vue";
import { useRouter, useRoute } from "vue-router";
import { downloadUrl } from "src/utils/download";
import { string } from "vue-types";
const router = useRouter();
const env = process.env.NODE_ENV == "development" ? true : false;
const route = useRoute();
const http = (request as any).studentCourse;
var configuration: any = inject("configuration");
var updata = inject("updataNav") as Function;
updata({
  tabs: [
    { name: "我的课程", componenttype: 0 },
  ],
  showContent: true,
  componenttype: undefined,
  showNav: false,
});
const EmptyType:any=computed(()=>{
  let str=''
  if(searchInfo.name === '' && labelSearch.state === ''){
    str= 'empty'
  }else{
    str= 'searchEmpty'
  }
  return str
})
interface ISearchInfo {
  name: string
  limit: number
  page: number
}
var courseList: any[] = reactive([{id:1}]);
var loading: Ref<boolean> = ref(false);
var totalCount: Ref<number> = ref(0);
const currentTab = ref<number>(0);
const searchInfo = reactive<ISearchInfo>({ 
  name: '',
  limit: 12,
  page: 1,
});
// watch(() => { return configuration.componenttype; },
//   (val) => {
//     // console.log(val)
//     currentTab.value = val ;
//     searchInfo.page = 1
//     // searchInfo.content_direction = 0
//     // searchInfo.content_type = 0
//     // searchInfo.content_level = 0
//     classifyList.forEach((v: any) => {
//       v.value = 0
//     })
//     initData();
//   }
// );
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
]);
const labelSearch:any = reactive({
  state: 0,
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
const initData = () => {
  // return
  // const param = currentTab.value ? Object.assign({}, {...searchInfo}, {myexper: true}) : Object.assign({}, {...searchInfo})
  // const param: ISearchInfo = Object.assign({...labelSearch}, {...searchInfo})
  const param:any={
    ...searchInfo,
    type:1,
    state:labelSearch.state?labelSearch.state:'',
  }
  loading.value = true;
  courseList.length = 0
  http.getCourseList({param:{...param}}).then((res: IBusinessResp) => {
    loading.value = false
    if (!res) return
    const { list, page }  = res.data
    list.forEach((v: any) => {
      // v.is_authorized=false
      v.is_authorizedText=v.is_authorized?'':'Unauthorized'
      // v.type_obj = Object.assign({}, getTypeList('90deg')[v.task_type]);
    });
    courseList.push(...list)
    totalCount.value = page.totalCount
  })
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
const courseDetail=(val:any)=>{
  router.push({ 
    path: "/student/studentCourse/Detail",
    query: { 
      currentTab:currentTab.value,
      courseId:val.id,
      course_student_id:val.course_student_id,
      state:val.state,
      is_authorizedText:val.is_authorizedText,
      activeTabOrder:0
       }
    });
}
const viewAchievement=(val:any)=>{
  router.push({ 
    path: "/student/studentCourse/Detail",
    query: { 
      currentTab:currentTab.value,
      courseId:val.id,
      course_student_id:val.course_student_id,
      studentDetailTab:'courseAchievement',
      state:val.state,
      is_authorizedText:val.is_authorizedText,
      activeTabOrder:1
      }
    });
}
// 归档
var Visible: Ref<boolean> = ref(false);
var activeCourse:any=reactive({
  name:'测试课程名称.xls'
})
const archives=(val: any)=>{
  Visible.value=true
  // activeCourse.name=val.name
}
const Save=()=>{
  // let url=`${env?'/proxyPrefix':''}${activeCourse.file_url}`
  // downloadUrl(url,activeCourse.name)
  Visible.value=false
}
const cancel=()=>{
  Visible.value=false
}
onMounted(() => {
  if (!Number(route.query.currentTab)) {
    currentTab.value = 0
    configuration.componenttype = 0
  } else {
    currentTab.value = 1
    configuration.componenttype = 1
  }
  // http.courseCategory().then((res:IBusinessResp)=>{
  //   const {data}=res
  //   data.map((v:any)=>{
  //     v.value=v.name
  //   })
  //   publicClassifyList[0].data.push(...data)
  // })
  // http.vocationDirection().then((res:IBusinessResp)=>{
  //   const {data}=res
  //   data.map((v:any)=>{
  //     v.value=v.name
  //   })
  //   publicClassifyList[1].data.push(...data)
  // })
  initData();
});
</script>
<style scoped lang="less">
.studentCourseList{
  // background-color: #F0F0F0;
}
  .mainBox{
    flex-wrap: wrap;
    .item{
      cursor: pointer;
      width: 282px;
      flex-direction: column;
      justify-content: space-between;
      margin-bottom: 2rem;
      box-shadow: 0px 1px 1px 0px rgba(0,0,0,0.07); 
      border-radius: 6px;
      background-color: #fff;
      .coverBox{
         position: relative;
        //  cursor: pointer;
         width: 282px;
         height: 150px;
         border-radius: 6px 6px 0 0;
         .cover{
          border-radius: 6px 6px 0 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          width: 100%;
          height: 100%;
          background-size: 100% 100%;
          background-repeat: no-repeat;
          background-image: url(src/assets/images/teacherCourse/defaultCover.jpg);
          .top{
            border-radius: 6px 0px 6px 0px;
            // opacity: .5;
            padding: 3px 0;
            .state{
              background-color: rgba(0, 0, 0,.5);
              color: var(--white-70);
              padding: 3px 14px;
              // opacity: .5;
              &.state-ing{
                color: #37E6AE;
                // opacity: 1;
              }
            }
          }
          .tabBox{
            background-color: rgba(0, 0, 0,.5);
            padding: 1px 6px;
            span{
              color: var(--white-85);
            }
          }
         }
        &:hover{

        }
      }
      .info{
        padding: 0 10px;
        .name{
          color: var(--black-85);
          font-size: 16px;
          padding: 10px 0;
        }
        .date{
         padding-bottom: 10px;
          span{
            color: var(--black-45);
            width: 80px;
          }
          .user{
              // color: var(--white);
              // background-color: rgba(0, 0, 0,.5);
              // width: 100px;
              padding-right: 1rem;
              justify-content: center;
              .img{
                width: 24px;
                height: 24px;
                border-radius: 50%;
                // src/assets/images/admin/home/env3.png
                background-image: url('src/assets/images/user/student.png');
                background-size: 100% 100%;
                background-repeat: no-repeat;
                margin: 0 6px;
              }
              .userName{
                color: var(--black-45);
                flex:1;
                text-align: center;
                max-width: 72px;
              }
            }
        }
        .createDate{
          border-top: 1px solid #f0f0f0;
          height: 44px;
          line-height: 44px;
          color: var(--black-45);
          justify-content: space-between;
        }
        .progress{
          justify-content: space-between;
          height: 40px;
          .left{
            width: 65%;
            .yixue{
              width:36px;
            }
          }
        }
      }
    }
    .midItem{
      margin: 0 18px 2rem;
    }
    // .item:hover,.midItem:hover{
    //   box-shadow: 0px 3px 6px 0px rgba(0,0,0,0.14);
    //   position: relative;
    //   top: -6px;
    //   transition: all 0.3s;
    // }
    .itemBox:hover{
      .item,.midItem{
        box-shadow: 0px 3px 6px 0px rgba(0,0,0,0.14);
        position: relative;
        top: -4px;
        transition: all 0.3s;
      }
    }
  }
  .setupVisible{
    color: var(--black-65);
    .title{
      padding-bottom: 24px;
    }
    .file{
      display: flex;
      align-items: center;
      .img{
        width: 32px;
        height: 32px;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        margin-right: 10px;
      }
    }
    .ant-btn{
      margin:  0 1rem;
    }
  }
</style>