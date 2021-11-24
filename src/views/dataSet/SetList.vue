<template>
  <div class="dateSetList">
    <div class="search fixCenter">
      <div class="left">
        <a-radio-group v-model:value="search.category" button-style="solid">
          <a-radio-button :value="v.uid" v-for="v in option" :key="v.name">{{v.name}}</a-radio-button>
        </a-radio-group>
      </div>
      <div class="right fix">
        <div class="search-box">
          <a-input-search
            v-model:value="search.keyword"
            placeholder="请输入搜索关键字查询"
            @search="init"
          />
        </div>
         <a-button v-if="showCreate" type="primary" @click="create">新建数据集</a-button>
      </div>
    </div>
    <a-spin :spinning="loading" size="large" tip="Loading...">
      <div class="data-set-content setScrollbar">
        <div class="card-item" v-for="(item, index) in dataList" :key="index" style="width: 25%">
          <!-- <div class="card-box" :style="setPadding(index + 1)"></div> -->
            <div class="card-box">
              <div class="card-content">
                <div class="card-look">
                  <div class="img"><img :src="item.cover" alt="" /></div>
                  <div class="base-info-box">
                    <h2>{{ item.name }}</h2>
                    <div>
                      <div class="system-box" v-if="role === 'admin'">
                        <div>
                          <i>{{ chinaToPy(item.creator) }}</i>
                          <span>{{ item.creator }}</span>
                        </div>
                      </div>
                      <div class="size-box">
                        <div>
                          <i class="iconfont icon-wenjianjia"></i>
                          <span>{{ item.amount }}</span>
                        </div>

                        <div>
                          <i class="iconfont icon-cunchuzhi"></i>
                          <span>{{ item.size }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="card-detail">
                  <div @click.stop="dataSetDetail(item)">
                    <div class="">
                      <h2>{{ item.name }}</h2>
                      <div class="data-set-detail-box" :title="item.description">
                        {{ item.description }}
                      </div>
                      <div class="tags-box">
                        <span class="iconfont iconbiaoqian"></span>
                        <span v-if="!item.labels.length" class="notYet">暂无标签！</span>
                        <div class="labelsBox">
                          <span v-for="c in item.labels" :key="c.name">
                            {{ c.name }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="action-box">
                      <span
                        class="iconfont iconshanchu"
                        @click.stop="openDeletePop($event, item)"
                        v-if="
                          (role === 'admin' && item.role === '3') ||
                          role === 'init' ||
                          ((role === 'teacher' || role === 'assistant') && currentTab === 0)
                        "
                      ></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
    </a-spin>
    
  </div>
</template>
<script lang="ts">
import { defineComponent,ref, onMounted,reactive, toRefs,watch ,inject,Ref,computed} from 'vue'
import request from '../../api/index'
import { IBusinessResp} from '../../typings/fetch.d';
import { useRouter ,useRoute } from 'vue-router';
import { Modal,message } from 'ant-design-vue';
import extStorage from "src/utils/extStorage";
const http=(request as any).dataSet
interface ISearch{
  category:string
  page:number
  per_page:number
  keyword:string
  common:number
  user_id:number
  label:string
}
export default defineComponent({
  name: '',
  components: {
   
  },
  setup: (props,context) => {
    const router = useRouter();
    const route = useRoute();
    const { lStorage } = extStorage
    const role = lStorage.get('role')
    const uid=lStorage.get('user_id')
    var currentTab:Ref<number>=ref(0)
    var configuration:any=inject('configuration')
    
    var loading:Ref<boolean> =ref(false)
    var search:ISearch=reactive({
      category:'',
      page:1,
      per_page:12,
      keyword:'',
      common:1,
      user_id:uid,
      label:''
    })
    var showCreate=computed(()=>{
      return true
    })
    var option:any[]=reactive([])
    var dataList:any[]=reactive([])
    function create(){

    }
    function categoryList(){
      option.length=0
      http.categoryList().then((res:IBusinessResp)=>{
          option.push(...res.data)
          option.unshift({uid:'',name:'全部'})
          // console.log(option)
      })
    }
    function init(){
      console.log(search)
      dataList.length=0
      loading.value=true
      http.datasets({param:{...search}}).then((res:IBusinessResp)=>{
          if(res){
            loading.value=false
            dataList.push(...res.data)
            console.log(dataList)
          }
      })
    }
    watch(()=>{return configuration.componenttype},(val)=>{
      console.log(val)
      currentTab.value=val
      search.common=(val===1)?0:1
    })
    watch(()=>{return search.common},(val)=>{
      console.log(val)
      init()
    })
    function chinaToPy(name: string) {
      return 'a'
      // return chinaToPy.chineseToPinYin(name).substring(0, 1)
    }
    function setPadding(index: number){
      return 6
    }
    function dataSetDetail(e: any) {
      console.log(e)
      // this.$router.push({
      //   path: '/dataAggregateDetails',
      //   query: { id: e.uid, common: e.common, user_id: e.creator },
      // })
    }
    function openDeletePop(e:any,item:any){

    }
    onMounted(()=>{
     categoryList()
     init()
    })
    return {loading,search,option,init,create,showCreate,dataList,role,currentTab,chinaToPy,setPadding,dataSetDetail,openDeletePop};
  },
})
</script>
<style scoped lang="less">
.fix{
  display: flex;
  align-items: center;
}
.fixCenter{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.dateSetList{
  height: 100%;
  overflow: hidden;
  .search{
    .right{
      .search-box{
        width: 340px;
      }
      .ant-btn{
        margin-left: 16px;
      }
    }
  }
  .data-set-content{
      display: flex;
      flex-wrap: wrap;

      .card-item {
        height: 323px;
        margin-bottom: 20px;
        .card-box {
          height: 100%;
          cursor: pointer;

          .card-content {
            background: #ffffff;
            height: 100%;
            position: relative;
            .card-look {
              height: 100%;
              padding: 20px;
              display: flex;
              flex-direction: column;
              border-radius: 5px;
              // box-shadow: 0px 0px 11px -4px rgb(0 0 0 / 50%);
              box-shadow: 0px 3px 6px 0px rgb(0 0 0 / 5%);
              &:hover {
                // box-shadow: 0px 11px 11px 0px rgba(0,0,0,0.23);
                // box-shadow: 0px 0px 11px -4px rgb(0 0 0 / 50%);
              }
              // background: #404040;
              box-sizing: border-box;

              > div:nth-child(1) {
                height: 220px;

                > img {
                  width: 100%;
                  height: 100%;
                }

                // &.img {
                //     background-image: url('../../../../assets/img/dataset/test.png');
                //     background-size: 100% 100%;
                //     background-repeat: no-repeat;
                //     background-position: center;
                // }
              }

              .base-info-box {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                height: 64px;

                h2 {
                  margin-top: 10px;
                  color: #404040;
                  font-size: 16px;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                }

                > div {
                  display: flex;
                  flex-direction: row;
                  justify-content: space-between;
                  > div {
                    // width: 0%;

                    span {
                      color: #808080;
                      font-size: 12px;
                    }
                  }

                  > div:nth-child(2) {
                    width: 60%;
                  }

                  .system-box {
                    i {
                      width: 18px;
                      height: 18px;
                      border-radius: 50%;
                      background: @theme-color;
                      display: inline-block;
                      line-height: 18px;
                      text-align: center;
                      color: #ffffff;
                      margin-right: 10px;
                    }
                  }

                  .size-box {
                    text-align: left;

                    > div {
                      display: inline-block;
                    }

                    > div:nth-child(1) {
                      margin-right: 30px;

                      i {
                        background-image: url('../../../../assets/img/dataset/wenjian.png');
                        background-size: 18px 14px;
                        width: 18px;
                        height: 14px;
                        display: inline-block;
                        vertical-align: middle;
                        margin-right: 10px;
                      }

                      span {
                        vertical-align: middle;
                      }
                    }

                    > div:nth-child(2) {
                      i {
                        background-image: url('../../../../assets/img/dataset/shujuji.png');
                        background-size: 16px 16px;
                        width: 16px;
                        height: 16px;
                        display: inline-block;
                        vertical-align: middle;
                        margin-right: 10px;
                      }

                      span {
                        vertical-align: middle;
                      }
                    }
                  }
                }
              }
            }
            
            .card-detail {
              position: absolute;
              width: 100%;
              height: 100%;
              top: 0;
              padding: 20px;
              transition: 0.5s;
              transform: rotateY(90deg);

              > div {
                width: 100%;
                height: 100%;
                background: linear-gradient(131deg, #bb77ff 3%, #6b43f1 90%);
                padding: 44px 24px 24px 24px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;

                > div {
                  > h2 {
                    text-align: left;
                    color: #ffffff;
                    font-size: 18px;
                    margin-bottom: 14px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  }

                  > div.data-set-detail-box {
                    color: rgba(255,255,255,0.8);
                    font-size: 14px;
                    line-height: 24px;
                    text-align: left;
                    word-wrap: break-word;
                    text-justify: inter-ideograph;
                    height: 70px;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                  }

                  > .tags-box {
                    margin-top: 24px;
                    display: flex;
                    // flex-wrap: wrap;
                    // justify-content: space-between;
                    span {
                      color:#E1CFFF;
                      font-size: 12px;
                      line-height: 18px;
                      padding: 5px;
                      &.more-point {
                        border: 1px solid #8955b5;
                        padding: 0 7px;
                        display: inline-block;
                        line-height: 12px;
                        border-radius: 11px;
                        font-size: 26px;
                        vertical-align: sub;
                        margin-left: 5px;
                        transition: 0.5s;
                        height: min-content;
                        margin: auto 0;
                        background: #ffffff;
                        color: @theme-color;
                        position: relative;

                        .more-tag-box {
                          position: absolute;
                          background: #ffffff;
                          top: 26px;
                          right: -22px;
                          width: max-content;
                          display: flex;
                          flex-direction: column;
                          // flex-wrap: wrap;
                          display: none;
                          border-radius: 6px;
                          box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
                          z-index: 111;
                          flex-shrink: 1;
                          cursor: default;
                          padding: 14px 12px;
                          > span {
                            width: max-content;
                            background: #f7f7f7;
                            // margin: 12px;
                            padding: 0;
                            color: #808080;
                            border-radius: 12px;
                            font-size: 12px;
                          }
                        }

                        &:hover {
                          .more-tag-box {
                            display: flex;
                          }

                          background: rgba(137, 99, 240);
                          color: #ffffff;
                          border: 1px solid transparent;
                        }
                      }
                    }
                    .iconbiaoqian{
                      font-size: 14px;
                      color: #f7f7f7;
                    }
                    .notYet{
                      color: rgba(255, 255, 255,.25);
                      flex: 1;
                    }
                    .labelsBox{
                      display: flex;
                      flex-wrap: wrap;
                      padding-top: 5px;
                      span{
                        padding: 0;
                        padding-bottom: 4px;
                        padding-right: 10px;
                        color: #E1CFFF;
                      }
                    }
                    //> span:nth-child(1) {
                    //  font-size: 18px;
                    //  vertical-align: middle;
                    //  margin-right: 6px;
                    //}
                  }
                }

                > .action-box {
                  text-align: right;

                  button {
                    width: 28px;
                    height: 28px;
                    background: transparent;
                    border-radius: 50%;
                    text-align: center;
                    line-height: 28px;
                    border: none;
                  }

                  span {
                    color: #ffffff;
                    font-size: 18px;
                    background-color: #6b43f1;
                    // color:#6b43f1;
                  }
                  span:hover{
                    background-color: #f7f7f7;
                    color:#6b43f1;
                    padding: 4px;
                    border-radius: 50%;
                  }
                }
              }
            }
          }
          .card-content:hover .card-look{
            box-shadow: 0px 0px 11px -4px rgb(0 0 0 / 50%);
          }
        }

        .card-box:hover {
          .card-detail {
            transform: rotateY(0deg);
            transition: 0.5s;
          }
        }
      }
    }
}
</style>