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
        <div class="started">
          <div class="num">846</div>
          <div class="img"></div>
        </div>
      </div>
      <div class="item item4">
        <h3 class="statisticalTitle">录像占用</h3>
        <div class="flexCenter proportion">
          <div class="left flexCenter">
            <span class="left1">32%</span>
            <span class="left2">300/1024</span>
          </div>
          <div class="right">
            <a-progress type="circle" :percent="75" :strokeColor="'#9872EB'" :strokeWidth="12">
              <template #format="percent">
                <div class="right1">磁盘总量</div>
                <div class="right2">1024G</div>
              </template>
            </a-progress>
          </div>
        </div>
      </div>
    </div>
    <div class="courseManagementContent">
      <div class="search flexCenter">
        <div class="left flexCenter">
          <div class="item">
            <span>课程名称：</span>
            <a-input v-model:value="searchInfo.name" placeholder="请输入关键字搜索" />
          </div>
          <div  class="item">
            <span>课程属性：</span>
            <a-select v-model:value="searchInfo.is_public" placeholder="请选择课程属性">
              <a-select-option :value="1">公开课程</a-select-option>
              <a-select-option :value="0">我的课程</a-select-option>
            </a-select>
          </div>
          <div class="item">
            <span>课程状态：</span>
            <a-select v-model:value="searchInfo.state" placeholder="请选择课程状态">
              <a-select-option :value="1">未开始</a-select-option>
              <a-select-option :value="2">进行中</a-select-option>
              <a-select-option :value="3">已结束</a-select-option>
            </a-select>
          </div>
        </div>
        <div class="right">
          <a-button type="primary"> 批量删除 </a-button>
          <a-button type="primary" class="brightBtn"> 批量清楚录屏 </a-button>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject,ref, toRefs, onMounted ,Ref,reactive} from "vue";
var updata = inject("updataNav") as Function;
updata({
  tabs: [{ name: "课程管理", componenttype: 0 }],
  showContent: true,
  componenttype: undefined,
  showNav: true,
});
var searchInfo:any=reactive({
  name:'',
  is_public:1,
  state:2
})
</script>

<style lang="less" scoped>
  .statisticalTitle{
    color: var(--black-85);
    font-weight: 500;
  }
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
          .name{
            color: #808294;
          }
          .num{
            font-size: 14px;
            color: #31394D;
            font-weight: 600;
          }
        }
      }
    }
    .item3{
      .started{
        display: flex;
        padding-top: 1rem;
        .num{
         flex-grow: 1;
         color:#31394D;
         font-size: 30px;
         font-weight: 600;
        }
        .img{
          width: 164px;
          height: 98px;
          background-size: 100% 100%;
          background-image: url('src/assets/images/user/teacher.png');
          background-size: 100% 100%;
          background-repeat: no-repeat;
        }
      }
    }
    .item4{
      .proportion{
        justify-content: space-between;
        .left{
          flex-direction: column;
          .left1{
            color: #31394D;
            font-size: 30px;
          }
          .left2{
            color: #808294;
            
          }
        }
        .right{
          .right1{
            color: #102241;
            font-size: 12px;
            padding: 6px 0;
          }
          .right2{
            color: #455A64;
            font-size: 12px;
          }
        }
      }
    }
  }
  .courseManagementContent{
    background-color: var(--white);
    margin-top: 2rem;
    min-height: 750px;
    padding: 24px 30px 0;
    .search{
      justify-content: space-between;
      .left{
        .item{
          display: flex;
          align-items: center;
          margin-right: 12px;
          .ant-select,.ant-input{
            width: 200px;
          }
        }
      }
      .right{
        .ant-btn:nth-child(1){
          margin-right: 12px;
        }
      }
    }
  }
</style>