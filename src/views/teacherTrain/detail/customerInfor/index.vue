<template>
  <div class="customerInfor">
    <div v-if="role !== '2'" class="radioInfo">
      <a-radio-group size="large" v-model:value="value" @change="onRadioChange">
        <a-radio :value="1"> 学生信息 </a-radio>
        <a-radio :value="2"> 班级信息 </a-radio>
      </a-radio-group>
    </div>
    <div class="stuAndclass">
      <div v-if="role !== '2'" class="operateBtn">
        <a-button type="primary" class="choice" @click="selectStuClass">选择</a-button>
        <a-button type="primary" @click="deleteMany">移除</a-button>
      </div>
      <div>
        <a-config-provider>
          <a-table
            :columns="columns"
            :data-source="data"
            :pagination="
          total > 10
            ? {
                hideOnSinglePage: false,
                showSizeChanger: true,
                total: total,
                current:params.page,
                pageSize: params.limit,
                onChange: onChange,
                onShowSizeChange: onShowSizeChange,
              }
            : false
        "
            :row-selection="role!=='2'?{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
            }:undefined"
            rowkey="id"
          >
            <template #username="{ record }">
              <div>
                {{ record.user.username }}
              </div>
            </template>
            <template #name="{ record }">
              <div>{{ record.userProfile.name }}</div>
            </template>
            <template #department="{ record }">
              <div>{{ record.userProfile.department }}</div>
            </template>
            <template #gender="{ record }">
              <div>{{ record.userProfile.gender }}</div>
            </template>
            <template #phone="{ record }">
              <div>{{ record.userProfile.phone }}</div>
            </template>
            <template #stuaction="{ record }">
              <div class="action">
                <a><span class="spanleft iconfont icon-shanchu" @click="removeStudent(record.id)"></span></a>
                <a><span @click="initPassword(record.id)">初始化密码</span></a>
              </div>
            </template>
            <template #classaction="{ record }">
              <div class="action">
                <span class="spanleft iconfont icon-chakan1" @click="checkClass(record.id)"></span>
                <span @click="deleteClass(record.id)" class="iconfont icon-shanchu"></span>
              </div>
            </template>
          </a-table>
          <template #renderEmpty>
            <div><empty type="tableEmpty"></empty></div>
          </template>
        </a-config-provider>
      </div>
      <div>
        <select-stu-class
          :unSelectData="unSelectData"
          :unselectLoading="unselectLoading"
          :selectvalue="value"
          :trainId="trainId"
          :isvisible="isvisible"
          @if-select="ifSelect"
          @selected-rows="addSelectedRows"
          @search-inquiry="searchInquiry"
          :addids="addidarr"
        >
        </select-stu-class>
      </div>
      <div>
        <a-modal
          width="600px"
          title="班级信息"
          :visible="classInfoVisible"
          :confirm-loading="classInfoLoading"
          :footer="null"
          @ok="classInfoOk"
          @cancel="classInfoCancel"
        >
          <div>
            <a-table :columns="classInfoColumns" :data-source="classInfoData" rowkey="id">
              <template #name="{ record }">
                <div>
                  {{ record.user_profile.name }}
                </div>
              </template>
              <template #gender="{ record }">
                <div>
                  {{ record.user_profile.gender }}
                </div>
              </template>
              <template #department="{ record }">
                <div>
                  {{ record.user_profile.department }}
                </div>
              </template>
            </a-table>
          </div>
        </a-modal>
      </div>
      <div>
        <a-modal
          title="删除提示"
          :visible="classDeleteVisible"
          :confirm-loading="classDeleteLoading"
          @ok="classDeleteOk"
          @cancel="classDeleteCancel"
        >
          <p>确定要删除这个班级吗？</p>
        </a-modal>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
interface stuType {
  name?: string;
  nick?: string;
  department?: string;
  limit?: number;
  page?: number;
  type?: number;
  id?: number;
  withs?: string;
}
interface classType {
  name?: string;
  limit?: number;
  page?: number;
  type?: number;
  id?: number;
}
interface Istate {
  value: number;
  stuColumns: any[];
  classColumns: any[];
  columns: any[];
  data: any[];
  total:number;
  params:any,
  isvisible: boolean;
  classInfoColumns: any[];
  classInfoData: any[];
  classInfoVisible: boolean;
  classInfoLoading: boolean;
  classDeleteVisible: boolean;
  classDeleteLoading: boolean;
  addidarr: any;
  unSelectData: any;
  unselectLoading: boolean;
  selectStuOrClassKeys: any[];
  classStuDeleteid: any[];
  stuUnselectParams: stuType;
  classUnselectParams: classType;
  allClassId: any[];
  allStuId: any[];
  selectedRowKeys: any[];
}
import { defineComponent, onMounted, inject, reactive, toRefs, ref, watch } from "vue";
import request from "src/api/index";
import Empty from "src/components/Empty.vue";
import selectStuClass from "../../components/selectStuClass/index.vue";
import { message, Modal } from "ant-design-vue";
export default defineComponent({
  name: "customerInfor",
  props: ["propTrainDetailInfo", "trainId", "type", "role"],
  components: {
    Empty,
    selectStuClass,
  },
  setup(props, context) {
    console.log(props.type);
    const http = (request as any).teacherTrain;
    const role = localStorage.getItem("role");
    const state: Istate = reactive({
      stuUnselectParams: {
        id: props.trainId,
        type: props.type === "course" ? 1 : 2,
        withs: "userProfile",
        limit:10,
        page:1,
      },
      classUnselectParams: {
        id: props.trainId,
        type: props.type === "course" ? 1 : 2,
        limit:10,
        page:1
      },
      allClassId: [],
      allStuId: [],
      value: 0,
      isvisible: false,
      unSelectData: [],
      classStuDeleteid: [],
      classColumns: [
        {
          title: "班级名称",
          dataIndex: "classname",
          align: "center",
        },
        {
          title: "人数",
          dataIndex: "number",
          align: "center",
        },
        {
          title: "操作",
          dataIndex: "classaction",
          align: "center",
          slots: { customRender: "classaction" },
        },
      ],
      stuColumns: [
        {
          title: "学号",
          dataIndex: "username",
          align: "left",
          ellipsis: true,
          slots: { customRender: "username" },
        },
        {
          title: "姓名",
          dataIndex: "name",
          ellipsis: true,
          slots: { customRender: "name" },
        },
        {
          title: "所属院系",
          dataIndex: "department",
          ellipsis: true,
          slots: { customRender: "department" },
        },
        {
          title: "性别",
          dataIndex: "gender",
          slots: { customRender: "gender" },
        },
        {
          title: "邮箱",
          dataIndex: "email",
          align: "center",
          ellipsis: true,
        },
        {
          title: "电话",
          dataIndex: "phone",
          ellipsis: true,
          slots: { customRender: "phone" },
        },
        {
          title: "操作",
          dataIndex: "stuaction",
          align: "center",
          slots: { customRender: "stuaction" },
        },
      ],
      classInfoColumns: [
        {
          title: "账号",
          dataIndex: "username",
          align: "left",
          ellipsis: true,
        },
        {
          title: "姓名",
          dataIndex: "name",
          align: "left",
          ellipsis: true,
          slots: { customRender: "name" },
        },
        {
          title: "性别",
          dataIndex: "gender",
          align: "left",
          ellipsis: true,
          slots: { customRender: "gender" },
        },
        {
          title: "院系",
          dataIndex: "department",
          align: "left",
          ellipsis: true,
          slots: { customRender: "department" },
        },
        {
          title: "班级",
          dataIndex: "classes",
          align: "left",
          ellipsis: true,
          slots: { customRender: "classes" },
        },
      ],
      columns: [],
      data: [],
      total:0,
      params:{
        limit:10,
        page:1
      },
      classInfoData: [],
      classInfoVisible: false,
      classInfoLoading: false,
      classDeleteVisible: false,
      classDeleteLoading: false,
      addidarr: [],
      selectStuOrClassKeys: [],
      unselectLoading: false,
      selectedRowKeys: [],
      
    });
    const rowSelection = {
      onChange: (selectedRowKeys1: any, selectedRows1: any) => {
        console.log(
          `selectedRowKeys: ${selectedRowKeys1}`,
          "selectedRows: ",
          selectedRows1
        );
        state.classStuDeleteid = selectedRows1;
      },
      onSelectAll: (selected1: any, selectedRows1: any, changeRows1: any) => {
        console.log(selected1, selectedRows1, changeRows1);
        state.classStuDeleteid = selectedRows1;
      },
    };
    const methods = {
       onChange(page: any, pageSize: any) {
        state.params.page = page;
        state.params.limit = pageSize;
         if (state.value == 1) {
          methods.getStudentList();
        } else {
          methods.getClassList();
        }
      },
      onShowSizeChange(current: any, size: any) {
        console.log(current, size, "current, size");
        state.params.page = 1;
        state.params.limit = size;
         if (state.value == 1) {
          methods.getStudentList();
        } else {
          methods.getClassList();
        }
      },
      onSelectChange(selectedRowKeys: any, selectedRows: any) {
        state.selectedRowKeys = selectedRowKeys;
        state.classStuDeleteid = selectedRows;
      },
      onRadioChange(e: any) {
        const columns = e.target.value == 1 ? state.stuColumns : state.classColumns;
        state.columns = role === "2" ? columns.splice(0, columns.length - 1) : columns;
        state.data = [];
        state.unSelectData = [];
        if (e.target.value == 1) {
          methods.getStudentList();
        } else {
          methods.getClassList();
        }
      },
      selectStuClass() {
        state.isvisible = true;
        if (state.value === 1) {
          methods.getUnselectStu();
        } else {
          methods.getUnselectClass();
        }
      },
      ifSelect() {
        state.isvisible = false;
      },
      rowkey(record: {}, index: number) {
        return index;
      },
      checkClass(id: any) {
        state.classInfoVisible = true;
        http
          .classMembersList({ param: { id: id, withs: "userProfile" } })
          .then((res: any) => {
            state.classInfoData = res.data.list;
          });
      },
      initPassword(id: any) {
        http.resetPassWord({ param: { schedule_id: id } }).then((res: any) => {
          message.success("重置密码成功！");
        });
      },
      classInfoOk() {
        state.classInfoVisible = false;
      },
      classInfoCancel() {
        state.classInfoVisible = false;
      },
      classDeleteCancel() {
        state.classDeleteVisible = false;
      },
      // 按学生或者班级排课
      addSelectedRows(value: any, selectValue: any, selectedRowKeys: any) {
        console.log(selectValue);
        value.forEach((item: any) => {
          state.addidarr.push(item.id);
        });
        if (selectValue === 1) {
          // 先把班级排课删除掉
          console.log(state.allClassId, "班级所有ID");
          if (state.allClassId.length) {
            http
              .deleteScheduleClass({
                param: {
                  id: state.allClassId,
                  relate_id: props.trainId,
                  type: props.type === "course" ? 1 : 2,
                },
              })
              .then((res: any) => {
                console.log(res);
                state.allClassId = [];
              });
          }
          // 然后添加学生
          const params: any = {
            id: props.trainId,
            student_id: state.addidarr,
            type: props.type === "course" ? 1 : 2,
          };
          http.scheduleStudent({ param: params }).then((res: any) => {
            console.log(res);
            console.log("再次请求未排课的学生接口");
            methods.getUnselectStu();
            methods.getStudentList();
            state.addidarr = [];
          });
        } else {
          // 先把学生排课全部删除
          console.log(state.allStuId, "学生所有ID");
          if (state.allStuId.length) {
            http
              .deleteScheduleStuMany({ param: { id: state.allStuId } })
              .then((res: any) => {
                console.log(res);
                // message.success("删除成功");
                state.allStuId = [];
              });
          }
          // 然后添加班级
          const params: any = {
            id: props.trainId,
            class_id: state.addidarr,
            type: props.type === "course" ? 1 : 2,
          };
          http.scheduleClass({ param: params }).then((res: any) => {
            methods.getUnselectClass();
            methods.getClassList();
            state.addidarr = [];
          });
        }
        console.log(state.addidarr, "ids");
      },
      // 学生排课移除
      removeStudent(id: any) {
        http.deleteScheduleStu({ urlParams: { id: id } }).then((res: any) => {
          message.success("移除成功");
          methods.getStudentList();
        });
      },
      // 班级排课删除
      deleteClass(id: any) {
        state.classDeleteVisible = true;
        state.classStuDeleteid = [id];
      },
      // 确定删除班级
      classDeleteOk() {
        state.classDeleteVisible = false;
        const deleteParmas = {
          id: state.classStuDeleteid,
          relate_id: props.trainId,
          type: props.type === "course" ? 1 : 2,
        };
        http.deleteScheduleClass({ param: deleteParmas }).then((res: any) => {
          console.log(res);
          message.success("删除成功");
          state.classStuDeleteid = [];
          methods.getClassList();
        });
      },
      // 批量删除
      deleteMany() {
        console.log(state.classStuDeleteid);
        if (!state.classStuDeleteid.length) {
          message.warning("请至少选择一条记录！");
          return;
        } else {
          Modal.confirm({
            title: "确认删除吗？",
            content: "删除后不可恢复",
            okText: "确认",
            cancelText: "取消",
            onOk() {
              let deleteid: any = [];
              state.classStuDeleteid.forEach((item: any) => {
                deleteid.push(item.id);
              });
              if (state.value === 1) {
                const deleteParmas = { id: deleteid };
                http.deleteScheduleStuMany({ param: deleteParmas }).then((res: any) => {
                  message.success("删除成功");
                  state.selectedRowKeys = [];
                  methods.getStudentList();
                });
              } else {
                const deleteParmas = {
                  id: deleteid,
                  relate_id: props.trainId,
                  type: props.type === "course" ? 1 : 2,
                };
                http.deleteScheduleClass({ param: deleteParmas }).then((res: any) => {
                  console.log(res);
                  message.success("删除成功");
                  state.classStuDeleteid = [];
                  state.selectedRowKeys = [];
                  methods.getClassList();
                });
              }
            },
          });
        }
      },
      // 未排课查询
      searchInquiry(studentValue: any, fullName: any, faculty: any, classes: any,params:any) {
        console.log(studentValue, fullName, faculty, classes);
        if (state.value === 1) {
          state.stuUnselectParams.nick = fullName;
          state.stuUnselectParams.name = studentValue;
          state.stuUnselectParams.department = faculty;
          state.stuUnselectParams.page=params?.page
          state.stuUnselectParams.limit=params?.limit
          methods.getUnselectStu();
        } else {
          state.classUnselectParams.name = classes;
          state.classUnselectParams.limit=params?.limit;
          state.classUnselectParams.page=params?.page;
          methods.getUnselectClass();
        }
      },
      // 未排课学生
      getUnselectStu() {
        state.unselectLoading = true;
        http.unSelectStudentGroup({ param: state.stuUnselectParams }).then((res: any) => {
          // state.data=res.data.list
          // state.unSelectData = res.data.list;
          state.unSelectData = res.data;
          state.unselectLoading = false;
        });
      },
      // 未排课班级列表
      getUnselectClass() {
        state.unselectLoading = true;
        http.unSelectClassGroup({ param: state.classUnselectParams }).then((res: any) => {
          // state.data=res.data.list
          // state.unSelectData = res.data.list;
          state.unSelectData = res.data;
          state.unselectLoading = false;
        });
      },
      // 已选学生列表
      getStudentList() {
        http
          .studentGroup({
            param: {
              id: props.trainId,
              type: props.type === "course" ? 1 : 2,
              withs: "userProfile,user",
              page:state.params.page,limit:state.params.limit
            },
          })
          .then((res: any) => {
            console.log(res);
            state.data = res.data.list;
            state.total=res.data.page.totalCount;
            state.data.forEach((item: any) => {
              state.allStuId.push(item.id);
            });
          });
      },
      // 已选班级列表
      getClassList() {
        http
          .classGroup({
            param: { id: props.trainId, type: props.type === "course" ? 1 : 2 ,page:state.params.page,limit:state.params.limit},
          })
          .then((res: any) => {
            console.log(res);
            state.data = res.data.list;
            state.total=res.data.page.totalCount;
            state.data.forEach((item: any) => {
              state.allClassId.push(item.id);
            });
          });
      },
    };
    watch(
      () => state.data,
      (val: any) => {
        //  state.form=cloneDeep(props.propTrainDetailInfo)
        context.emit("class-or-stu-data", state.value, state.data);
      },
      {
        deep: true,
        immediate: true,
      }
    );
    onMounted(() => {
      // state.columns =
      //   role === "2"
      //     ? state.stuColumns.splice(0, state.stuColumns.length - 1)
      //     : state.stuColumns;
      // // console.log('请求学生接口')
 
        //      state.value=1
        state.columns=state.stuColumns
        http.studentGroup({
            param: {
              id: props.trainId,
              type: props.type === "course" ? 1 : 2,
              withs: "userProfile,user",
              page:state.params.page,limit:state.params.limit
            },
          })
          .then((res: any) => {
            state.data = res.data.list;
            state.total=res.data.page.totalCount;
            state.data.forEach((item: any) => {
              state.allStuId.push(item.id);
            });
            if(state.total){
                 state.value=1
                  state.columns =
                  role === "2"
                    ? state.stuColumns.splice(0, state.stuColumns.length - 1)
                  : state.stuColumns;
                return 
            }else{
               http
                .classGroup({
                  param: { id: props.trainId, type: props.type === "course" ? 1 : 2 ,page:state.params.page,limit:state.params.limit},
                })
                .then((res: any) => {
                  console.log(res);
                  state.data = res.data.list;
                  state.total=res.data.page.totalCount;
                  state.data.forEach((item: any) => {
                    state.allClassId.push(item.id);
                  });
                  if(state.total){
                    state.value=2
                     state.columns =
                  role === "2"
                    ? state.classColumns.splice(0, state.classColumns.length - 1)
                  : state.classColumns;
                  return
                  }else{
                    state.value=1
                    methods.getClassList()
                  }
                });
            }
          }) 
    });
    return { ...toRefs(state), ...methods, rowSelection, role};
  },
});
</script>
<style lang="less" scoped>
.customerInfor {
  margin: 10px;
  .radioInfo {
    .ant-radio-inner {
      width: 20px;
      height: 20px;
    }
    .ant-radio-input {
      width: 16px;
      height: 16px;
    }
    /* 单选选中样式 */
    .ant-radio-checked .ant-radio-inner {
      background-color: var(--primary-color);
      border: none;
    }
    .ant-radio-inner::after {
      content: "";
      width: 12px;
      height: 8px;
      border: 2px solid var(--black-100);
      border-top: transparent;
      border-right: transparent;
      text-align: center;
      display: block;
      position: absolute;
      top: 4px;
      left: 4px;
      transform: rotate(-45deg);
      border-radius: 0px;
      background: none;
    }
  }
  .stuAndclass {
    margin-top: 20px;
    .operateBtn {
      margin-bottom:16px;
      .choice {
        margin-right: 10px;
      }
    }
    .action {
      color: var(--primary-color);
      cursor: pointer;
    
      .spanleft {
        margin-right: 10px;
      }
    }
  }
}
:deep(.ant-table-pagination.ant-pagination) {
  float: none;
  text-align: center;
}
</style>
