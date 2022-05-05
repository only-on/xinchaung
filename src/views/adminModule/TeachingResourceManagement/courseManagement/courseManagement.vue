<template>
  <div class="courseManagement">
    <div class="Statistics flexCenter">
      <div class="item"></div>
      <div class="item item2">
        <h3 class="statisticalTitle">课程状态</h3>
        <div class="progressItem">
          <a-progress :percent="30" :showInfo="false" :trailColor="'#E5E9F2'" />
          <div class="tip flexCenter">
            <span class="name">未开始课程</span>
            <span class="num">120</span>
          </div>
        </div>
        <div class="progressItem">
          <a-progress :percent="30" :status="'success'" :showInfo="false" :trailColor="'#E5E9F2'" />
          <div class="tip flexCenter">
            <span class="name">进行中课程</span>
            <span class="num">96</span>
          </div>
        </div>
        <div class="progressItem">
          <a-progress :percent="30" :strokeColor="'#86A7FF'" :showInfo="false" :trailColor="'#E5E9F2'" />
          <div class="tip flexCenter">
            <span class="name">结束课程</span>
            <span class="num">80</span>
          </div>
        </div>
      </div>
      <div class="item item3">
        <h3 class="statisticalTitle">正在开设课程</h3>
      </div>
      <div class="item item4">
        <h3 class="statisticalTitle">录像占用</h3>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject,ref, toRefs, onMounted ,Ref} from "vue";
var updata = inject("updataNav") as Function;
updata({
  tabs: [{ name: "课程管理", componenttype: 0 }],
  showContent: true,
  componenttype: undefined,
  showNav: true,
});

</script>

<style lang="less" scoped>
  .Statistics{
    justify-content: space-between;
    .item{
      width: 285px;
      height: 180px;
      background-color: var(--white);
      padding: 12px;
    }
    .item2{
      .progressItem{
        .tip{
          justify-content: space-between;
          font-size: 10px;
          .num{
            color: #31394D;
            font-weight: 600;
          }
        }
      }
    }
  }
</style>