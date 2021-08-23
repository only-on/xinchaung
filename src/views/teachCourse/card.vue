<template>
  <span class="stu-name">{{list.username? list.username : '--'}}</span>
  <span class="stu-id"><span class="stu-idname">学号：</span>{{list.student_id ? list.student_id : '--'}}</span>
  <div class="swiper-box">
    <a-carousel arrows :beforeChange="beforeChange">
      <template #prevArrow>
        <div class="custom-slick-arrow">
          左
        </div>
      </template>
      <template #nextArrow>
        <div class="custom-slick-arrow">
          右
        </div>
      </template>
      <div v-for="v in list.vms" :key="v.uuid" :class="{'active': v.status === 'ACTIVE', 'noactive': v.status !== 'ACTIVE'}"></div>
    </a-carousel>
    <div class="kvm-info">
      <p class="kvm-status">虚机状态：<span>{{list.vms[current].status === 'ACTIVE' ? '开启' : '关闭'}}</span></p>
      <p class="operation-status">操作状态：<span>空闲</span></p>
    </div>
  </div>
  <div class="btns">
    <a-button type="primary" title="重置" :disabled="list.vms[current].status === 'SHUTOFF'" @click="btnClick(3)"><sync-outlined/></a-button>
    <a-button type="primary" title="重启" :disabled="list.vms[current].status === 'SHUTOFF'" @click="btnClick(2)"><reload-outlined/></a-button>
    <a-button type="primary" title="关机" :disabled="list.vms[current].status === 'SHUTOFF'" @click="btnClick(1)"><poweroff-outlined /></a-button>
    <a-button type="primary" title="开机" :disabled="list.vms[current].status === 'ACTIVE'" @click="btnClick(0)"><play-circle-outlined /></a-button>
  </div>
</template>

<script lang="ts">
import { PlayCircleOutlined, PoweroffOutlined, ReloadOutlined, SyncOutlined  } from '@ant-design/icons-vue';
import request from 'src/api/index'
import { message } from 'ant-design-vue'
import { defineComponent, ref, toRefs, PropType } from 'vue'

interface Ivms {
  uuid: string
  // atype: string
  status: string
}
interface Ilist {
  id: number,
  username: string,
  student_id: number,
  vms: Ivms[]
}

const key = 'updatable';
export default defineComponent({
  props: {
    list: {
      type: Object as PropType<Ilist>,
      default: {
        
      }
    }
  },
  components: {PlayCircleOutlined, PoweroffOutlined, ReloadOutlined, SyncOutlined},
  setup(props, {emit}) {
    console.log(props.list);
    const http=(request as any).course
    let current = ref(0)
    function beforeChange(from:any, to:number) {
      current.value= to
    }
    let apiList = ['vmOpen', 'vmClose', 'vmRevert', 'vmReset']
    let params = {
      // uuid: 'e81c9056-91c6-4695-8188-a815f28ba34a', // props.list.vms[current].uuid
      uuid: props.list.vms[current.value].uuid,
      atype: 'course'
    }
    function btnClick(v: number) {
      console.log(apiList[v]);
      http[apiList[v]]({param: params}).then((res:any) => {
        if (res && res.status) {
          // 请求数据
          emit('getList')
          message.success({ content: '请求成功!', key, duration: 2 });
        } else if (res) {
          // res.error.msg
        }
        
      })
      
    }
    return {
      ...toRefs(props),
      current,
      beforeChange,
      btnClick
    }
  },
})
</script>

<style lang="less" scoped>
.swiper-box {
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
  padding-right: 17px;
  .ant-btn {
    height: 30px;
    font-size: 20px;
    color: #fff;
    padding: 0 13px;
    margin: 0px 2px;
    background-color: @theme-color;
    color: #fff;
    border: 1px solid transparent;
    border-radius: 3px;
    .anticon {
      vertical-align: top;
      margin-top: 5px;
    }

  }
  .ant-btn.ant-btn-primary[disabled],
  .ant-btn.ant-btn-primary[disabled]:hover {
    background-color: @theme-color;
    color: #fff;
    border: 1px solid transparent;
    opacity: .65;
  }
}
</style>
