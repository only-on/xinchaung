<template>
  <a-modal class="" 
    title="实训成果" 
    :footer="null" 
    :visible="visible" 
    @cancel="close()"
    :width="1000"
  >
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane v-for="(v, k) in lookAchievementsInfo" :key="k" :tab="v.name">
        <div v-if="v.note">
          <antdv-markdown v-model="v.note" :preview-only="true" class="markdown__editor"/>
        </div>
        <div v-else>该任务未提交笔记</div>
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, watch } from 'vue'
import AntdvMarkdown from "@xianfe/antdv-markdown/src/index.vue";

export default defineComponent({
  components: {
    AntdvMarkdown,
  },
  props: {
    isShowAchievements: Boolean,
    lookAchievementsInfo: {
      type: Object,
      default: {}
    }
  },
  emit: ['close'],
  setup(props, {emit}) {

    let activeKey = ref('')

    let visible = ref(false)
    watch(
      () => props.isShowAchievements,
      (newVal) => {
        visible.value = newVal
        if (newVal) {
          console.log(props.lookAchievementsInfo)
          activeKey.value = Object.keys(props.lookAchievementsInfo)[0]
        }
      },
      {deep: true}
    )
    const close = () => {
      emit('close')
      // activeKey.value = ''
    }
    return {
      visible,
      close,
      activeKey
    }
  },
})
</script>

<style lang="less" scoped>
:deep(.ant-modal-body) {
  height: 750px;
}
</style>
