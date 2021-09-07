<template>
    <div id="TrainingResults">
         <div class="searchInput">
            <a-input-search style="width:503px;padding:8px 5px 8px 30px" placeholder="请输入课程名称关键字查询"/>
        </div>
        <div class="content-list">
            <div class="item-list">
                <div class="item-img"><img src="../../../assets/images/cover2.png" alt="" srcset=""></div>
                <div class="item-info">
                    <h3>123</h3>
                    <div>起止时间:111111</div>
                    <div class="train-status">实训状态:已完成</div>
                    <div class="train-table">
                    <a-table :columns="columns" :data-source="data" :bordered='true' :pagination="false">
                     </a-table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { message } from 'ant-design-vue'
import {defineComponent, onMounted, reactive} from 'vue'
import request from '../../../api'
interface State{
    columns:any[],
    data:any[]
}
export default defineComponent({
    name:'TrainingResults',
    setup:(props,context)=>{
        const state :State=reactive({
            columns:[
                    {   title:'花费时间',
                        dataIndex: 'name',
                        key: 'name',
                    },
                    {
                        title: '实训报告',
                        dataIndex: 'age',
                        key: 'age',
                    },
                    {
                        title: '实训结果',
                        dataIndex: 'address',
                        key: 'address',
                    },
                    {
                        title: '操作视频',
                        key: 'tags',
                        dataIndex: 'tags',
                        scopedSlots: { customRender: 'tags' },
                    },
                    {
                        title: '实训成绩',
                        key: 'action',
                        scopedSlots: { customRender: 'action' },
                    },
                    {
                        title: '班级排名',
                        key: 'tags1',
                        scopedSlots: { customRender: 'action' },
                    },
                     {
                        title: '班级最高分',
                        key: 'tags2',
                        scopedSlots: { customRender: 'action' },
                    },
                ],
            data:[{
                key: '1',
                name: 'John Brown',
                age: 32,
                address: 'New ',
                tags: ['nice'],
                tags1: ['nice'],
                tags2: ['nice'],
            }]
        })
        function getData(){
            const infoRequest=(request as any).studentPerformance
            infoRequest.trainingResults()
            .then((res:any)=>{
            if(res.status==1){
                console.log(res.data)
                state.columns=res.data.list
            }else{
                    message.error(res.msg)
                }

            })
            .catch((err:any)=>{
                console.log(err)
            })
        }
        onMounted(()=>{
            getData()
        })
        return {...state}
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