<template>
  <div class="cradItem" @click.stop="goPreview">
    <div class="left">
      <span class="type">{{type == 1 ? '作业' : '考试'}}</span>
      <div :class="['img',{'isExam': type == 2},getClass(item)] ">
        <span>{{getStatus(item)}}</span>
      </div>
    </div>
    <div class="middle">
      <span>关联课程：{{item.course_id ? item.course_info.name : '无'}}</span>
      <div>
        {{item.name}}
      </div>
      <div>
        <template v-if="type == 2">
          <span>创建时间：{{item.created_at}}</span>
          <span>开始时间：{{item.started_at}}</span>
          <span>考试时长：{{item.times}}</span>
        </template>
        <template v-else>
          <span>创建时间：{{item.created_at}}</span>
          <span>起止时间：{{item.started_at}} - {{item.closed_at}}</span>
        </template>
        
        <!-- 已发布 并且状态是 进行中或已结束 -->
        <span v-if="item.is_publish && [1,3].includes(item.status)">提交人数：{{item.submit_num}}/{{item.students_count}}</span>
      </div>
    </div>
    <div class="right">
      <div>
        <a-button type="link" v-if="type == 2" @click.stop="handleClick('setting', item)">防作弊设置</a-button>
        <a-dropdown>
          <a class="ant-dropdown-link" @click.stop.prevent>
            <i class="iconfont icon-gengduotianchong"></i>
          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <a-button type="link" @click.stop="handleClick('edit', item)" :disabled="!item.can_edit">编辑</a-button>
              </a-menu-item>
              <a-menu-item>
                <a-button type="link" @click.stop="handleClick('delete', item)" :disabled="!item.can_delete">删除</a-button>
              </a-menu-item>
              <a-menu-item>
                <a-button type="link" @click.stop="handleClick('copy', item)">复用</a-button>
              </a-menu-item>
              <a-menu-item>
                <a-button type="link" @click.stop="handleClick('export', item)">导出试卷</a-button>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
      <!-- 1-进行中;2-未开始;3-已结束-->
      <!-- 未发布 -->
      <a-button type="primary" v-if="!item.is_publish" @click.stop="handleEvent('publish', item)">发布</a-button>
      <!-- 已发布且未开始 -->
      <a-button type="primary" v-if="item.is_publish && item.status == 2" @click.stop="handleEvent('unpublish', item)">撤销发布</a-button>
      <!-- 已发布且进行中,已结束 -->
      <a-button type="primary" v-if="item.is_publish && [1,3].includes(item.status)" @click.stop="handleEvent('review', item)">评阅</a-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {ref,reactive, watch} from 'vue'
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const props =withDefaults(defineProps<{
  data: Object,
  type: any
}>(), {
  data: ()=>({}),
  type: '1', // 作业；1，考试：2
})
const item = reactive<any>(props.data)
const emit = defineEmits<{
  (e: "menuClick", val: any, item:any): void;
  (e: "operate", val: any, item:any): void;
}>();

const handleClick = (operateType:string, item:any) => {
  emit('menuClick', operateType, item)
}
const handleEvent = (operateType:string, item:any) => {
  emit('operate', operateType, item)
}
const goPreview=()=>{
  let path=props.type=='2'?'/teacher/teacherExamination/teacherExaminationPreview':'/teacher/teacherAssignment/teacherAssignmentPreview'
  router.push({
    path:path,
    query:{id:item.id,canEdit:item.can_edit}
  })
}
const getClass = (item:any) => {
  let isEnd = new Date(item.closed_at).valueOf() < new Date().valueOf()
  return item.is_publish == 0 && isEnd ?'end':item.is_publish == 0 ? 'unpublish' : item.status == 1 ? 'ongoing' :  item.status == 2 ? 'unstart' :  'end'
}
const getStatus = (item:any) => {
  let isEnd = new Date(item.closed_at).valueOf() < new Date().valueOf()
  return item.is_publish == 0 && isEnd  ? '已结束' : item.is_publish == 0 ? '未发布' :item.status == 1 ? '进行中' :   item.status == 2 ? '未开始' : '已结束'
}
watch(()=>props.data, newVal => {
  Object.assign(item,newVal)
},{deep:true,immediate:true})
const leftStyle = {
  bg: props.type == 1?'linear-gradient(270deg,#ffffff, #ddefff)' :'linear-gradient(270deg,#fff, #deebff)',
  textBg: props.type == 1 ? '#3094EF' : '#5E7BE2'
}
</script>
<style lang="less" scoped>
.cradItem {
  height: 110px;
  background: var(--white-100);
  border-radius: 10px;
  box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.07);
  display: flex;
  margin-bottom: 15px;
  cursor: pointer;
  .left {
    width: 150px;
    height: 100%;
    background: v-bind('leftStyle.bg');
    border-radius: 10px 0px 0px 10px;
    position: relative;
    .type{
      display: inline-block;
      width: 22px;
      height: 52px;
      border-radius: 0px 6px 6px 0px;
      writing-mode: vertical-lr;
      font-size: 12px;
      background: v-bind('leftStyle.textBg');
      color: var(--white-100);
      text-align: center;
      letter-spacing: 3px;
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      margin-top: auto;
      margin-bottom: auto;
    }
    .img{
      width: 100px;
      height: 100%;
      margin-left: 30px;
      position: relative;
      &.unpublish{
        background: url(src/assets/images/teacherAssignment/unpublish.png) no-repeat center 20%;
      }
      &.unstart{
        background: url(src/assets/images/teacherAssignment/unstart.png) no-repeat center 20%;
      }
      &.ongoing{
        background: url(src/assets/images/teacherAssignment/ongoing.png) no-repeat center 20%;
      }
      &.end{
        background: url(src/assets/images/teacherAssignment/end.png) no-repeat center 20%;
      }
      &.isExam.unpublish{
        background: url(src/assets/images/teacherExamination/unpublish.png) no-repeat center 20%;
      }
      &.isExam.unstart{
        background: url(src/assets/images/teacherExamination/unstart.png) no-repeat center 20%;
      }
      &.isExam.ongoing{
        background: url(src/assets/images/teacherExamination/ongoing.png) no-repeat center 20%;
      }
      &.isExam.end{
        background: url(src/assets/images/teacherExamination/end.png) no-repeat center 20%;
      }
      span{
        position: absolute;
        left: 0;
        right: 0;
        margin-left: auto;
        margin-right: auto;
        bottom: 0;
        color: #5e7be2;
        font-size: 12px;
        text-align: center;
      }
    }
  }
  .middle {
    flex: 1;
    padding: 17px 23px;
    > span {
      color: #5e7be2;
      font-size: 12px;
    }
    > div:first-of-type {
      font-size: 16px;
      color: var(--black-85);
      margin-bottom: 10px;
    }
    > div:last-of-type {
      color: var(--black-45);
      span {
        margin-right: 20px;
      }
    }
  }
  .right {
    padding: 11px 23px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    > div {
      .ant-btn {
        padding: 0 !important;
        color: var(--brightBtn);
        margin-right: 10px;
        cursor: pointer;
      }
      .iconfont{
        color: var(--brightBtn);
      }
    }
  }
}
.ant-btn-link{
  color: var(--black-65);
}
</style>
