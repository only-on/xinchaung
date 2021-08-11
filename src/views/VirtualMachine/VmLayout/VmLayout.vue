
<template>
  <div class="vm-layout">
    <div class="vm-header" @click="open"><slot name="header"></slot></div>
    <div class="vm-main">
      <div class="vm-nav">
        <ul class="vm-nav-list">
          <li class="vm-nav-item">
              <span class="iconfont" :class="true?'icon-shouqi12-copy':'icon-shouqi1-copy'"></span>
          </li>
          <li
            class="vm-nav-item"
            v-for="(item, index) in vmData"
            :key="index"
            @click="open(item.key)"
          >
            <span class="iconfont" :class="item.icon"></span>
            <span class="nav-title">{{item.name}}</span>
          </li>
        </ul>
      </div>
      <div class="vm-content">
        <div class="vm-content-left">
          <div class="vm-content-box">
            <component :is="currentComponent"></component>
          </div>
          <div class="move-bar"></div>
        </div>
        <div class="vm-content-right">
          <slot name="right"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent ,onMounted,reactive,ref} from 'vue'
import VM from "./VM/VM.vue"
import ExperimentalGuide from "./ExperimentalGuide/ExperimentalGuide.vue"
import ExperimentalExercises from "./ExperimentalExercises/ExperimentalExercises.vue"
import ExperimentalReport from "./ExperimentalReport/ExperimentalReport.vue"
import InClassPractice from "./InClassPractice/ClassPractice.vue"
import InClassForum from "./InClassForum/InClassForum.vue"
export default defineComponent({
    components:{
        VM,
        "experimental-guide":ExperimentalGuide,
        "experimental-exercises":ExperimentalExercises,
        "experimental-report":ExperimentalReport,
        "in-class-practice":InClassPractice,
        "in-class-forum":InClassForum
    },
    props:['VmData'],
    setup(props,{emit}) {
        const vmData=reactive(props.VmData)
        const currentComponent=ref("VM")
        onMounted(()=>{
            console.log("12121")
        })
        function setCurrentComponent(key:string){
            switch (key) {
                case "vm":
                    return "VM"
                case "guide":
                    return "experimental-guide"
                case "exercises":
                    return "experimental-exercises"
                case "report":
                    return "experimental-report"
                case "practice":
                    return "in-class-practice"
                case "forum":
                    return "in-class-forum"
                default:
                    return "VM"
            }
        }
        function open(key:string){
            console.log("我是夫组件打开方法");
            currentComponent.value=setCurrentComponent(key)
        }
        console.log(vmData);
      
        return {open,vmData,currentComponent}
    },
})
</script>


<style lang="less">
.vm-layout {
  height: 100%;
  display: flex;
  flex-direction: column;
  .vm-header {
    height: 70px;
    background: #2c2e45;
    flex-shrink: 0;
  }
  .vm-main {
    flex: 1;
    display: flex;
    flex-direction: row;
    .vm-nav {
      width: 70px;
      background: #e2e2e2;
      flex-shrink: 0;
      .vm-nav-list{
          padding-top: 20px;
          .vm-nav-item{
              display: flex;
              flex-direction: column;
              align-items: center;
              margin-bottom: 32px;
              color: #050101;
              .iconfont{
                  font-size: 22px;
              }
              .nav-title{
                  font-size: 12px;
              }
              &:hover{
                    color: @theme-color;
                    cursor: pointer;
              }
          }
        //   .vm-nav-item:hover{
        //       color: @theme-color;
        //       cursor: pointer;
        //   }
      }
    }
    .vm-content {
      flex: 1;
      display: flex;
      flex-direction: row;
      .vm-content-left {
        width: 434px;
        flex-shrink: 0;
        border-right: 1px solid #515151;
        display: flex;
        .vm-content-box {
          width: 100%;
        }
        .move-bar {
          width: 2px;
          background: #515151;
          height: 100%;
          flex-shrink: 0;
          cursor: col-resize;
          transition: 0.1s;
          &:hover {
            transition: 0.1s;
            transform: scaleX(5);
          }
        }
      }
      .vm-content-right {
        width: 100%;
      }
    }
  }
}
</style>