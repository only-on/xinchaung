<template>
    <div>
        
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import request from "src/request/getRequest"
import storage from "src/utils/extStorage"
export default defineComponent({
    setup() {
        const datasetApi= request.teacherWorkbench
        const uid=storage.lStorage.get("uid")
        let params={
            per_page:20,
            page:1,
            category:"",
            label:"",
            keyword:"",
            common:1,
            user_id:uid
        }

        onMounted(()=>{
            getImage()
        })
        function  getImage() {
            datasetApi.getDataSetApi({param:params})
        }
    },
})
</script>
