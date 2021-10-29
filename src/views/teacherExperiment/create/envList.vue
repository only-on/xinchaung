<template>
  <div class="image-list-box">
    <div class="image-item" v-for="(item, index) in envData" :key="item.id">
      <span class="image-name" v-if="item.image">{{ item.image.name }}</span>
      <div class="cpu options">
        <span>CPU</span>
        <a-select v-model:value="item.config.cpu_text">
          <a-select-option v-for="item in cpuList" :key="item" :value="item">{{item}}</a-select-option>
        </a-select>
      </div>
      <div class="neicun options">
        <span>内存</span>
        <a-select v-model:value="item.config.ram_text">
          <a-select-option v-for="item in ramList" :key="item" :value="item">{{item}}</a-select-option>
        </a-select>
      </div>
      <div class="disk options">
        <span>硬盘</span>
        <a-select v-model:value="item.config.disk_text">
          <a-select-option v-for="item in diskList" :key="item" :value="item">{{item}}</a-select-option>
        </a-select>
      </div>
      <div class="gpu options">
        <span>GPU</span>
        <a-select v-model:value="item.config.swap">
          <a-select-option :value="0">开启</a-select-option>
          <a-select-option :value="1">关闭</a-select-option>
        </a-select>
      </div>
      <span class="shanchu iconfont icon-shanchu" @click="removeImage(index)"></span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs, onMounted, provide, inject, watch, nextTick, PropType } from 'vue'
import { IimageData } from './../experTyping'

export default defineComponent({
  name: '',
  components: {},
  props: {
    envData: {
      type: Array as PropType<IimageData[]>,
      default: []
    }
  },
  emit: [],
  setup(props, {emit}) {
    // 移除镜像
    function removeImage(index: number) {
      props.envData.splice(index, 1)
    }
    return {
      removeImage,
      cpuList: ['1核', '2核', '3核', '4核'],
      ramList: ['2GB', '4G', '6G', '8G'],
      diskList: ['30GB', '40GB', '50GB'],
    }
  }
})
</script>

<style lang="less" scoped>
  .image-list-box {
    .image-item {
      border: 1px solid #d9d9d9;
      border-radius: 2px;
      background: #f5f5f5;
      line-height: 52px;
      margin-top: 16px;
      padding: 0 10px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      color: rgba(0,0,0,0.65);
      font-size: 14px;

      .image-name {
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        flex: 1;
      }

      .shanchu {
        width: 20px;
        flex-shrink: 0;
        cursor: pointer;
      }
      .options {
        margin-right: 24px;
        .ant-select {
          width: 76px;
          margin-left: 8px;
          color: rgba(0,0,0,0.65);
          font-size: 14px;
          
        }
      }
    }
  }
</style>