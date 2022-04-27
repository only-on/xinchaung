<template>
    <div>
      <h1>管理端首页</h1>
    </div>
</template>
<script lang='ts' setup>
    import { defineComponent, ref, reactive, onMounted, toRefs, inject, watch } from "vue";
    var configuration: any = inject("configuration");
    var updata = inject("updataNav") as Function;
    updata({
    tabs: [],
    showContent: true,
    componenttype: undefined,
    showNav:false,
    });
</script>