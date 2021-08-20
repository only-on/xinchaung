<template>
    <div>
        <top></top>
        <content></content>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import top from "./top.vue"
import content from "./content.vue"

export default defineComponent({
    components:{
        top,
        content
    },
    setup() {
        
    },
})
</script>
