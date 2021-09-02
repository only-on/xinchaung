<template>
  <div class="vm-list-box scrollbar">
    <div class="vm-item" v-for="(item,index) in vms" :key="Number(index)">
      <h2 class="vm-title">远程连接</h2>
      <div class="vm-info">
        <div class="vm-info-line">
          <span>用户名：{{item.name}}</span><span>密码：{{'vncpassword'}}</span>
        </div>
        <div class="vm-info-line">
          <span>IP：{{item.host_ip}}</span><span>rdp端口：{{item.classify==="Linux"?item.ssh_port:item.rdp_port}}</span>
        </div>
      </div>
      <div class="vm-loading-box">
        <img
          class="vm-image"
          src="../../../../assets/images/vm/kvm-computer-active.png"
          alt=""
        />
        <div class="loading" @click="openVM(item,Number(index))">
           {{vncLoading?(currentIndex===index?'关闭':'打开'):'打开'}}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent,inject,watch,ref,Ref } from "vue";
import { getVmConnectSetting } from "src/utils/seeting";
export default defineComponent({
  setup() {
    const currentIndex=ref(0)
    const vmInfoData:any=inject("vmInfoData")
    let vncLoading:Ref<boolean>|undefined=inject("vncLoading")
    const vmOptions:any=inject("vmOptions")
    const vms:any=ref([])
    watch(()=>vmInfoData.value,()=>{
      if (vmInfoData.value.data&&vmInfoData.value.data.vms) {
        vms.value=vmInfoData.value.data.vms
        console.log(vms.value);
      }
    },{immediate:true})
    function openVM(val:any,index:number){
      currentIndex.value=index
      settingCurrentVM(val)
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
    }
    return {vms,vncLoading,currentIndex,openVM};
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
      .loading{
          cursor: pointer;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translateY(-50%) translateX(-50%);
          width: 59px;
          height: 59px;
          background: @white;
          border-radius: 50%;
          line-height: 59px;
          text-align: center;
      }
    }
  }
}
</style>
