<template>
  <div class="vm-layout">
    <div class="vm-header">
      <vm-header></vm-header>
    </div>
    <div class="vm-main">
      <div class="vm-nav" v-if="vmData.length > 0">
        <ul class="vm-nav-list">
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
        <div
          class="vm-content-left"
          ref="leftEl"
          :style="{ width: openStatus ? leftWidth + 'px' : '0px' }"
          v-if="isLeftContentShowType === 'line'"
        >
          <div class="vm-content-box" v-if="!contentShow">
            <div class="warn-hint">
              <span class="iconfont icon-warn"></span
              >该课件仅用于人工智能教学，请勿用于其他用途。
            </div>
            <component :is="currentComponent"></component>
          </div>
          <div class="move-bar" @mousedown="mousedown" @mouseup="mouseup"></div>
          <div class="shouqi pointer" @click="open()"></div>
        </div>
        <div class="forumn" v-if="openStatus">
          <div class="forumn-input" v-if="!isShowForumn">
            <a-input @focus="isShowForumn = true" placeholder="说点什么" />
          </div>
          <div class="forumn-create" v-if="isShowForumn">
            <span class="close pointer" @click="isShowForumn = false"
              ><span class="iconfont icon-guanbi"></span
            ></span>
            <a-form ref="formRef" :model="formState" labelAlign="left">
              <a-form-item label="帖子名称" name="name">
                <a-input
                  v-model:value="formState.title"
                  placeholder="请在这里输入帖子标题"
                />
              </a-form-item>
              <a-form-item>
                <QuillEditor
                  v-model="formState.content"
                  :height="'200px'"
                  :uploadPathName="'teacherForum'"
                />
              </a-form-item>
              <a-form-item class="btn">
                <a-button type="primary" @click.prevent="onSubmit"
                  >发布</a-button
                >
              </a-form-item>
            </a-form>
          </div>
        </div>
      </div>
      <div class="vm-content" ref="vmWrapEl">
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
  <a-modal v-model:visible="contentShow" :width="1000" :footer="false">
    <component :is="currentComponent"></component>
  </a-modal>
  <a-drawer
    title="Basic Drawer"
    placement="left"
    :closable="false"
    v-model:visible="drawerVisible"
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
import ExperimentalGuide from "./ExperimentalGuide/Guide.vue";
import ExperimentalExercises from "./ExperimentalExercises/ExperimentalExercises.vue";
import ExperimentalReport from "./ExperimentalReport/ExperimentalReport.vue";
import InClassPractice from "./InClassPractice/ClassPractice.vue";
import InClassForum from "./InClassForum/InClassForum.vue";
import VmHeader from "./VmHeader.vue";
import ExperimentalNote from "./ExperimentalNote/ExperimentalNote.vue";
import TrainCourseware from "./TrainCourseware/TrainCoursewar.vue";
import TrainResource from "./TrainResource/TrainResource.vue";
import TrainNote from "./TrainNote/TrainNote.vue";
import TrainReport from "./TrainReport/TrainReport.vue";
import QuillEditor from "src/components/editor/quill.vue";
import { Delta } from "quill-delta";

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
    "train-note": TrainNote,
    "train-report": TrainReport,
    QuillEditor,
  },
  props: ["VmData", "reportId", "isLeftContentShowType"],
  setup(props, { emit }) {
    const vmData: Ref<Array<Vm>> = reactive(props.VmData);
    var reportId: any = computed(() => {
      return props.reportId;
    });
    provide("reportId", reportId);
    const currentComponent =
      (vmData as any).length > 0 ? ref(vmData[0].key) : "";
    // currentComponent.value = setCurrentComponent(currentComponent.value)
    const openStatus = ref(false); // left内容打开状态

    const vmWrapEl: Ref<HTMLElement | null> = ref(null);
    const leftEl: Ref<HTMLElement | null> = ref(null); // 左侧dom
    const rightEl: Ref<HTMLElement | null> = ref(null); // 右侧dom
    const vmWrapWidth: Ref<number> = ref(0);
    const leftWidth: Ref<number> = ref(443); // 左侧宽度
    const rightWidth: Ref<number> = ref(0); // 右侧宽度
    let mouseStart: number = 0; // 鼠标开始移动位置
    let isMove: boolean = false; // 当前是否可以拖动标识
    let currentNavKey: Ref<string> = ref("");
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
          return "train-report";
        default:
          return currentComponent.value;
      }
    }
    // 左边菜单点击事件
    function open(key?: string) {
      console.log(key);
      if (key == "report") {
        contentShow.value = true;
        openStatus.value = false;
        drawerVisible.value = false;
        rightWidth.value =
          vmWrapWidth.value - (openStatus.value ? leftWidth.value - 1 : 1);
        window.dispatchEvent(eventCustom);
        currentComponent.value = setCurrentComponent(key);
        return;
      } else {
        contentShow.value = false;
      }
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
          bottomStyle.display = "none";
        }
        rightWidth.value =
          vmWrapWidth.value - (openStatus.value ? leftWidth.value - 1 : 1);
        window.dispatchEvent(eventCustom);
        return;
      }
      if (isLeftContentShowType === "float") {
        if (!key) {
          drawerVisible.value = !drawerVisible.value;
        } else {
          drawerVisible.value = true;
        }

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
      if (leftWidth.value === 200) {
        return;
      }
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

    // 论坛
    let isShowForumn = ref<boolean>(false);
    let formState = reactive<IFormState>({
      title: "",
      content: {
        ops: [],
      },
    });
    // 发帖
    function onSubmit() {}

    //
    const contentShow = ref(false); // 1 正常左侧显示，2 弹框显示

    // 问答 点击展开全文 底部收起样式
    let bottomStyle = reactive({
      bottom: "70px",
      width: "403px",
      background: "rgba(252, 252, 252, 0.8)",
      display: "flex",
    });
    provide("bottomStyle", bottomStyle);
    watch(leftWidth, () => {
      bottomStyle.width = leftWidth.value - 40 + "px";
    });
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
      isShowForumn,
      formState,
      onSubmit,
      contentShow,
      bottomStyle,
    };
  },
});
interface IFormState {
  title: string;
  content: Delta;
}
</script>

<style lang="less">
.vm-layout {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .vm-header {
    height: 70px;
    background: #192843;
    flex-shrink: 0;
  }
  .vm-main {
    height: calc(100% - 70px);
    display: flex;
    flex-direction: row;
    .vm-nav {
      display: flex;
      position: relative;
      .vm-nav-list {
        // padding-top: 20px;
        color: var(--black-65);
        width: 74px;
        background: var(--lightgray-2);
        flex-shrink: 0;
        .vm-nav-item {
          // display: flex;
          // flex-direction: column;
          // align-items: center;
          // margin-bottom: 32px;
          // color: #050101;
          transition: 0.5s;
          height: 43px;
          line-height: 19px;
          padding: 12px 14px;
          &.active {
            color: var(--primary-color);
          }
          .iconfont {
            font-size: var(--base-font-size);
            margin-right: 4px;
          }
          .nav-title {
            // font-size: 12px;
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
        background-color: var(--white-100);
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
        .shouqi {
          height: 159px;
          width: 10px;
          background: #e9e9e9;
          border-radius: 4px 0px 0px 4px;
          position: absolute;
          right: 6px;
          top: 50%;
          margin-top: -80px;
          &::before {
            content: "";
            display: inline-block;
            width: 0;
            height: 0;
            border: 4px solid rgba(0, 0, 0, 0.45);
            border-top-color: transparent;
            border-left-color: transparent;
            border-bottom-color: transparent;
            position: absolute;
            top: 50%;
            margin-top: -2px;
            right: 3px;
          }
        }
      }
      .forumn {
        width: 100%;
        position: absolute;
        bottom: 0;
        background-color: var(--white-100);
        box-shadow: 0px -3px 6px 0px rgba(0, 0, 0, 0.14);
        .forumn-input {
          padding: 18px 42px 18px 37px;
        }
        .forumn-create {
          padding: 20px 30px;
          position: relative;
          .ant-form {
            .btn {
              margin-bottom: 0;
              text-align: right;
            }
            .ant-input {
              width: 340px;
            }
          }
          .close {
            position: absolute;
            top: 13px;
            right: 13px;
            color: var(--black-45);
          }
        }
      }
    }
    .vm-content {
      flex: 1;
      display: flex;
      flex-direction: row;
      .vm-content-right {
        width: 100%;
        overflow: hidden;
      }
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
