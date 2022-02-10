<template>
        <course-experiment></course-experiment>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import courseExperiment from "../courseExperiment/courseExperiment.vue"
export default defineComponent({
    components:{
        "course-experiment":courseExperiment
    },
    setup() {
        return{

        }
    },
})
</script>
