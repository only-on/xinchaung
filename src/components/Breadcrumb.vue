<template>
  <a-breadcrumb :class="type === 'default'?'':'allWhite'">
    <!-- <div class="nav"> -->
          <!-- <div>首页</div>
          <div class="qian">我的课程</div> -->
          <!-- <div v-for="(v,k) in breadcrumbArr" :key="v.name" :class="k?'qian':''" @click="go(v.path)">{{v.name}}</div> -->
        <!-- </div> -->
    <!-- <a-breadcrumb-item><a href="">Application Center</a></a-breadcrumb-item> -->
   
    <a-breadcrumb-item v-for="v in breadcrumbArr" :key="v.name" @click="Jump(v.path)" :class="v.path?'allow':''"> 
     {{v.name}}     
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted,computed } from 'vue'
import {useStore} from "vuex"
import { useRouter } from 'vue-router';
export default defineComponent({
  name: 'Breadcrumb',
  components: {
   
  },
  props:{
    type:{
      required: false,
      type: String,
      default: 'default',
    }
  },
  setup: (props,{emit}) => {
    const type=ref(props.type)
    const store=useStore()
    const router = useRouter();
    let breadcrumbArr = computed(()=>{ return store.state.breadcrumb });
    // console.log(breadcrumbArr.value)
    function Jump(v:any){
      router.push(v)
    }
    onMounted(()=>{
     
    })
    return { breadcrumbArr,type,Jump};
  },
})
</script>

<style scoped lang="scss">
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
  .ant-breadcrumb{
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .allow{
        :deep(.ant-breadcrumb-link){
          cursor: pointer;
        }
      }
  }
  .allWhite{
    a,span:last-child{
      color:#fff;
    }
    :deep(.ant-breadcrumb-separator){
      color:#fff;
    }
  }

</style>
