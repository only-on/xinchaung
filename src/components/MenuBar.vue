<script lang="tsx">
import { defineComponent, VNode,reactive,Ref,ref,watch,onMounted} from "vue";
import { FakeMenu, MenuItem } from "src/api/modules/common";
import { useRouter,useRoute } from 'vue-router';
import request from 'src/api/index'
import { IBusinessResp} from 'src/typings/fetch';
import extStorage from "src/utils/extStorage";
import {useStore} from "vuex"
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
    const store=useStore()
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
              class={(item.name === activeName.value) ? "menu__top-item active" : "menu__top-item"}
              onClick={
                  (e: Event) => {
                    if(item.children && item.children.length){
                      // console.log(item.items)
                    }else{
                      select('Parent',item)
                    }
                }
              } 
            >
              {item.name}
            </div>
          </a-dropdown>
        );
      }
      return (
        <a-menu-item class="menu__item">
          <div onClick={(e: Event)=>{select('Children',item)}}>{item.name}</div>
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
      console.log('to：path：'+val.url)
      router.replace(String(val.url))
      if(level==='Parent'){
        activeName.value=val.name
      }else{
        menus.forEach((v:MenuItem)=>{
          v.children?v.children.forEach((i:MenuItem)=>{
            if(i.name===val.name){
                activeName.value=v.name
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
    function getMenu(){
      http.getMenu().then((res:IBusinessResp)=>{
        if(res){
          menus.length=0
          let data=res.data.menus
          activeName.value=lStorage.get('menuActiveName')?lStorage.get('menuActiveName'):(data && data.length && data[0].name)
          menus.push(...data)
          if(route.path===(data && data.length && data[0].url)){
            activeName.value=(data && data[0].name)
          }
          let user=res.data.user
          lStorage.set('role',user.role)
          lStorage.set('name',user.name)
          lStorage.set('user_id',user.id)
          lStorage.set("ws_config",JSON.stringify(res.data.websocket_conf))
          //   现阶段登录在后端    登录状态无法捕捉    分离之后用户信息改存在vuex
          store.commit('saveMenus', data)
        }
      })
    }
    onMounted(() => {
      // console.log(store.state.Menus)
      // let Menus=store.state.Menus;
      // if(!Menus.length){
      //    getMenu()
      // }else{
      //   menus=Menus
      // }
      getMenu()
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
