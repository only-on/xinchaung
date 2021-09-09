<script lang="tsx">
import { defineComponent, VNode} from "vue";
import { FakeMenu, MenuItem } from "src/api/modules/common";
import request from '../api/index'
import { IBusinessResp} from '../typings/fetch';
export default defineComponent({
  name: "MenuBar",
  props: {
    menus: {
      required: false,
      type: Array,
      default: () => [],
    },
  },
  setup(props,context) {
    const http=(request as any).common
    const renderItem = function (item: MenuItem, level: number): VNode {
      if (level % 2 === 0) {
        let items: VNode | null = null;
        if (item.items) {
          level += 1;
          let tmpChildren: Array<VNode> = [];
          for (let i in item.items) {
            tmpChildren.push(renderItem(item.items[i], level));
          }
          items = <a-menu class="menu__group">{tmpChildren}</a-menu>;
        }

        return (
          <a-dropdown
            v-slots={{
              overlay() {
                return items;
              },
            }}
          >
            <a
              class={item.active ? "menu__top-item active" : "menu__top-item"}
              onClick={(e: Event) => {
                e.preventDefault();
              }}
            >
              {item.label}
            </a>
          </a-dropdown>
        );
      }
      return (
        <a-menu-item class="menu__item">
          <a href={item.url[0] + ""}>{item.label}</a>
        </a-menu-item>
      );
    };
    const renderMenu = function (menuData: MenuItem[]) {
      let children: Array<VNode> = [];
      menuData.forEach((item) => {
        children.push(renderItem(item, 0));
      });
      return <div class="nav__menu">{children}</div>;
    };
    return () => (renderMenu(props.menus as MenuItem[]));
  },
  components: {},
  //  render() {
  //   const renderItem = function (item: MenuItem, level: number): VNode {
  //     if (level % 2 === 0) {
  //       let items: VNode | null = null;
  //       if (item.items) {
  //         level += 1;
  //         let tmpChildren: Array<VNode> = [];
  //         for (let i in item.items) {
  //           tmpChildren.push(renderItem(item.items[i], level));
  //         }
  //         items = <a-menu class="menu__group">{tmpChildren}</a-menu>;
  //       }

  //       return (
  //         <a-dropdown
  //           v-slots={{
  //             overlay() {
  //               return items;
  //             },
  //           }}
  //         >
  //           <a
  //             class={item.active ? "menu__top-item active" : "menu__top-item"}
  //             onClick={(e: Event) => {
  //               e.preventDefault();
  //             }}
  //           >
  //             {item.label}
  //           </a>
  //         </a-dropdown>
  //       );
  //     }
  //     return (
  //       <a-menu-item class="menu__item">
  //         <a href={item.url[0] + ""}>{item.label}</a>
  //       </a-menu-item>
  //     );
  //   };

  //   const renderMenu = function (menuData: MenuItem[]) {
  //     let children: Array<VNode> = [];
  //     menuData.forEach((item) => {
  //       children.push(renderItem(item, 0));
  //     });
  //     return <div class="nav__menu">{children}</div>;
  //   };
  //   return renderMenu(FakeMenu.data as MenuItem[]);
  // },
});
</script>
<style lang="less" scoped>
.nav__menu {
  display: flex;
  align-items: center;
  .menu__top-item {
    display: inline-block;
    padding: 0 @padding-md;
    color: @text-color-secondary;
    font-size: @font-size-lg;
    text-align: center;
    &.active {
      color: @text-color;
    }
  }
}
.menu__item {
  span {
    padding: @padding-xss @padding-md;
    font-size: @font-size-base;
  }
}
</style>
