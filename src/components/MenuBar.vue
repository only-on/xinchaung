<script lang="tsx">
import { defineComponent, VNode,reactive} from "vue";
import { FakeMenu, MenuItem } from "src/api/modules/common";
import { useRouter } from 'vue-router';
import request from 'src/api/index'
import { IBusinessResp} from 'src/typings/fetch';
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
    const router = useRouter();
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
                if(item.items && item.items.length){
                  e.preventDefault();
                }else{
                  router.replace(item.url[0]!)
                }
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
    var menus:MenuItem[]=reactive([])
    var children: Array<VNode>=reactive([])
    const renderMenu = function (menuData: MenuItem[]) {
      menuData.forEach((item) => {
        children.push(renderItem(item, 0));
      });
      return <div class="nav__menu">{children}</div>;
    };
    const http=(request as any).common
    http.getMenu().then((res:IBusinessResp)=>{
      menus.length=0
      let data=res.data
      menus.push(...data)
    })
    return () => (renderMenu(menus as MenuItem[]));
  },
  components: {},
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
