<template>
  <div>
    <h3 class="courseH3">学习进度排行榜</h3>
    <div class="Ranking">
      <div class="gamePlayer flexCenter" v-for="(v,k) in 10" :key="v">
        <div class="user flexCenter">
          <div class="rank" :class="k<3?`rank${k+1}`:''">{{k>2?k+1:''}}</div>
          <!-- :style="`background-image: url(${env? '/proxyPrefix' + systemBaseInfo.login_logo: systemBaseInfo.login_logo});`" -->
          <div class="portrait"></div>
          <div class="name">{{'左卿辞'}}</div>
        </div>
        <div class="progress">学习进度{{'70'}}%</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted ,Ref} from "vue";
interface Props {
  rank: any;
}
const props = withDefaults(defineProps<Props>(), {
  rank: ()=> [],
});

</script>

<style lang="less" scope>
  .courseH3{
    margin-bottom: 1rem;
    // color: var(--blue-6-2);
  }
  .Ranking{
    margin-bottom: 2rem;
    .gamePlayer{
      justify-content: space-between;
      line-height: 50px;
      .user{
        width: 50%;
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
          // background-image: url('src/assets/images/empty/empty.png');
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
      }
      .name{
        color: var(--black-65);
      }
      .progress{
        color: var(--black-45);
      }
    }
  }
</style>