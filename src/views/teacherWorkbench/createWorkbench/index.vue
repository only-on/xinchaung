<template>
  <div v-layout-bg class="create-workbench-box">
    <a-form
      ref="ruleFormDom"
      :model="ruleForm"
      :rules="rules"
      class="create-form"
      layout="vertical"
    >
      <div class="form-left">
        <a-form-item has-feedback name="end_time" class="time-item">
          <template #label>
            <div class="time-label">
              <span>容器使用日期</span
              ><label class="time-check-box">
                <a-checkbox v-model:checked="permanent"></a-checkbox>
                永久有效</label
              >
            </div>
          </template>
          <div class="start-end-date-box">
            <a-date-picker v-model:value="ruleForm.start_time" disabled />
            <span class="and-line">~</span>
            <a-date-picker
              v-model:value="ruleForm.end_time"
              :allowClear="false"
            />
          </div>
        </a-form-item>
        <div>参数设置</div>
        <a-form-item name="cpu" label="CPU">
          <a-radio-group v-model:value="ruleForm.cpu" button-style="solid">
            <a-radio-button
              v-for="(it, key) in configs.cpu"
              :key="key"
              :value="key"
              >{{ it }}核</a-radio-button
            >
          </a-radio-group>
        </a-form-item>
        <a-form-item name="ram" label="内存">
          <a-radio-group v-model:value="ruleForm.ram" button-style="solid">
            <a-radio-button
              v-for="(it, key) in configs.ram"
              :key="key"
              :value="key"
              >{{ it }}</a-radio-button
            >
          </a-radio-group>
        </a-form-item>
        <a-form-item name="disk" label="硬盘">
          <a-radio-group v-model:value="ruleForm.disk" button-style="solid">
            <a-radio-button
              v-for="(it, key) in configs.disk"
              :key="key"
              :value="key"
              >{{ it }}</a-radio-button
            >
          </a-radio-group>
        </a-form-item>
        <div>
          <label>
            <a-checkbox v-if="showGPU" v-model="ruleForm.openGPU"
              >启动GPU</a-checkbox
            >
          </label>
        </div>
      </div>
      <div class="form-right">
        <a-form-item name="image" label="选择镜像">
          <a-select
            v-model:value="ruleForm.image"
            placeholder="选择镜像"
            @change="iamgeChange"
          >
            <a-select-opt-group v-for="(val, key) in images" :key="key">
              <template #label>
                {{ key }}
              </template>
              <a-select-option v-for="v in val" :key="v.id" :value="v.id">{{
                v.name
              }}</a-select-option>
            </a-select-opt-group>
          </a-select>
        </a-form-item>
        <a-form-item name="datasets" label="选择数据集">
          <a-button @click="addDataset" v-if="ruleForm.datasets.length < 3" class="add-data-set-btn"
            ><span class="icon-tianjia iconfont"></span></a-button
          >
          <div
            class="data-set-item"
            v-for="it in ruleForm.datasets"
            :key="it"
            :value="it"
          >
            <span>{{ it }}</span>
            <span class="iconfont icon-shanchu"></span>
          </div>
        </a-form-item>
      </div>
      <div class="form-bottom">
        <a-button>取消</a-button>
        <a-button type="primary" @click="create">创建</a-button>
      </div>
    </a-form>
    <a-drawer :closable="false" placement="right"  :visible="drawerVisible" @close="closeDrawer" width="640"></a-drawer>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  watch,
  Ref,
  ref,
  inject,
  reactive,
  toRefs,
  onMounted,
} from "vue";
import moment from "moment";
import { getConfigApi } from "../api";
import { includes } from "lodash";
export default defineComponent({
  setup() {
    const dateFormat = "YYYY-MM-DD";
    var updata = inject("updataNav") as Function;
    updata({
      tabs: false,
      navPosition: "outside",
      navType: false,
      showContent: true,
      componenttype: undefined,
      showNav: true,
      backOff: false,
      showPageEdit: false,
    });

    const reactiveData = reactive({
      // form数据
      ruleForm: {
        start_time: moment(new Date(), dateFormat),
        end_time: moment("2019-11-22", dateFormat),
        cpu: 1,
        ram: 1,
        disk: 1,
        image: undefined,
        openGPU: false,
        datasets: [1],
      },
      // 规则验证
      rules: {
        end_time: [{ required: true, message: "请选择结束时间" }],
        cpu: [{ required: true, message: "请选择cpu" }],
        ram: [{ required: true, message: "请选择内存" }],
        disk: [{ required: true, message: "请选择硬盘" }],
        image: [{ required: true, message: "请选择" }],
      },
      // 是否永久有效
      permanent: true,
      configs: {
        cpu: {},
        disk: {},
        ram: {},
      },
      images: {
        notebook: [],
        vnc: [],
      },
      showGPU: false,
      drawerVisible:false,
    });

    onMounted(() => {
      init();
    });
    function init() {
      getConfig().then(() => {
        const { cpu, disk, ram } = reactiveData.configs || {};
        console.log(cpu);
        let cpuKeys: any[] = Object.keys(cpu);
        let ramKeys: any[] = Object.keys(ram);
        let diskKeys: any[] = Object.keys(disk);
        for (let i = 0; i < cpuKeys.length; i++) {
          if (i === 0) {
            reactiveData.ruleForm.cpu = cpuKeys[i];
            continue;
          }
        }

        for (let i = 0; i < ramKeys.length; i++) {
          if (i === 0) {
            reactiveData.ruleForm.ram = ramKeys[i];
            continue;
          }
        }

        for (let i = 0; i < diskKeys.length; i++) {
          if (i === 0) {
            reactiveData.ruleForm.disk = diskKeys[i];
            continue;
          }
        }
      });
    }
    function getConfig() {
      return new Promise((resolve: any, reject: any) => {
        getConfigApi().then((res: any) => {
          const { base_image, image_configs } = res.data;
          reactiveData.configs = image_configs;
          reactiveData.images = base_image;
          resolve();
        });
      });
    }

    // 镜像选择发生变化时
    function iamgeChange(val: any) {
      console.log(val);
      let currentImageTemp: any = {};
      outerloop: for (const key in reactiveData.images) {
        if (Object.prototype.hasOwnProperty.call(reactiveData.images, key)) {
          for (let i = 0; i < reactiveData.images[key].length; i++) {
            if (Number(reactiveData.images[key][i].id) === val) {
              currentImageTemp = reactiveData.images[key][i];
              break outerloop;
            }
          }
        }
      }
      console.log(currentImageTemp.tags);
      if (includes(currentImageTemp.tags, 3)) {
        reactiveData.showGPU = true;
        if (currentImageTemp.is_use_gpu === 1) {
          reactiveData.ruleForm.openGPU = true;
        } else {
          reactiveData.ruleForm.openGPU = false;
        }
      } else {
        reactiveData.showGPU = false;
        reactiveData.ruleForm.openGPU = false;
      }
    }

    // 打开选择数据集抽屉
    function addDataset() {
        reactiveData.drawerVisible=true
    }

    // 关闭抽屉
    function closeDrawer() {
        reactiveData.drawerVisible=false
    }
    // 创建
    function create() {
      console.log(reactiveData.ruleForm.image);
    }
    return {
      ...toRefs(reactiveData),
      dateFormat,
      moment,
      iamgeChange,
      addDataset,
      closeDrawer,
      create,
    };
  },
});
</script>

<style lang="less">
.create-workbench-box {
  width: 1000px;
  margin: 0 auto;
  height: 100%;
  .create-form {
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    .form-left {
      width: 50%;
      padding-right: 40px;
      .time-item {
        label.ant-form-item-required {
          width: 100%;
        }
        .start-end-date-box {
          border: 1px solid #d9d9d9;
          .and-line {
            position: relative;
            right: 50px;
            color: #d9d9d9;
          }
          input {
            border: none;
            &:focus {
              box-shadow: none;
            }
            &.ant-input-disabled {
              background: none;
            }
          }
          > .ant-calendar-picker {
            &:nth-child(1) {
              span {
                display: none;
              }
            }
          }
        }
      }
      .time-label {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .time-check-box {
          display: flex;
          flex-direction: row;
          flex-shrink: 0;
          color: orange;
          .ant-checkbox-wrapper {
            margin-right: 5px;
          }
        }
      }
    }
    .form-right {
      width: 50%;
      padding-left: 20px;
      .add-data-set-btn {
        width: 100px;
        font-size: 14px;
        border: 1px solid @theme-color;
      }
      .data-set-item {
        margin-top: 15px;
        padding: 0 10px;
        border-radius: 4px;
        display: flex;
        width: 100%;
        justify-content: space-between;
        border: 1px solid #d9d9d9;
        color: #d9d9d9;

        .icon-shanchu {
          color: #000000;
          cursor: pointer;
        }
      }
    }
    .form-bottom {
      width: 100%;
      margin-top: auto;
      text-align: center;
      > button {
        margin-right: 40px;
      }
    }
  }
}
</style>
