<script lang="tsx">
import { defineComponent, VNode,reactive,Ref,ref,watch,onMounted} from "vue";
import { FakeMenu, MenuItem } from "src/api/modules/common";
import { useRouter,useRoute } from 'vue-router';
import request from 'src/api/index'
import { IBusinessResp} from 'src/typings/fetch';
import extStorage from "src/utils/extStorage";
export default defineComponent({
  name: "MenuBar",
  props: {
    // menus: {
    //   required: false,
    //   type: Array,
    //   default: () => [],
    // },
  },
  setup(props,context) {
    const router = useRouter();
    const route = useRoute();
    const { lStorage } = extStorage
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
              class={(item.label === activeName.value) ? "menu__top-item active" : "menu__top-item"}
              onClick={
                  (e: Event) => {
                    if(item.items && item.items.length){
                      // console.log(item.items)
                    }else{
                      select('Parent',item)
                    }
                }
              } 
            >
              {item.label}
            </div>
          </a-dropdown>
        );
      }
      return (
        <a-menu-item class="menu__item">
          <div onClick={(e: Event)=>{select('Children',item)}}>{item.label}</div>
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
    var activeName:Ref<string>=ref(lStorage.get('menuActiveName') || '')

    function select(level:string,val:MenuItem){
       router.replace(val.url[0]!)
      if(level==='Parent'){
        // router.replace(val.url[0]!)
        activeName.value=val.label
      }else{
        menus.forEach((v:MenuItem)=>{
          v.items?v.items.forEach((i:MenuItem)=>{
            if(i.label===val.label){
                activeName.value=v.label
                return
            }
          }):''
        })
      }
    }
    watch(activeName,(val:any)=>{
      lStorage.set('menuActiveName',val)
    })
    const http=(request as any).common
    http.getMenu().then((res:IBusinessResp)=>{
      menus.length=0
      let data=res.data
      activeName.value=lStorage.get('menuActiveName')?lStorage.get('menuActiveName'):(data && data.length && data[0].label)
      menus.push(...data)
      if(route.path===(data && data[0].url[0])){
        activeName.value=(data && data[0].label)
      }
    })
    onMounted(() => {
      // console.log(route.path)
    });
    return () => (renderMenu(menus as MenuItem[]));
    // return () => (renderMenu(FakeMenu.data as MenuItem[]));
    
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
    cursor: pointer;
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
