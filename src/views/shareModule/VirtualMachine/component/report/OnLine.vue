<template>
  <div
    class="report-template-data"
    v-if="reportTemplateData && reportTemplateData.json_content.length > 0"
  >
    <div class="template-name">{{reportTemplateData.filename.split('.')[0]}}</div>
    <table style="width: 100%" id="onlineReportTableEditable">
      <template
        v-for="(item, index) in reportTemplateData.json_content"
        :key="index"
      >
        <tr v-if="item.type === 'w1'">
          <td
            colspan="6"
            class="report-title"
            :title="item.fields[0].value"
            :align="item.fields[0].align"
          >
            {{ item.fields[0].value }}
            <!-- <div v-if="reportTemplateData.can_student_update&&cid!==0">
                <a-input :placeholder='item.placeholder' v-model:value="item.fields[0].value"></a-input>
            </div>
            <div v-else>{{item.fields[0].value}}</div> -->
          </td>
        </tr>
        <tr v-if="['w2', 'w5'].includes(item.type)">
          <td
            class="title-text"
            style="width: 20%"
            :title="item.fields[0].value"
            :align="item.fields[0].align"
          >
            {{ item.fields[0].value }}
          </td>
          <td colspan="5" class="title-text" style="word-break: break-all">
            <!-- {{ item.fields[1].value }} -->
            <div v-if="reportTemplateData.can_student_update">
              <a-textarea
                :placeholder="item.placeholder"
                :auto-size="{ minRows: 2, maxRows: 6 }"
                v-model:value="item.fields[1].value"
              ></a-textarea>
            </div>
            <div v-else>{{ item.fields[1].value }}</div>
          </td>
        </tr>
        <tr v-if="item.type === 'w3'">
          <td
            style="width: 20%"
            class="title-text"
            :align="item.fields[0].align"
          >
            {{ item.fields[0].value }}
          </td>
          <td colspan="2" style="word-break: break-all">
            <!-- {{ item.fields[1].value }} -->
            <div v-if="reportTemplateData.can_student_update">
              <a-textarea
                :placeholder="item.placeholder"
                :auto-size="{ minRows: 2, maxRows: 6 }"
                v-model:value="item.fields[1].value"
              ></a-textarea>
            </div>
            <div v-else>{{ item.fields[1].value }}</div>
          </td>
          <td
            style="width: 20%"
            class="title-text"
            :align="item.fields[0].align"
          >
            {{ item.fields[2].value }}
          </td>
          <td colspan="2" style="word-break: break-all">
            <!-- {{ item.fields[3].value }} -->
            <div v-if="reportTemplateData.can_student_update">
              <a-textarea
                :placeholder="item.placeholder"
                :auto-size="{ minRows: 2, maxRows: 6 }"
                v-model:value="item.fields[3].value"
              ></a-textarea>
            </div>
            <div v-else>{{ item.fields[3].value }}</div>
          </td>
        </tr>
        <tr v-if="['w4', 'w6'].includes(item.type)">
          <td
            colspan="6"
            class="title-text"
            :align="item.fields[0].align"
            style="height: 30px"
          >
            {{ item.fields[0].value }}
          </td>
        </tr>
        <tr v-if="['w4', 'w6'].includes(item.type)">
          <td colspan="6" style="word-break: break-all">
            <!-- {{ item.fields[1].value }} -->
            <div v-if="reportTemplateData.can_student_update">
              <a-textarea
                :auto-size="{ minRows: 2, maxRows: 6 }"
                :placeholder="item.placeholder"
                v-model:value="item.fields[1].value"
              ></a-textarea>
            </div>
            <div v-else>{{ item.fields[1].value }}</div>
          </td>
        </tr>
        <tr v-if="item.type === 'w7'" class="editable-markdown">
          <td
            class="title-text"
            style="width: 20%"
            :align="item.fields[0].align"
          >
            {{ item.fields[0].value }}
          </td>
          <td class="" colspan="5">
            <div>
              <marked-editor
                v-if="reportTemplateData.can_student_update"
                v-model="item.fields[1].value"
              />
              <marked-editor
                v-else
                :preview-only="true"
                v-model="item.fields[1].value"
              />
            </div>
          </td>
        </tr>
        <tr v-if="item.type === 'w8'" class="editable-markdown">
          <td
            colspan="6"
            class="title-text"
            style="height: 30px"
            :align="item.fields[0].align"
          >
            {{ item.fields[0].value }}
          </td>
        </tr>
        <tr v-if="item.type === 'w8'" class="editable-markdown">
          <td class="editable-markdown" colspan="6">
            <div>
              <marked-editor
                v-if="reportTemplateData.can_student_update"
                v-model="item.fields[1].value"
              />
              <marked-editor
                v-else
                :preview="true"
                v-model="item.fields[1].value"
              />
            </div>
          </td>
        </tr>
      </template>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from "vue";
import markedEditor from "src/components/editor/markedEditor.vue";

export default defineComponent({
  components: { markedEditor },
  setup() {
    const reportTemplateData:any = inject("reportTemplateData");
    return {
      reportTemplateData,
    };
  },
});
</script>

<style lang="less" scoped>
.report-template-data {
  .template-name {
    margin-bottom: 24px;
    text-align: center;
    font-size: 16px;
  }
  :deep(.mark__container--fullscreen) {
    .mark__body {
      .mark__editor, .mark__preview {
        max-height: 100%;
      }
    }
  }
  :deep(.mark__body) {
    .mark__editor, .mark__preview {
      max-height: 200px;
      overflow: auto;
      min-width: 50%;
    }
  }
  .mark__body .mark__editor {
    min-width: auto;
  }
  .mark__body .mark__preview {
    min-width: auto;
  }
  table {
    border: 1px solid #a3a3a3;
    border-collapse: collapse;
    border-spacing: 0;
    tr {
      border: 1px solid #a3a3a3;
    }
    td {
      border: 1px solid #a3a3a3;
    }
  }
  :deep(.ant-input) {
    border-radius: 0;
    box-shadow: none;
    &:hover {
      border-color: var(--gray-5);
    }
    &:focus {
      border-color: var(--gray-5);
    }
  }
}
</style>
