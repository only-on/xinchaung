<template>
  <div class="image-list-box">
    <div class="image-item" v-for="(item, index) in envData" :key="item.id">
      <span class="image-name" v-if="item">{{ item.name }}</span>
      <div class="cpu options">
        <span>CPU</span>
        <a-select v-model:value="item.flavor.cpu" :disabled="edit">
          <a-select-option
            v-for="item in cpuList"
            :key="item"
            :value="item.value"
            >{{ item.name }}</a-select-option
          >
        </a-select>
      </div>
      <div class="neicun options">
        <span>内存</span>
        <a-select v-model:value="item.flavor.ram" :disabled="edit">
          <a-select-option
            v-for="item in ramList"
            :key="item"
            :value="item.value"
            >{{ item.name }}</a-select-option
          >
        </a-select>
      </div>
      <div class="disk options">
        <span>硬盘</span>
        <a-select v-model:value="item.flavor.disk" :disabled="edit">
          <a-select-option
            v-for="item in diskList"
            :key="item"
            :value="item.value"
            >{{ item.name }}</a-select-option
          >
        </a-select>
      </div>
      <div class="gpu options" v-if="item.showSelectGpu">
        <span>GPU</span>
        <a-select v-model:value="item.is_use_gpuNumber" :disabled="edit">
          <a-select-option
            v-for="item in gpuList"
            :key="item"
            :value="item.value"
            >{{ item.name }}</a-select-option
          >
        </a-select>
      </div>
      <span
        class="shanchu iconfont icon-shanchu"
        @click="removeImage(index)"
        v-if="!edit"
      ></span>
    </div>
  </div>
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
import { IimageData } from "src/views/teacherModule/teacherExperiment/experTyping";
import request from "src/api/index";
export default defineComponent({
  name: "",
  components: {},
  props: {
    envData: {
      type: Array as PropType<IimageData[]>,
      default: [],
    },
    edit: {
      type: Boolean,
      default: false,
    },
  },
  emit: [],
  setup(props, { emit }) {
    // 移除镜像
    const http = (request as any).common;
    function removeImage(index: number) {
      props.envData.splice(index, 1);
    }
    let cpuList = reactive<any[]>([]);
    let ramList = reactive<any[]>([]);
    let diskList = reactive<any[]>([]);
    function getConfigs() {
      http.getConfigs().then((res: any) => {
        const { cpu, ram, disk } = res.data.image_configs;
        Object.keys(cpu).forEach((v: any) => {
          cpuList.push({ name: `${cpu[v]}核`, value: Number(v) });
        });
        Object.keys(ram).forEach((v: any) => {
          ramList.push({ name: `${ram[v]}`, value: Number(v) });
        });
        Object.keys(disk).forEach((v: any) => {
          diskList.push({ name: `${disk[v]}`, value: Number(v) });
        });
      });
    }
    getConfigs();
    onMounted(() => {});
    return {
      removeImage,
      cpuList,
      ramList,
      diskList,
      gpuList: [
        { name: "开启", value: 1 },
        { name: "关闭", value: 0 },
      ],
    };
  },
});
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
    color: rgba(0, 0, 0, 0.65);
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
        color: rgba(0, 0, 0, 0.65);
        font-size: 14px;
      }
    }
  }
}
</style>
