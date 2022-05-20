<template>
  <div class="nav__menu">
    <a-dropdown v-for="v in menus" :key="v" trigger="hover" 
    :overlayClassName="`${v.children && v.children.length?'meanBarOverlay borC':'meanBarOverlay'}`"
     @visibleChange="visibleChange">
      <div
        class="menu__top-item ant-dropdown-trigger flexCenter"
        :class="v.name === activeName ? 'active' : ''"
        @click="!v.children.length ? select('Parent', v) : ''"
      >
        
        <span class="iconfont" style="padding-right:4px;" :class="v.icon"></span>
        <span>{{ v.name }}</span>
      </div>
      <template #overlay>
        <a-menu class="menu__group">
          <a-menu-item v-for="i in v.children" :key="i" class="menu__item">
            <div @click="select('Children', i)">{{ i.name }}</div>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>
<script lang="tsx">
import {
  defineComponent,
  VNode,
  reactive,
  Ref,
  ref,
  watch,
  onMounted,
  PropType,
  nextTick,
} from "vue";
import { FakeMenu, MenuItem } from "src/api/modules/common";
import { useRouter, useRoute } from "vue-router";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch";
import extStorage from "src/utils/extStorage";
import { useStore } from "vuex";
export default defineComponent({
  name: "MenuBar",
  props: {
    menus: {
      required: false,
      type: Array,
      // type: Array as PropType<MenuItem>,
      default: () => [],
    },
  },
  setup(props, context) {
    const renderFlag: Ref<boolean> = ref(true);
    const router = useRouter();
    const route = useRoute();
    const { lStorage } = extStorage;
    const store = useStore();
    const renderItem = function (item: MenuItem, level: number): VNode {
      if (level % 2 === 0) {
        let items: VNode | null = null;
        if (item.children) {
          level += 1;
          let tmpChildren: Array<VNode> = [];
          for (let i in item.children) {
            tmpChildren.push(renderItem(item.children[i], level));
          }
          items = <a-menu class="menu__group">{tmpChildren}</a-menu>;
        }
        // select
        return (
          <a-dropdown
            v-slots={{
              overlay() {
                return items;
              },
            }}
          >
            <div
              // class={item.name === activeName.value ? "menu__top-item" : "menu__top-item"}
              class={
                item.name === activeName.value
                  ? "menu__top-item active"
                  : "menu__top-item"
              }
              onClick={(e: Event) => {
                if (item.children && item.children.length) {
                  // console.log(item.items)
                } else {
                  select("Parent", item);
                }
              }}
            >
              {item.name}
            </div>
          </a-dropdown>
        );
      }
      return (
        <a-menu-item class="menu__item">
          <div
            onClick={(e: Event) => {
              select("Children", item);
            }}
          >
            {item.name}
          </div>
        </a-menu-item>
      );
    };
    // var menus:MenuItem[]=reactive([])
    var menus: any[] = props.menus;
    var children: Array<VNode> = reactive([]);
    const renderMenu = function (menuData: MenuItem[]) {
      menuData.forEach((item) => {
        children.push(renderItem(item, 0));
      });
      return <div class="nav__menu">{children}</div>;
    };
    var activeName: Ref<string> = ref(lStorage.get("menuActiveName") || "");

    function select(level: string, val: MenuItem) {
      // console.log(val)
      console.log("to：path：" + val.url);
      router.replace(String(val.url));
      if (level === "Parent") {
        activeName.value = val.name;
      } else {
        menus.forEach((v: MenuItem) => {
          v.children
            ? v.children.forEach((i: MenuItem) => {
                if (i.name === val.name) {
                  activeName.value = v.name;
                  return;
                }
              })
            : "";
        });
      }
    }
    watch(activeName, (val: any) => {
      lStorage.set("menuActiveName", val);
    });
    const http = (request as any).common;

    const visibleChange=(val:any)=>{
      // console.log(val);
      
      nextTick(()=>{
        // var dom:any=document.querySelector('.meanBarOverlay')
        // console.log(dom); 
        // dom.style.minWidth='86px'
        // dom.style.position='absolute'
        // dom.style.left='790px'
        // console.log(dom.style.cssText);
      })
    }
    onMounted(() => {
      
    });
    return { menus, select, activeName ,visibleChange};
  },
  components: {},
});
</script>
<style lang="less" scoped>
.nav__menu {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .menu__top-item {
    display: inline-block;
    padding: 0 var(--padding-md);
    // color: var(--black-25);
    color: var(--white-45);
    font-size: var(--font-size-18);
    text-align: center;
    cursor: pointer;
    width: max-content;
    &.active {
      // color: var(--black-85);
      color: var(--white);
    }
  }
}
.menu__item {
  background: #192843;
  border: 1px solid #ff9544;
  border-radius: 6px;
  // span {
  //   padding: var(--padding-xss) var(--padding-md);
  //   font-size: var(--base-font-size);
  //   // color: var(--black-85);
  //   color: var(--white-45);
  // }
  // div {
  //   padding: var(--padding-xss) var(--padding-md);
  //   font-size: var(--base-font-size);
  //   // color: var(--black-85);
  //   color: var(--white-45);
  //   background: #192843;
  // }
}
:deep(.ant-dropdown-menu-item, .ant-dropdown-menu-submenu-title) {
  // color: var(--black-65);
  // font-size: var(--base-font-size);
}
:deep(.ant-dropdown-menu){
  // background: #192843;
  // border: 1px solid #ff9544;
  // border-radius: 6px;
}
</style>
