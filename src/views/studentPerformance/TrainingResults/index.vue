<template>
    <div id="TrainingResults">
         <div class="searchInput">
            <a-input-search style="width:503px;padding:8px 5px 8px 30px" placeholder="请输入课程名称关键字查询"  @keyup.enter="onSearch" @search="onSearch"/>
        </div>
        <div v-if="traningResult.length" class="content-list">
            <div class="item-list" v-for="(item,i) in traningResult" :key="i">
                <div class="item-img">
                    <!-- <img src="../../../assets/images/cover2.png" alt="" srcset=""> -->
                    <img :src="item.url" alt="">
                </div>
                <div class="item-info">
                    <h3>{{item.name}}</h3>
                    <div>起止时间:{{item.between_time}}</div>
                    <div class="train-status">实训状态:{{item.state}}</div>
                    <div class="train-table">
                    <a-table class="trainResultTable" :columns="columns" :data-source="tableData" :bordered='true' :pagination="false">
                    </a-table>
                    </div>
                </div>
            </div>
            <div>第{{1}}-{{pagingData.totalCount}}条，共{{pagingData.totalCount}}条数据</div>
        </div>
        <div v-else class="no-search-data">
            <div class="noMatching">
                 <div>
                <span class="iconfont icon-kongshuju"></span>    
                </div>
                <div>亲~这里什么都没有~</div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { message } from 'ant-design-vue'
import {defineComponent, onMounted, reactive, toRefs} from 'vue'
import request from '../../../api'
interface pageingType{
    currentPage?:number,
    pageCount?:number,
    perPage?:number,
    totalCount?:number,
}
interface State{
    traningResult:any[],
    pagingData:pageingType;
    columns:any[],
    tableData:any[]
}
export default defineComponent({
    name:'TrainingResults',
    setup:()=>{
        const state :State=reactive({
            traningResult:[],
            pagingData:{},
            columns:[
                    {   title:'花费时间',
                        key:'used_time',
                        dataIndex: 'used_time',
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
                        dataIndex: 'video',
                        scopedSlots: { customRender: 'video' },
                    },
                    {
                        title: '实训成绩',
                        dataIndex: 'final_score',
                        scopedSlots: { customRender: 'final_score' },
                    },
                    {
                        title: '班级排名',
                        dataIndex: 'rank',
                        scopedSlots: { customRender: 'rank' },
                    },
                     {
                        title: '班级最高分',
                        dataIndex: 'max_score',
                        scopedSlots: { customRender: 'max_score' },
                    },
                ],
            tableData:[{
                        used_time:'00时00分52秒',
                        video:'查看',
                        report:'查看',
                        notes:'查看',
                        final_score:'待教师评分',
                        rank: "待教师评分",
                        max_score: "待教师评分",
                    }]
        })
        function getData(value?:any,ifSearch?:boolean){
            const infoRequest=(request as any).studentPerformance
            infoRequest.trainingResults(ifSearch?{
               param:{keyword:value} 
            }:'')
            .then((res:any)=>{
            if(res.status==1){
                console.log(res.data)
                state.traningResult=res.data.list
                state.pagingData=res.data.page
            }else{
                    message.error(res.msg)
                }

            })
            
            infoRequest.experimentalResults(
                {    
                param: {type:'train'}
                })
            .then((res:any)=>{
                    var tableGetData:any=[]
                    tableGetData=[{
                        used_time:'00时00分52秒',
                        video:'查看',
                        report:'查看',
                        notes:'查看',
                        final_score:'90',
                        rank: "待教师评分",
                        max_score: "待教师评分",
                    }]
                    state.tableData=tableGetData
                    if(tableGetData[0].final_score){
                        state.tableData[0].final_score=tableGetData[0].final_score
                    }
                     if(tableGetData[0].rank){
                        state.tableData[0].rank=tableGetData[0].rank
                    }
                     if(tableGetData[0].max_score){
                        state.tableData[0].max_score=tableGetData[0].max_score
                    }
                    console.log('获取实训成绩')
                    console.log(res.data)
            })
        }
        function onSearch(value:string,){
            getData(value,true)
        }
        onMounted(()=>{
            getData()
        })
        return {onSearch,...toRefs(state)}
    }
    
})
</script>
<style lang="less">
#TrainingResults{
    font-size: 14px;
     .searchInput{
    height: 100px;
    line-height: 100px;
    }
    .no-search-data{
    display: flex;
    justify-content: center;
    align-items: center;
    color: #8955B5;
    min-height:650px;
    .noMatching{
        .icon-kongshuju{
            font-size: 86px;
        }
    }
}
    .content-list{
        padding: 14px;
        border-bottom: 1px solid #ddd;
        margin-bottom: 16px;
        background-color: white;
        .item-list{
            display: flex;
            padding: 14px;
            margin: 0 0 16px;
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
    .trainResultTable{
        tr:nth-child(1){
            td:nth-child(1){
                color:black;
            }
            td:nth-child(2){
                color: #8955B5;
            }
            td:nth-child(2):hover{
                color: #a86cdc;
            }
            td:nth-child(3){
                color: #8955B5;
            }
             td:nth-child(3):hover{
                color: #a86cdc;
            }
            td:nth-child(4){
                color: #8955B5;
            }
            td:nth-child(4):hover{
                color: #a86cdc;
            }
            td:nth-child(5){
                color:red;
                font-weight: bold;
            }
            td:nth-child(6){
                color:red;
                font-weight: bold;
            }
             td:nth-child(7){
                color:red;
                font-weight: bold;
            }
        }
    }
    .ant-table-thead > tr > th, .ant-table-tbody > tr > td{
        padding: 8px;
        text-align: center;
        font-size: 14px;
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