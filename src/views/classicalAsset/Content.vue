<template>
  <div class="classical__container" v-layout-bg>
    <a-card>
      <div class="classical__content--header">
        <div class="left">
          <h2>demo目录</h2>
          <div>
            创建日期：2021-03-11 最后修改：2021-05-06
          </div>
        </div>
        <div class="right">
          <watermark-icon icon="cipanjiedian" title="30.7KB" description="文件大小" style="background-color: #2CB6FA"/>
          <watermark-icon icon="wenjianshu" title="2个" description="文件个数" style="background-color: #FFBB3C; margin-left: 25px;"/>
        </div>
      </div>
      <div class="classical__content--main">
        <div class="more-detail">
          <h3>描述</h3>
          <a-divider style="background-color: #d5d5d5;"/>
          <div>暂无描述！</div>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts">
import {defineComponent, inject} from "vue";
import {useRoute} from 'vue-router'
import {ILayoutConfiguration} from "../../types";
import WatermarkIcon from "../../components/common/WatermarkIcon.vue";

export default defineComponent({
  name: "Content",
  components: {
    WatermarkIcon
  },
  setup() {
    const route = useRoute()
    console.log('[classical/content] route params: ', route.params.type, route.params.id)

    const updateNav: (config: ILayoutConfiguration) => void = inject('updataNav')!
    updateNav({
      showNav: true,
      navType: false,
      tabs: []
    })
  }
})
</script>

<style lang="less" scoped>
.classical__container {
  width: @center-width;
  margin: 0 auto;
  min-height: 750px;
  background: none !important;

  .classical__content--header {
    display: flex;

    .left {
      flex: 1;
    }
  }
}
</style>
