<template>
  <a-breadcrumb :class="type ? '' : 'allWhite'">
    <a-breadcrumb-item
      v-for="(v, i) in breadcrumbArr"
      :key="'breadcrumbs-' + i"
      @click="Jump(v)"
      :class="v.control.enabled ? 'allow' : ''"
    >
      {{ v.control.title }}
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, ComputedRef, watch } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { IRouteTuple } from "src/types";
export default defineComponent({
  name: "Breadcrumb",
  components: {},
  props: {
    type: {
      required: false,
      type: Boolean,
      default: true,
    },
  },
  setup: (props, { emit }) => {
    const type = ref(props.type);
    const store = useStore();
    const router = useRouter();
    let breadcrumbArr: ComputedRef<IRouteTuple[]> = computed<IRouteTuple[]>(() => {
      return store.state.breadcrumb;
    });
    function Jump(v: IRouteTuple) {
      // 不按path跳转，因为path是动态地址，不是具体的地址，以对象的方式跳转
      console.log("[breadcrumb] will jump to: ", v);
      if (v.control.enabled) {
        router.push(v.route);
      }
    }
    watch(
      () => {
        return props.type;
      },
      (val: any) => {
        type.value = val;
      }
    );

    onMounted(() => {});
    return { breadcrumbArr, type, Jump };
  },
});
</script>

<style scoped lang="less">
.nav {
  display: flex;
  justify-content: flex-end;
  div {
    position: relative;
    cursor: pointer;
    &.qian {
      padding-left: 20px;
    }
    &.qian::before {
      position: absolute;
      content: ">";
      left: 7px;
      top: 0;
    }
  }
}
.ant-breadcrumb {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 14px;
  color: @location-color;
  .allow {
    :deep(.ant-breadcrumb-link) {
      cursor: pointer;
    }
  }
}
.allWhite {
  // padding: 16px 0;
  a,
  span,
  span:last-child {
    color: #fff;
  }
  :deep(.ant-breadcrumb-separator) {
    color: #fff;
  }
}
</style>
