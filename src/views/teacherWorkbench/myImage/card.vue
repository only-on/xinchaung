<template>
  <div class="image-card-box">
    <div class="card-content">
      <div class="card-top">
        <div class="card-title">{{ modelValue.name }}</div>
        <div class="card-tag">{{modelValue.tag.join(" / ")}}</div>
        <img
          class="image-type"
          :src="modelValue.ostypes === 'kvm'
                ?kvmImg
                :dockerImg
          "
          alt=""
        />
      </div>
      <div class="card-bottom">
        <div>
          <span>容量：{{modelValue.size}}</span>
          <span>系统：{{modelValue.classify_id===1?'Windows':'Linux'}}</span>
        </div>
      </div>
    </div>
    <div>
      <div class="card-head">
        <div class="description">{{modelValue.description}}</div>
      </div>
      <div class="card-foot">
        <div class='image-type'>{{modelValue.classify_id===1?'Windows':'Linux'}}</div>
        <div class="icon-operate">
          <span class="iconfont icon-bianji1" @click="editImage(modelValue)"></span>
          <span class="iconfont icon-shanchu-copy" @click="deleteImage(modelValue.id)"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import kvmImg from "src/assets/images/workbench/kvm.png"
import dockerImg from "src/assets/images/workbench/docker.png"
export default defineComponent({
  props: ["modelValue"],
  setup(props, { emit }) {
   const  baseUrl = process.env.NODE_ENV !== 'development' ? process.env.BASE_URL : ''
    // const data = props.modelValue;
    const methods={
      copyImage(data:number){
        emit('copy-image',data)
      },
      editImage(data:number){
        emit('edit-image',data)
      },
      deleteImage(id:number){
        emit('delete-image',id)
      }
    }
    return { baseUrl,...methods,kvmImg,dockerImg};
  },
});
</script>

<style lang="less">
.image-card-box {
  height: 100%;
  background: #ffffff;
  border-radius: 6px;
  box-shadow: 0px 3px 6px 0px var(--black-7);
  position: relative;
  > div {
    &:nth-child(2) {
      position: absolute;
      top: 0;
      background: linear-gradient(45deg,var(--purpleblue-5), var(--blue-4) 26%);
      border-radius: 6px;
      transition: 0.5s;
      padding: 14px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      width: 100%;
      transform: rotateY(90deg);
      // color: rgba(88, 92, 229, 0.2);
    }
  }
  &:hover {
    > div {
      &:nth-child(2) {
        transform: rotateY(0deg);
      }
    }
  }
  .card-content {
    .card-top {
      width: 100%;
      height: 84px;
      background: linear-gradient(45deg,var(--purpleblue-5), var(--blue-4) );
      border-radius: 6px 6px 0px 0px;
      position: relative;
      padding: 14px;
      .card-title{
        color: var(--black-100);
        font-size: 16px;
        line-height: 35px;
      }
      .card-tag{
        font-size: 12px;
        color: #ffde00;
      }
      .image-type{
        color: rgba(var(--purpleblue-6),.25);
       position: absolute;
      right: 20px;
      bottom: -15px;
      width: 64px;
      height: 64px;
      box-shadow: 0 4px 6px 0 var(--black-7);
      border-radius: 50%;
      overflow: hidden;
      }
    }
    .card-bottom {
      color: rgba(0,0,0,.65);
      padding: 14px;
      font-size: 12px;
      height: 66px;
      background: var(--black-100);
      border-radius: 6px;
      box-shadow: 0px 3px 6px 0px var(--black-7);
      >div{
        >span{
          display: inline-block;
          width: 32%;
        }
        >span:nth-child(1){
          margin-right:10%;
        }
        >span:nth-child(3){
          margin-right:0px;
        }
      }
    }
  }
  .card-head{
      .description{
      word-break: break-all;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      font-size: 12px;
      color: var(--black-65);
      line-height: 22px;
      -webkit-user-select: text;
      -moz-user-select: text;
      -ms-user-select: text;
      user-select: text
      }
    }
   .card-foot{
      display: flex;
      width: 100%;
      justify-content:right;
      align-items: center;
      .image-type{
        font-size: 24px;
        color: #d0bce6;
        margin-right: auto;
        letter-spacing: 2px;
        font-weight: 700;
      }
       .icon-operate{
        width: 20%;
        display: flex;
        justify-content:space-between;
        color: var(--black-45);
        cursor: pointer;
        .iconfont:hover{
          color: var(--purpleblue-6);
        }
      }
    }
}
</style>
