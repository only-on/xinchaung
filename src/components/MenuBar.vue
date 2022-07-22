<template>
  <div class="nav__menu">
    <a-dropdown v-for="v in menus" :key="v" trigger="hover" 
    :overlayClassName="`${v.children && v.children.length? dropClass:'meanBarOverlay'}`"
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
  computed,
  nextTick,
} from "vue";
import { FakeMenu, MenuItem } from "src/api/modules/common";
import { useRouter, useRoute } from "vue-router";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch";
import extStorage from "src/utils/extStorage";
import { useStore } from "vuex";
import menusFn from 'src/routers/menuConfig'
export default defineComponent({
  name: "MenuBar",
  setup(props, context) {
    const renderFlag: Ref<boolean> = ref(true);
    const router = useRouter();
    const route = useRoute();
    const { lStorage } = extStorage;
    const store = useStore();
    const dropClass = ref(store.state.systemInfo.theme ? `meanBarOverlay borC theme${store.state.systemInfo.theme}` : 'meanBarOverlay borC')
    // var menus:MenuItem[]=reactive([])
    var menus: any[] = menusFn();
    // console.log(menus);
    
    var activeName: Ref<string> = ref(lStorage.get("menuActiveName") || "");

    function select(level: string, val: MenuItem){ // MenuItem
      console.log("to：path：" + val.url);
      router.replace(String(val.url));
      if (level === "Parent") {
        activeName.value = val.name;
      } else {
        menus.forEach((v: MenuItem) => {
          v.children? v.children.forEach((i: MenuItem) => {
                if (i.name === val.name) {
                  activeName.value = v.name;
                  return;
                } })
            : "";
        });
      }
      lStorage.set("menuActiveName", activeName.value);
      store.commit("changemenuActiveName",activeName.value)
    }
    watch(()=>store.state.systemInfo.theme, newVal => {
      dropClass.value = `meanBarOverlay borC theme${newVal}`
    })
    // store
    watch(()=>store.state.menuActiveName, newVal => {
      // console.log(newVal);
      activeName.value = newVal
      lStorage.set("menuActiveName", activeName.value);
    },{immediate: true })
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
    return { menus, select, activeName ,visibleChange, dropClass};
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
    color: var(--menu-text);
    font-size: var(--font-size-16);
    text-align: center;
    cursor: pointer;
    width: max-content;
    &.active {
      // color: var(--black-85);
      color: var(--menu-active);
    }
  }
}
.menu__item {
  background: #192843;
  border: 1px solid var(--primary-color);
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
  // border: 1px solid var(--primary-color);
  // border-radius: 6px;
}
</style>
