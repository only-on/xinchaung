<template>
  <div class="report-template">
    <viewTemplate ref="viewTemplateRef" :id="templateId"></viewTemplate>
    <!-- <div class="report-template-name">{{reportName}}</div>
    <div class="report-template-content">
      <div class="pdfBox" v-if="pdfUrl">
        <PdfVue :url="pdfUrl" />
      </div>
      <drag-gable
        v-else
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
    </div> -->
    <div class="operate">
      <a-button @click="backGo">返回</a-button>
      <a-button type="primary" v-show="canEdit" @click="reportVisible = true">更换报告模板</a-button>
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
import PdfVue from "src/components/pdf/pdf.vue";
import widgetCreate from "src/views/teacherModule/teacherTemplate/components/widgetCreate.vue";
import { widgetDataModel } from "src/views/teacherModule/teacherTemplate/components/DM";
import { deepClone } from "src/views/teacherModule/teacherTemplate/utils";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { WidgetModel } from "src/views/teacherModule/teacherTemplate/templateTyping";
import extStorage from "src/utils/extStorage";
import viewTemplate from "src/components/report/viewTemplate.vue"

const router = useRouter();
const route = useRoute();
const http = (request as any).teacherExperimentResourcePool;
let {id, createExperUserId, currentTab, type} = route.query;
let templateId: number = Number(route.query.templateId)
var updata = inject("updataNav") as Function;
const { lStorage } = extStorage
// 当前用户id === 创建实验用户id
const uid = lStorage.get("role")===5 ? lStorage.get("tuid"):lStorage.get("uid")
const canEdit = ref<boolean>(Number(createExperUserId)===uid&&type!=='recommend'&&Number(currentTab)!=1 ? true : false)
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
    // getDetail();
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
const pdfUrl = ref('')
const getDetail = () => {
  dataList.length = 0;
  http.detailTemplate({ urlParams: { id: templateId } })
    .then((res: IBusinessResp) => {
      if (res && res.data) {
        const result = res.data;
        reportName.value = result.name;
        pdfUrl.value = result.pdf_path
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

const viewTemplateRef: any = ref(null)
const reportVisible = ref<boolean>(false);
const reportOk = (val: any) => {
  // console.log(val);
  http.updateReport({urlParams: {id}, param: {report: val.id}}).then((res: IBusinessResp) => {
    templateId = val.id
    reportInfo.id = val.id
    const { query, path } = route;
    router.replace({
      path: path,
      query: { ...query, templateId: val.id},
    });
    viewTemplateRef.value.getDetail(val.id)
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
  .pdfBox {
    height: 800px;
  }
}
</style>
