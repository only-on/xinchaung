<template>
    <div>
        <exercise-list></exercise-list>
    </div>
</template>
<script lang="ts">
import {defineComponent}from 'vue'
import exerciseList from './exerciseList.vue'
export default defineComponent({
    name:'shareExercises',
    props: ["componentData"],
    components:{
        exerciseList
    },
    setup:(props,context)=>{
        console.log(props,'props')
    }
})
</script>