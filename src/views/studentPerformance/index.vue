<template>
    <div id='studentPerformance'>
        <NavTab :tabs="tabs"  @tabSwitch="tabSwitch" />
         <div class="content_box">
            <component :is="componentName" />
         </div>
    </div>
</template>
<script lang="ts">
import {defineComponent,ref,UnwrapRef,reactive, onMounted,toRefs} from 'vue'
import CourseAchievement from './CourseAchievement/index.vue'
import TrainingResults from './TrainingResults/index.vue'
interface Iitem{
  name:string,
  componentName:string,
  path:string,
}
interface state{
    tabs:Array<TtabItem>,
    componentName:string,
    tabSwitch:(item:Iitem)=>void
}
type TtabItem =Pick<Iitem,'name' | 'componentName'>
type Tbreadcrumb=Omit<Iitem,'componentName'>
export default defineComponent({
    name:'studentPerformance',
      components: {
        CourseAchievement,
        TrainingResults
  },
    setup:(props,context)=>{
       const state:state=reactive({
            tabs:[{name:'课程成绩',componentName:'CourseAchievement'},{name:'实训成绩',componentName:'TrainingResults'}],
            componentName:'CourseAchievement',
      tabSwitch:(item:any)=>{
        console.log(item)
        state.componentName=item.componentName
      }
       })
    onMounted(()=>{
        console.log(ref,'ref')
    }) 
    return {...toRefs(state)}
    }
})
</script>
<style lang="less" scoped>
#studentPerformance{
      width: 1330px;
    margin: 20px auto 0;
    // background: #fff;
    height: 100%;
}
</style>