<template>
  <div class="create-test-paper" v-layout-bg>
    <div class="create-top">
      <a-form
        ref="formRef"
        :model="formSate"
        :rules="{ testName: { required: true, message: '请输入测试卷名称' } }"
        layout="vertical"
      >
        <a-form-item label="测试卷名称" required>
          <a-input v-model:value="formSate.testName" />
        </a-form-item>
      </a-form>
      <a-dropdown placement="bottomCenter">
        <a-button type="primary" class="add">添加试题</a-button>
        <template #overlay>
          <a-menu @click="clickAddPaper">
            <a-menu-item v-for="type in paperType" :key="type.id">{{
              type.name
            }}</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
      <a-dropdown placement="bottomCenter">
        <a-button type="primary">选择试题</a-button>
        <template #overlay>
          <a-menu @click="clickSelectPaper">
            <a-menu-item v-for="type in paperType" :key="type.id">{{
              type.name
            }}</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
    <!-- 试题列表 -->
    <div class="create-content">
      <test-paper-list v-model="paperLists"></test-paper-list>
    </div>
    <div class="btns">
      <a-button @click="cancel">取消</a-button>
      <a-button type="primary" @click="createHandle">{{
        paper_id ? "更新" : "创建"
      }}</a-button>
    </div>
  </div>
  <add-single-modal
    v-model:isShow="isShowSingle"
    :addType="addType"
    @addPaperContent="addPaperContent"
    @getPCatalogueList="getPCatalogueList"
  ></add-single-modal>
  <select-paper-draw
    v-model:isShow="isShowDraw"
    v-model:selectType="selectType"
    v-model="paperLists"
    @allSelect="allSelect"
    @del="del"
    @add="add"
  ></select-paper-draw>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  toRefs,
  onMounted,
  provide,
  inject,
  watch,
  nextTick,
  PropType,
} from "vue";
import { message } from "ant-design-vue";
import addSingleModal from "./addSingleModal.vue";
import testPaperList from "./testPaperList.vue";
import selectPaperDraw from "./selectPaperDraw.vue";
import request from "src/api/index";
import { IformSate, IPaperList, Ihttp, IpaperType, Ilist } from "./typings";
import { IBusinessResp } from "src/typings/fetch.d";
import { useRoute, useRouter } from "vue-router";
import { cloneDeep } from "lodash";
export default defineComponent({
  name: "",
  components: { addSingleModal, testPaperList, selectPaperDraw },
  props: {},
  emit: [],
  setup() {
    const route = useRoute();
    const router = useRouter();
    let course_id = route.query.course_id;
    const paper_id = route.query.paper_id;
    var updata = inject("updataNav") as Function;
    updata({
      tabs: [],
      navPosition: "outside",
      navType: false,
      showContent: false,
      componenttype: undefined,
    });
    const http = (request as Ihttp).teachCourse;
    const examApi1 = request.teachCourse;
    const examApi = request.studentExam;
    // 试题名称
    let formSate = reactive<IformSate>({
      testName: "",
      paperLists: [],
    });

    let isShowSingle = ref(false);
    let addType = ref(0);
    onMounted(() => {
      if (paper_id) {
        getPaperDetail();
        getQuestionsList();
      }
    });
    // 检测习题变化
    watch(
      () => formSate.paperLists,
      (newVal: any, oldVal: any) => {
        let arr1 = cloneDeep(newVal);
        let arr2 = cloneDeep(oldVal);
        let arr3 = arr1.concat(...arr2);
      },
      { deep: true }
    );
    // 点击添加试题
    const clickAddPaper = ({ key }: { key: string }) => {
      // if(!formSate.testName) {
      //   message.warning('请填写测试卷名称')
      //   return
      // }
      addType.value = Number(key);
      isShowSingle.value = true;
    };

    let isShowDraw = ref(false);
    let selectType = ref(0);
    // 点击选择试题
    const clickSelectPaper = ({ key }: { key: string }) => {
      // if(!formSate.testName) {
      //   message.warning('请填写测试卷名称')
      //   return
      // }
      selectType.value = Number(key);
      isShowDraw.value = true;
    };

    // 添加一条试题
    const addPaperContent = (list: Ilist) => {
      formSate.paperLists.push(list);
    };
    // 创建试卷
    const createHandle = () => {
      if (!formSate.testName) {
        message.warning("请填写测试卷名称");
        return;
      }
      if (formSate.paperLists.length == 0) {
        message.warning("试卷至少添加一个习题");
        return;
      }
      if (paper_id) {
        examApi1
          .updatePaperBaseApi({
            param: { name: formSate.testName },
            urlParams: {
              paper_id: paper_id,
            },
          })
          .then((res: any) => {
            setTimeout(()=>{
              router.push({
                path: "/teacher/teacherCourse/testPaperList",
                query: {
                  course_id: course_id,
                },
              });
            },500)
          });

        return;
      }
      http
        .createPaper({
          param: {
            name: formSate.testName,
            type: "test", // 随测
            // is_publish:    // 发布
            course_id: course_id,
          },
        })
        .then((res: IBusinessResp) => {
          relationQuest(res.data.id);
          setTimeout(()=>{
            router.push({
              path: "/teacher/teacherCourse/testPaperList",
              query: {
                course_id: course_id,
              },
            });
          },500)
        });
    };
    // 关联习题
    const relationQuest = (id: number) => {
      http
        .relationQuest({
          param: {
            questions: formSate.paperLists.map((v) => v.id),
          },
          urlParams: {
            entity_id: id,
            entity_type: "test",
          },
        })
        .then((res: IBusinessResp) => {
          // getPaperList()
        });
    };
    // 获取试卷详情
    function getPaperDetail() {
      examApi1
        .getPaperDetailApi({ urlParams: { paper_id: paper_id } })
        .then((res: any) => {
          formSate.testName = res.data.name;
        });
    }
    // 获取试卷习题
    function getQuestionsList() {
      examApi
        .getQuestionsListApi({
          urlParams: { entity_type: "test", entity_id: paper_id },
          param: { include: "answers" },
        })
        .then((res: any) => {
          formSate.paperLists = res.data;
        });
    }
    // 获取试卷列表
    const getPaperList = () => {
      http
        .getPaperList({
          param: {
            // name: 'test',
            type: "test",
            course_id: course_id,
          },
        })
        .then((res: IBusinessResp) => {});
    };
    // 习题类型和难易类型
    let typeList = reactive<IpaperType>({
      paperType: [],
      levelType: [],
    });
    provide("typeList", typeList);
    // 获取目录列表
    let directoryList = reactive<IDirectoryList>({
      commonList: [],
      privateList: [],
    });
    const getCCatalogueList = () => {
      http.getCatalogueList({ param: { limit: 100 } }).then((res: IBusinessResp) => {
        let commonList: ICPDirectoryList[] = [];
        let privateList: ICPDirectoryList[] = [];
        res.data.list.map((v: any) => {
          v.initial === 0 ? privateList.push(v) : commonList.push(v);
        });
        directoryList.commonList = commonList;
        directoryList.privateList = privateList;
        // getPCatalogueList()
      });
    };
    const getPCatalogueList = () => {
      http
        .getCatalogueList({ param: { initial: 0, limit: 100 } })
        .then((res: IBusinessResp) => {
          directoryList.privateList = res.data.list;
        });
    };
    provide("directoryList", directoryList);
    onMounted(() => {
      // 获取目录
      getCCatalogueList();
      // 获取习题类型列表
      http.getPaperTypeList().then((res: IBusinessResp) => {
        typeList.paperType = res.data;
      });
      // 获取习题难易程度列表
      http.getLevelList().then((res: IBusinessResp) => {
        typeList.levelType.push({ id: "", name: "全部" });
        typeList.levelType.push(...res.data);
      });
    });
    // 取消
    function cancel() {
      router.push({
        path: "/teacher/teacherCourse/testPaperList",
        query: {
          course_id: course_id,
        },
      });
    }

    // 全选
    function allSelect(paperList: any[]) {
      if (!paper_id) {
        return;
      }
      let questions: any = [];
      paperList.forEach((item: any) => {
        if (!item.isChecked) {
          questions.push(item.id);
        }
      });
      http
        .relationQuest({
          param: {
            questions: questions,
          },
          urlParams: {
            entity_id: paper_id,
            entity_type: "test",
          },
        })
        .then((res: IBusinessResp) => {
          // getPaperList()
        });
    }
    // 删除
    function del(val: any) {
      if (!paper_id) {
        return;
      }
      examApi1
        .deleteQuestionPaperApi({
          urlParams: { entity_type: "test", entity_id: paper_id },
          param: { questions: [val.id] },
        })
        .then((res: any) => {});
    }
    // 添加
    function add(val: any) {
      if (!paper_id) {
        return;
      }
      http
        .relationQuest({
          param: {
            questions: [val.id],
          },
          urlParams: {
            entity_id: paper_id,
            entity_type: "test",
          },
        })
        .then((res: IBusinessResp) => {
          // getPaperList()
        });
    }
    return {
      ...toRefs(formSate),
      formSate,
      ...toRefs(typeList),
      clickAddPaper,
      clickSelectPaper,
      isShowSingle,
      addType,
      addPaperContent,
      isShowDraw,
      selectType,
      createHandle,
      getPCatalogueList,
      cancel,
      paper_id,
      allSelect,
      del,
      add,
    };
  },
});
interface ICPDirectoryList {
  id: number;
  name: string;
}
interface IDirectoryList {
  commonList: ICPDirectoryList[];
  privateList: ICPDirectoryList[];
}
</script>

<style lang="less" scoped>
.create-test-paper {
  width: var(--center-width);
  height: 100%;
  margin: 0 auto;
  background-color: var(--white-100);
  border-radius: 6px;
  padding: 60px 100px;
  overflow: auto;
  .create-top {
    display: flex;
    justify-content: flex-end;
    :deep(.ant-form) {
      margin-right: auto;
      .ant-input {
        width: 844px;
      }
    }
    :deep(.ant-btn-primary) {
      margin-top: 29px;
      &.add {
        margin-right: 8px;
      }
    }
  }
  .create-content {
    width: 844px;
    padding: 18px;
  }
  .btns {
    text-align: center;
    .ant-btn-primary {
      margin-left: 14px;
    }
  }
}
</style>
