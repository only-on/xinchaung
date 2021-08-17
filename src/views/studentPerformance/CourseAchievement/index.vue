<template>
    <div id="CourseAchievement">
        <div class="searchInput">
            <a-input-search style="width:503px;padding:8px 5px 8px 30px" placeholder="请输入课程名称关键字查询" @search="onSearch"/>
        </div>
        <div class="content-list">
            <div class="itemlist" v-for="(item,index) in courseDataList" :key="index">
                <div class="card-pic">
                   <img src="../../../assets/images/d3.jpg" alt="">
                </div>
                <div class="card-mask">
                    <div class="state-desc">{{item.name}}</div>
                </div>
                <div class="card-info">
                    <h3 class="card-info-top">{{item.name}}</h3>
                    <div class="card-info-time">起止时间:{{item.time}}</div>
                    <div class="card-info-status">课程状态:{{item.status}}</div>
                    <div class="check-score">查看成绩</div>
                </div>
            </div>
        </div>

    </div>
</template>
<script lang="ts">
import {defineComponent, reactive,toRefs} from 'vue'
interface CourseType{
    name?:string;
    index?:string;
    time?:string;
    status?:string;
}
interface State{
    courseDataList:CourseType[];
}
export default defineComponent({
    name:'CourseAchievement',
    setup:(props,context)=>{
         const state: State=reactive({
             courseDataList:[
                { name:'1111',index:'1',time:'233',status:'进行中'},
                { name:'1111',index:'2',time:'233',status:'进行中'},
                { name:'1111',index:'3',time:'233',status:'进行中'}, 
                { name:'1111',index:'4',time:'233',status:'进行中'},
                { name:'1111',index:'5',time:'233',status:'进行中'},
                { name:'1111',index:'6',time:'233',status:'进行中'},
                { name:'1111',index:'7',time:'233',status:'进行中'},
            ]
         })
        function onSearch(value:string){
            console.log(value,'oooooooooooooo')
        }
         return {onSearch,...state}
    }
})
</script>
<style lang="less" scoped>
.searchInput{
    height: 100px;
    line-height: 100px;
}
.content-list{
    display: flex;
    flex-wrap: wrap;
    .itemlist{
        width:24%;
        margin-bottom: 30px;
        background-color: white;
          position:relative;
        .card-pic{
            height: 166px;
            width: 100%;
            img{
                width: 100%;
                height: 100%;
            }
        }
        .card-mask{
            position:absolute;
            left: 0;
            top: 0;
            background-color:rgba(47, 40, 21, 0.73);
            height: 166px;
            z-index: 20;
            width: 100%;
            display: none;
            text-align:center;
            .state-desc{
                line-height: 166px;
                color: white;
            }
        }
        .card-info{
            padding: 15px;
            .card-info-top{
                color: #050101;
                font-size: 17px;
                width: 100%;
                white-space: nowrap;
                text-overflow: ellipsis;
                display: inline-block;
                overflow: hidden;
            }
            .card-info-time{
                min-height: 25px;
            }
            .card-info-status{
                min-height: 25px;
            }
        }
    }
    .itemlist:hover{
        .card-mask{
            display: block;
        }
    }
    .itemlist:nth-child(n){
        margin-right: 1%;
    }
    .itemlist:nth-child(2n){
        margin-right: 1%;
    }
    .itemlist:nth-child(3n){
        margin-right: 1%;
    }
}
</style>