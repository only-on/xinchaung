<template>
  <div
    class="report-template-online"
    v-if="reportTemplateData && reportTemplateData.json_content.length > 0"
  >
    <div class="template-name">{{reportTemplateData.name||reportTemplateData.filename}}</div>
    <table style="width: 100%" id="onlineReportTableEditable">
      <template v-for="(item, index) in reportTemplateData.json_content" :key="index">
        <tr v-if="item.type === 'w1'">
          <td
            colspan="6"
            class="report-title"
            :title="item.fields[0].value"
            :align="item.fields[0].align"
          >
            <div class="title">{{ item.fields[0].value }}</div>
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
            <div class="title">{{ item.fields[0].value }}</div>
          </td>
          <td colspan="5" class="title-text" style="word-break: break-all">
            <!-- {{ item.fields[1].value }} -->
            <div>
              <a-textarea
                :disabled="true"
                :placeholder="item.placeholder"
                :auto-size="{ minRows: 2, maxRows: 6 }"
                v-model:value="item.fields[1].value"
              ></a-textarea>
            </div>
            <!-- <div v-else>{{ item.fields[1].value }}</div> -->
          </td>
        </tr>
        <tr v-if="item.type === 'w3'">
          <td style="width: 20%" class="title-text" :align="item.fields[0].align">
            <div class="title">{{ item.fields[0].value }}</div>
          </td>
          <td colspan="2" style="word-break: break-all">
            <!-- {{ item.fields[1].value }} -->
            <div>
              <a-textarea
                :disabled="true"
                :placeholder="item.placeholder"
                :auto-size="{ minRows: 2, maxRows: 6 }"
                v-model:value="item.fields[1].value"
              ></a-textarea>
            </div>
            <!-- <div v-else>{{ item.fields[1].value }}</div> -->
          </td>
          <td style="width: 20%" class="title-text" :align="item.fields[0].align">
            <div class="title">{{ item.fields[2].value }}</div>
          </td>
          <td colspan="2" style="word-break: break-all">
            <!-- {{ item.fields[3].value }} -->
            <div>
              <a-textarea
                :disabled="true"
                :placeholder="item.placeholder"
                :auto-size="{ minRows: 2, maxRows: 6 }"
                v-model:value="item.fields[3].value"
              ></a-textarea>
            </div>
            <!-- <div v-else>{{ item.fields[3].value }}</div> -->
          </td>
        </tr>
        <tr v-if="['w4', 'w6'].includes(item.type)">
          <td
            colspan="6"
            class="title-text"
            :align="item.fields[0].align"
            style="height: 30px"
          >
            <div class="title">{{ item.fields[0].value }}</div>
          </td>
        </tr>
        <tr v-if="['w4', 'w6'].includes(item.type)">
          <td colspan="6" style="word-break: break-all">
            <!-- {{ item.fields[1].value }} -->
            <div>
              <a-textarea
                :disabled="true"
                :auto-size="{ minRows: 2, maxRows: 6 }"
                :placeholder="item.placeholder"
                v-model:value="item.fields[1].value"
              ></a-textarea>
            </div>
            <!-- <div v-else>{{ item.fields[1].value }}</div> -->
          </td>
        </tr>
        <tr v-if="item.type === 'w7'" class="editable-markdown">
          <td class="title-text" style="width: 20%" :align="item.fields[0].align">
            <div class="title">{{ item.fields[0].value }}</div>
          </td>
          <td class="" colspan="5">
            <div>
              <markdown v-model="item.fields[1].value" :preview="true" />
              <!-- <markdown
                v-else
                :preview="true"
                v-model="item.fields[1].value"
              /> -->
            </div>
          </td>
        </tr>
        <tr v-if="item.type === 'w8'" class="editable-markdown">
          <td class="title-text" style="height: 30px" :align="item.fields[0].align">
            <div class="title">{{ item.fields[0].value }}</div>
          </td>
          <td class="editable-markdown" colspan="5">
            <div>
              <markdown v-model="item.fields[1].value" :preview="true" />
              <!-- <markdown
                v-else
                :preview="true"
                v-model="item.fields[1].value"
              /> -->
            </div>
          </td>
        </tr>
      </template>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from "vue";
import markdown from "src/components/editor/markedEditor.vue";

export default defineComponent({
  components: {
    markdown,
  },
  props:['preview','reportTemplateData'],
  setup() {
    // const reportTemplateData: any = inject("reportTemplateData");
    return {
      // reportTemplateData,
    };
  },
});
</script>

<style lang="less">
.report-template-online {
  .template-name {
    margin-bottom: 16px;
    text-align: center;
    font-size: 16px;
  }
  .mark__body .mark__editor,
  .mark__body .mark__preview {
    min-width: auto;
    border-bottom: none;
    max-height: 200px;
    overflow-y: auto;
  }
  .mark__body .mark__preview {
    min-width: auto;
  }
  .mark__container {
    border: none !important;
  }
  table {
    border: 1px solid #a3a3a3;
    border-collapse: collapse;
    border-spacing: 0;
    tr {
      border: 1px solid #a3a3a3;
      &.editable-markdown {
        td .title {
          max-height: 200px;
        }
      }
    }
    td {
      border: 1px solid #a3a3a3;
      .ant-input-disabled {
        color: var(--black-85);
        cursor: auto;
      }
      .title {
        min-height: 52px;
        max-height: 140px;
        overflow: auto;
      }
    }
  }
  textarea {
    outline: none;
    border: none;
  }
}
</style>
