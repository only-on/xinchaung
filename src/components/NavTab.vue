<template>
 <div class="navList">
        <div class="tab">
          <div v-for="v in tabs" :key="v.name" :class="activeName ===v.name?'active':''" @click="activeName !==v.name?tabChange(v):''">{{v.name}}</div>
        </div>
        <div class="nav">
          <!-- <div>首页</div>
          <div class="qian">我的课程</div> -->
          <!-- <div v-for="(v,k) in breadcrumbArr" :key="v.name" :class="k?'qian':''" @click="go(v.path)">{{v.name}}</div> -->
        </div>
      </div>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted ,reactive,computed} from 'vue'
import {useStore} from "vuex"
import { useRouter } from 'vue-router';
export default defineComponent({
  name: 'NavTab',
  props:{
    tabs:{
      required: false,
      type: Array,
      default: () => [{}],
    }
  },
  emits:["tabSwitch"],
  setup: (props,context) => {
    const router = useRouter();
    const store=useStore()
    const tabs=reactive(props.tabs)
    const activeName=ref((tabs as any)[0].name)
    function tabChange(item:any){
      context.emit('tabSwitch',item)
      activeName.value=item.name
    }
    // function go(path:string){
    //   router.push(path)
    // }
    // let breadcrumbArr = computed(()=>{ return store.state.breadcrumbArr });
    onMounted(()=>{
     
    })
    return {tabs ,activeName,tabChange};
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
    justify-content: flex-end;
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
