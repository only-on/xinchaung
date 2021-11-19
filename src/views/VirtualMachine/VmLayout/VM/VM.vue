<template>
  <div class="vm-list-box scrollbar">
    <div class="vm-item" v-for="(item, index) in vms" :key="Number(index)">
      <h2 class="vm-title">远程连接</h2>
      <div class="vm-info">
        <div class="vm-info-line">
          <span>用户名：{{ item.name }}</span
          ><span>密码：{{ "vncpassword" }}</span>
        </div>
        <div class="vm-info-line">
          <span>IP：{{ item.host_ip }}</span
          ><span
            >rdp端口：{{
              item.classify === "Linux" ? item.ssh_port : item.rdp_port
            }}</span
          >
        </div>
      </div>
      <div class="vm-loading-box">
        <img
          class="vm-image"
          :src="kvmComputerActive"
          alt=""
        />

        <div class="circle-progress-box" v-if="vmCurrentIndex === index&&!vncLoading">
          <div class="circle-text">开机中</div>
          <div class="circle-progress">
            <div class="content left">
              <div class="circle left-circle" :style="{transform: 'rotate('+leftDeg+'deg)'}"></div>
            </div>
            <div class="content right">
              <div class="circle right-circle" :style="{transform: 'rotate('+rightDeg+'deg)'}"></div>
            </div>
          </div>
        </div>
        <div class="vm-loading" @click="openVM(item, Number(index))">
          <span class="icon-kaiguanshenx iconfont"></span>
          <span>{{
            vncLoading ? (vmCurrentIndex === index ? "关机" : "开机") : "开机"
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, watch, ref, Ref } from "vue";
import { getVmConnectSetting } from "src/utils/seeting";
import kvmComputerActive from "src/assets/images/vm/kvm-computer-active.png"
export default defineComponent({
  setup() {
    const vmCurrentIndex:any = inject("vmCurrentIndex");
    const vmInfoData: any = inject("vmInfoData");
    let vncLoading: Ref<boolean> | undefined = inject("vncLoading");
    const vmOptions: any = inject("vmOptions");
    const uuid:any=inject("uuid")
    const vms: any = ref([]);
    const leftDeg=ref(135)
    const rightDeg=ref(135)
    let timer:NodeJS.Timer|null=null
    watch(
      () => vmInfoData.value,
      () => {
        if (vmInfoData.value.data && vmInfoData.value.data.vms) {
          vms.value = vmInfoData.value.data.vms;
          console.log(vms.value);
        }
      },
      { immediate: true }
    );

    watch(()=>vncLoading?.value,()=>{
      
      console.log(vncLoading);
      if (!vncLoading?.value) {
        leftDeg.value=135
        rightDeg.value=135
        loadingCircle()
      }else{
        leftDeg.value=315
        rightDeg.value=315
        clearInterval(Number(timer))
      }
    },{immediate:true})

    // 控制加载进度
    function loadingCircle() {
      clearInterval(Number(timer))
      timer=setInterval(()=>{
        if (rightDeg.value===315) {
          clearInterval(Number(timer))
        }else{
          if (leftDeg.value<315) {
            leftDeg.value++
          }else{
            if (vncLoading?.value) {
              rightDeg.value=315
            }else{
              if (rightDeg.value<=300) {
                rightDeg.value++
              }
            }
            
          }
        }
      },10)
    }
    function openVM(val: any, index: number) {
      vmCurrentIndex.value = index;
      settingCurrentVM(val);
    }

    function settingCurrentVM(data: any) {
      vmOptions.value.password = getVmConnectSetting.VNCPASS;
      vmOptions.value.wsUrl =
        getVmConnectSetting.VNCPROTOC +
        "://" +
        data.host_ip +
        ":" +
        getVmConnectSetting.VNCPORT +
        "/websockify?vm_uuid=" +
        data.uuid;
        uuid.value=data.uuid
    }
    return { vms, vncLoading, vmCurrentIndex, openVM ,leftDeg,rightDeg,kvmComputerActive};
  },
});
</script>

<style lang="less">
.vm-list-box {
  height: calc(100% - 27px);
  .vm-item {
    height: 374px;
    // background-image: url("../../../../assets/images/vm/kvm-computer.png");
    background: linear-gradient(270deg, #ecf0ff 0%, #fdf5ff);
    margin-bottom: 20px;
    padding: 17px 24px;
    .vm-title {
      font-size: 16px;
      font-weight: 700;
    }
    .vm-info {
      .vm-info-line {
        display: flex;
        flex-direction: row;
        > span {
          font-size: 14px;
          color: #050101;
          line-height: 30px;
          overflow: hidden;
          text-overflow: ellipsis;
          &:nth-child(1) {
            width: 60%;
          }
          &:nth-child(2) {
            width: 40%;
          }
        }
      }
    }
    .vm-loading-box {
      position: relative;
      width: 384px;
      height: 215px;
      .vm-image {
        display: block;
        margin: 20px auto 37px auto;
      }
      .vm-loading {
        cursor: pointer;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateY(-50%) translateX(-50%);
        width: 59px;
        height: 59px;
        background: @white;
        border-radius: 50%;
        // line-height: 59px;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        color: #514ca6;
      }
      .circle-progress-box {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translateY(-50%) translateX(-50%);
          width: 59px;
          height: 59px;
          z-index: 1;
          border-radius: 50%;
          overflow: hidden;
          background: rgb(255, 255, 255);
          .circle-text{
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 2;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 20px;
            transform: scale(0.5);
          }
        .circle-progress {
          width: 50px;
          height: 50px;
          position: absolute;
          background: rgb(255, 255, 255);
          margin: 4.5px;
          .content {
            position: absolute;
            top: 0;
            width: 25px;
            height: 50px;
            margin: 0;
            padding: 0;
            overflow: hidden;
          }

          .left {
            left: 0;
          }

          .right {
            right: 0;
          }

          .circle {
            position: absolute;
            margin: 0;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: 5px solid transparent;
            transform: rotate(135deg);
          }

          .left-circle {
            left: 0;
            border-top-color: green;
            border-left-color: green;
            animation: circle-left 5s linear infinite;
          }

          .right-circle {
            right: 0;
            border-bottom-color: green;
            border-right-color: green;
            animation: circle-right 5s linear infinite;
          }
          // @keyframes circle-right {
          //   0% {
          //     transform: rotate(135deg);
          //   }
          //   50%,
          //   100% {
          //     transform: rotate(315deg);
          //   }
          // }

          // @keyframes circle-left {
          //   0%,
          //   50% {
          //     transform: rotate(135deg);
          //   }
          //   100% {
          //     transform: rotate(315deg);
          //   }
          // }
        }
      }
    }
  }
}
</style>
