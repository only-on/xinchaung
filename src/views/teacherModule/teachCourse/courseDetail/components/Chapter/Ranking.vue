<template>
  <div>
    <h3 class="courseH3">学习进度排行榜</h3>
    <div class="Ranking">
      <div class="gamePlayer flexCenter" v-for="(v,k) in list" :key="v">
        <div class="user flexCenter">
          <div class="rank" :class="k<3?`rank${k+1}`:''">{{k>2?k+1:''}}</div>
          <!-- :style="`background-image: url(${env? '/proxyPrefix' + systemBaseInfo.login_logo: systemBaseInfo.login_logo});`" -->
          <div class="portrait"></div>
          <div class="name">{{v.username}}</div>
        </div>
        <div class="progress">学习进度{{v.progress}}%</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted ,Ref,reactive} from "vue";
import request from 'src/api/index'
const http=(request as any).teachCourse
interface Props {
  courseId: number;
}
const props = withDefaults(defineProps<Props>(), {
  courseId: 0,
});
var list:any=reactive([])
const courseRankList=()=>{
  list.length=0
  http.courseRankList({urlParams: {courseId:props.courseId}}).then((res: any) => {
    const {data}=res
    list.push(...data)
  });
}
onMounted(() => {
  // console.log(props.courseId)
  courseRankList()
});

</script>

<style lang="less" scope>
  .courseH3{
    margin-bottom: 1rem;
    // color: var(--blue-6-2);
  }
  .Ranking{
    margin-bottom: 2rem;
    height: 500px;
    .gamePlayer{
      justify-content: space-between;
      line-height: 50px;
      .user{
        // width: 50%;
        flex:1;
        justify-content: space-between;
      }
      .rank{
        width: 24px;
        height: 20px;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        line-height: 20px;
        text-align: center;
        font-size: var(--font-size-sm);
        color: var(--black-45);
        &.rank1{
          
          background-image: url('src/assets/images/teacherCourse/1.png');   
        }
        &.rank2{
          background-image: url('src/assets/images/teacherCourse/2.png');
        }
        &.rank3{
          background-image: url('src/assets/images/teacherCourse/3.png');
        }
      }
      .portrait{
        width: 30px;
        height: 30px;
        background-color: #FF9544;
        border-radius: 15px;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-image: url('src/assets/images/user/student.png');
      }
      .name{
        color: var(--black-65);
        width: 70px;
      }
      .progress{
        width: 100px;
        color: var(--black-45);
      }
    }
  }
</style>