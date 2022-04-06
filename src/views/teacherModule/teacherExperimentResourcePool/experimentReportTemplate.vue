<template>
  <div class="report-template">
    <div class="report-template-name">{{reportName}}</div>
    <div class="report-template-content">
      <drag-gable
        :list="dataList"
        class="tableDom"
        :sort="true"
        tag="table"
        ignore="a, img, input, textarea"
        item-key="idx"
      >
        <template #item="{ element, index }">
          <widget-create :type="element.type" v-model:fields="element.fields"
            >{{ index }}
          </widget-create>
        </template>
      </drag-gable>
    </div>
    <div class="operate">
      <a-button @click="backGo">返回</a-button>
      <a-button type="primary" @click="reportVisible = true">更换报告</a-button>
    </div>
    <SelectReport
      v-if="reportVisible"
      :selectedReport="reportInfo"
      @reportCancel="reportCancel"
      @reportOk="reportOk"
    ></SelectReport>
  </div>
</template>
<script lang="ts" setup>
import { defineComponent, inject, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import SelectReport from "src/views/teacherModule/teacherExperimentResourcePool/component/selectReport.vue";
import dragGable from "vuedraggable";
import widgetCreate from "src/views/teacherModule/teacherTemplate/components/widgetCreate.vue";
import { widgetDataModel } from "src/views/teacherModule/teacherTemplate/components/DM";
import { deepClone } from "src/views/teacherModule/teacherTemplate/utils";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { WidgetModel } from "src/views/teacherModule/teacherTemplate/templateTyping";

const router = useRouter();
const route = useRoute();
const http = (request as any).teacherExperimentResourcePool;
let {templateId, id} = route.query;
var updata = inject("updataNav") as Function;
updata({
  tabs: [{ name: "报告模板预览", componenttype: 0 }],
  showContent: false,
  componenttype: 0,
  showNav: true,
});
onMounted(() => {
  // templateId.value = route.query.templateId
  // console.log(templateId);
  if (templateId) {
    getDetail();
  }
});

const reportInfo = reactive({
  id: templateId
})
const dataList = reactive<any[]>([
  {
    ...deepClone(widgetDataModel.w1),
    idx: 0,
  },
]);
const reportName = ref<string>("");
const getDetail = () => {
  dataList.length = 0;
  http.detailTemplate({ urlParams: { id: templateId } })
    .then((res: IBusinessResp) => {
      if (res && res.data) {
        const result = res.data;
        reportName.value = result.name;
        Object.assign(dataList, result.json_content);
        // 增加唯一标识， 否则拖拽排序时input的value值会被影响
        dataList.forEach((item: WidgetModel, index: number) => {
          item.idx = index;
        });
      }
    })
};
const backGo = () => {
  router.go(-1);
};

const reportVisible = ref<boolean>(false);
const reportOk = (val: any) => {
  // console.log(val);
  http.updateReport({urlParams: {id}, param: {report: val.id}}).then((res: IBusinessResp) => {
    templateId = val.id
    reportInfo.id = val.id
    getDetail()
  })
};
const reportCancel = () => {
  reportVisible.value = false;
};
const replaceReport = () => {
  reportVisible.value = true;
};
</script>
<style lang="less" scoped>
.report-template {
  width: var(--center-width);
  margin: 0 auto;
  margin-top: 32px;
  background: var(--white-100);
  padding: 24px 40px;
  &-name {
    text-align: center;
    font-size: var(--font-size-16);
    color: var(--black-85);
    margin: 16px 0;
  }
  &-content {
    table {
      width: 100%;
    }
  }
  .operate {
    text-align: center;
    margin: 40px 0;
    .ant-btn-primary {
      margin-left: 16px;
    }
  }
}
</style>
