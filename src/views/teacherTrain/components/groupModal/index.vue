<template>
  <div class="groupModal">
    <a-modal
      title="学生分组"
      :visible="editvisible"
      :confirm-loading="editLoading"
      @ok="editOk"
      @cancel="editCancel"
      width="800px"
    >
      <div class="editCon">
        <!-- <transfer></transfer> -->
        <div class="hasGroup">
          <div v-if="!ifautoGroupEdit" class="groupHeader">
            <a-input
              placeholder="请输入组名"
              style="width: 70%"
              v-model:value="inputGroupName"
            ></a-input
            ><a-button type="primary" @click="addGroup">创建</a-button>
          </div>
          <!-- <div class="groupOperate" v-if="ifautoGroupEdit">
            <a-input style="width: 150px"></a-input>
            <a-button type="primary">修改</a-button>
          </div> -->
          <!-- <div class="groupOperate" v-else> -->
          <!-- <a-input style="width:150px"></a-input>
                    <a-button type="primary">编辑</a-button>
                    <a-button type="primary">解散</a-button> -->
          <!-- </div> -->
          <!-- :treeData='treeData'   :replaceFields='replaceFields' -->
          <a-tree
            checkable
            @select="selectTree"
            v-model:checkedKeys="groupedKeys"
            v-if="flag === true"
          >
            <template #switcherIcon>
              <down-outlined />
            </template>
            <a-tree-node
              :checkable="false"
              v-for="(item, index) in treeData"
              :key="index"
            >
              <!-- :title="item.name" -->
              <template #title>
                <div class="tree-title title">
                  <template v-if="currentEditData === index">
                    <a-input
                      class="name inputname"
                      v-model:value="item.name"
                      @blur="titleBlurs"
                    ></a-input>
                  </template>
                  <template v-else>
                    <span class="name"
                      >{{ item.name }}
                      <i
                        class="edit icon-bianji1 iconfont"
                        @click="editTreeTittle(index)"
                      ></i>
                       <i
                        class="delete icon-shanchu-copy iconfont"
                        @click="deleteTree(index)"
                      ></i>
                    </span>
                  </template>
                </div>
              </template>
              <a-tree-node
                :checkable="true"
                v-for="it in item.student_list"
                :key="index + '-' + it?.userProfile?.id"
                :title="it?.userProfile?.name"
              >
              </a-tree-node>
            </a-tree-node>
          </a-tree>
        </div>
        <div>
          <div class="transferBox">
            <div :class="groupedKeys.length ? 'moveHoverRight' : 'move'">
              <span
                @click="leftMove"
                class="icon-chuansuojiantou iconfont"
              ></span>
            </div>
            <div :class="checkedValues.length ? 'moveHover' : 'move'">
              <span
                @click="rightMove"
                class="icon-chuansuojiantou-copy iconfont"
              ></span>
            </div>
          </div>
        </div>
        <div class="unGroup">
          <div>
            <span v-if="groupType === 'class'">班级列表</span>
            <span v-else>学生列表</span>
            <a-checkbox
              :indeterminate="indeterminate"
              v-model:checked="checkAll"
              @change="onCheckAllChange"
            >
              {{ checkedValues?.length }}/{{groupType === 'class'?totalStu:unGroupData?.length }}人
            </a-checkbox>
          </div>
          <div class="groupOperate" v-if="!ifautoGroupEdit">
            <a-input-search
              style="width: 100%"
              placeholder="请输入搜索关键字"
              v-model:value="groupname"
              @keyup.enter="onSearch"
              @search="onSearch"
            ></a-input-search>
            <!-- <a-button type='primary' @click="addGroup">添加分组</a-button> -->
          </div>
                <!-- 如果按班级排课 -->
              <div v-if="groupType === 'class'" class="checkGroup">
                <div v-if="totalStu">
                  <a-tree
                  checkable
                  v-model:checkedKeys="checkedKeys"
                  @select="selectTreeOfClass"
                  @check="check"
                  @expand="expandTree"
                  checkStrictly
                  v-if="flag === true"
                >
                  <template #switcherIcon>
                    <down-outlined />
                  </template>
                  <a-tree-node
                    :checkable="false"
                    v-for="(val, key) in unGroupData1"
                    :key="key"
                    :title="key"
                  >
                    <a-tree-node
                      v-for="it in val"
                      :key="key + '-' + it?.userProfile?.id"
                      :checkable="true"
                      :title="it?.userProfile?.name"
                    >
                    </a-tree-node>
                  </a-tree-node>
                </a-tree>
                </div>
                <div v-else>
                  <empty text="暂无待排课的学生"></empty>
                </div>
              </div>
              <!-- 如果按学生排课 -->
              <div v-else class="checkGroup">
                <div v-if='unGroupData?.length'>
                  <a-checkbox-group
                  v-model:value="checkedValues"
                  v-if="flag === true"
                >
                  <div
                    v-for="(item, index) in unGroupData1"
                    :key="index.toString()"
                  >
                    <a-checkbox :value="item.userProfile.id">
                      {{ item.userProfile.name }}
                    </a-checkbox>
                  </div>
                  </a-checkbox-group>
                </div>
                <div v-else>
                  <empty text="暂无待排课的学生"></empty>
                </div>
              </div>
          
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script lang="ts">
interface groupType {
  group_info: any;
  student_list: any;
}
interface groupItem {
  name: string;
  student_list: any[];
}
interface Istate {
  editLoading: boolean;
  group: groupType;
  treeData: groupItem[];
  replaceFields: any;
  groupname: string;
  checkedValues: any[];
  groupedKeys: number[];
  selectedKeys: string[];
  indeterminate: boolean;
  checkAll: boolean;
  inputGroupName: string;
  selectedKeysClass: string[];
  checkedKeys: any[];
  selectedGroup: any;
  unGroupData1: any[];
  flag: boolean;
  currentEditData: any;
  totalStu:any;

  selectedClass:any;
}
import {
  defineComponent,
  onMounted,
  inject,
  reactive,
  toRefs,
  ref,
  watch,
} from "vue";
import request from "src/api/index";
import Empty from "src/components/Empty.vue";
import { DownOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import transfer from "../transfer/transfer.vue";
import configRouters from "src/routers/modules";
import { stat } from "fs/promises";
import { AnyPtrRecord } from "dns";
export default defineComponent({
  name: "resources",
  props: [
    "propTrainDetailInfo",
    "trainId",
    "editvisible",
    "ifautoGroupEdit",
    "unGroupData",
    "groupType",
    "groupData",
  ],
  components: {
    Empty,
    DownOutlined,
    transfer,
  },
  setup(props, context) {
    const http = (request as any).teacherTrain;
    const state: Istate = reactive({
      editLoading: false,
      treeData: [],
      group: {
        group_info: {},
        student_list: [],
      },
      replaceFields: { children: "student_list", title: "name", key: "id" },
      groupname: "",
      checkedValues: [],
      selectedKeys: [],
      groupedKeys: [],
      indeterminate: false,
      checkAll: false,
      inputGroupName: "",
      selectedKeysClass: [],
      selectedGroup: "",
      unGroupData1: [],
      flag: true,
      checkedKeys: [],
      currentEditData: "",
      totalStu:0,

      selectedClass:''
    });
    const methods = {
      editOk() {
        console.log(state.treeData, "treeData");
        context.emit("editModal", true, state.treeData,props.ifautoGroupEdit);
        state.treeData=[]
      },
      editCancel() {
        context.emit("editModal", false);
        state.treeData=[]
      },
      onCheckAllChange(e: any) {
        console.log(e,'e')
        state.checkedValues = [];
        if(props.groupType==='member'){
          props.unGroupData.forEach((item: any, index: any) => {
          state.checkedValues.push(item.userProfile.id);
        });
        Object.assign(state, {
          checkedValues: e.target.checked ? state.checkedValues : [],
          indeterminate: true,
        });
        }else{
          if(e.target.checked){
              let arrDataId=methods.objToArray()
              arrDataId.forEach((con:any,x:any)=> {
                state.checkedValues.push(con.key+'-'+con.item.userProfile.id);
              });
              console.log(state.checkedValues,'state.checkedValues')
              Object.assign(state, {
              // checkedValues: e.target.checked ? state.checkedValues : [],
              checkedKeys: e.target.checked ? state.checkedValues : [],
              indeterminate: true,
            });
          }else{
            state.checkedKeys=[]
          }
        }
      },
      objToArray(){
         let unGroupDataKeys=Object.keys(props.unGroupData)
         let unGroupData=Object.values(props.unGroupData)
          let arrDataId:any=[]
          unGroupData.forEach((item:any,index:any)=>{
            Object.values(item).forEach((it:any,j:any)=>{
               arrDataId.push({'key':unGroupDataKeys[index],'item':it})
            })
          })
        return arrDataId
      },
      onSearch() {
        console.log(state.groupname);
        context.emit("search-group", state.groupname);
      },
      check(checkedKeys: any, e: any) {
        console.log(checkedKeys, e, "hhhh");
        state.checkedValues = checkedKeys.checked;
        console.log(state.checkedValues,'state.checkedValues')
      },
      expandTree(e: any) {
        console.log(e);
      },
      addGroup() {
        if (!state.inputGroupName) {
          message.warning("请输入分组名称");
          return;
        }
        const treeItem: any = {
          name: state.inputGroupName,
          student_list: [],
        };
        console.log(treeItem);
        state.treeData.push(treeItem);
        state.inputGroupName = "";
        state.checkedValues = [];
        state.selectedGroup = [];

        console.log(state.checkedValues);
      },
      selectTree(selectedKeys: any, e: any) {
        state.selectedGroup = selectedKeys[0];
      },
      selectTreeOfClass(selectedKeys: any, e: any){
        console.log(selectedKeys,'selectedKeys')
        state.selectedClass=selectedKeys[0]
        console.log(state.selectedClass,'state.selectedClass')
      },
      clickTree(index: any) {
        state.selectedGroup = index;
      },
      leftMove() {
        if (props.groupType === "class") {
        //  console.log('按照班级分组',state.groupedKeys,state.treeData,state.unGroupData1)
        //  let unGroupDataKeys=Object.keys(state.unGroupData1)
        //  console.log(unGroupDataKeys.indexOf(state.selectedClass),'选择的班级')
        //  console.log(state.unGroupData1[state.selectedClass],'state.unGroupData1[state.selectedClass]')
        if(!state.selectedClass){
          message.warning("请选择要移回的班级！")
          return
        }
          state.groupedKeys.forEach((item: any, index) => {
            let treeIndex = Number(item.split("-")[0]);
            let childrenId = Number(item.split("-")[1]);
            let i = state.treeData[treeIndex].student_list.findIndex(
              (it: any) => {
                return childrenId == it.userProfile.id;
              }
            );
          console.log(i,state.treeData[treeIndex].student_list[i],'i')
            // state.unGroupData1[
            //   state.treeData[treeIndex].student_list[i].classes.classname
            // ].push(state.treeData[treeIndex].student_list[i]);
            // state.treeData[treeIndex].student_list.splice(i, 1);
         state.unGroupData1[state.selectedClass].push(state.treeData[treeIndex].student_list[i])
         state.treeData[treeIndex].student_list.splice(i, 1);

          });
          state.flag = false;
          setTimeout(() => {
            state.flag = true;
          }, 100);
          state.groupedKeys = [];
        } else {
          state.groupedKeys.forEach((item: any, index) => {
            // checkys.push(item.split("-")[1]);
            let treeIndex = Number(item.split("-")[0]);
            let childrenId = Number(item.split("-")[1]);
            let i = state.treeData[treeIndex].student_list.findIndex(
              (it: any) => {
                return childrenId == it.userProfile.id;
              }
            );

            state.unGroupData1.push(state.treeData[treeIndex].student_list[i])
            state.treeData[treeIndex].student_list.splice(i,1)
          });
          state.groupedKeys = [];
        }
      },
      rightMove() {
        console.log(state.selectedGroup, "state.selectedGroup");
        if (state.selectedGroup === "") {
          message.warning("请选择或者创建分组");
          return;
        }
        if (props.groupType === "class") {
          let deleteids: any = [];
          state.checkedValues.forEach((item: any, index: any) => {
            let i: any = item.split("-")[0];
            let j: any = item.split("-")[1];
            console.log(i, j);
            let ci = state.unGroupData1[i].findIndex((it: any) => {
              console.log(it.userProfile.id);

              return it.userProfile.id == j;
            });
            console.log(ci);
            state.treeData[state.selectedGroup].student_list.push(
              state.unGroupData1[i][ci]
            );
            state.unGroupData1[i].splice(ci, 1);
          });
        } else {
          state.checkedValues.forEach((item, index) => {
            let i = state.unGroupData1.findIndex((it) => {
              return it.userProfile.id == item;
            });
            state.treeData[state.selectedGroup].student_list.push(
              state.unGroupData1[i]
            );
            state.unGroupData1.splice(i, 1);
          });
        }
        state.flag = false;
        setTimeout(() => {
          state.flag = true;
        }, 100);
        state.checkedValues = [];
        state.checkedKeys = [];
      },
    };
    watch(
      () => state.checkedValues,
      (val) => {
        state.indeterminate =
          !!val.length && val.length < props.unGroupData.length;
        state.checkAll = val.length === props.unGroupData.length;
      }
    ),
    watch(()=>state.checkedKeys,(val)=>{
      state.checkAll=val.length===state.totalStu?true:false
    })
    watch(
      () => props.unGroupData,
      (val: any) => {
        console.log(props.groupType,'props.groupType')
        if(props.groupType==='member'){
        state.unGroupData1 = val; 
        if(!props.groupData){
          state.treeData=[]
        }
        }else{ 
        state.unGroupData1 = val; 
        if(!props.groupData){
          state.treeData=[]
        }
          state.totalStu=methods.objToArray().length
        }
      },
      {
        immediate: true,
        deep:true
      }
    );
    watch(
      () => props.groupData,
      (val: any) => {
        state.treeData = val;
      },
      {
        immediate: true,
      }
    );
    watch(()=>state.groupedKeys,(val:any)=>{
        console.log(val,'state.groupedKeys')
    })
    // 编辑学生分组tree标题
    function editTreeTittle(index: number) {
      state.currentEditData = index;
    }
    // 编辑学生分组tree标题失去焦点时
    function titleBlurs() {
      state.currentEditData = "";
    }
    // 删除树
    function deleteTree(index: number) {
      if (props.groupType === "class") {
        state.treeData[index].student_list.forEach((item: any, index: any) => {
          state.unGroupData1[item.classes.classname].push(item);
        });
        state.treeData.splice(index, 1);
        state.groupedKeys = [];
        state.flag = false;
        setTimeout(() => {
          state.flag = true;
        }, 100);
      } else {
        state.unGroupData1 = state.unGroupData1.concat(
          ...state.treeData[index].student_list
        );
        state.treeData.splice(index, 1);
      }
    }
    onMounted(() => {});
    return {
      ...toRefs(state),
      ...methods,
      editTreeTittle,
      titleBlurs,
      deleteTree,
    };
  },
});
</script>
<style lang="less">
.transferBox {
  .move {
    width: 24px;
    height: 24px;
    border-radius: 2px;
    background-color: #f5f5f5;
  }
  .move:hover {
    cursor: not-allowed;
  }
  .moveHover {
    width: 24px;
    height: 24px;
    border-radius: 2px;
    background-color: var(--primary-color);
    color: white;
  }
  .moveHoverRight {
    width: 24px;
    height: 24px;
    border-radius: 2px;
    background-color: var(--primary-color);
    color: white;
    margin-bottom: 20px;
  }
  .move:nth-child(1) {
    margin-bottom: 20px;
  }
  .isMoveRight {
    cursor: none;
  }
  .isMoveLeft {
    cursor: none;
  }
}
// .groupModal{

// }
.hasGroup,
.unGroup {
  width: 45%;
  border: 1px solid #c5d2da;
  padding: 0 10px 10px 10px;
  height: 390px;
  overflow-y: auto;
  text-align: left;
  .groupHeader {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    // border-bottom: 1px solid #C5D2DA;
  }
  .title {
    .name {
      display: flex;
      width: 280px;
    }
    .inputname {
      height: 25px;
      width: 260px;
    }
    .edit {
      margin-left: 10px;
      margin-right: 15px;
      color: var(--primary-color);
      display: none;
      margin-left: auto;
    }
    .delete {
      color: var(--primary-color);
      display: none;
    }
    &.tree-title {
      &:hover {
        .iconfont {
          display: inline-block;
        }
      }
    }
  }
  .groupOperate {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
  }
  .checkGroup {
    margin-top: 10px;
  }
}
</style>