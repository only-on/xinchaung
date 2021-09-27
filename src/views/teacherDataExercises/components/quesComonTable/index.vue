<template>
    <div class="quesComonTable">
        <div class="question-content-operate">
                <div class="question-search">
                  <a-input></a-input>
                </div>
                <div class="question-btn">
                    <a-button type="primary">添加试题</a-button>
                    <a-button type="primary">批量删除</a-button>
                    <a-button type="primary">批量导入</a-button>
                </div>
            </div>
            <div class="question-content-table">
                <!-- <a-table :columns="columns" :loading="loading" :data-source="list"></a-table> -->
                <a-table></a-table>
            </div>
    </div>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
export default defineComponent({
    name:'quesComonTable'
})
</script>
<style lang="less" scoped>
.question-content-operate{
        display: flex;
        justify-content:space-between;
        padding: 20px 0;
        .question-btn{
            .ant-btn{
                margin-left: 10px;
            }
        }
    }
</style>