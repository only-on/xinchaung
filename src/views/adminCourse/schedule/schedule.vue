<template>
    <div> 
    <teaching-scheduleList></teaching-scheduleList>
    </div>   
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import teachingScheduleList from "src/views/teachCourse/courseSchedule/teachingScheduleList.vue"

export default defineComponent({
    components:{
        teachingScheduleList
    },
    setup() {
        return{

        }
    },
})
</script>
