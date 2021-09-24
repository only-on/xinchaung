<template>
  <div class="classical__container" v-layout-bg>
    <a-card>
      123
    </a-card>
  </div>
</template>

<script lang="ts">
import {defineComponent, inject} from "vue";
import {useRoute} from 'vue-router'
import {ILayoutConfiguration} from "../../types";

export default defineComponent({
  name: "Content",
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
}
</style>
