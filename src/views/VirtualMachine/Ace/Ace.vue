<template>
  <layout :VmData="data">
    <template v-slot:header>
      <div class="vm-header-student" v-if="roleType">
          <div class="vm-header-left"><a-button type="primary"  @click="back">返回</a-button></div>
          
            <div class="vm-header-title">实验名称</div>
            <div class="vm-header-right">
                <a-button type="danger">结束实验</a-button>
                <span class="vm-time">
                    <span class="icon-shijian1 iconfont"></span>
                    <span>实验剩余时间: 05时07分43秒</span>
                </span>
                <a-button type="primary">延时</a-button>
            </div>
      </div>
      <div v-else class="vm-header-teacher">
          <a-button type="primary" @click="back">返回</a-button>
      </div>
    </template>
    <template v-slot:right>right</template>
  </layout>
</template>

<script lang="ts">
import { defineComponent, reactive,ref } from "vue";
import layout from "../VmLayout/VmLayout.vue";
import { useRouter } from "vue-router";

export default defineComponent({
  components: {
    layout,
  },
  setup(props, { emit }) {
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
    return { roleType,back, data };
  },
});
</script>
<style lang="less">
    .vm-layout{
        .vm-header{
            .vm-header-student{
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                height: 100%;
                padding: 0 43px;
                .vm-header-left{

                }
                .vm-header-title{
                    color: @white;
                }
                .vm-header-right{
                    .vm-time{
                        color: @red-6;
                        margin: 0 10px;
                        .iconfont{
                            margin-right: 3px;
                            font-size: 12px;
                        }
                    }
                }
            }
        }
    }
</style>
