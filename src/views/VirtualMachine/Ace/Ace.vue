<template>
    <layout :VmData="data">
            <template v-slot:header>
                <div><span @click="back">返回</span></div>
            </template>
            <template v-slot:right>right</template>
    </layout>
</template>

<script lang="ts">
import { defineComponent ,reactive} from 'vue'
import layout from "../VmLayout/VmLayout.vue"
import {useRouter} from "vue-router"

export default defineComponent({
    components:{
        layout
    },
    setup(props,{emit}) {
        const router=useRouter()
        const data=reactive({nav:[{name:"测试1"}]})
        function back(){
            router.go(-1)
        }
        return {back,data}
    },
})
</script>
