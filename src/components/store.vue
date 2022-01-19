<template>
    <div @click="setNameClick">121{{name}}</div>
</template>

<script lang="ts">
import { defineComponent, nextTick,computed } from 'vue'
import {useStore} from "vuex"
import {TestStateType} from "../store/common/common.type"
export default defineComponent({
    setup(props,context) {
        const store=useStore()
        let name=computed({
            get:()=>{
                return store.state.CommonState.name
            },
            set:val=>{
                store.commit("CommonState/setName",val)
            }
        })
        nextTick(()=>{
            console.log(context);
        })
        const setNameClick=()=>{
            name.value="文和"
        }
        return {setNameClick,name}
    },
})
</script>
