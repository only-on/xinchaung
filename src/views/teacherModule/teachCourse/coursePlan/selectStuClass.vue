<template>
  <a-drawer
    class="select-stuclass-drawer"
    width="640"
    placement="right"
    :closable="false"
    :visible="visible"
    @close="onClose"
  >
    <a-tabs v-model:activeKey="currentType" class="activeClass" @change="change">
      <a-tab-pane v-for="item in tabsList" :key="item.key" :tab="item.tab" />
    </a-tabs>
    <div v-if="visible">
      <select-table 
        v-if="currentType === 'student'"
        :currentType="currentType"
      ></select-table>
      <select-table 
        v-else
        :currentType="currentType"
      ></select-table>
    </div>
  </a-drawer>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs, onMounted, provide, inject, watch, nextTick, PropType, computed } from 'vue'
import selectTable from './selectTable.vue'

export default defineComponent({
  name: 'selectStuclassDrawer',
  components: {
    selectTable
  },
  props: {
    visible: Boolean,
    activeName: String
  },
  emit: [],
  setup(props, {emit}) {
    let tabsList = [
      {
        key: 'student',
        tab: '选择学生',
        api: '/timetable/timetable/students',
      },
      {
        key: 'class',
        tab: '选择班级',
        api: '/timetable/timetable/classes',
      },
    ]
    let currentType = ref<string>('student')
    watch(
      () => props.activeName,
      (newVal: any) => {
        currentType.value = newVal
      },
      {deep: true}
    )
    function change() {
      emit('update:activeName', currentType.value)
    }
    function onClose() {
      emit('update:visible', false)
    }
    return {
      onClose,
      tabsList,
      currentType,
      change,
    }
  },
})
</script>

<style lang="less" scoped>
:deep(.ant-tabs-bar) {
  border-bottom: 1px solid #e8e8e8;
  .ant-tabs-nav {
    .ant-tabs-tab {
      transition: all .1s;
    }
    .ant-tabs-tab-active {
      background: var(--purpleblue-6);
      border-radius: 6px 6px 0 0;
      color: var(--white-100);
    }
  }
}
.ant-tabs {
  height: 52px;
}
</style>
