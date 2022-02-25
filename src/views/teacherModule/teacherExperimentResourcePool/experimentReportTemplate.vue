<template>
  <div class="report-template">
    <report-template :templateId="templateId"></report-template>
  </div>
</template>
<script lang="ts" setup>
import { defineComponent, inject, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import reportTemplate from "src/views/teacherModule/teacherTemplate/createTemplate.vue";

const router = useRouter();
const route = useRoute();
const { templateId } = route.query;
console.log(templateId);
var updata = inject("updataNav") as Function;
updata({
  tabs: [{ name: "报告模板预览", componenttype: 0 }],
  showContent: true,
  componenttype: undefined,
  showNav: true,
});
onMounted(() => {
  // templateId.value = route.query.templateId
});
</script>
<style lang="less" scoped></style>
