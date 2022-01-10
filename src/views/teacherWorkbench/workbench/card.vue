<template>
  <div class="workbench-card-box">
    <div class="workbench-content-box">
      <div class="workbench-info-box">
        <div class="content-left">
          <span class="time-text">剩余存活时间</span>
          <span
            class="time-no"
            :style="
              !isNaN(timeToArray(data.is_permanent)[0])
                ? 'font-size:54px'
                : 'font-size:44px'
            "
          >
            <span class="howmany-day"> {{ timeToArray(data.is_permanent)[0] }}</span>
            <sub class="time-unit">{{
              timeToArray(data.is_permanent)[1]
                ? "/ " + timeToArray(data.is_permanent)[1]
                : ""
            }}</sub></span
          >
        </div>
        <div class="content-right">
          <table class="base-info">
            <tr>
              <td>
                <span>内存</span>
                <span>{{ data.flavor.ram_text }}</span>
              </td>
              <td>
                <span>CPU</span>
                <span>{{ data.flavor.cpu_text }}</span>
              </td>
            </tr>
            <tr>
              <td>
                <span>硬盘</span>
                <span>{{ data.flavor.disk_text }}</span>
              </td>
              <td>
                <span>GPU</span>
                <span>{{ data.use_gpu_text }}</span>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div class="use-image-box">
        <span></span>
        <div class="image-right">
          <span class="image-title">使用镜像</span>
          <span class="image-name">{{ data.image.name }}</span>
        </div>
      </div>
      <div class="data-set-box">
        <span></span>
        <div class="data-set-right">
          <span class="data-set-title">数据集</span>
          <span class="data-set-name">
            <span v-if="data.dataset.length > 0">{{ data.dataset[0].name }}</span>
            <span class="no-dataset" v-if="data.dataset.length < 0"
              >本工作台无数据集！</span
            >
            <!-- {{ data.dataset.length > 0 ? data.dataset[0].name : "本工作台无数据集！" }} -->
            <a-tooltip
              v-if="data.dataset && data.dataset.length > 1"
              placement="top"
              overlayClassName="data-set-more-tooltip"
            >
              <template #title>
                <div class="more-list" v-if="true">
                  <div
                    class="title-item"
                    v-for="(ct, ci) in data.dataset"
                    :key="ci.toString()"
                  >
                    {{ ct ? ct.name : "" }}
                  </div>
                </div>
              </template>
              <span class="data-set-more icon-gengduo iconfont"></span> </a-tooltip
          ></span>
        </div>
      </div>
    </div>
    <div class="action-box" :class="isPoll ? 'not-allowed' : ''">
      <div :class="isPoll ? 'no-event' : ''">
        <span @click="deleteFun">
          <span class="icon-shanchu iconfont"></span>
          删除
        </span>
      </div>
      <div
        :class="[
          data.vm
            ? data.vm.status === 1 && data.task_state === null
              ? ''
              : data.vm.status === 1
              ? 'iconloading no-click'
              : 'no-click'
            : 'no-click',
          isPoll ? 'no-event' : '',
        ]"
      >
        <span @click="enterFun">
          <span class="iconfont icon-jinru"></span>
          进入
        </span>
      </div>
      <div :class="isPoll ? 'no-event' : ''">
        <span v-if="data.opening" class="icon-loading iconfont">开启中...</span>
        <span v-else @click="openOrCloseFun">
          <span class="iconfont icon-kaiguanshenx"></span>
          {{ data.vm ? (data.vm.status === 1 ? "关闭" : "开启") : "开启" }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref, Ref } from "vue";

export default defineComponent({
  props: ["content", "index", "isPoll", "opening"],
  emits: ["openOrCloseFun", "enterFun", "deleteFun"],
  setup(props, { emit }) {
    const data: Ref<any> = ref([]);
    const index = props.index;
    const isPoll = ref(false);
    watch(
      () => props.content,
      () => {
        data.value = props.content;
      },
      { deep: true, immediate: true }
    );

    watch(
      () => props.isPoll,
      () => {
        isPoll.value = props.isPoll;
      }
    );
    function openOrCloseFun() {
      emit("openOrCloseFun", data.value, index);
    }
    function enterFun() {
      emit("enterFun", data.value, index);
    }
    function deleteFun() {
      emit("deleteFun", data.value, index);
    }
    // 处理时间
    function timeToArray(time: string): number[] {
      return (time as any).split(":");
    }
    return {
      data,
      isPoll,
      enterFun,
      openOrCloseFun,
      deleteFun,
      timeToArray,
    };
  },
});
</script>

<style lang="less">
.workbench-card-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-image: url("src/assets/images/workbench/fill.png");
  background-repeat: no-repeat;
  background-position: right top;
  .workbench-content-box {
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    width: 100%;
    height: 264px;
    .workbench-info-box {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin-bottom: auto;
      .content-left {
        display: flex;
        flex-direction: column;
        background-image: url("../../../assets/images/workbench/time.png");
        background-size: 100% 100%;
        justify-content: space-between;
        text-align: center;
        width: 104px;
        height: 90px;
        // word-break: normal;
        white-space: nowrap;
        .time-text {
          font-size: 12px;
          letter-spacing: 1px;
          color: rgba(var(--royalpurple-7),.2);
          margin-top: 10px;
        }
        .time-no {
          font-size: 54px;
          background: linear-gradient(180deg, rgba(var(--royalpurple-7),.2), var(--purpleblue-6));
          -webkit-background-clip: text;
          color: transparent;
          font-weight: 500;
          position: relative;
          bottom: 10px;
          .howmany-day {
            font-weight: 500;
          }
          .time-unit {
            font-size: 12px;
            color: #5e66ff;
            font-weight: 400;
          }
        }
      }
      .content-right {
        table.base-info {
          border-collapse: collapse;
          border: none;
          tr {
            &:nth-child(2) {
              border-bottom: none;
              td {
                border-bottom: none;
                border-left: none;
                &:nth-child(2) {
                  border-right: none;
                }
              }
            }
            &:nth-child(1) {
              border-top: none;
              td {
                border-top: none;
                border-left: none;
                &:nth-child(2) {
                  border-right: none;
                }
              }
            }
            td {
              // border: 1px solid #eadff4;
              border: 1px dashed #eadff4;
              height: 50px;
              padding: 0 10px;
              text-align: center;
              > span {
                display: block;
                &:nth-child(1) {
                  font-size: 12px;
                  color: rgba(5, 1, 1, 0.45);
                }
                &:nth-child(2) {
                  font-size: 14px;
                  color: #050101;
                }
              }
            }
          }
        }
      }
    }
    .use-image-box {
      display: flex;
      flex-direction: row;
      > span {
        &:nth-child(1) {
          background: url("../../../assets/images/workbench/iamge.png");
          width: 36px;
          height: 36px;
          display: block;
        }
      }
      .image-right {
        display: flex;
        flex-direction: column;
        margin-left: 10px;
        .image-title {
          font-size: 12px;
          color: rgba(5, 1, 1, 0.45);
        }
        .image-name {
          font-size: 14px;
          color: #050101;
        }
      }
    }
    .data-set-box {
      display: flex;
      flex-direction: row;
      margin-top: 20px;
      > span {
        &:nth-child(1) {
          background: url("../../../assets/images/workbench/data-set.png");
          width: 36px;
          height: 36px;
          display: block;
        }
      }
      .data-set-right {
        display: flex;
        flex-direction: column;
        margin-left: 10px;
        .data-set-title {
          font-size: 12px;
          color: rgba(5, 1, 1, 0.45);
        }
        .data-set-name {
          font-size: 14px;
          color: #050101;
          display: flex;
          align-items: center;
          .no-dataset {
            color: rgba(black, 0.25);
          }
          .data-set-more {
            margin-left: 5px;
            width: 32px;
            text-align: center;
            display: inline-block;
            border-radius: 8px;
            height: 14px;
            line-height: 12px;
            border: 1px solid var(--purpleblue-6);
            font-size: 24px;
            color: var(--purpleblue-6);
            &:hover {
              background-color: var(--purpleblue-6);
              color: var(--black-100);
              cursor: pointer;
            }
          }
        }
      }
    }
  }
  .action-box {
    height: 50px;
    display: flex;
    flex-direction: row;
    background-color: var(--purpleblue-6);
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    > div {
      width: 33.3333%;
      text-align: center;
      line-height: 50px;
      color: var(--black-100);
      cursor: pointer;
    }
    .no-click {
      color: rgba(#ffffff, 0.25);
      pointer-events: none;

      .iconloading {
        color: #ffffff;

        b {
          color: rgba(#ffffff, 0.25);
        }
      }
    }
    .no-event {
      pointer-events: none !important;
    }

    &.not-allowed {
      cursor: not-allowed !important;
    }
  }
}
.data-set-more-tooltip.ant-tooltip {
  max-width: inherit;
}
.data-set-more-tooltip {
  .ant-tooltip-inner {
    background: var(--black-100);
    .more-list {
      color: grey;
      padding: 0 5px 5px 5px;
      font-size: 14px;
      display: flex;
      flex-wrap: nowrap;
    }
  }
  .ant-tooltip-arrow-content {
    background-color: var(--black-100);
  }
}
</style>
