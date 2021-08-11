
<template>
  <div class="vm-layout">
    <div class="vm-header"><slot name="header"></slot></div>
    <div class="vm-main">
      <div class="vm-nav">
        <ul class="vm-nav-list">
          <li class="vm-nav-item" @click="open()">
            <span
              class="iconfont"
              :class="openStatus ? 'icon-shouqi1-copy' : 'icon-shouqi12-copy'"
            ></span>
          </li>
          <li
            class="vm-nav-item"
            v-for="(item, index) in vmData"
            :key="index"
            @click="open(item.key)"
          >
            <span class="iconfont" :class="item.icon"></span>
            <span class="nav-title">{{ item.name }}</span>
          </li>
        </ul>
      </div>
      <div class="vm-content">
        <div
          class="vm-content-left"
          ref="leftEl"
          :style="{ width: openStatus ? '434px' : '0px' }"
        >
          <div class="vm-content-box">
            <component :is="currentComponent"></component>
          </div>
          <div class="move-bar" @mousedown="mousedown" @mouseup="mouseup"></div>
        </div>
        <div class="vm-content-right" ref="rightEl">
          <slot name="right"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from "vue";
import VM from "./VM/VM.vue";
import ExperimentalGuide from "./ExperimentalGuide/ExperimentalGuide.vue";
import ExperimentalExercises from "./ExperimentalExercises/ExperimentalExercises.vue";
import ExperimentalReport from "./ExperimentalReport/ExperimentalReport.vue";
import InClassPractice from "./InClassPractice/ClassPractice.vue";
import InClassForum from "./InClassForum/InClassForum.vue";
export default defineComponent({
  components: {
    VM,
    "experimental-guide": ExperimentalGuide,
    "experimental-exercises": ExperimentalExercises,
    "experimental-report": ExperimentalReport,
    "in-class-practice": InClassPractice,
    "in-class-forum": InClassForum,
  },
  props: ["VmData"],
  setup(props, { emit }) {
    const vmData = reactive(props.VmData);
    const currentComponent = ref("VM");
    const openStatus = ref(false); // left内容打开状态

    const leftEl = ref(null); // 左侧dom
    const rightEl = ref(null); // 右侧dom
    const leftWidth = ref(0); // 左侧宽度
    const rightWidth = ref(0); // 右侧宽度
    let mouseStart = 0; // 鼠标开始移动位置
    let isMove = false;
    onMounted(() => {
      console.log("12121");
      document.onmouseup = () => {
        isMove = false;
        document.onmousemove = null;
      };
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
        default:
          return currentComponent.value;
      }
    }
    // 左边菜单点击事件
    function open(key: string) {
      if (key) {
        openStatus.value = true;
        currentComponent.value = setCurrentComponent(key);
      } else {
        openStatus.value = !openStatus.value;
      }
    }

    // 鼠标按下事件
    function mousedown(e: MouseEvent) {
      console.log("按下");
      console.log(leftEl.value);
      leftWidth.value = (leftEl as any).value.clientWidth;
      rightWidth.value = (rightEl as any).value.clientWidth;
      mouseStart = e.pageX;
      isMove = true;
      console.log(leftWidth.value, rightWidth.value, mouseStart);
      document.onmousemove = (event: any) => {
        changeWidth(event);
      };
    }
    // 鼠标抬起事件
    function mouseup() {
      console.log("抬起");
      isMove = false;
    }

    function changeWidth(event: MouseEvent) {
      if (isMove && event.button === 0) {
        (leftEl as any).value.style.transition = "none";
        const mouseEnd = event.pageX;
        if (mouseStart > mouseEnd) {
          console.log("左");
          (leftEl as any).value.style.width =
            leftWidth.value - mouseStart - (mouseStart - mouseEnd) + "px";
        } else {
          console.log("右");
          (leftEl as any).value.style.width =
            leftWidth.value - mouseStart + (mouseEnd - mouseStart) + "px";
        }
        mouseStart = mouseEnd;
      }
    }
    return {
      openStatus,
      open,
      vmData,
      currentComponent,
      leftEl,
      rightEl,
      mousedown,
      mouseup,
    };
  },
});
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
      .vm-nav-list {
        padding-top: 20px;
        .vm-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 32px;
          color: #050101;
          transition: 0.5s;
          .iconfont {
            font-size: 22px;
          }
          .nav-title {
            font-size: 12px;
          }
          &:hover {
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
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        transition: 0.5s;
        .vm-content-box {
          width: 100%;
        }
        .move-bar {
          width: 6px;
          background: #515151;
          height: 100%;
          flex-shrink: 0;
          cursor: col-resize;
          transition: 0.1s;
          &:hover {
            transition: 0.1s;
            transform: scaleX(1);
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