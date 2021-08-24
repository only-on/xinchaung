<template>
    <div v-layout-bg class="detail">
      <div class="header">
        <div class="title">
          <span>HTML是编程语言吗</span>
          <span>(分享)</span>
        </div>
        <a-button type="primary" @click.prevent="Reply"> 回 帖 </a-button>
      </div>
      <div class="main">
          <div class="postItem">
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
              <div class="item">
                <div class="topInfo">
                  <div class="left">
                    <span>回帖人</span>
                    <span>辛德拉</span>
                  </div>
                  <div class="right">
                    <span >2021-04-01 09:58:27</span>
                    <a-button type="" @click.prevent="Reply"> 删 除 </a-button>
                  </div>
                </div>
                <div class="cont">回帖1</div>
              </div>
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
</style>
