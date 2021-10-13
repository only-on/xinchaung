<template>
  <div class="classical__container" v-layout-bg>
    <div class="classical__content--header">
      <div class="left">
        <h2>demo目录</h2>
        <div>
          创建日期：2021-03-11 最后修改：2021-05-06
        </div>
      </div>
      <div class="right">
        <watermark-icon icon="cipanjiedian" title="30.7KB" description="文件大小" style="background-color: #2CB6FA"/>
        <watermark-icon icon="wenjianshu" title="2个" description="文件个数"
                        style="background-color: #FFBB3C; margin-left: 25px;"/>
      </div>
    </div>
    <div class="classical__content--main">
      <div class="more-detail">
        <h3>描述</h3>
        <a-divider style="background-color: #d5d5d5;"/>
        <div>暂无描述！</div>
      </div>
      <a-divider style="opacity: 0;"/>
      <div class="classical__data-list">
        <div class="classical__data-list-header">
          <h3>文件列表</h3>
          <div class="classical__data-list-space"></div>
          <div class="classical__data-list-form">
            <a-input-search placeholder="请输入关键字查询" @search="handleSearch"/>
          </div>
          <a-button class="classical__data-list-upload" type="primary" @click="openUploadDialog">
            <span class="iconfont icon-upload"/>上传文件
          </a-button>
        </div>
        <div class="classical__data-list-content">
          <a-row :gutter="[16, 16]" class="classical__data-list-row">
            <a-col :span="8">
              <file-card/>
            </a-col>
            <a-col :span="8">
              <file-card/>
            </a-col>
            <a-col :span="8">
              <file-card/>
            </a-col>
            <a-col :span="8">
              <file-card/>
            </a-col>
            <a-col :span="8">
              <file-card/>
            </a-col>
          </a-row>
        </div>
      </div>
    </div>
  </div>
  <a-modal v-model:visible="uploadVisible" title="上传文件">
    123
  </a-modal>
</template>

<script lang="ts">
import {defineComponent, inject, ref} from "vue";
import {useRoute} from 'vue-router'
import {ILayoutConfiguration} from "../../types";
import WatermarkIcon from "../../components/common/WatermarkIcon.vue";
import FileCard from "../../components/classical/FileCard.vue";

export default defineComponent({
  name: "Content",
  components: {
    FileCard,
    WatermarkIcon,
  },
  setup(props, {emit}) {
    const route = useRoute()
    const uploadVisible = ref(false)
    console.log('[classical/content] route params: ', route.params.type, route.params.id)

    const updateNav: (config: ILayoutConfiguration) => void = inject('updataNav')!
    updateNav({
      showNav: true,
      navType: false,
      tabs: [],
      showContent: true,
      navPosition: 'outside',
      backOff: true,
      showPageEdit: true,
      pageEdit: () => {
        console.log('page edit')
      }
    })

    const openUploadDialog = function () {
      uploadVisible.value = true
    }

    const handleSearch = () => {
      emit('search')
    }
    return {uploadVisible, handleSearch, openUploadDialog}
  }
})
</script>

<style lang="less" scoped>
.classical__container {
  .classical__content--header {
    display: flex;

    .left {
      flex: 1;
    }
  }

  .classical__content--main {
    margin-top: @margin-lg + 21px;

    .classical__data-list {
      .classical__data-list-header {
        display: flex;
        align-items: center;

        .classical__data-list-space {
          flex: 1;
        }

        .classical__data-list-form {
          width: 30%;
        }

        .classical__data-list-upload {
          margin-left: @margin-md;
        }
      }

      .classical__data-list-content {
        padding: @padding-md 0px;

        .classical__data-list-row {
          width: 100%;
        }
      }
    }
  }
}
</style>
