<template>
  <p>资源面板</p>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import http from "src/api/index";
export default defineComponent({
  name: "ClassicalAssetPanel",
  setup() {
    http.classicalAsset.datasetList({
      param: {
        type: 3,
        page: 1,
        pageSize: 10,
        is_public: 1,
        name: "",
      },
      success: (resp) => {
        console.log("got resp: ", resp);
      },
    });
    return {};
  },
});
</script>
