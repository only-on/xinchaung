<template>
  <div class="vm-layout">
    <div class="vm-header">
    <slot name="header">
      <vm-header></vm-header>
    </slot>
      
    </div>
    <div class="vm-main">
      <div
        class="vm-left"
        ref="leftEl"
        :style="{ width: leftWidth + 'px' }"
      >
        <div class="leftPanel">
            <slot name="leftNav">
               <leftPanel></leftPanel>
            </slot>
        </div>
        <div class="move-bar" @mousedown="mousedown" @mouseup="mouseup"></div>
      </div>
      <div class="vm-content" ref="vmWrapEl">
        <div class="vm-content-right" ref="rightEl">
          <slot name="right"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted, Ref, defineProps, inject } from "vue";
import VmHeader from "./newVmHeader.vue";
import leftPanel from "./leftPanel.vue";
const props = defineProps({
  navData: {
    type: Array as any,
    defalut: [],
  },
});

const currentNavKey = ref("");
const leftEl = ref(null); // left
const rightEl = ref(null); // right
const leftWidth = inject("leftWidth",ref(45));
const rightWidth = inject("rightWidth",ref(window.innerWidth - 45));
const vmWrapWidth: Ref<number> = ref(0);

let mouseStart: number = 0; // 鼠标开始移动位置
let isMove: boolean = false; // 当前是否可以拖动标识

// 自定义事件
const eventCustom = document.createEvent("HTMLEvents");
eventCustom.initEvent("resize", true, true);
function open(type: string) {
  console.log(type);
}

// 鼠标按下事件
function mousedown(e: MouseEvent) {
  console.log(333);

  leftWidth.value = (leftEl as any).value.clientWidth;
  rightWidth.value = (rightEl as any).value.clientWidth;
  vmWrapWidth.value = window.innerWidth - 45;
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
  console.log(111111);

  document.onmousemove = null;
}

// 左右比例发生变化时
function changeWidth(event: MouseEvent) {
  //   if (leftWidth.value === 200) {
  //     return;
  //   }
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
onMounted(() => {
  currentNavKey.value = props.navData[0].key;
  document.onmouseup = () => {
    isMove = false;
    document.onmousemove = null;
    document.body.style.pointerEvents = "all";
    document.body.style.userSelect = "auto";
  };
});
</script>

<style lang="less" scoped>
.vm-layout {
  height: 100%;
  flex-shrink: 0;
  .vm-main {
    height: calc(100% - 45px);
    display: flex;
    overflow-y:hidden ;
  }
  .vm-content {
    height: 100%;
    width: 100%;
    background: #0c182e;
  }
  .vm-content-right {
    height: 100%;
  }
  .vm-left {
    height: 100%;
    position: relative;
    min-width: 51px;
    flex-shrink: 0;
    display: flex;
    flex-direction: row;
    
  }
  .leftPanel{
    flex: 1;
    display: flex;
    flex-direction: row;
    overflow-x: hidden;
  }
  .move-bar {
    pointer-events: all;
    width: 6px;
    background: #515151;
    height: 100%;
    flex-shrink: 0;
    cursor: col-resize;
    position: absolute;
    right: 0;
  }
}
</style>
