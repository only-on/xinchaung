<template>
    <div id="TrainingResults">
         <div class="searchInput">
            <a-input-search style="width:503px;padding:8px 5px 8px 30px" placeholder="请输入课程名称关键字查询"/>
        </div>
        <div class="content-list">
            <div class="item-list" v-for="(item,i) in traningResult" :key="i">
                <div class="item-img"><img src="../../../assets/images/cover2.png" alt="" srcset=""></div>
                <div class="item-info">
                    <h3>{{item.name}}</h3>
                    <div>起止时间:{{item.between_time}}</div>
                    <div class="train-status">实训状态:{{item.state}}</div>
                    <div class="train-table">
                    <a-table :columns="columns" :data-source="tableData" :bordered='true' :pagination="false">
                    </a-table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { message } from 'ant-design-vue'
import {defineComponent, onMounted, reactive, toRefs} from 'vue'
import request from '../../../api'
interface State{
    traningResult:any[],
    columns:any[],
    tableData:any[]
}
export default defineComponent({
    name:'TrainingResults',
    setup:()=>{
        const state :State=reactive({
            traningResult:[],
            columns:[
                    {   title:'花费时间',
                        dataIndex: 'used_time',
                        key: 'used_time',
                    },
                    {
                        title: '实训报告',
                        dataIndex: 'report',
                        scopedSlots: { customRender: 'report' },
                    },
                    {
                        title: '实训结果',
                        dataIndex: 'notes',
                        scopedSlots: { customRender: 'notes' },
                    },
                    {
                        title: '操作视频',
                        key: 'video',
                        dataIndex: 'video',
                        scopedSlots: { customRender: 'video' },
                    },
                    {
                        title: '实训成绩',
                        key: 'final_score',
                        scopedSlots: { customRender: 'final_score' },
                    },
                    {
                        title: '班级排名',
                        key: 'rank',
                        scopedSlots: { customRender: 'rank' },
                    },
                     {
                        title: '班级最高分',
                        dataIndex: 'max_score',
                        key: 'max_score',
                    },
                ],
            tableData:[]
        })
        function getData(){
            const infoRequest=(request as any).studentPerformance
            infoRequest.trainingResults()
            .then((res:any)=>{
            if(res.status==1){
                console.log(res.data)
                state.traningResult=res.data.list
            }else{
                    message.error(res.msg)
                }

            })
            .catch((err:any)=>{
                console.log(err)
            })
            infoRequest.experimentalResults(
                {    
                param: {type:'train'}
                })
            .then((res:any)=>{
                if(res.status==1){
                    state.tableData=res.data.list
                    console.log('获取实训成绩')
                    console.log(res.data)
                }
            })
        }
        onMounted(()=>{
            getData()
        })
        return {...toRefs(state)}
    }
    
})
</script>
<style lang="less">
#TrainingResults{
     .searchInput{
    height: 100px;
    line-height: 100px;
    }
    .content-list{
        padding: 14px;
        border-bottom: 1px solid #ddd;
        margin-bottom: 16px;
        background-color: white;
        .item-list{
            display: flex;
            .item-img{
                width: 290px;
                height: 168px;
                img{
                    width: 100%;
                    height: 100%;
                }
            }
            .item-info{
                margin-left: 30px;
                h3{
                    width: 800px;
                    font-size: 16px;
                    font-weight: 700;
                    color: #333;
                    cursor: pointer;
                }
                .train-status{
                    margin-bottom: 15px;
                }
                .train-table{
                    width: 800px;
                }
            }
        }
    }
    .ant-table-thead > tr > th, .ant-table-tbody > tr > td{
        padding: 8px;
        text-align: center;
    }
    .ant-table-thead>tr>th{
        background-color:#f6f0fa;
    }
    .ant-table-bordered .ant-table-thead > tr > th, .ant-table-bordered .ant-table-tbody > tr > td {
    border-right: 1px solid white;
    }
    .ant-table-thead > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td, .ant-table-tbody > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td, .ant-table-thead > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td, .ant-table-tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
    background:white;
   }
}
</style>