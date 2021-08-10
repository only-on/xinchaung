
<template>
  <div class="vm-layout">
    <div class="vm-header" @click="open"><slot name="header"></slot></div>
    <div class="vm-main">
      <div class="vm-nav">
          <ul>
              <li>打开</li>
              <li v-for="(item,index) in vmData" :key="index">{{item}}</li>
          </ul>
      </div>
      <div class="vm-content">
        <div class="vm-content-left">
          <div class="vm-content-box">
              <!-- <component :is=""></component> -->
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
import { defineComponent ,onMounted,reactive} from 'vue'

export default defineComponent({
    props:['VmData'],
    setup(props,{emit}) {
        const vmData=reactive(props.VmData)
        onMounted(()=>{
            console.log("12121")
        })
        function open(){
            console.log("我是夫组件打开方法");
        }
        console.log(vmData);
        
        return {open,vmData}
    },
})
</script>


<style lang="scss">
.vm-layout{
    height: 100%;
    display: flex;
    flex-direction: column;
    .vm-header{
        height: 70px;
        background: #2C2E45;
        flex-shrink: 0;
    }
    .vm-main{
        flex: 1;
        display: flex;
        flex-direction: row;
        .vm-nav{
            width: 70px;
            background: #E2E2E2;
            flex-shrink: 0;
        }
        .vm-content{
            flex: 1;
            display: flex;
            flex-direction: row;
            .vm-content-left{
                width: 434px;
                flex-shrink: 0;
                border-right:1px solid #515151;
                display: flex;
                .vm-content-box{
                    width: 100%;
                }
                .move-bar{
                    width: 2px;
                    background: #515151;
                    height: 100%;
                    flex-shrink: 0;
                    cursor: col-resize;
                    transition: 0.1s;
                    &:hover{
                        transition: 0.1s;
                        transform: scaleX(5);
                    }
                }
            }
            .vm-content-right{
                width: 100%;
            }
        }
    }
}
</style>