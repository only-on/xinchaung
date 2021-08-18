<template>
    <div id="CourseAchievement">
        <div class="searchInput">
            <a-input-search style="width:503px;padding:8px 5px 8px 30px" placeholder="请输入课程名称关键字查询" @search="onSearch"/>
        </div>
        <div class="content-list">
            <div class="itemlist" v-for="(item,index) in courseDataList" :key="index">
                <div class="card-pic">
                   <img src="../../../assets/images/stuAchievement/d3.jpg" alt="">
                </div>
                <div class="card-mask" @click="lookScore">
                    <div class="state-desc">{{item.name}}</div>
                </div>
                <div class="card-info">
                    <h3 class="card-info-top">{{item.name}}</h3>
                    <div class="card-info-time">起止时间:{{item.time}}</div>
                    <div class="card-info-status">课程状态:{{item.status}}</div>
                    <div class="check-score">
                        <span><img src="../../../assets/images/stuAchievement/teacher.png" alt="" srcset="">{{item.teacher}}</span>
                        <span class="look-score" @click="lookScore">查看成绩</span>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>
<script lang="ts">
import {defineComponent, reactive,toRefs} from 'vue'
import {useRouter} from 'vue-router'
interface CourseType{
    name?:string;
    index?:string;
    time?:string;
    status?:string;
    teacher?:string;
}
interface State{
    courseDataList:CourseType[];
}
export default defineComponent({
    name:'CourseAchievement',
    setup:(props,context)=>{
        const router=useRouter()
         const state: State=reactive({
             courseDataList:[
                { name:'1111',index:'1',time:'233',status:'进行中',teacher:'1223'},
                { name:'1111',index:'2',time:'233',status:'进行中',teacher:'sihaif'},
                { name:'1111',index:'3',time:'233',status:'进行中',teacher:'ddd'}, 
                { name:'1111',index:'4',time:'233',status:'进行中',teacher:'cdcd'},
                { name:'1111',index:'5',time:'233',status:'进行中',teacher:'deuh'},
                { name:'1111',index:'6',time:'233',status:'进行中',teacher:'1223'},
                { name:'1111',index:'7',time:'233',status:'进行中',teacher:'1223'},
            ]
         })
        function onSearch(value:string){
            console.log(value,'oooooooooooooo')
        }
        function lookScore(){
            router.push({path:'/courseScore'})
        }
         return {onSearch,lookScore,...state}
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
        box-shadow:0px 2px 4px 0px rgba(0,0,0,0.14);
        border-radius: 6px;
        .card-pic{
            height: 166px;
            width: 100%;
            img{
                width: 100%;
                height: 100%;
                border-top-left-radius: 6px;
                border-top-right-radius: 6px;
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
            border-top-left-radius: 6px;
            border-top-right-radius: 6px;
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
            .check-score{
                display: flex;
                justify-content: space-between;
                img{
                    width: 24px;
                    height: 24px;
                    margin-right: 8px;
                }
                .look-score{
                    color: #8955B5;
                    cursor: pointer;
                }
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