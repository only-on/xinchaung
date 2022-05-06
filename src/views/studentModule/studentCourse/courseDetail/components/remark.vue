<template>
    <div>
      {{detailInfo}}    
    </div>
</template>
<script lang="ts">
    import { defineComponent, reactive, toRefs, watch } from "vue";
    export default defineComponent({
      name: "remark",
      props: ["detailInfo"]
    });
    </script>