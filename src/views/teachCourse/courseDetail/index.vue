<template>
  <div v-layout-bg="{ size: '234px', bg: bg }" style="height: 100%">
    <top></top>
    <div>
      <a-tabs default-active-key="1" @change="tabChange">
        <a-tab-pane key="1" tab="Tab 1"> Content of Tab Pane 1 </a-tab-pane>
        <a-tab-pane key="2" tab="Tab 2" force-render>
          Content of Tab Pane 2
        </a-tab-pane>
        <a-tab-pane key="3" tab="Tab 3"> Content of Tab Pane 3 </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from "vue";
import bg from "src/assets/common/course-detail_bg.jpg";
import top from "./top.vue";

export default defineComponent({
  components: {
    top,
  },
  setup() {
      
    function tabChange(key:string) {
        console.log(key);
        
    }
    return {
      tabChange,
      bg,
    };
  },
});
</script>
