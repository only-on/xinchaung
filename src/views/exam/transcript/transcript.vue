<template>
  <examLayout>
    <template v-slot>
      <div class="exam-transcript-content">
        <top class="transcript-top"></top>
        <div class="frist-box">
            <div class="score-detail-echarts">
                <div>成绩详情</div>
                <div>

                </div>
            </div>
            <div class="accuracy-echarts">
                <div>正确率</div>
                <div>

                </div>
            </div>
        </div>
        <div class="second-box">
            <div>答题详情</div>
            <div>

            </div>
        </div>
      </div>
    </template>
  </examLayout>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import top from "./top.vue";
import examLayout from "../examLayout.vue";
export default defineComponent({
  components: {
    top,
    examLayout,
  },
  setup() {},
});
</script>

<style lang="less">
.exam-transcript-content{
    width: 100%;
      height: 100%;
      padding: 0px 80px;
      box-sizing: border-box;
      background: #e6e4ff;
      display: flex;
      flex-direction: column;
.frist-box{
    flex: 1;
    display: flex;
    flex-direction: row;
    width: 100%;
    margin-top: 10px;
    >.score-detail-echarts{
        width: 50%;
    }
    >.accuracy-echarts{
        width: 50%;
    }
}
.second-box{
    flex: 1;
}
}

</style>
