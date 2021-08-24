<template>
    <div class="header" v-layout-bg>
      <div class="title">
        <span>HTML是编程语言吗</span>
        <span>（分享）</span>
      </div>
      <a-button type="primary" @click.prevent="Reply"> 回 帖 </a-button>
    </div>
    <div class="main">
        <div class="postItem item">
          <div class="topInfo">
            <div class="left">
              <span>发帖人</span>
              <span>辛德拉</span>
            </div>
            <span class="right">2021-04-01 09:58:27</span>
          </div>
          <div class="cont">
            发帖信息
          </div>
        </div>
        <div class="forumBody">
            <div class="item" v-for="v in 30" :key="v">
              <div class="topInfo">
                <div class="left">
                  <span>回帖人：</span>
                  <span>辛德拉</span>
                </div>
                <div class="right">
                  <span >2021-04-01 09:58:27</span>
                  <a-button  @click.prevent="Reply"> 删 除 </a-button>
                </div>
              </div>
              <div class="cont">回帖1</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted,reactive ,toRefs,inject} from 'vue'
interface Istate{
  Reply: () => void;
}
export default defineComponent({
  name: 'PostsDetailed',
  components: {
   
  },
  setup: (props,{emit}) => {
    var updata=inject('updataNav') as Function
    updata({showContent:true,tabs:[],navPosition:'outside',navType:false})
    const state:Istate=reactive({
      Reply:()=>{

      }
    })
    onMounted(()=>{
     
    })
    return { ...toRefs(state)};
  },
})
</script>
<style scoped lang="less">
  @border-color:#d3d3d3;
  .detail{
    // height: 100%;
  }
  .header{
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
    padding: 20px 10px 10px 10px;
    .title{
      font-size: 20px;
    }
    .ant-btn-primary{
      margin-top: 40px;
    }
  }
  .main{
    height: calc(100% - 102px);
  }
  .item{
    border: @border-color solid 1px;
    min-height: 120px;
    font-size: 15px;
    .topInfo{
      display: flex;
      justify-content: space-between;
      border-bottom: @border-color solid 1px;
      padding: 0 20px;
    }
  }
  .cont{
    padding: 20px;
  }
  .forumBody{
    padding: 30px;
    overflow: auto;
    max-height: calc(100% - 150px);
    .item{
      margin-bottom: 15px;
    }
  }
  .postItem{
    min-height: 150px;
    max-height: 200px;
    overflow-y: auto;
  }
</style>
