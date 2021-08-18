<template>
  <div class="vm-list-box scrollbar">
    <div class="vm-item" v-for="i in 5" :key="i">
      <h2 class="vm-title">远程连接</h2>
      <div class="vm-info">
        <div class="vm-info-line">
          <span>用户名：Username</span><span>密码：password</span>
        </div>
        <div class="vm-info-line">
          <span>IP：192.168.101.150</span><span>rdp端开：123456</span>
        </div>
      </div>
      <div class="vm-loading-box">
        <img
          class="vm-image"
          src="../../../../assets/images/vm/kvm-computer-active.png"
          alt=""
        />
        <div class="loading">
            loading
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    return {};
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
