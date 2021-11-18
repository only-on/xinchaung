<template>
    <div>
        <customerInfor :trainId="course_id" type="course"/>
    </div>
</template>


<script lang="ts">
import { defineComponent ,inject} from 'vue'
import customerInfor from "src/views/teacherTrain/detail/customerInfor/index.vue"
export default defineComponent({
    components:{
        customerInfor
    },
    setup() {
        const course_id=inject("course_id")
        return{
            course_id
        }
    },
})
</script>
