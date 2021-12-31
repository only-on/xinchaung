<template>
  <div class="file__container">
    <div class="file__icon">
      <span class="iconfont" :class="getFileType(title)" :style="`background-image: url(${iconList[getFileType(title)]});`" />
    </div>
    <div class="file__info">
      <div class="title">
        {{ title }}
      </div>
      <div class="description">
        {{ size }}
      </div>
    </div>
    <div class="file__op">
      <a-button type="text" @click="handlePreview">
        <font-awesome-icon icon="eye" />
      </a-button>
      <a-button type="text" :href="downloadUrl">
        <font-awesome-icon icon="download" />
      </a-button>
      <a-button type="text" @click="handleRemove">
        <span class="iconfont icon-shanchu" />
      </a-button>
    </div>
    <a-modal
      v-model:visible="previewerVisible"
      wrapClassName="file__previewer--container"
      title="预览文件"
      :width="1200"
      :footer="null"
    >
      <common-video
        v-if="suffix.toLowerCase() === 'mp4'"
        controls="true"
        :src="origin + previewFileUrl"
      ></common-video>
      <!-- <iframe
        v-else
        id="pdf-iframe"
        :src="'/plugin/PDF/viewer.html?file=' + origin + previewFileUrl"
        style="width: 100%; height: 700px; border: none"
      ></iframe> -->
      <iframe
       v-else
      :src="`/pdfjs-2.5.207/web/viewer.html?file=${
        env ? '/proxyPrefix' + previewFileUrl : previewFileUrl
      }`"
      frameborder="0"
      style="width: 100%; height: 700px; border: none"
    ></iframe>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, Ref, inject } from "vue";
import http from "src/api";
import { ModalFunc } from "ant-design-vue/lib/modal/Modal";
import { MessageApi } from "ant-design-vue/lib/message";
import { useRoute } from "vue-router";
import CommonVideo from "../../components/common/CommonVideo.vue";
import iconList from 'src/utils/iconList'
import { getFileType } from 'src/utils/getFileType'
export default defineComponent({
  name: "FileCard",
  props: {
    title: {
      type: String,
      default: "课件",
    },
    size: {
      type: String,
      default: "0KB",
    },
    previewUrl: {
      type: String,
      default: "#",
    },
    downloadUrl: {
      type: String,
      default: "#",
    },
    id: {
      type: Number,
      default: 0,
    },
    suffix: {
      type: String,
      default: "qita",
    },
  },
  components: {
    CommonVideo
  },
  emits: ["removed"],
  setup(props, { emit }) {
    let env = process.env.NODE_ENV == "development" ? true : false;
    const route = useRoute();
    const confirmRemove = ref(false);
    const previewerVisible: Ref<boolean> = ref(false);
    const previewFileUrl = ref("/default-not-found");
    const origin = window.location.origin;
    const $confirm: ModalFunc = inject("$confirm")!;
    const $message: MessageApi = inject("$message")!;
    const dataType = parseInt(route.params.type as string);
    const handlePreview = function () {
      previewFileUrl.value =
        dataType === 4 ? props.downloadUrl : props.previewUrl;
      previewerVisible.value = true;
    };
    const handleRemove = function () {
      $confirm({
        title: "删除文件",
        content: "文件删除后将无法恢复，确定要删除吗？",
        onOk: () => {
          http.classicalAsset
            .dataDelItem({ param: { id: props.id } })
            .then((res) => {
              $message.success("删除成功！");
              emit("removed");
            });
        },
      });
    };
    return {
      confirmRemove,
      previewerVisible,
      previewFileUrl,
      origin,
      handlePreview,
      handleRemove,
      getFileType,
      iconList,
      env
    };
  },
});
</script>

<style lang="less" scoped>
.file__container {
  border: 1px solid @border-color-base;
  position: relative;
  display: flex;
  border-radius: @border-radius-base;
  padding: @padding-xs;
  align-items: center;

  .file__icon {
    display: flex;
    .iconfont {
      width: 40px;
      height: 40px;
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
  }

  .file__info {
    flex: 1;
    margin-left: @margin-md;

    .title {
      max-width: 220px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .description {
      font-size: @font-size-sm - 2px;
      color: @text-color-secondary;
    }
  }

  .file__op {
    position: absolute;
    right: 8px;
    bottom: 8px;

    button,
    a {
      padding: @padding-xss - 2px;
      font-size: @font-size-base - 2px;
      color: @text-color-secondary;

      &:hover {
        color: @theme-color;
      }
    }
  }
}
</style>
