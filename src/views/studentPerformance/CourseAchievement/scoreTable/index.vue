<template>
    <div class="scoreTable">
         <a-table :columns="columns" :data-source="data" :bordered='true' :pagination="false" rowKey="id">
            <template v-slot:action0>
                <span class="detail">详情</span>
            </template>
                <template v-slot:action1>
                <span class="detail">详情</span>
            </template>
                <template v-slot:action2>
                <span class="detail">详情</span>
            </template>
            <template v-slot:action3>
                <div class='scoreStar'>
                    <div v-for="item in 3" :key="item">
                        <img class="star" src="src/assets/images/stuAchievement/star-off.png">
                    </div>
                </div>  
            </template>
            <template v-slot:action4>
                <span>未评价</span>
            </template>
            <template v-slot:action5>
                <span class="detail" @click="scoreDetails">成绩明细</span>
            </template>
        </a-table>
        <div>
            <a-modal
            class="scoreDetailModal"
            title="成绩明细"
            width='1000px'
            height='630px'
            :footer="null"
            :visible="visable"
            :confirm-loading="confirmLoading"
            @ok="handleOk"
            @cancel="handleCancel"
            >
            <div>
                <a-tabs default-active-key="1" type="card">
                    <a-tab-pane key="1" tab="试验得分">
                      <test-score></test-score>
                    </a-tab-pane>
                    <!-- <a-tab-pane key="2" tab="Tab 2" force-render>
                    Content of Tab Pane 2
                    </a-tab-pane> -->
                </a-tabs>
            </div>
        </a-modal>
        </div>
    </div>
</template>
<script lang="ts">
import Vue, { toRefs } from 'vue'
import {defineComponent,reactive,ref,Ref} from 'vue'
import testScore from '../testScore/index.vue'
import request from '../../../../api'
export default defineComponent({
    name:'scoreTable',
    components:{
    'test-score':testScore
    },
    setup:(props,context)=>{
        const columns:any=[
                    {   title:'实验得分',
                        dataIndex: 'number1',
                        key: 'number1',
                    },
                    {
                        title: '重修得分',
                        dataIndex: 'number2',
                        key: 'number2',
                    },
                    {
                        title: '最终得分',
                        dataIndex: 'number3',
                        key: 'number3',
                    },
                    {
                        title: '班级排名',
                        key: 'number4',
                        dataIndex: 'number4',
                    },
                    {
                        title: '班级最高分',
                        key: 'number5',
                        dataIndex: 'number5',
                    },
                    {
                        title: '操作视频',
                        key: 'action0',
                        dataIndex: 'action0',
                        slots: { customRender: 'action0' },
                    },
                    {
                        title: '实验习题',
                        key: 'action1',
                        slots: { customRender: 'action1' },
                    },
                     {
                        title: '实验报告',
                        key: 'action2',
                        slots: { customRender: 'action2' },
                    },
                     {
                        title: '自评结果',
                        key: 'action3',
                        slots: { customRender: 'action3' },
                    },
                     {
                        title: '教师评价',
                        key: 'action4',
                        slots: { customRender: 'action4' },
                    },
                     {
                        title: '成绩明细',
                        key: 'action5',
                        slots: { customRender: 'action5' },
                    },
                ]
        const data:any=[{
                 id:'',
                 number1: '10',
                 number2: '--',
                 number3: '--',
                 number4: 'D',
                 number5: '--',
                 action0:'详情',
                tags1:'11',
                tags2: '222',
                action3: 3,
                tags4: '',
                tags5:''
        }]
        var confirmLoading:boolean=false
        var ModalText:string='你好啊'
        var visable:Ref<boolean> = ref(false)
        // var panes:Ref<any[]>=ref([
        // { title: '试验得分', content:testScore, key: '1' },
        // { title: 'Tab 2', content: 'Content of Tab 2', key: '2' },
        // ]);
        // var activeKey:Ref<any>=panes.value[0].key
        //成绩明细弹框
        function scoreDetails(){
            visable.value=true
            getScore()
        } 
        //确认弹框
        function handleOk(){
            visable.value = false;
        }
        function handleCancel(){
            visable.value = false;
        }
        function getScore(){
            const infoRequest=(request as any).studentPerformance
            var formData:any = new FormData();
            formData.append('tid',260);
            formData.append('type','score');
            formData.append('stu_id','');
                infoRequest.getScore({param:formData}).then((res:any)=>{
                console.log(res)
            })
        }
        // function onEdit(targetKey:string, action:string){
        //    console.log(targetKey, action) 
        // }
        return {columns,data,confirmLoading,visable,ModalText,scoreDetails,handleOk,handleCancel,getScore}
    }
})
</script>
<style lang="less">
    .detail{
        color:@primary-color;
    }
    .scoreStar{
        display: flex;
    }
    .star{
        width: 22px;
        display: inline-block;
    }
    .scoreDetailModal{
        .ant-modal-header{
            background-color: @theme-color;
        }
        .ant-modal-title{
            color: white;
        }
        .ant-modal-body{
            min-height: 630px;
        }
        .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab{
            border-radius: 0px;
            border-left: 0px;
        }
        .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab:nth-child(1){
            border-left: 1px solid @normal-color;
        }
        .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab-active{
            border-top: 2px solid @theme-color;
        }
    }
</style>