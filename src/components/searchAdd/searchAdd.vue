<template>
  <div class="reference1" :class=" configuration.showNav || configuration.tabs.length ? 'reference2' : '' ">
    <div class="addBox">
      <div class="add flexCenter fr">
        <div @mouseover="isMouseOver = true" @mouseout="isMouseOver = false" v-if="props.isShowSearch">
          <a-input-search  
            class="greenSearch"
            :class="{ mouseover: isMouseOver }"
            v-model:value="searchKey"
            @search="searchFn"
            placeholder="请输入关键词查询"
          />
        </div>
        <a-dropdown v-if="props.isShowAdd && props.TypeList.length">
          <span class="addCircular iconfont icon-tianjia"></span>
          <template #overlay>
            <a-menu @click="handleMenuClick" class="menu__group">
              <a-menu-item v-for="item in props.TypeList" :key="item.key">
                <div>{{ item.name }}</div>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
        <span
          v-else-if="props.isShowAdd && !props.TypeList.length"
          @click="handleMenuClick"
          class="addCircular iconfont icon-tianjia"
        ></span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch ,inject} from "vue";
var configuration: any = inject("configuration");
const isMouseOver = ref<boolean>(false);
const searchKey = ref<string>("");
const searchFn = () => {
  emit("searchFn", searchKey.value);
};
const handleMenuClick = (v: any) => {
  emit("handleMenuClick", v);
};
watch(()=>props.isReset, newVal => {
  searchKey.value = ''
},{immediate: true, deep:true})
interface IList {
  name: string;
  key: string;
}
interface Props {
  TypeList?: IList[];
  isShowAdd?: boolean;
  isShowSearch?: boolean;
  isReset?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  TypeList: () => [],
  isShowAdd: true,
  isShowSearch: true,
  isReset: false
});
const emit = defineEmits<{
  (e: "searchFn", key: string): void;
  (e: "handleMenuClick", obj: IList): void;
}>();
</script>

<style lang="less" scoped>
.reference1 {
  position: fixed;
  width: 100%;
  top: 90px;
  left: 0;
  height: 0px;
  z-index: 1;
  .addBox {
    width: var(--center-width);
    margin: 0 auto;
    height: 0px;
    .add {
      // justify-content: end;
      .ant-input-search {
        color: #fff;
        width: auto;
        border-radius: 25px;
        min-width: 35px;
        height: 50px;
        line-height: 50px;
        position: relative;
        overflow: hidden;
        padding: 0;
        // padding-right: 15px;
        box-sizing: content-box;
        &.mouseover {
          :deep(.ant-input) {
            padding-left: 20px;
            width: 190px;
          }
        }
        :deep(.ant-input) {
          display: inline-block;
          background: 0 0;
          padding: 0;
          border: none;
          box-shadow: none;
          color: var(--white-100);
          // padding-left: 20px;
          line-height: 50px;
          height: 50px;
          box-sizing: border-box;
          vertical-align: 4px;
          font-size: var(--font-size-16);
          width: 0px;
          transition: all 0.3s ease-in-out;
        }
        :deep(.ant-input-suffix) {
          margin-left: 0;
          padding: 0 15px;
        }
        :deep(.ant-input-group-addon:last-child){
          background: var(--brightBtn);
          border:0;
          .ant-btn{
            width: 50px;
            border: 0;
            background: none;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 20px;
            padding: 0 25px;
          }
        }
      }
      .addCircular {
        margin-left: 20px;
      }
    }
  }
}
.reference2{
  // top: 90px;
}
</style>
