<template>
 <div class="navList">
        <div class="tab">
          <div v-for="v in tabs2" :key="v.name" :class="activeName ===v.name?'active':''" @click="activeName !==v.name?tabChange(v):''">{{v.name}}</div>
        </div>
        <div class="nav">
          <div>首页</div>
          <div class="qian">我的课程</div>
        </div>
        <!-- <div>{{}}</div> -->
      </div>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted ,reactive} from 'vue'

export default defineComponent({
  name: 'NavTab',
  props:{
    tabs:{
      required: false,
      type:()=>{[]}
    }
  },
  emits:["tabSwitch"],
  setup: (props,context) => {
    const tabs2=reactive([{name:'最近学习',componentName:'LatelyCourseList'},{name:'我的课程',componentName:'MyCourseList'}])
    // const tabs=reactive([])
    console.log(props);
    const activeName=ref(tabs2[0].name)
    function tabChange(item:any){
      context.emit('tabSwitch',item)
      activeName.value=item.name
    }
    onMounted(()=>{
     console.log(props);
    })
    return {tabs2 ,activeName,tabChange};
  },
})
</script>

<style scoped lang="scss">
.navList{
  width: 1330px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #D0D0D0;
  line-height: 43px;
  .tab{
    display: flex;
    div{
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      margin-right: 15px;
      color: #444;
      font-size: 16px;
      width: 94px;
      text-align: center;
      cursor: pointer;
      &:hover{
        color: #999;
      }
    }
    .active{
       background: #8955b5;
       color: #fff;
       &:hover{
        color: #fff;
      }
    }
  }
  .nav{
    display: flex;
    div{
      position: relative;
      cursor: pointer;
      &.qian{
        padding-left: 20px;
      }
      &.qian::before{
        position: absolute;
        content: ">";
        left: 7px;
        top: 0;
      }
    }
  }
}
</style>
