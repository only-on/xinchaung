<template>
    <paper-list :type="2"></paper-list>
</template>
<script lang="ts" setup>
import { ref, inject} from "vue";
import paperList from './paperList.vue'
var updata = inject("updataNav") as Function;
updata({
  tabs: [{ name: "考试", componenttype: 0 }],
  showContent: true,
  componenttype: undefined,
  showNav:false,
});
</script>
