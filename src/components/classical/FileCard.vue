<template>
  <div class="file__container">
    <div class="file__icon">
      <span class="iconfont" :class="'icon-' + icon"/>
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
        <font-awesome-icon icon="eye"/>
      </a-button>
      <a-button type="text" :href="downloadUrl">
        <font-awesome-icon icon="download"/>
      </a-button>
      <a-button type="text" @click="handleRemove">
        <span class="iconfont icon-shanchu"/>
      </a-button>
    </div>
    <a-modal v-model:visible="confirmRemove" title="删除文件" @ok="handleRemoveItem">
      文件删除后将无法恢复，确定要删除吗？
    </a-modal>
  </div>
</template>

<script lang="ts">
import {defineComponent, computed, ref} from "vue";
import http from 'src/api'

export default defineComponent({
  name: "FileCard",
  props: {
    title: {
      type: String,
      default: '课件'
    },
    size: {
      type: String,
      default: '0KB'
    },
    previewUrl: {
      type: String,
      default: '#'
    },
    downloadUrl: {
      type: String,
      default: '#'
    },
    id: {
      type: Number,
      default: 0
    },
    suffix: {
      type: String,
      default: 'qita'
    }
  },
  emit: ['preview', 'remove'],
  setup(props, {emit}) {
    const iconMap = {
      bmp: "tupian",
      svg: "tupian",
      gif: "tupian",
      png: "tupian",
      jpg: "tupian",
      doc: "word",
      docx: "word",
      pptx: "PPT",
      ppt: "PPT",
      mp4: "MP4",
      MP4: "MP4",
      flv: "MP4",
      txt: "wendang",
      'tar.gz': 'wenjianjia',
      zip: 'wenjianjia',
      tgz: 'wenjianjia',
      tar: 'wenjianjia'
    }
    const confirmRemove = ref(false)
    const icon = computed(() => {
      return iconMap[props.suffix] || 'qita'
    })
    const handlePreview = function () {
      emit('preview')
    }
    const handleRemove = function () {
      confirmRemove.value = true
    }
    const handleRemoveItem = () => {
      http.classicalAsset.dataDelItem({param: {id: props.id}})
    }
    return {
      icon,
      confirmRemove,
      handlePreview,
      handleRemove,
      handleRemoveItem
    }
  }
})
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
    .icon-tupian {
      color: #3b7ff5;
      font-size: 40px;
    }

    .icon-word {
      color: #3b7ff5;
      font-size: 40px;
    }

    .icon-PPT {
      color: #ec602c;
      font-size: 40px;
    }

    .icon-MP4 {
      color: #5c6cda;
      font-size: 40px;
    }

    .icon-wendang {
      color: #3b7ff5;
      font-size: 40px;
    }

    .icon-wenjianjia {
      color: #3b7ff5;
      font-size: 40px;
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

    button, a {
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
