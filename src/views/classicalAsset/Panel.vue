<template>
<p>资源面板</p>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import http from 'src/api/index'
export default defineComponent({
    name: 'ClassicalAssetPanel',
    setup() {
        http.classicalAsset.loginIn();
        return {}
    }
})
</script>