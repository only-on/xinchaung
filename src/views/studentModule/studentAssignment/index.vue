<template>
    <paper-list :type="1"></paper-list>
</template>
<script lang="ts" setup>
import { ref, inject} from "vue";
import paperList from '../studentExamination/paperList.vue'
var updata = inject("updataNav") as Function;
updata({
  tabs: [{ name: "作业", componenttype: 0 }],
  showContent: true,
  componenttype: undefined,
  showNav:false,
});
</script>
