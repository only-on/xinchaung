<template>
  <div v-show="!isClose" class="novnc-wrap" ref="refName"></div>
  <div v-show="isClose" class="close-vm-bg">
    <img :src="closevmImg" alt="" srcset="" width="324" height="68">
  </div>
</template>
<script lang="ts">
import { defineComponent, nextTick, ref, onMounted, watch,inject,Ref,PropType } from "vue";
import RFB from "@novnc/novnc/core/rfb.js";
import { onBeforeRouteLeave } from "vue-router";
import closevmImg from "src/assets/images/vm/vm_close.png"
type Toptions={
  password:string
  wsUrl:string
  userName:string
}

export default defineComponent({
  name: "WhNovnc",
  props: {
    // dom名称
    refName: {
      type: String,
      default: "novncEl",
    },
    // 配置
    options:{
      require:true,
      type:Object as PropType<Toptions>
    },
    // 密码
    // password: {
    //   type: String,
    //   default: "",
    // },
    // // ws url
    // wsUrl: {
    //   type: String,
    // },
    // 背景
    background: {
      type: String,
      default: "",
    },
    // 用户名
    userName: {
      type: String,
      default: "",
    },
  },
  emits: ["clipboard"],
  setup(props, context) {
    let rfb: any = ref(null);
    let loading:Ref<boolean>|undefined=inject("loading")
    const refName=ref(props.refName)
    let isClose:Ref<boolean>|undefined=inject("isClose",ref(false))

    // 连接断开
    function disconnect(msg: any) {
      if(isClose!.value) return;
      setTimeout(() => {
        if (msg.detail.clean) {
          // 根据 断开信息的msg.detail.clean 来判断是否可以重新连接
          // loading!.value=false
          connectVnc();
        } else {
          //这里做不可重新连接的一些操作
          // console.log("链接失败,重新链接中-------" + props.options?.wsUrl);
          // loading!.value=false
          connectVnc();
        }
      },2000);
    }
    // 连接成功
    function success(msg: any) {
      // console.log(msg);
      console.log("连接成功");
        setTimeout(()=>{loading!.value=false},5000)
    }

    function securityfailure(msg: any) {
      console.log("securityfailure:", msg);
    }

    function clipboard(msg: CustomEvent) {
      context.emit("clipboard",msg)
    }
    // 连接vnc
    function connectVnc() {
      if (!props.options?.wsUrl) {
        return false
      }
      // if (document.getElementById(props.refName)) {
      //     (document.getElementById(props.refName) as HTMLDivElement).innerHTML=""
      // }
      if (refName.value) {
          (refName.value as any).innerHTML=""
      }
      // loading!.value=false
      // isClose!.value=true
      // loading!.value=false
      // 实例化rfb
      if (!refName.value)  return;
      rfb.value = new RFB(refName.value, props.options?.wsUrl, {
        // 向vnc 传递的一些参数，比如说虚拟机的开机密码等
        credentials: {
          password: props.options?.password,
          username: props.options?.userName,
        },
      });
      rfb.value.addEventListener("connect", success); // 与服务器连接成功时，触发的事件
      rfb.value.addEventListener("disconnect", disconnect); // 与服务器连接断开时，触发的事件
      rfb.value.addEventListener("securityfailure", securityfailure); //与服务器的安全协商失败时会触发securityfailure事件。
      rfb.value.addEventListener("clipboard", clipboard); // 从服务器收到剪贴板数据时会触发剪贴板事件。
      rfb.value.scaleViewport = 0.65; //scaleViewport指示是否应在本地扩展远程会话以使其适合其容器。禁用时，如果远程会话小于其容器，则它将居中，或者根据clipViewport它是否更大来处理。默认情况下禁用。
      rfb.value.resizeSession = true; //是一个boolean指示是否每当容器改变尺寸应被发送到调整远程会话的请求。默认情况下禁用
      rfb.value.background = props.background;
      // console.log(rfb.value);
    }

    function  sendSelectContent(text:string){
      if (text&&rfb.value) {
        rfb.value.clipboardPasteFrom(text)
      }
    }
    function sendCtrlAltDel(){
       if (rfb.value) {
        rfb.value.sendCtrlAltDel()
      }
    }

    function sendDisconnect(){
       if (rfb.value) {
        rfb.value.disconnect()
        rfb.value=null
      }
    }
    // 直接mounted周期
    onMounted(() => {
      // connectVnc();
    });
    onBeforeRouteLeave(()=>{
      console.log(isClose)
      isClose!.value=false
    })
    // 监听prop属性变化时，执行
    // watch(
    //   () => props,
    //   () => {
    //     nextTick(() => {
    //       connectVnc();
    //     });
    //   },
    //   { deep: true }
    // );

    return { connectVnc,sendDisconnect, rfb,loading,sendSelectContent ,refName,sendCtrlAltDel,isClose,closevmImg};
  },
});
</script>


<style lang="less">
.novnc-wrap {
  height: 100%;
  width: 100%;
}
.close-vm-bg{
  background: url("../../assets/images/vm/vm_close_bg.jpg");
  height: 100%;
  width: 100%;
  background-size: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
