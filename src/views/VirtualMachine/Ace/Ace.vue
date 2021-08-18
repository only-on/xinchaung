<template>
  <layout :VmData="data">
    <template v-slot:header>
      <div class="vm-header-student" v-if="!roleType">
        <div class="vm-header-left">
          <a-button type="primary" @click="back">返回</a-button>
        </div>

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
        <div class="vm-header-left">
          <a-button type="primary" @click="back">返回</a-button>
        </div>

        <div class="vm-header-title">实验名称</div>
        <div class="vm-header-right">
          <a-button type="danger">结束备课</a-button>
        </div>
      </div>
    </template>
    <template v-slot:right>
      <div class="ace-loading" v-if="!aceLoading">loading...</div>
      <div class="ace-box">
        <div class="ace-left">tree</div>
      <div class="ace-right" v-layout-bg="'../assets/common/layout_bg1.jpg'">
        <div class="ace-action">
          <span><i class="iconfont icon-baocun"></i>保存</span>
          <span><i class="iconfont icon-beifen"></i>备份</span>
          <span><i class="iconfont icon-huigun"></i>回滚</span>
          <span><i class="iconfont icon-yunhang"></i>运行</span>
        </div>
        <ace
          v-model:value="content"
          lang="html"
          theme="monokai"
          style="height: 100%"
          :options="options"
        ></ace>
        <div
          class="ace-result"
          :style="{ height: openOrCloseResultStatus ? '200px' : '35px' }"
        >
          <div class="ace-result-title">
            <span @click="openOrClose"
              >收起结果<i
                class="iconfont"
                :class="
                  openOrCloseResultStatus ? 'icon-zhankai' : 'icon-shouqi'
                "
              ></i
            ></span>
          </div>
          <div class="ace-result-box">
            <div class="ace-result-content"></div>
          </div>
        </div>
      </div>
      </div>
    </template>
  </layout>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted, Ref } from "vue";
import layout from "../VmLayout/VmLayout.vue";
import { useRouter } from "vue-router";
import ace from "src/components/ace/ace.vue";
import "src/components/ace/options";

export default defineComponent({
  components: {
    layout,
    ace,
  },
  setup(props, { emit }) {
    const openOrCloseResultStatus: Ref<boolean> = ref(true);
    const options = {
      enableBasicAutocompletion: true,

      enableSnippets: true,

      enableLiveAutocompletion: true,
    };
    let aceLoading:Ref<boolean>=ref(false)
    setTimeout(()=>{
      aceLoading.value=true
    },3000)
    let content = ref("测试12");
    const roleType = ref(true);
    const router = useRouter();
    onMounted(() => {});
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
    function openOrClose() {
      openOrCloseResultStatus.value = !openOrCloseResultStatus.value;
    }
    return {
      roleType,
      back,
      data,
      options,
      content,
      openOrClose,
      openOrCloseResultStatus,
      aceLoading
    };
  },
});
</script>
<style lang="less">
.vm-layout {
  .vm-header {
    .vm-header-student,.vm-header-teacher {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      height: 100%;
      padding: 0 43px;
      .vm-header-left {
      }
      .vm-header-title {
        color: @white;
      }
      .vm-header-right {
        .vm-time {
          color: @red-6;
          margin: 0 10px;
          .iconfont {
            margin-right: 3px;
            font-size: 12px;
          }
        }
      }
    }
  }
  .vm-main {
    .vm-content {
      .vm-content-right {
        .ace-loading{
          position: relative;
          width: 100%;
          height: 100%;
          background: rgba(#515151,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          color: @white;
        }
        .ace-box{
          display: flex;
          flex-direction: row;
          height: 100%;
        }
        .ace-left {
          width: 200px;
          flex-shrink: 0;
          background: #272822;
        }
        .ace-right {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #2f3129;
          .ace-action {
            flex-shrink: 0;
            color: @white;
            padding-left: 20px;
            line-height: 35px;
            white-space: nowrap;
            word-break: break-all;
            > span {
              font-size: 14px;
              margin-right: 25px;
              cursor: pointer;
              transition: 0.2s;
              &:hover {
                color: @theme-color;
              }
              > i {
                font-size: 12px;
                margin-right: 2px;
              }
            }
          }
          .ace-result {
            height: 235px;
            padding-left: 10px;
            background: #2f3129;
            display: flex;
            flex-direction: column;
            transition: 0.2s;
            .ace-result-title {
              color: @white;
              font-size: 12px;
              padding-left: 10px;
              line-height: 35px;
              flex-shrink: 0;
              cursor: pointer;
              .iconfont {
                font-size: 12px;
                margin-left: 3px;
              }
            }
            .ace-result-box {
              background: #000000;
              flex: 1;
            }
          }
        }
      }
    }
  }
}
</style>
