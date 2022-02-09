<template>
  <span class="stu-name">{{list.username || '--'}}</span>
  <span class="stu-id" v-if="!(list.student_id == '' && list.number == '')"><span class="stu-idname">学号：</span>{{list.number ||'--'}}</span>
  <div class="swiper-box">
    <a-carousel arrows :beforeChange="beforeChange">
      <template #prevArrow>
        <div class="custom-slick-arrow"></div>
      </template>
      <template #nextArrow>
        <div class="custom-slick-arrow"></div>
      </template>
      <div v-for="v in list.vms" :key="v.uuid" :class="{'active': v.status === 'ACTIVE', 'noactive': v.status !== 'ACTIVE'}"></div>
    </a-carousel>
    <div class="kvm-info">
      <p class="kvm-status">虚机状态：<span>{{list.vms[current].status === 'ACTIVE' ? '开启' : '关闭'}}</span></p>
      <p class="operation-status">操作状态：<span>{{list.online && list.vms[current].uuid === list.current ? '繁忙' : '空闲'}}</span></p>
    </div>
    <div class="mask" @click="jumpHandle(list)"></div>
  </div>
  <div class="btns">
    <a-button type="primary" title="开机" :disabled="list.vms[current].status === 'ACTIVE'" @click="btnClick(0)"><play-circle-outlined /></a-button>
    <a-button type="primary" title="关机" :disabled="list.vms[current].status !== 'ACTIVE'" @click="btnClick(1)"><poweroff-outlined /></a-button>
    <a-button type="primary" title="重启" :disabled="list.vms[current].status !== 'ACTIVE'" @click="btnClick(2)"><reload-outlined/></a-button>
    <a-button type="primary" title="重置" :disabled="list.vms[current].status !== 'ACTIVE'" @click="btnClick(3)"><sync-outlined/></a-button>
  </div>
</template>

<script lang="ts">
import { PlayCircleOutlined, PoweroffOutlined, ReloadOutlined, SyncOutlined  } from '@ant-design/icons-vue';
import request from 'src/api/index'
import { message } from 'ant-design-vue'
import { defineComponent, ref, toRefs, PropType, inject } from 'vue'
import { IBusinessResp } from 'src/typings/fetch'
import { Ihttp, ICourseInfo } from './typings'
import { useRouter, useRoute } from 'vue-router'

interface Ivms {
  uuid: string
  // atype: string
  status: string,
}
interface Ilist {
  id: number
  username: string
  student_id: string
  online: number
  number: string
  current: string
  vms: Ivms[]
}

export default defineComponent({
  props: {
    list: {
      type: Object as PropType<Ilist>,
      default: {}
    }
  },
  emits: ['getList'],
  components: {PlayCircleOutlined, PoweroffOutlined, ReloadOutlined, SyncOutlined},
  setup(props, {emit}) {
    const router = useRouter()
    const route = useRoute()
    const courseInfo = inject('courseInfo') as ICourseInfo
    
    const http=(request as Ihttp).teachCourse

    let current = ref(0)
    function beforeChange(from:Function, to:number) {
      current.value= to
    }

    let apiList = ['vmOpen', 'vmClose', 'vmRevert', 'vmReset']
    let params = {
      // uuid: 'e81c9056-91c6-4695-8188-a815f28ba34a', // props.list.vms[current].uuid
      uuid: props.list.vms[current.value]?.uuid,
      atype: courseInfo.type
    }
    function btnClick(v: number) {
      http[apiList[v]]({param: params}).then((res: IBusinessResp) => {
        if (res && res.status) {
          emit('getList')
          message.success({ content: '请求成功!', duration: 2 });
        } else if (res) {
          // res.error.msg
        }
      })
    }

    function jumpHandle(list: {id: number}) {
      http.canAccessVm({
        param: {uuid: props.list.vms[current.value].uuid}
      }).then((res: IBusinessResp) => {
        if (res.status) {
          router.push('/vm/vnc')  // 一个是vnc的 /vm/vnc，一个是webide的 /vm/ace
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
      })
    }
    
    return {
      ...toRefs(props),
      current,
      beforeChange,
      btnClick,
      jumpHandle,
    }
  },
})
</script>

<style lang="less" scoped>
.stu-name {
  color: var(--primary-color);
  font-size: 22px;
  min-height: 25px;
  font-weight: 600;
  display: inline-block;
  max-width: 130px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.stu-id {
  font-size: 16px;
  color: #464646;
  line-height: 29px;
  display: inline-block;
  max-width: 135px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  float: right;
}
.swiper-box {
  height: 165px;
  position: relative;
  .kvm-info {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    top: -165px;
    position: relative;
    color: var(--white-100);
    font-size: 12px;
  }
}
.btns {
  text-align: center;
  .btn {
    height: 30px;
    font-size: 20px;
    color: var(--white-100);
    padding: 0 13px;
    margin: 0px 2px;
    background-color: var(--primary-color);
    color: var(--white-100);
    border: 1px solid transparent;
    border-radius: 3px;
    // opacity: .65;
  }
  .btn.disabled {
    opacity: .65;
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
    height: 165px;
    background-size: 90%;
  }
  .noactive {
    background: url(src/assets/images/vm/kvm-computer-close.png) center no-repeat;
    height: 165px;
    background-size: 90%;
  }
}
.btns {
  height: 30px;
  // padding-right: 17px;
  .ant-btn {
    height: 30px;
    font-size: 20px;
    color: var(--white-100);
    padding: 0 13px;
    margin: 0px 2px;
    background-color: var(--primary-color);
    color: var(--white-100);
    border: 1px solid transparent;
    border-radius: 3px;
    .anticon {
      vertical-align: top;
      margin-top: 5px;
    }

  }
  .ant-btn.ant-btn-primary[disabled],
  .ant-btn.ant-btn-primary[disabled]:hover {
    background-color: var(--primary-color);
    color: var(--white-100);
    border: 1px solid transparent;
    opacity: .65;
  }
}

.ant-carousel {
  height: 100%;
  // background: url(./kvm-computer-open.png) center no-repeat;
  background-size: 90%;
  .custom-slick-arrow.slick-arrow  {
    width: 0;
    height: 0;
    // border: 15px solid var(--primary-color);
    border: 15px solid #d6c4e5;;
    border-bottom-color: transparent;
    border-top-color: transparent;
    z-index: 1;
  }
  .custom-slick-arrow.slick-arrow.slick-prev {
    border-left-color: transparent;
    left: -12px;
  }
  .custom-slick-arrow.slick-arrow.slick-next {
    border-right-color: transparent;
    right: -12px;
  }
  .swiper {
    height: 165px;
  }
}
.ant-carousel :deep(.slick-slide) {
  text-align: center;
  height: 160px;
  line-height: 160px;
  // background: #364d79;
  overflow: hidden;
}
// .ant-carousel :deep(.slick-arrow.custom-slick-arrow) {
//   width: 25px;
//   height: 25px;
//   font-size: 25px;
//   color: var(--white-100);
//   background-color: rgba(31, 45, 61, 0.11);
//   opacity: 0.3;
// }
.ant-carousel :deep(.custom-slick-arrow:before) {
  display: none;
}
.ant-carousel :deep(.custom-slick-arrow:hover) {
  opacity: 0.5;
}
.ant-carousel :deep(.slick-slide h3) {
  color: var(--white-100);
}
</style>
