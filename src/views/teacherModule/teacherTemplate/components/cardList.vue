<template>
  <div class="cardList">
    <div class="cardBox mySelfCreate" v-if="type === 'mine' && getRole() == 3">
      <div class="operate-btn" @click="handleCreate">
        <span class="iconfont icon-chuangjian1"></span>
        创建在线模板
      </div>
      <div class="operate-btn" @click="handleUpload">
        <span class="iconfont icon-upload"></span>
        上传离线模板
      </div>
    </div>
    <div class="cardBox" v-for="item in dataList" :key="item.id">
      <div class="cardPic" @click="handleView(item)">
        <img class="card-cover" :src="item.type === 'form' ? img3: img4 " :alt="item.name">
        <div class="info">
          <div class="title">{{item.name}}</div>
          <div class="desc">{{desc(item)}}</div>
        </div>
      </div>
      <div class="cardfoot">
        <!-- 我的模板 -->
        <template v-if="type === 'mine'">
          <span v-if="item.can_download" @click="handleDownload(item)">下载</span>
          <span v-if="item.can_update && item.type === 'form'" @click="handleEdit(item)">编辑</span>
          <span v-if="item.can_shared" @click="handleShare(item)">{{ item.is_shared ? '取共' : '共享' }}</span>
          <span v-if="item.can_copy && item.can_delete">
            <a-tooltip placement="bottom" color="#fff">
                <template #title>
                  <span :style="setStyle()" @click="handleCopy(item)">复用</span>
                  <span :style="setStyle()" @click="handleDelete(item)">删除</span>
                </template>
                <span class="iconfont icon-gengduo"></span>
              </a-tooltip>
          </span>
        </template>
        <!-- 教师创建模板 -->
        <template v-if="type === 'teacher'">
          <span v-if="item.can_download" @click="handleDownload(item)">下载</span>
          <span v-if="item.can_delete" @click="handleDelete(item)">删除</span>
        </template>
        <!-- 内置模板 -->
        <template v-if="type === 'init'">
          <span v-if="item.can_download" @click="handleDownload(item)">下载</span>
          <span v-if="item.can_copy" @click="handleCopy(item)">保存</span>
        </template>
        <!-- 共享模板 -->
        <template v-if="type === 'shared'">
          <span v-if="item.can_download" @click="handleDownload(item)">下载</span>
          <span v-if="item.can_update && item.type === 'form'" @click="handleEdit(item)">编辑</span>
          <span v-if="item.can_shared" @click="handleShare(item)">{{ item.is_shared ? '取共' : '共享' }}</span>
          <span v-if="item.can_copy && !item.can_delete" @click="handleCopy(item)">保存</span>
          <span v-if="item.can_copy && item.can_delete">
            <a-tooltip placement="bottom" color="#fff">
                <template #title>
                  <span :style="setStyle()" @click="handleCopy(item)">保存</span>
                  <span :style="setStyle()" @click="handleDelete(item)">删除</span>
                </template>
                <span class="iconfont icon-gengduo"></span>
              </a-tooltip>
          </span>
        </template>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, watch, ref, computed } from 'vue'
import img3 from 'src/assets/images/teacherExperiment/list-card-cover3.png'
import img4 from 'src/assets/images/teacherExperiment/list-card-cover4.png'
interface Iitem{
  is_init: boolean,
  created_at: string,
  user_name: string
}
export default defineComponent({
  props: ['type', 'data'],
  setup(props,{emit}) {
    var type = ref<string>(props.type)
    var dataList = ref<any>(props.data)
    watch(()=>props.type, newVal => {
      type.value = newVal
    })
    watch(()=>props.data, newVal => {
      dataList.value = newVal
    })
    const getRole = () => {
      return localStorage.role
    }
    const desc = computed(() => {
      return (item:Iitem)=>{
        return type.value === 'mine' || type.value === 'teacher' || (type.value === 'shared' && item.is_init) ? item.created_at : type.value === 'shared' && !item.is_init ? item.user_name : ''
      }
    })
    const setStyle =()=>{
      return 'display:block;color: #898989;line-height:30px;padding:0 15px;cursor:pointer;text-align:center;font-size:14px'
    }
    // 删除
    const handleDelete = (item:any) => {
      emit('delete', item)
    }
    // 复用、保存
    const handleCopy = (item:any) => {
      emit('copy', item)
    }
    // 共享
    const handleShare = (item:any) => {
      emit('share', item)
    }
    // 下载
    const handleDownload = (item:any) => {
      emit('down', item)
    }
    // 上传
    const handleUpload = () => {
      emit('upload')
    }
    // 创建
    const handleCreate = () => {
      emit('create')
    }
    // 编辑
    const handleEdit = (item:any) => {
      emit('edit', item)
    }
    // 查看
    const handleView = (item:any) => {
      emit('view', item)
    }
    return {
      type,
      dataList,
      desc,
      getRole,
      img3,
      img4,
      handleDelete,
      setStyle,
      handleCopy,
      handleShare,
      handleDownload,
      handleUpload,
      handleCreate,
      handleEdit,
      handleView
    }
  },
})
</script>
<style lang="less" scoped>
.cardList{
  display: flex;
  flex-wrap: wrap;
  .cardBox{
    position: relative;
    width: 18%;
    height: 158px;
    background: var(--white-100);
    border-radius: 6px;
    box-shadow: 0 3px 4px 0 #eaeaea;
    margin: 0 1% 20px;
    flex: 0 0 auto;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    font-size: 14px;
    &.mySelfCreate{
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 15px;
      cursor: pointer;
      border: 1px dashed rgba(137,85,181,.45);
      &:hover{
        border-color: rgba(137, 85, 181, 0.1);
        box-shadow: 0 5px 9px 0 var(--black-0-7);
      }
      .operate-btn{
        height: 50%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        color: var(--primary-color);
        span{
          margin-right: 10px;
        }
        &:first-of-type{
          border-bottom: 1px dashed rgba(137,85,181,.45);
        }
      }
    }
    .cardPic{
      height: 118px;
      position: relative;
      cursor: pointer;
      img{
        height: 100%;
        width: 100%;
      }
      .info{
        position: absolute;
        left: 0;
        right: 0;
        top:10px;
        bottom: 15px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        color: var(--white-100);
        .title{
          text-align: center;
          word-break: break-all;
          font-size: 16px;
        }
      }
    }
    .cardfoot{
      flex:1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      span{
        display: inline-block;
        width: 100%;
        text-align: center;
        color: #898989;
        vertical-align: middle;
        cursor: pointer;
        &:hover{
          color: var(--primary-color);
        }
        &:not(:last-child){
          border-right: 1px solid #ececec;
        }
      }
      .toolTip{
        display: inline-block !important;
        width: 72px !important;
        line-height: 30px !important;
        cursor: pointer !important;
        color: #898989 !important;
      }
    }
  }
}
:deep(.ant-tooltip-content) {
  .ant-tooltip-inner {
    color: red
  }
}
</style>
