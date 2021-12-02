<template>
  <div class="file-box">
    <div class="file-tree-box">
      <div class="upload-file-btn" v-if="uid === creator">
        <a-button @click="openUpload">
          <span class="icon-upload iconfont"></span>
          上传文件
        </a-button>
      </div>

      <ul v-if="fileList.length > 0">
        <li
          v-for="(item, index) in fileList"
          :key="index"
          :class="fileActive.uid === item.uid ? 'active' : ''"
          @click="selectFile(item,index)"
          :title="item.name"
        >
          <span class="img" :class="getFileType(item.name)" :style="`background-image: url(${iconList[getFileType(item.name)]});`"></span>
          <span>{{ item.name }}</span>
        </li>
      </ul>
    </div>
    <div class="file-content-box">
      <div class="file-detail-box" v-if="fileActive">
        <div>
          <span class="img" :style="`background-image: url(${iconList[getFileType(fileActive.name)]});`"></span>
          <span class="file-name">{{ fileActive.name }}</span>
          <span @click="download" class="icon-download iconfont"></span>
          <span class="delete-cion" v-if="uid === creator && fileList && fileList.length > 0">
          <a-button @click.stop="openDeleteFile()">
            <span class="iconfont icon-shanchu"></span>
          </a-button>
          </span>
        </div>
        <div class="file-base">
          <span>{{ fileActive.size }}</span>
          <span>{{ fileActive.created_at }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted,reactive, toRefs,watch ,inject,Ref,computed,createVNode} from 'vue'
import SetList from './SetList.vue'
import {useStore} from "vuex"
import extStorage from "src/utils/extStorage";
import { getFileType } from 'src/utils/getFileType'
import { useRouter ,useRoute } from 'vue-router';
import { Modal,message } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import request from 'src/api/index'
import iconList from 'src/utils/iconList'
const http=(request as any).dataSet
export default defineComponent({
  name: '',
  components: {
   SetList
  },
  // props: {
  //   fileList: {
  //     required: true,
  //     type: Array,
  //     default: () => [],
  //   },
  // },
  props:['fileList','data_id'],
  emits:['getDataFile','openUpload'],
  setup: (props,{emit}) => {
    const router = useRouter();
    const route = useRoute();
    const { lStorage } = extStorage
    const role = lStorage.get('role')
    const creator=Number(lStorage.get('user_id'))
    const uid = ref<number>(0);
    function openUpload() {
      emit('openUpload')
    }
    function selectFile(item:any,index:number){
      Active.value=index
    }
    function download(){
      // { data_id: this.data_id, file_id: this.fileDetail.uid }
      http.download({param:{data_id:props.data_id,file_id:fileActive.value.uid}}).then((res:any)=>{
          const a: any = document.createElement('a')
          a.href = res.data.download_path
          a.download = res.data.name
          a.click()
      })
    }
    function openDeleteFile(){
      if (props.fileList.length - 1 <= 0) {
        message.error('至少需要保留一个文件')
        return
      }
      Modal.confirm({
        title: '确定要删除这个文件吗？',
        icon: createVNode(ExclamationCircleOutlined),
        // content: '删除后不可恢复',
        okText: '确认',
        cancelText: '取消',
        onOk(){
          const deleteParam = {
            file_id: fileActive.value.uid,
            file_name: fileActive.value.name,
          }
          http.deleteFile({param:{...deleteParam}}).then((res:any)=>{
            message.success('删除成功')
            emit('getDataFile')
          })
        }
      });
    }
    const Active=ref<number>(0);
    const fileActive=computed(()=>{
      return props.fileList[Active.value]
    })
    onMounted(()=>{
     const {user_id}=route.query
     uid.value=Number(user_id)
    })
    return {iconList,getFileType,uid,creator,openUpload,props,fileActive,selectFile,download,openDeleteFile};
  },
})
</script>

<style scoped lang="less">
  .file-box {
    min-height: 500px;
    display: flex;
    flex-direction: row;

    .file-tree-box {

        width: 236px;
        flex-shrink: 0;
        border-right: 1px solid #ebebeb;

        .upload-file-btn {
            padding: 12px 10px;
            color: #FFAF47;

            button {
                width: 100%;
                height: 38px;
                border: 1px dashed #ffaf47;
                background: #ffeed8;
                color: #FFAF47;

                .icon-upload {
                    margin-right: 7px;
                    color: #FFAF47;
                }
            }
        }

        ul {
            margin-top: 15px;

            li {
                padding-left: 24px;
                line-height: 36px;
                color: #808080;
                font-size: 12px;
                cursor: pointer;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                display: flex;
                align-items: center;
                span.img {
                    width: 18px;
                    height: 18px;
                    display: inline-block;
                    vertical-align: inherit;
                    margin-right: 6px;
                    background-repeat: no-repeat;
                    background-size: 100% 100%;
                }
                &:hover {
                    background: #ffeed8;
                }
            }

            li.active {
                background: #ffeed8;
                border-left: 4px solid #ff9712;
                padding-left: 20px;
            }

        }
    }

    .file-content-box {
        width: 100%;
        padding: 29px 31px;

        .file-detail-box {
            display: flex;
            flex-direction: column;

            >div:nth-child(1) {
                display: flex;
                flex-direction: row;
                align-items: center;
                >.img {
                    width: 18px;
                    height: 19px;
                    flex-shrink: 0;
                    background-repeat: no-repeat;
                    background-size: 100% 100%;
                    margin-right: 6px;
                }

                .file-name {
                    color: #404040;
                    font-size: 16px;
                    margin-left: 5px;
                    width: 100%;
                }

                >.icon-download {
                    font-size: 16px;
                    width: 41px;
                    height: 38px;
                    // background: #ebeff8;
                    margin-left: 11px;
                    display: inline-block;
                    text-align: center;
                    line-height: 38px;
                    border-radius: 50%;
                    color: @theme-color;
                    cursor: pointer;
                    // border: 1px solid #d9d9d9;
                    transition: 0.5;

                    &:hover {
                        background: @theme-color;
                        color: #f7f7f7;
                    }
                }

                >.delete-cion {

                    button {
                        color: #808080;
                        font-size: 16px;
                        margin-left: 7px;
                        width: 38px;
                        height: 38px;
                        vertical-align: middle;
                        text-align: center;
                        line-height: 32px;
                        // background: #ebeff8;
                        border-radius: 50%;
                        cursor: pointer;
                        padding: 0;
                        line-height: 32px;
                        border: 0;
                        span {
                            font-size: 16px;
                            color: @theme-color;
                        }
                        &:hover {
                            background: @theme-color;
                            .icon-shanchu:before {
                                color: #f7f7f7;;
                            }
                        }
                    }
                }
            }

            .file-base {
                display: flex;
                flex-direction: row;
                padding-left: 23px;

                span:nth-child(1) {
                    color: #808080;
                    font-size: 12px;
                    line-height: 32px;
                }

                span:nth-child(2) {
                    color: #808080;
                    font-size: 12px;
                    margin-left: 50px;
                    line-height: 32px;
                }

                span:nth-child(3) {
                    color: #00b4af;
                    font-size: 16px;
                    margin-left: 100px;
                    width: 32px;
                    height: 32px;
                    vertical-align: middle;
                    text-align: center;
                    line-height: 32px;
                    background: #ebeff8;
                    border-radius: 50%;
                    cursor: pointer;
                }

                span:nth-child(4) {
                    button {
                        color: #808080;
                        font-size: 16px;
                        margin-left: 7px;
                        width: 32px;
                        height: 32px;
                        vertical-align: middle;
                        text-align: center;
                        line-height: 32px;
                        background: #ebeff8;
                        border-radius: 50%;
                        cursor: pointer;
                        padding: 0;
                        line-height: 32px;

                        span {
                            font-size: 16px;
                        }
                    }

                }
            }
        }
    }
}
</style>