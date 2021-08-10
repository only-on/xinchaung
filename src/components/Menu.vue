<template>
    <menu-bar></menu-bar>
</template>
<script lang="ts">
import { defineComponent, h, VNode } from "vue";
import { FakeMenu, MenuItem } from "src/api/modules/common";

const renderItem = function (item: MenuItem, level: number): VNode {
  if (level % 2 === 0) {
    // 主菜单出现的时候
    let children = [h("a", { class: "ant-dropdown-link" }, item.label)];
    if (item.items) {
      level += 1;
      let tmpChildren = [];
      for (let i in item.items) {
        tmpChildren.push(renderItem(item.items[i], level));
      }
      children.push(
        h(
          "template",
          { slot: "overlay" },
          h("a-menu", { class: "menu-item-group" }, tmpChildren)
        )
      );
    }
    let cssClass = item.options;
    if (item.active) {
      cssClass!.class += " active";
    }
    return h("a-dropdown", cssClass, children);
  }
  // 菜单条目
  return h("a-menu-item", {}, h("a", { href: item.url }, item.label));
};
const render = function (menuData: MenuItem[]) {
  let children: Array<VNode> = [];
  menuData.forEach((item) => {
    children.push(renderItem(item, 0));
  });
  return h("div", { class: "menu" }, children);
};
const menu = render(FakeMenu.data as MenuItem[]);

export default defineComponent({
  name: "Menu",
  components: {
    MenuBar: menu,
  },
  setup() {},
});
</script>
