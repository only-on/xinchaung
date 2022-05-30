<template>
  <div>
    <memberManage :is_high='is_high' :is_teamed='is_teamed'></memberManage>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted, Ref } from "vue";
import memberManage from "src/views/teacherModule/teachCourse/memberManage/index.vue";
interface Props {
  is_high:any;
  is_teamed:any
}
const props = withDefaults(defineProps<Props>(), {
  is_high: () =>false,
  is_teamed: () =>false,
})
</script>

<style lang="less" scoped></style>
