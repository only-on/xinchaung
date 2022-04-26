<template>
    <div class="personalizaation">
        个性化设置    
    </div>
</template>
<script lang="ts" setup>
    import {
      defineComponent,
      ref,
      onMounted,
      reactive,
      inject
    } from "vue";
    import cleanModal from './cleanModal.vue'
import { Console } from "console";
    var configuration: any = inject("configuration");
    var updata = inject("updataNav") as Function;
    updata({
      tabs: [
        { name: "个性化设置", componenttype: 0 }
      ],
      showContent: true,
      componenttype: undefined,
      showNav:true,
    });
</script>