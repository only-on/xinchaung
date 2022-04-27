<template>
    <div class="home">
        <div class="entrance">
            <div class="entrance-left">
                <div class="title">快捷入口</div>
                <div class="entranceCon">
                    <div class="enterItem" v-for="(item,index) in enterNumber1" :key="index.toString()">
                        <div>
                            <img :src="item.img">
                        </div>
                        <div class="courseNumber">{{item.course}}</div>
                        <div class="number">{{item.number}}</div>
                    </div>
                </div>
            </div>
            <div class="entrance-right">
                <div class="title">快捷入口</div>
                <div class="entranceCon">
                    <div class="enterItem" v-for="(item,index) in enterNumber2" :key="index.toString()">
                        <div>
                            <img :src="item.img">
                        </div>
                        <div class="courseNumber">{{item.course}}</div>
                        <div class="number">{{item.number}}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="activity">
            <div class="activity-left">

            </div>
            <div class="activity-right">

            </div>
        </div>
        <div class="platformResources">
                资源
        </div>
        <div class="serverNode">
            <div class="serverNode-left">

            </div>
            <div class="serverNode-right">

            </div>
        </div>
        <div class="bottomInfo">
            <div class="productinfo"></div>
            <div class="quickEntrance"></div>
        </div>
        <div class="aboutXiPu">

        </div>
    </div>
</template>
<script lang='ts' setup>
    import { defineComponent, ref, reactive, onMounted, toRefs, inject, watch } from "vue";
    var configuration: any = inject("configuration");
    var updata = inject("updataNav") as Function;
    updata({ tabs: [], showContent: true, showNav: false });
    import img1 from 'src/assets/images/admin/home/1.png'
    import img2 from 'src/assets/images/admin/home/2.png'
    import img3 from 'src/assets/images/admin/home/3.png'
    import img4 from 'src/assets/images/admin/home/4.png'
    import img5 from 'src/assets/images/admin/home/5.png'
    import img6 from 'src/assets/images/admin/home/6.png'

    const enterNumber1:any=ref([])
    const enterNumber2:any=ref([])
    enterNumber1.value=[
        {
        img:img1,
        course:'课程门数',
        number:'200',
        link:''
        },{
        img:img2,
        course:'实验数',
        number:'10',
        link:''
        },{
        img:img3,
        course:'素材数',
        number:'80',
        link:''
        }
    ];
    enterNumber2.value=[
        {
        img:img4,
        course:'教师数',
        number:'200',
        link:''
        },{
        img:img5,
        course:'学生数',
        number:'10',
        link:''
        },{
        img:img6,
        course:'预约人数',
        number:'80',
        link:''
        }
    ]
</script>
<style lang="less" scoped>
.entrance{
    display: flex;
    justify-content: space-between;
    .entrance-left,.entrance-right{
        padding: 20px;
        color: var(--white-100);
        width: 49%;
        height:247px;
        .title{
            color: var(--white-100);
            font-size: 18px;
        }
        .entranceCon{
            display: flex;
            justify-content: space-between;
            padding: 30px;
        }
        .number{
            font-weight:20px;
            font-weight: bold;
            margin-top: 10px;
        }
        .courseNumber{
            margin-top: 10px;
        }
        .enterItem{
            text-align: center;
        }
    }
    .entrance-left{
        background-image: url('src/assets/images/admin/home/enter.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }
    .entrance-right{
        background-image: url('src/assets/images/admin/home/enter1.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }
}
.activity{
    display: flex;
    justify-content: space-between;
    margin-top: 20px;

    .activity-left{
        width: 65%;
        height: 480px;
        background-color: var(--white-100);
    }
    .activity-right{
        width: 33%;
        height: 480px;
        background-color: var(--white-100);
    }
}
.platformResources{
    margin-top: 20px;
    height: 360px;
    background-color: var(--white-100);
}
.serverNode{
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    .serverNode-left,.serverNode-right{
        width: 49%;
        height: 359px;
        background-color: var(--white-100);
    }
}
.bottomInfo{
    width: 100%;
    height:204px;
    background-color:#192843;
    margin-top: 40px;
}
.aboutXiPu{
    width: 100%;
    height:70px;
    background-color:#131F34;
}
</style>