<template>
  <div class="file__container">
    <div class="file__icon">
      <span class="iconfont" :class="'icon-' + icon + ' ' + fileType"/>
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
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "FileCard",
  props: {
    icon: {
      type: String,
      default: 'word'
    },
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
    fileType: {
      type: String,
      default: 'word'
    }
  },
  emit: ['click'],
  setup(props, {emit}) {
    const handlePreview = () => {
      emit('click')
    }
    return {
      handlePreview
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
    .word {
      color: #3b7ff5;
      font-size: 40px;
    }

    .ppt {
      color: #ec602c;
    }

    .mp4 {
      color: #5c6cda;
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
