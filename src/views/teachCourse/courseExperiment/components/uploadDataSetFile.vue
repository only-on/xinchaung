<template>
    <div>
        <label>选择目录</label>
        <a-select>
            <a-select-option value="jack">Jack</a-select-option>
        </a-select>
    </div>
</template>

<script lang="ts">
import { defineComponent,reactive } from 'vue'
import {getDataSetListApi} from "../api"

export default defineComponent({
    setup() {
        // 获取数据集列表
        function getDataSetList() {
            // getDataSetListApi({})
        }
        return {
            
        }
    },
})
</script>
