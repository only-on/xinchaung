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
                      <in-class-forum
                        class="delete icon-shanchu-copy iconfont"
                        @click="deleteTree(index)"
                      ></in-class-forum>
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
              {{ checkedValues?.length }}/{{ unGroupData?.length }}人
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
            <a-tree
              checkable
              v-model:checkedKeys="checkedKeys"
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
          <!-- 如果按学生排课 -->
          <div v-else class="checkGroup">
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
  checkedValues: number[];
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
    });
    const methods = {
      editOk() {
        console.log(state.treeData, "treeData");
        context.emit("editModal", true, state.treeData,props.ifautoGroupEdit);
        state.treeData=[]

      },
      handGroup() {},
      editCancel() {
        context.emit("editModal", false);
      },
      onCheckAllChange(e: any) {
        state.checkedValues = [];
        props.unGroupData.forEach((item: any, index: any) => {
          state.checkedValues.push(item.userProfile.id);
        });
        Object.assign(state, {
          checkedValues: e.target.checked ? state.checkedValues : [],
          indeterminate: true,
        });
      },
      onSearch() {
        console.log(state.groupname);
        context.emit("search-group", state.groupname);
      },
      check(checkedKeys: any, e: any) {
        console.log(checkedKeys, e, "hhhh");
        state.checkedValues = checkedKeys.checked;
      },
      expandTree(e: any) {
        console.log(e);
      },
      //   onChange(checkedValues:any) {
      //     state.checkedValues=checkedValues

      //     },
      addGroup() {
        if (!state.inputGroupName) {
          message.warning("请输入分组名称");
          return;
        }
        // state.group.student_list
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
      clickTree(index: any) {
        state.selectedGroup = index;
      },
      leftMove() {
        console.log("哈哈哈哈");

        // if (props.groupType === "class"){

        // }else{
        // const checkys: any = [];
        if (props.groupType === "class") {
          state.groupedKeys.forEach((item: any, index) => {
            // checkys.push(item.split("-")[1]);
            let treeIndex = Number(item.split("-")[0]);
            let childrenId = Number(item.split("-")[1]);
            let i = state.treeData[treeIndex].student_list.findIndex(
              (it: any) => {
                return childrenId == it.userProfile.id;
              }
            );
            state.unGroupData1[
              state.treeData[treeIndex].student_list[i].classes.classname
            ].push(state.treeData[treeIndex].student_list[i]);
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

        // console.log(checkys, "checkyscheckyscheckys");
        // state.unGroupData1 = state.treeData[0].student_list.filter(
        //   (item: any) => {
        //     console.log(
        //       checkys,
        //       item.userProfile.id.toString(),
        //       checkys.includes(Number(item.userProfile.id))
        //     );
        //     return checkys.includes(item.userProfile.id.toString());
        //   }
        // );
        // state.treeData = state.treeData[0].student_list.filter((item: any) => {
        //   console.log(item);
        //   return checkys.includes(!item.userProfile.id.toString());
        // });

        // }
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
    watch(
      () => props.unGroupData,
      (val: any) => {
        state.unGroupData1 = val; 
        if(!props.groupData){
          state.treeData=[]
        }
      },
      {
        immediate: true,
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
    background-color: var(--purpleblue-6);
    color: white;
  }
  .moveHoverRight {
    width: 24px;
    height: 24px;
    border-radius: 2px;
    background-color: var(--purpleblue-6);
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
      color: var(--purpleblue-6);
      display: none;
      margin-left: auto;
    }
    .delete {
      color: var(--purpleblue-6);
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