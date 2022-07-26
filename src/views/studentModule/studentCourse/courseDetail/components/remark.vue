<template>
    <div class="remark">
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
<style lang="less" scoped>
 .remark{
   min-height: 200px;
   background: rgba(0,0,0,0.04);
   padding: 24px;
 } 
</style>