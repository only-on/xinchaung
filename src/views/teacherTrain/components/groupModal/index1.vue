<template>
    <div class="groupModal" v-layout-bg>
      <a-modal
        title="学生分组"
        :visible="editvisible"
        :confirm-loading="editLoading"
        @ok="editOk"
        @cancel="editCancel"
        width="800px"
        >
        <transfer :treeData='treeData'></transfer>
        <!-- <div style="height:300px">
           <template>
                <div>
                    <a-transfer
                    class="tree-transfer"
                    :data-source="dataSource"
                    :target-keys="targetKeys"
                    :render="item => item.title"
                    :show-select-all="false"
                    @change="onChange"
                    >
                    <template #children="{ direction, selectedKeys, onItemSelect }">
                        <a-tree
                        v-if="direction === 'left'"
                        blockNode
                        checkable
                        checkStrictly
                        defaultExpandAll
                        :checkedKeys="[...selectedKeys, ...targetKeys]"
                        :treeData="treeData"
                        @check="
                            (_, props) => {
                            onChecked(_, props, [...selectedKeys, ...targetKeys], onItemSelect);
                            }
                        "
                        @select="
                            (_, props) => {
                            onChecked(_, props, [...selectedKeys, ...targetKeys], onItemSelect);
                            }
                        "
                        />
                        </template>
                    </a-transfer>
                </div>
        </template>
        </div> -->
        </a-modal>
    </div>
</template>
<script lang="ts">
interface groupType{
    group_info:any,
    student_list:any,
}
interface groupItem{
    name:string,
    student_list:any[]
}
interface Istate{
   editLoading:boolean,
   group:groupType,
   dataSource:any[],
   targetKeys:any[]
} 
import { defineComponent,onMounted,inject,reactive,toRefs,ref,watch,computed} from 'vue'
import { CheckEvent } from 'ant-design-vue/es/tree/Tree'
import request from 'src/api/index'
import Empty from 'src/components/Empty.vue'
import { DownOutlined} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import transfer from '../transfer/transfer.vue'
interface TreeDataItem {
  key: string;
  title: string;
  disabled?: boolean;
  children?: TreeDataItem[];
}
export default defineComponent({
    name:'resources',
    props:['propTrainDetailInfo','trainId','editvisible','ifautoGroupEdit','unGroupData','groupType'],
    components:{
        Empty,
        DownOutlined,
        transfer
    },
    setup(props,context){
    const http=(request as any).teacherTrain
    const state:Istate=reactive({
        editLoading:false,
        // treeData:[],
        group:{
            group_info: {},
            student_list:[]
        },
        treeData:[
        { key: '0-0', title: '0-0' },
        {
            key: '0-1',
            title: '0-1',
            children: [
            { key: '0-1-0', title: '0-1-0' },
            { key: '0-1-1', title: '0-1-1' },
            ],
        },
        { key: '0-2', title: '0-3' },
        ],
        dataSource:[],
        targetKeys:[]
    })
    const methods={
            editOk(){
            },
            editCancel(){
                context.emit('editModal',false)
            },
            onChange(keys: string[]){
                state.targetKeys= keys;
            },
    }
    onMounted(()=>{
    })
    return {...toRefs(state),...methods}
    }
})
</script>
<style lang="less">
.transferBox{
        .move{
        width:24px;
        height:24px;
        border-radius: 2px;
        background-color:#f5f5f5;
        }
        .move:hover{
            cursor: not-allowed
        }
        .moveHover{
            width:24px;
            height:24px;
            border-radius: 2px;
            background-color:@theme-color; 
            color: white;
        }
        .move:nth-child(1){
            margin-bottom:20px;
        }
        .isMoveRight{
            cursor: none;
        }
        .isMoveLeft{
            cursor: none;
        }
    }
// .groupModal{
    
// }
.hasGroup,.unGroup{
        width: 45%;
        border: 1px solid #C5D2DA;
        padding: 0 10px 10px 10px;
        height: 390px;
        overflow-y: auto;
        text-align: left;
        .groupHeader{
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
            // border-bottom: 1px solid #C5D2DA;
        }
        .groupOperate{
            margin-top:10px;
            display: flex;
            justify-content: space-between;
        }
        .checkGroup{
            margin-top: 10px;
        }
    }
</style>