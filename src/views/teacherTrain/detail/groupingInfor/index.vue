<template>
  <div class="groupingInfor">
    <div v-if="role !== '2'" class="groupBtn">
      <a-button class="autoGroup" type="primary" @click="aotuGroup">自动分组</a-button>
      <a-button type="primary" @click="manualGroup">手动分组</a-button>
    </div>
    <div>
      <a-config-provider>
        <a-table class="groupTable" :columns="columns" :data-source="data" rowkey="id"  :pagination="
          total > 10
            ? {
                hideOnSinglePage: false,
                showSizeChanger: true,
                total: total,
                pageSize: params.limit,
                onChange: onChange,
                onShowSizeChange: onShowSizeChange,
              }
            : false
        ">
          <template #created_time="{ record }">
            <div>
              {{ record.created_time.split(" ")[0] }}
            </div>
          </template>
          <template #action="{ record }">
            <div class="action">
              <span @click="deleteGroup(record.id)" class="iconfont icon-shanchu-copy"></span>
              <span @click="editGroup(record.name, record.id)" class="iconfont icon-bianji"></span>
            </div>
          </template>
        </a-table>
        <template #renderEmpty>
          <div><empty type="tableEmpty"></empty></div>
        </template>
      </a-config-provider>
      <a-modal
        title="提示"
        :visible="deletevisible"
        :confirm-loading="confirmLoading"
        @ok="deleteOk"
        @cancel="deleteCancel"
        class="groupModal"
      >
        <p>确定要删除此分组吗？</p>
      </a-modal>
      <group-modal
        :trainId="trainId"
        :editvisible="editvisible"
        @edit-modal="editModal"
        :unGroupData="unGroupData"
        :groupData="groupData"
        :groupType="groupType"
        @search-group="searchGroup"
        :ifautoGroupEdit="ifautoGroupEdit"
      >
      </group-modal>
      <a-modal
        title="学生分组"
        width="550px"
        :footer="null"
        :visible="autoGroupVisible"
        :confirm-loading="autoConfirmLoading"
        @ok="autoGroupOk"
        @cancel="autoGroupCancel"
        class="groupModal"
      >
        <div class="groupWay">
          <span class="groupItem">分组方式：</span>
          <span class="groupItem">
            <a-select
              default-value="1"
              style="width: 100px; height: 32px"
              @change="handleChange"
            >
              <a-select-option value="1"> 小组数 </a-select-option>
              <a-select-option value="2"> 分组人数 </a-select-option>
            </a-select>
          </span>
          <a-input
            class="groupItem"
            style="width: 170px"
            v-model:value="groupNumber"
          ></a-input>
          <a-button type="primary" @click="grouping">分组</a-button>
        </div>
      </a-modal>
    </div>
  </div>
</template>
<script lang="ts">
interface Istate {
  // columns: any[];
  data: any[];
  total:number;
  params:{
    limit:number,
    page:number
  };
  deletevisible: boolean;
  confirmLoading: boolean;
  editvisible: boolean;
  autoGroupVisible: boolean;
  autoConfirmLoading: boolean;
  ifautoGroupEdit: boolean;
  groupNumber: any;
  groupway: number;
  deleteGroupId: number;
  unGroupPrams: any;
  unGroupData: any;
  groupType: any;
  groupData: any;
  editId: any;
}
import { defineComponent, onMounted, inject, reactive, toRefs, ref } from "vue";
import request from "src/api/index";
import Empty from "src/components/Empty.vue";
import { message } from "ant-design-vue";
import groupModal from "../../components/groupModal/index.vue";
import { stat } from "fs";
export default defineComponent({
  name: "groupingInfor",
  props: ["propTrainDetailInfo", "trainId", "type", "role"],
  components: {
    Empty,
    groupModal,
  },
  setup(props, context) {
    const http = (request as any).teacherTrain;
    const role = localStorage.getItem("role");
    const columns1 = [
      {
        title: "小组名称",
        dataIndex: "name",
        align: "center",
      },
      {
        title: "小组人数",
        dataIndex: "num",
        align: "center",
      },
      {
        title: "创建时间",
        dataIndex: "created_time",
        align: "center",
        slots: { customRender: "created_time" },
      },
      {
        title: "操作",
        key: "action",
        align: "center",
        slots: { customRender: "action" },
      },
    ];
    const columns = role === "2" ? columns1.splice(0, 3) : columns1;
    const state: Istate = reactive({
      deletevisible: false,
      confirmLoading: false,
      editvisible: false,
      autoGroupVisible: false,
      autoConfirmLoading: false,
      ifautoGroupEdit: false,
      groupway: 1,
      groupNumber: "",
      deleteGroupId: 0,
      editId: "",
      unGroupPrams: {
        name: "",
        type: props.type === "course" ? 1 : 2,
        id: props.trainId,
      },
      unGroupData: [],
      groupData: [],
      groupType: "class",
      data: [],
      total:0,
      params:{
        limit:10,
        page:1
      }
    });
    const methods = {
       onChange(page: any, pageSize: any) {
        state.params.page = page;
        state.params.limit = pageSize;
        methods.getGroupList();
      },
      onShowSizeChange(current: any, size: any) {
        console.log(current, size, "current, size");
        state.params.page = current;
        state.params.limit=size;
        methods.getGroupList();
      },
      // 删除分组确认框
      deleteGroup(id: any) {
        state.deletevisible = true;
        state.deleteGroupId = id;
      },
      //   确定删除分组
      deleteOk() {
        state.deletevisible = false;
        http
          .deleteGroupListItem({ urlParams: { group: state.deleteGroupId } })
          .then((res: any) => {
            console.log(res);
            methods.getGroupList();
          });
      },
      searchGroup(val: any) {
        console.log(val);
        state.unGroupPrams.name = val;
        methods.unGroupList();
      },
      getGroupMembers(name: any, id: any) {
        http
          .groupMembersList({ param: { group_id: id, withs: "userProfile" } })
          .then((res: any) => {
            console.log(res);
            state.groupData = [
              {
                name: name,
                student_list: res.data.list,
              },
            ];
          });
      },
      editGroup(name: any, id: any) {
        state.editId = id;
        state.editvisible = true;
        state.ifautoGroupEdit = true;
        console.log("编辑分组");
        methods.getGroupMembers(name, id);
        methods.unGroupList();
      },
      editGroupList() {
        http.editGroupStu().then((res: any) => {
          console.log(res);
        });
      },
      //
      deleteCancel() {
        state.deletevisible = false;
      },
      editModal(value: any, groupdata: any, ifEdit: any) {
        console.log(value, groupdata, ifEdit);
        if (value && !ifEdit) {
          const params: any = {
            id: props.trainId,
            type: props.type === "course" ? 1 : 2,
            groups: [],
          };
          groupdata.forEach((item: any, index: any) => {
            const members: any = [];
            item.student_list.forEach((it: any) => {
              members.push(it.id);
            });
            params.groups.push({ name: item.name, members: members });
          });
          http.manualGrouping({ param: params }).then((res: any) => {
            console.log(res);
            methods.getGroupList();
          });
        }
        if (value && ifEdit) {
          const params: any = {
            name: "",
            members: [],
          };
          groupdata.forEach((item: any, index: any) => {
            params.name = item.name;
            item.student_list.forEach((it: any) => {
              params.members.push(it.id);
            });
          });
          http
            .editGroupStu({ param: params, urlParams: { group: state.editId } })
            .then((res: any) => {
              methods.getGroupList();
            });
        }
        state.editvisible = false;
        state.ifautoGroupEdit = false;
      },
      //   自动分组
      aotuGroup() {
        state.autoGroupVisible = true; //   展示弹框内容
      },
      // 点击分组按钮
      grouping() {
        console.log(props.trainId, "trainId");
        if (!state.groupNumber) {
          message.warning("人数或小组数不能为空！");
          return;
        }
        const params = {
          id: props.trainId,
          type: props.type === "course" ? 1 : 2,
          number: state.groupNumber,
          group_type: state.groupway === 1 ? "group_num" : "group_people_num",
        };
        http.automaticGroup({ param: params }).then((res: any) => {
          console.log(res);
          methods.getGroupList();
        });
      },
      autoGroupOk() {
        state.autoGroupVisible = false;
      },
      autoGroupCancel() {
        state.autoGroupVisible = false;
      },
      //   手动分组
      manualGroup() {
        state.editvisible = true;
        methods.unGroupList();
      },
      //获取待分组排课用户列表
      unGroupList() {
        http.usersTobeGrouped({ param: state.unGroupPrams }).then((res: any) => {
          console.log(res.data.data, "unGroupData");
          (state.groupType = res.data.type), (state.unGroupData = res.data.data);
        });
        //   http.userHasGrouped({}).then((res:any)=>{
        //   })
      },
      handleChange(value: any) {
        console.log(value);
        state.groupway = value;
      },
      rowkey(record: {}, index: number) {
        return index;
      },
      //   获取分组列表
      getGroupList() {
        http
          .groupList({
            param: { id: props.trainId, type: props.type === "course" ? 1 : 2,page:state.params.page,limit:state.params.limit},
          })
          .then((res: any) => {
            console.log(res);
            state.data = res.data.list;
            state.total=res.data.page.totalCount;
          });
      },
    };
    onMounted(() => {
      methods.getGroupList();
    });
    return { ...toRefs(state), ...methods, role, columns };
  },
});
</script>
<style lang="less">
.groupingInfor {
  margin: 10px;
  .groupBtn {
    margin-bottom: 20px;
    .autoGroup {
      margin-right: 20px;
    }
  }
  .groupTable {
    .action {
      span {
        margin: 0 5px;
        color: var(--purpleblue-6);
      }
      span:hover {
        color: var(--theme-light-color);
      }
    }
  }
}
.editCon {
  display: flex;
  .transferBox {
    float: left;
    padding: 160px 0 0 34%;
    width: 84px;
    text-align: center;
  }
}
.groupWay {
  // justify-content: center;
  // align-items:center;
  text-align: center;
  .groupItem {
    margin-right: 5px;
  }
}
.groupModal {
  .ant-modal-body {
    min-height: 120px;
  }
}
:deep(.ant-table-pagination.ant-pagination) {
  float: none;
  text-align: center;
}
</style>
