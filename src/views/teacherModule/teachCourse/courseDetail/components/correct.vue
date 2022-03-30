<template>
    <div class="correct-wrap">
        <div class="left">
tree
        </div>
        <div class="right">
            <div class="top">
                <div class="t-left">
                    <span>提交情况：<i class="surplus">10</i>/100</span>
                    <span>
                        评阅情况：<i class="surplus">10</i>/100
                    </span>
                </div>
                <div class="t-right">
                    <a-button type="primary" size="">一键评阅<i class="icon-yidong iconfont"></i></a-button>
                    <a-button type="primary" size="">导出成绩</a-button>
                </div>
            </div>
            <div class="c-table">
                <a-table
                    class="correct-table"
                    :columns="columns"
                    bordered
                >
                    <template #customReportTitle>
                        报告<i>40%</i>
                    </template>
                    <template #customQuizTitle>
                        随测<i>40%</i>
                    </template>
                    <template #customCodeTitle>
                        代码<i>40%</i>
                    </template>
                </a-table>
            </div>  
        </div>
    </div>
</template>

<script lang="ts" setup>
const columns = [
    {
        title:"序号",
        width:49,
        customRender:({text, record, index}:any)=>{
            return index
        }
    },
    {
        title:"学号",
        dataIndex:"schoolCode",
    },
    {
        title:"姓名",
        dataIndex:"name",
    },
    {
        title:"花费时间",
        dataIndex:"expenditure",
    },
    {
        title:"评分项",
        children:[
            {
                dataIndex: 'report',
                slots: { title: 'customReportTitle', customRender: 'report' },
            },
            {
                dataIndex: 'quiz',
                slots: { title: 'customQuizTitle', customRender: 'quiz' },
            },
            {
                dataIndex: 'code',
                slots: { title: 'customCodeTitle', customRender: 'code' },
            }
        ]
    },
    {
        title:"评分参考",
        dataIndex:"reference",
    },
    {
        title:"成绩",
        dataIndex:"score",
    },
]
</script>

<style lang="less" scoped>
.correct-wrap{
    display: flex;
    height: 767px;
    width: var(--center-width);
    margin: 0 auto;
    .left,.right{
        background: white;
    }
    .left{
        width: 470px;
        margin-right: 16px;
        height: 100%;
        
    }
    .right{
        flex: 1;
        padding: 26px 24px;
    }
    .top{
        display: flex;
        justify-content: space-between;
    }
    i{
        font-style: normal;
    }
    .t-left{
        .surplus{
            color: var(--primary-color);
            font-size: var(--font-size-18);
        }
        >span{
            &:nth-child(1){
                margin-right: 28px;
            }
        }
    }
    .t-right{
        .iconfont{
            margin-left: 20px;
        }
        button{
            margin-left: 10px;
        }
    }
    .correct-table{
        :deep(.ant-table-thead > tr > th, .ant-table-tbody > tr > td){
            padding: 10px;
        }
    }
}
</style>