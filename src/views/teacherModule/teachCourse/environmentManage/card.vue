<template>
  <div class="stu">
    <span class="stu-name" :title="list.number">姓名：
      <span>{{ list.username || "--" }}</span>
      <span class="stu-id" :title="list.number" v-if="list.number">（ {{ list.number || "--" }} ）</span>
    </span>
    <!-- <span class="stu-id" v-if="!(list.student_id == '' && list.number == '')">学号：
      <span class="stu-idname" :title="list.number">{{ list.number || "--" }}</span>
    </span> -->
  </div>
  <div class="swiper-box">
    <a-carousel arrows :beforeChange="beforeChange" :dots="false">
      <template #prevArrow>
        <div class="custom-slick-arrow" :class="current === 0 ? 'first' : ''">
          <span class="iconfont icon-zuojiantou"></span>
        </div>
      </template>
      <template #nextArrow>
        <div
          class="custom-slick-arrow"
          :class="current === list.vms.vms?.length - 1 ? 'last' : ''"
        >
          <span class="iconfont icon-youjiantou"></span>
        </div>
      </template>
      <div
        v-for="v in list.vms.vms"
        :key="v.uuid"
        :class="{
          active: v.status === 'ACTIVE',
          noactive: v.status !== 'ACTIVE',
        }"
      ></div>
    </a-carousel>
    <div
      class="kvm-info"
      :class="currentStatus ? '' : 'close'"
      v-if="list.vms.vms?.length > 0"
    >
      <p class="kvm-status">
        虚机状态：<span>{{ currentStatus ? "开启" : "关闭" }}</span>
      </p>
      <p class="operation-status">
        操作状态：<span>{{ isBusy ? "繁忙" : "空闲" }}</span>
      </p>
    </div>
    <div class="mask" @click="jumpHandle(list)"></div>
  </div>
  <div class="btns" v-if="list.vms.vms?.length > 0">
    <span
      class="btn vm-open pointer"
      @click="btnClick(0)"
      :class="currentStatus ? 'isOpen' : ''"
      >开机</span
    >
    <span
      class="btn vm-close pointer"
      @click="btnClick(1)"
      :class="currentStatus ? '' : 'isOpen'"
      >关机</span
    >
    <a-popover placement="bottom">
      <template #content>
        <div class="btn vm-revert pointer" :class="currentStatus ? '' : 'isOpen'" @click="btnClick(2)" style="marginBottom:10px;padding: 0 10px;">重启</div>
        <div  class="btn vm-reset pointer" @click="btnClick(3)" style="padding: 0 10px;">重置</div>
      </template>
      <!-- <a-button type="primary">Hover me</a-button> style="border-right: 1px solid var(--brightBtn-25);color: #007879;"-->
    
      <span class="iconfont icon-gengduotianchong btn vm-revert pointer"></span>
    </a-popover>
    <!-- <span
      class="btn vm-revert pointer"
      @click="btnClick(2)"
      >重启</span
    >
    <span
      class="btn vm-reset pointer"
      @click="btnClick(3)"
      >重置</span
    > -->
  </div>
</template>

<script lang="ts" setup>
import request from "src/api/index";
import { message } from "ant-design-vue";
import { defineComponent, ref, toRefs, PropType, inject, computed } from "vue";
import { IBusinessResp } from "src/typings/fetch";
import { useRouter, useRoute } from "vue-router";
import ls from "src/utils/extStorage";
import { operatesHandle } from "src/utils/vncInspect";

const router = useRouter();
const route = useRoute();
const type = route.query.type;
const http = (request as any).teachCourse;
interface Props {
  list: any;
  currentExperiment: any
}
const props = withDefaults(defineProps<Props>(), {
  list: () => {},
  currentExperiment: () => {}
});
const emit = defineEmits<{
  (e: "getList", v: string, list: any): void;
}>();
let current = ref(0);
function beforeChange(from: Function, to: number) {
  current.value = to;
}

// 繁忙或空闲
const isBusy = computed(() => {
  const sign = props.list.course_student_content.filter((v: any) => v.vm_uuid === props.list.vms.vms[current.value]?.uuid)[0]
  return sign&&props.list.is_online
})

// 当前环境状态 开启是true
const currentStatus = computed(
  () => props.list.vms.vms[current.value]?.status === "ACTIVE"
);

let vmStatus = {
  0: "startVm",
  1: "closeVm",
  2: "revertVm",
  3: "resetVm",
};

function btnClick(v: any) {
  let param: any = {
    action: vmStatus[v],
    params: {
      uuid: props.list.vms.vms[current.value]?.uuid,
    },
  };
  if (props.list.course_student_content?.length) {
    Object.assign(param.params, {
      type: props.list.course_student_content[0].type,
      opType: 'help',
      taskId: props.list.course_student_content[0].taskId
    })
  }
  operatesHandle(param).then((res: any) => {
    // console.log(res);
    if (!res?.status || !res?.code) return
    const status = v===0||v===1?vmStatus[v] : currentStatus.value ? 'startVm' : 'closeVm'
    res.status ? emit("getList", status, props.list.vms.vms[current.value]) : '';
  });
}

function jumpHandle(list: any) {
  if (props.currentExperiment.type == 3 || props.currentExperiment.type == 4) {
    return false
  }
  http
    .canAccessVm({
      param: { uuid: props.list.vms.vms[current.value].uuid },
    })
    .then((res: IBusinessResp) => {
      if (res.status) {
        // console.log(res);
        // openVm({type:"course",opType:"help",taskId:list.taskId})
        const {href} = router.resolve({
          path: "/vm",
          query: {
            opType: "help",
            type: "course",
            taskId: list.taskId,
            connection_id: ls.lStorage.get("uid") + "_" + list.id,
            experType: props.currentExperiment.type,
            isClose: 1 // 打开的标签页
          },
        }); // 一个是vnc的 /vm/vnc，一个是webide的 /vm/ace
        window.open(href, '_blank');
        // router.push({
        //   name: 'classicalAsset',
        //   params: {
        //     uuid: props.list.vms[current.value].uuid,
        //     id: list.id
        //   }
        // })
      } else {
        message.warning({ content: res.error.msg, duration: 2 });
      }
    });
}
</script>

<style lang="less" scoped>
.stu {
  margin: 14px;
  display: flex;
  justify-content: space-between;
  .stu-name {
    margin-right: 8px;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .stu-id {
    width: 100px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.swiper-box {
  height: 150px;
  position: relative;
  .kvm-info {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    top: -165px;
    position: relative;
    color: #08414d;
    &.close {
      color: var(--primary-color);
    }
  }
}
.btns {
  // text-align: center;
  height: 40px;
  background-color: rgba(28, 178, 179, 0.14);
  .btn {
    display: inline-block;
    height: 19px;
    line-height: 19px;
    // padding: 0 25px;
    margin: 10px 0;
    border-right: 1px solid var(--brightBtn-25);
    color: rgba(0, 120, 121, 1);
    width: 80px;
    text-align: center;
    &:last-child {
      border-right: 0;
    }
    &.isOpen {
      color: rgba(0, 120, 121, 0.25);
      pointer-events: none;
      cursor: not-allowed;
    }
  }
  .btn.disabled {
    opacity: 0.65;
  }
}

.swiper-box {
  .mask {
    width: 200px;
    height: 100%;
    position: absolute;
    top: 0;
    left: 21px;
    cursor: pointer;
    // background-color: papayawhip;
  }
  .active {
    background: url(src/assets/images/vm/kvm-computer-open.png) center no-repeat;
    height: 132px;
    // background-size: 90%;
  }
  .noactive {
    background: url(src/assets/images/vm/kvm-computer-close.png) center
      no-repeat;
    height: 132px;
    // background-size: 90%;
  }
}

.ant-carousel {
  height: 100%;
  // background: url(./kvm-computer-open.png) center no-repeat;
  background-size: 90%;
  .custom-slick-arrow.slick-arrow {
    color: var(--primary-color);
    z-index: 9;
    &.slick-next {
      right: 0;
    }
    &.slick-prev {
      left: 0;
    }
    &.last,
    &.first {
      opacity: 0.25;
      pointer-events: none;
      cursor: not-allowed;
    }
    .iconfont {
      font-size: var(--font-size-20);
      font-weight: 600;
    }
  }
  .swiper {
    height: 165px;
  }
}
.ant-carousel :deep(.slick-slide) {
  text-align: center;
  height: 150px;
  line-height: 150px;
  // background: #364d79;
  overflow: hidden;
}
.isOpen {
  color: rgba(0, 120, 121, 0.25);
  pointer-events: none;
  cursor: not-allowed;
}
</style>
