
<template>
  <div class="vm-layout">
    <div class="vm-header">
      <vm-header></vm-header>
    </div>
    <div class="vm-main">
      <div class="vm-nav" v-if="vmData.length>0">
        <ul class="vm-nav-list">
          <li class="vm-nav-item" @click="open()">
            <span
              class="iconfont"
              :class="openStatus ? 'icon-shouqi1-copy' : 'icon-shouqi12-copy'"
            ></span>
          </li>
          <li
            class="vm-nav-item"
            :class="currentNavKey === item.key ? 'active' : ''"
            v-for="(item, index) in vmData"
            :key="index.toString()"
            @click="open(item.key)"
          >
            <span class="iconfont" :class="item.icon"></span>
            <span class="nav-title">{{ item.name }}</span>
          </li>
        </ul>
      </div>
      <div class="vm-content" ref="vmWrapEl">
        <div
          class="vm-content-left"
          ref="leftEl"
          :style="{ width: openStatus ? leftWidth + 'px' : '0px' }"
          v-if="isLeftContentShowType === 'line'"
        >
          <div class="vm-content-box">
            <div class="warn-hint">
              <span class="iconfont icon-warn"></span
              >该课件仅用于人工智能教学，请勿用于其他用途。
            </div>
            <component :is="currentComponent"></component>
          </div>
          <div class="move-bar" @mousedown="mousedown" @mouseup="mouseup"></div>
        </div>
        <div
          class="vm-content-right"
          ref="rightEl"
          :style="{ width: rightWidth + 'px' }"
        >
          <slot name="right" :data="rightWidth"></slot>
        </div>
      </div>
    </div>
  </div>
  <a-drawer
    title="Basic Drawer"
    placement="left"
    :closable="false"
    :visible="drawerVisible"
    @close="drawerClose"
    :style="{ left: drawerVisible ? '70px' : '0px' }"
    width="600px"
    class="content-drawer"
  >
    <div class="vm-content-box">
      <div class="warn-hint">
        <span class="iconfont icon-warn"></span
        >该课件仅用于人工智能教学，请勿用于其他用途。
      </div>
      <component :is="currentComponent"></component>
    </div>
  </a-drawer>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  ref,
  nextTick,
  watch,
  Ref,
  provide,
  computed,
  toRefs,
} from "vue";
import VM from "./VM/VM.vue";
import ExperimentalGuide from "./ExperimentalGuide/ExperimentalGuide.vue";
import ExperimentalExercises from "./ExperimentalExercises/ExperimentalExercises.vue";
import ExperimentalReport from "./ExperimentalReport/ExperimentalReport.vue";
import InClassPractice from "./InClassPractice/ClassPractice.vue";
import InClassForum from "./InClassForum/InClassForum.vue";
import VmHeader from "./VmHeader.vue";
import ExperimentalNote from "./ExperimentalNote/ExperimentalNote.vue";
import TrainCourseware from "./TrainCourseware/TrainCoursewar.vue";
import TrainResource from "./TrainResource/TrainResource.vue";
import TrainNote from "./TrainNote/TrainNote.vue";
import TrainReport from "./TrainReport/TrainReport.vue"

interface Vm {
  key: string;
  icon: string;
  name: string;
}
export default defineComponent({
  components: {
    VM,
    "experimental-guide": ExperimentalGuide,
    "experimental-exercises": ExperimentalExercises,
    "experimental-report": ExperimentalReport,
    "in-class-practice": InClassPractice,
    "in-class-forum": InClassForum,
    "vm-header": VmHeader,
    "experimental-note": ExperimentalNote,
    "train-courseware": TrainCourseware,
    "train-resource": TrainResource,
    "train-note":TrainNote,
    "train-report":TrainReport
  },
  props: ["VmData", "reportId", "isLeftContentShowType"],
  setup(props, { emit }) {
    const vmData: Ref<Array<Vm>> = reactive(props.VmData);
    var reportId: any = computed(() => {
      return props.reportId;
    });
    provide("reportId", reportId);
    const currentComponent = (vmData as any).length>0?ref(vmData[0].key):"";
    const openStatus = ref(false); // left内容打开状态

    const vmWrapEl: Ref<HTMLElement | null> = ref(null);
    const leftEl: Ref<HTMLElement | null> = ref(null); // 左侧dom
    const rightEl: Ref<HTMLElement | null> = ref(null); // 右侧dom
    const vmWrapWidth: Ref<number> = ref(0);
    const leftWidth: Ref<number> = ref(443); // 左侧宽度
    const rightWidth: Ref<number> = ref(0); // 右侧宽度
    let mouseStart: number = 0; // 鼠标开始移动位置
    let isMove: boolean = false; // 当前是否可以拖动标识
    let currentNavKey: Ref<string> = ref("VM");
    const isLeftContentShowType = props.isLeftContentShowType;
    const drawerVisible = ref(false);
    // 自定义事件
    const eventCustom = document.createEvent("HTMLEvents");
    eventCustom.initEvent("resize", true, true);
    onMounted(() => {
      nextTick(() => {
        vmWrapWidth.value = window.innerWidth - 70;
        rightWidth.value =
          vmWrapWidth.value - (openStatus.value ? leftWidth.value - 1 : 1);
      });
      // window鼠标抬起事件
      document.onmouseup = () => {
        isMove = false;
        document.onmousemove = null;
        document.body.style.pointerEvents = "all";
        document.body.style.userSelect = "auto";
      };
      // 监听window变化事件
      window.addEventListener("resize", function () {
        // vmWrapWidth.value = (vmWrapEl as any).value?.clientWidth;
        vmWrapWidth.value = window.innerWidth - 70;
      });
    });

    // 监听vmWrapWidth变化
    watch(vmWrapWidth, () => {
      rightWidth.value =
        vmWrapWidth.value - (openStatus.value ? leftWidth.value - 1 : 1);
    });
    // 返回当前的菜单类型
    function setCurrentComponent(key: string) {
      switch (key) {
        case "vm":
          return "VM";
        case "guide":
          return "experimental-guide";
        case "exercises":
          return "experimental-exercises";
        case "report":
          return "experimental-report";
        case "practice":
          return "in-class-practice";
        case "forum":
          return "in-class-forum";
        case "experimental-note":
          return "experimental-note";
          case "train-note":
          return "train-note";
        case "courseware":
          return "train-courseware";
        case "resource":
          return "train-resource";
        case "train-report":
          return "train-report"
        default:
          return currentComponent.value;
      }
    }
    // 左边菜单点击事件
    function open(key?: string) {
      if (isLeftContentShowType === "line") {
        // 当为关闭状态时，从新设置值
        vmWrapWidth.value = window.innerWidth - 70;
        if (!openStatus.value) {
          leftWidth.value = 443;
        }

        if (key) {
          openStatus.value = true;
          currentNavKey.value = key;
          currentComponent.value = setCurrentComponent(key);
        } else {
          openStatus.value = !openStatus.value;
        }
        rightWidth.value =
          vmWrapWidth.value - (openStatus.value ? leftWidth.value - 1 : 1);
        window.dispatchEvent(eventCustom);
        return;
      }
      if (isLeftContentShowType === "float") {
        drawerVisible.value = true;
        if (currentNavKey.value === key) {
          return;
        }
        if (key) {
          currentNavKey.value = key;
          currentComponent.value = setCurrentComponent(key);
        }
      }
    }

    // 鼠标按下事件
    function mousedown(e: MouseEvent) {
      leftWidth.value = (leftEl as any).value.clientWidth;
      rightWidth.value = (rightEl as any).value.clientWidth;
      vmWrapWidth.value = window.innerWidth - 70;
      mouseStart = e.pageX;
      isMove = true;
      document.onmousemove = (event: any) => {
        document.body.style.pointerEvents = "none";
        document.body.style.userSelect = "none";
        changeWidth(event);
      };
    }
    // 鼠标抬起事件
    function mouseup() {
      isMove = false;
      document.onmousemove = null;
    }

    // 左右比例发生变化时
    function changeWidth(event: MouseEvent) {
      // 可以改变比例
      if (isMove && event.button === 0) {
        (leftEl as any).value.style.transition = "none";
        const mouseEnd = event.pageX;
        // 向左移动
        if (mouseStart > mouseEnd) {
          if (leftWidth.value < 8) return; // 左边预留8px
          leftWidth.value = leftWidth.value - (mouseStart - mouseEnd);
          rightWidth.value = vmWrapWidth.value - leftWidth.value;
        } else {
          // 向右移动
          if (vmWrapWidth.value - leftWidth.value < 8) return; // 右边预留8px
          leftWidth.value = leftWidth.value + (mouseEnd - mouseStart);
          rightWidth.value = vmWrapWidth.value - leftWidth.value;
        }
        mouseStart = mouseEnd;
      }
      window.dispatchEvent(eventCustom);
    }

    // 关闭抽屉
    function drawerClose() {
      drawerVisible.value = false;
    }
    return {
      openStatus,
      open,
      vmData,
      reportId,
      currentComponent,
      vmWrapEl,
      leftEl,
      rightEl,
      mousedown,
      mouseup,
      leftWidth,
      rightWidth,
      currentNavKey,
      isLeftContentShowType,
      drawerVisible,
      drawerClose,
    };
  },
});
</script>


<style lang="less">
.vm-layout {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .vm-header {
    height: 70px;
    background: #2c2e45;
    flex-shrink: 0;
  }
  .vm-main {
    height: calc(100% - 70px);
    display: flex;
    flex-direction: row;
    .vm-nav {
      width: 70px;
      background: #e2e2e2;
      flex-shrink: 0;
      .vm-nav-list {
        padding-top: 20px;
        .vm-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 32px;
          color: #050101;
          transition: 0.5s;
          &.active {
            color: var(--primary-color);
          }
          .iconfont {
            font-size: 22px;
          }
          .nav-title {
            font-size: 12px;
          }
          &:hover {
            color: var(--primary-color);
            cursor: pointer;
          }
        }
        //   .vm-nav-item:hover{
        //       color: var(--primary-color);
        //       cursor: pointer;
        //   }
      }
    }
    .vm-content {
      flex: 1;
      display: flex;
      flex-direction: row;
      .vm-content-left {
        position: relative;
        width: 434px;
        flex-shrink: 0;
        border-right: 1px solid #515151;
        display: flex;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        transition: 0.5s;
        .vm-content-box {
          width: 100%;
          .warn-hint {
            color: #ff3e00;
            text-align: center;
            font-size: 12px;
            line-height: 25px;
            background: #fff8f8;
            > .iconfont {
              margin-right: 5px;
            }
          }
        }
        .move-bar {
          pointer-events: all;
          width: 6px;
          background: #515151;
          height: 100%;
          flex-shrink: 0;
          cursor: col-resize;
          // transition: 0.1s;
          position: absolute;
          right: 0;
          &:hover {
            // transition: 0.1s;
            // transform: scaleX(1);
          }
        }
      }
      .vm-content-right {
        width: 100%;
        overflow: hidden;
      }
    }
  }
}
.vm-content-box {
  width: 100%;
  .warn-hint {
    color: #ff3e00;
    text-align: center;
    font-size: 12px;
    line-height: 25px;
    background: #fff8f8;
    > .iconfont {
      margin-right: 5px;
    }
  }
}
.content-drawer {
  .ant-drawer-header {
    display: none;
  }
  .ant-drawer-body {
    padding: 0;
  }
}
</style>