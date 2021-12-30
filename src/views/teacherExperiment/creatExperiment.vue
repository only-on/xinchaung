<template>
  <div class="create-experimental-wrap" v-layout-bg>
    <div>
      <h2 class="title">请选择要创建的实验类型</h2>
      <div class="select-type-box">
        <div @click="select('vnc')" class="vnc-box">
          <div>
            <img src="src/assets/images/teacherExperiment/vnc.png" alt="" />
            <div>桌面实验</div>
          </div>
        </div>
        <div @click="select('note')" class="note-box">
          <div>
            <img src="src/assets/images/teacherExperiment/note.png" alt="" />
            <div>交互实验</div>
          </div>
        </div>
      </div>
      <div class="experiment-desk">
        <img src="src/assets/images/teacherExperiment/experiment.png" alt="" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, inject, reactive, watch, onMounted, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
export default defineComponent({
  components: {},
  setup() {
    let route = useRoute()
    let router = useRouter()
    var updata=inject('updataNav') as Function
    updata({tabs:[],navPosition:'outside',navType:false,showContent:false,componenttype:undefined,showNav:true})

    function select(type: string) {
      router.push({
        path: '/teacher/teacherExperiment/creatTypeExperiment',
        query: {
          type: type,
          chapter_id: route.query.chapter_id,
          chapter_name: route.query.chapter_name,
          skill_name: route.query.skill_name,
          course_index: route.query.course_index,
          chapter_index: route.query.chapter_index,
        }
      })
    }
    return {
      select
    }
  }
})
</script>

<style lang="less" scoped>
.create-experimental-wrap {
  width: @center-width;
  margin: 0 auto;
  height: 100%;
  background-image: url('arc/assets/images/teacherExperiment/bg.png');
  background-repeat: no-repeat;
  background-position: center bottom;

  box-shadow: 0px 3px 6px 0px @shadow-color;
  border-radius: 6px;

  > div {
    // margin-top: 40px;
    width: 100%;
    height: 100%;
    background: #ffffff;
    padding-top: 66px;
  }

  .title {
    font-size: 20px;
    color: rgba(5, 1, 1, 0.65);
    text-align: center;
  }

  .select-type-box {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 45px;

    > div {
      width: 300px;
      height: 170px;
      // background: linear-gradient(180deg, #f9f0ff, #eaf2ff);
      background:linear-gradient(90deg,@geekblue-1, @purpleblue-1);
      border-radius: 10px;
      box-shadow: 0px 4px 6px 0px @shadow-color;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      cursor: pointer;

      > div {
        > div {
          margin-top: 14px;
          font-size: 20px;
          color: #5559b5;
        }
      }
    }

    > div:hover {
      border: 1px solid @purplebule-3;
    }

    .vnc-box {
      margin-right: 110px;
    }
  }
}
.experiment-desk {
  margin: 170px 280px;
}

</style>