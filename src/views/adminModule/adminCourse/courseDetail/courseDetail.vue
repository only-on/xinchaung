<template>
    <div style="height:100%">
        <course-detail></course-detail>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import courseDetail from "src/views/teacherModule/teachCourse/courseDetail/index.vue";

export default defineComponent({
    components:{
        "course-detail":courseDetail
    },
    setup() {
        
    },
})
</script>
