<template>
  <layout :VmData="data">
    <template v-slot:header>
      <div class="vm-header-student" v-if="!roleType">
          <div class="vm-header-left">
            <a-button type="primary"  @click="back">返回</a-button>
            <a-button type="primary">操作</a-button>
          </div>
          
            <div class="vm-header-title">实验名称</div>
            <div class="vm-header-right">
                
                <span class="vm-time">
                    <span class="icon-shijian1 iconfont"></span>
                    <span>实验剩余时间: 05时07分43秒</span>
                </span>
                <a-button class="delayed-btn">延时</a-button>
                <span class="vm-action-box">
                  <a-button type="primary">保存进度</a-button>
                  <a-button type="danger">结束实验</a-button>
                </span>
            </div>
      </div>
      <div v-else class="vm-header-teacher">
          <div class="vm-header-left">
            <a-button type="primary"  @click="back">返回</a-button>
            <a-button type="primary">操作</a-button>
          </div>
          
            <div class="vm-header-title">实验名称</div>
            <div class="vm-header-right">
                <span class="vm-action-box">
                  <a-button type="danger">结束备课</a-button>
                </span>
            </div>
      </div>
    </template>
    <template v-slot:right>
      <div v-if="!vncLoadingV" class="vncloading">Loading...</div>
        <vue-no-vnc background="rgb(40,40,40)" refName="refName" password="vncpassword" wsUrl="ws://192.168.101.150:8888/websockify?vm_uuid=c417fb05-c2f4-4cc9-9791-ecac23c448c5"/>
    </template>
  </layout>
</template>

<script lang="ts">
import { defineComponent, reactive,ref ,Ref,provide,watch} from "vue";
import layout from "../VmLayout/VmLayout.vue";
import { useRouter } from "vue-router";
import VueNoVnc from "src/components/noVnc/noVnc.vue"
export default defineComponent({
  components: {
    layout,
    "vue-no-vnc":VueNoVnc
  },
  setup(props, { emit }) {
    let vncLoadingV=ref(false)
    provide("vncLoading",vncLoadingV)
    const roleType=ref(true)
    const router = useRouter();
    let navData = [
      { name: "虚拟机", key: "vm", icon: "icon-xuniji" },
      { name: "实验指导", key: "guide", icon: "icon-zhidao" },
      { name: "实验习题", key: "exercises", icon: "icon-xiti1" },
      { name: "实验报告", key: "report", icon: "icon-baogao1" },
      { name: "随堂练习", key: "practice", icon: "icon-biji" },
      { name: "随堂论坛", key: "forum", icon: "icon-luntan1" },
    ];
    const data = reactive(navData);
    function back() {
      router.go(-1);
    }
    
    // setInterval(()=>{
    //   // console.log(vncLoadingV.value);
    //   vncLoadingV.value=!vncLoadingV.value
    //   // console.log(vncLoadingV.value=false);
      
    // },1000)

    watch(vncLoadingV,()=>{
      console.log(vncLoadingV.value);
      
    })
    return { roleType,back, data,provide,vncLoadingV };
  },
});
</script>
<style lang="less">
    .vm-layout{
        .vm-header{
            .vm-header-student,.vm-header-teacher{
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                height: 100%;
                padding: 0 43px;
                .vm-header-left{
                  >button{
                    margin-right: 20px;
                  }
                }
                .vm-header-title{
                    color: @white;
                }
                .vm-header-right{
                  .delayed-btn{
                    background: @warning-color;
                    color: @white;
                    border: none;
                    &:hover{
                      background: rgba(#faad14, 0.8);
                    }
                  }
                    .vm-time{
                        color: @warning-color;
                        margin: 0 10px;
                        .iconfont{
                            margin-right: 3px;
                            font-size: 12px;
                        }
                    }
                    .vm-action-box{
                      margin-left: 25px;
                      >button{
                        margin-left: 20px;
                      }
                    }
                }
            }
        }
        .vm-content-right{
          .vncloading{
            position: relative;
            width: 100%;
            height: 100%;
            background: rgba(#515151, 0.8);
            color: @white;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
    }
</style>
