<template>
 <div class="navList">
        <div class="tab">
          <div v-for="v in tabs" :key="v.name" :class="activeName ===v.name?'active':''" @click="activeName !==v.name?tabChange(v):''">{{v.name}}</div>
        </div>
        <Breadcrumb />
      </div>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted ,reactive, Ref} from 'vue'
import {useStore} from "vuex"
interface Tab {
  name: string
}
export default defineComponent({
  name: 'NavTab',
  props:{
    tabs:{
      required: false,
      type: Array,
      default: () => [{name:'21'}],
    }
  },
  emits:["tabSwitch"],
  setup: (props,context) => {
    const tabs:Tab[]=reactive(props.tabs) as Tab[]
    const activeName=ref((tabs as any)[0].name)
    function tabChange(item:any){
      context.emit('tabSwitch',item)
      activeName.value=item.name
    }
  
    onMounted(()=>{
     
    })
    return {tabs ,activeName,tabChange};
  },
})
</script>

<style scoped lang="less">
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
      padding: 0 15px;
      text-align: center;
      cursor: pointer;
      &:hover{
        color: #999;
      }
    }
    .active{
       background:  @primary-color;
       color: #fff;
       &:hover{
        color: #fff;
      }
    }
  }
}
</style>
