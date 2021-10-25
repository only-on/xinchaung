<template>
  <div class="image-card-box">
    <div class="card-content">
      <div class="card-top">
        <div>{{ data.name }}</div>
        <div></div>
        <img
          class="image-type"
          :src="
            data.image
              ? data.image.ostypes === 'kvm'
                ? baseUrl + '/img/working/kvm.png'
                : baseUrl + '/img/working/docker.png'
              : ''
          "
          alt=""
        />
      </div>
      <div class="card-bottom"></div>
    </div>
    <div></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: ["modelValue"],
  setup(props, { emit }) {
   const  baseUrl = process.env.NODE_ENV !== 'development' ? process.env.BASE_URL : ''
    console.log(props.modelValue);
    const data = props.modelValue;
    return { baseUrl,data };
  },
});
</script>

<style lang="less">
.image-card-box {
  height: 100%;
  background: #ffffff;
  border-radius: 6px;
  box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.05);
  position: relative;
  > div {
    &:nth-child(2) {
      position: absolute;
      top: 0;
      background: linear-gradient(135deg, #eaddf7, #dee0fb 99%);
      border-radius: 6px;
      transition: 0.5s;
      padding: 14px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      width: 100%;
      transform: rotateY(90deg);
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
      background: linear-gradient(135deg, #b17cde, #7a87f5 99%);
      border-radius: 6px 6px 0px 0px;
    }
    .card-bottom {
      height: 66px;
      background: @white;
      border-radius: 6px;
      box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.05);
    }
  }
}
</style>
