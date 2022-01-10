<template>
  <div class="video-tab">
    <div class="video-tab-top">
      <span>{{ detailInfo.name }}</span>
      <span v-role>
        是否对学生开放
        <a-switch
          checked-children="开"
          un-checked-children="关"
          v-model:checked="is_visible"
          @change="checkedChange"
        />
      </span>
    </div>
    <div class="video-box">
      <video
        :src="env ? '/proxyPrefix' + detailInfo.url : detailInfo.url"
        :controls="true"
      >
        您的浏览器不支持 video 标签
      </video>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, watch, ref } from "vue";
import { isDisparkApi } from "../../api";

export default defineComponent({
  setup() {
    const env = process.env.NODE_ENV == "development" ? true : false;
    const detailInfo: any = inject("detailInfo");
    const course_id = inject("course_id") as number;
    const experiment_id: any = inject("experiment_id");
    const is_visible = ref(false);
    watch(
      () => detailInfo,
      () => {
        is_visible.value = detailInfo.value.is_visible === 1 ? true : false;
      },
      { deep: true, immediate: true }
    );
    function checkedChange() {
      isDisparkApi(
        { is_visible: is_visible.value },
        { course_id: course_id, experiment_id: experiment_id.value }
      ).then((res: any) => {});
    }
    return {
      detailInfo,
      env,
      checkedChange,
      is_visible,
    };
  },
});
</script>
<style lang="less">
.video-tab {
  height: 100%;
  .video-tab-top {
    width: 100%;
    height: 84px;
    background: linear-gradient(270deg, #d3ddff 0%, #e8f9ff);
    border-radius: 4px;
    box-shadow: 0px 3px 6px 0px undefined;
    display: flex;
    padding: 0 22px;
    justify-content: space-between;
    align-items: center;
    > span {
      &:first-child {
        font-size: 22px;
        font-weight: 700;
      }
      &:nth-child(2) {
        font-size: 14px;
        button {
          margin-left: 15px;
        }
      }
    }
  }
  .video-box {
    background: var(--black-100);
    height: calc(100% - 100px);
    width: 100%;
    border-radius: 4px;
    margin-top: 16px;
    box-shadow: 0px 3px 6px 0px var(--black-7);
    display: flex;
    video {
      width: 100%;
      margin: auto auto;
    }
  }
}
</style>
