import extStorage from "src/utils/extStorage";
const { lStorage,sStorage } = extStorage;
const role = lStorage.get("role") || 3;
// 教师首页
let teacherHome={
  icon: "icon-shouye1",
  id: 189,
  name: "首页",
  parent_id: 0,
  sort: 89,
  url: "/teacher/home",
  children: [],
};
 //论坛
let forum={
  children: [],
  icon: "icon-jiaoliu1",
  id: 169,
  // name: "论坛",
  name:['','交流问答','学习问答','学习交流',''][role-1],
  parent_id: 0,
  sort: 9,
  url: "/teacher/teacherForum?currentTab=0",
}
// 实验中心
let center = {
  icon: "icon-shiyan2",
  id: 170,
  name: "实验中心",
  parent_id: 0,
  sort: 3,
  url: "",
  children: [
    {
      children: [],
      icon: "",
      id: 1148,
      name: "实验资源库",
      parent_id: 161,
      sort: 1,
      url: "/teacher/teacherExperimentResourcePool?currentTab=0",
    },
    {
      children: [],
      icon: "",
      id: 1149,
      name: "镜像资源库",
      parent_id: 161,
      sort: 2,
      url: "/teacher/teacherImageResourcePool",
    },
  ],
};
// 素材资源
let material = {
  icon:'icon-sucai1',
  id: 170,
  name: "素材资源",
  parent_id: 0,
  sort: 3,
  url: "/teacher/teacherMaterialResource?currentTab=0",
  children: [],
};
// 教师课程
let teacherCourse={
  icon: "icon-jiaoxue",
  id: 180,
  name: "教学过程",
  parent_id: 0,
  sort: 3,
  url: "",
  children:[
    {
      children: [],
      icon: "",
      id: 1148,
      name: "我的教学",
      parent_id: 161,
      sort: 1,
      url: "/teacher/teacherCourse?currentTab=0",
    },
    {
      children: [],
      icon: "",
      id: 1148,
      name: "公开课程",
      parent_id: 161,
      sort: 1,
      url: "/teacher/teacherCourse?currentTab=1",
    },
    {
      children: [],
      icon: "",
      id: 1148,
      name: "课程安排",
      parent_id: 161,
      sort: 1,
      url: "/teacher/coursePlan",
    },
    {
      children: [],
      icon: "",
      id: 1148,
      name: "教学质量",
      parent_id: 161,
      sort: 1,
      url: "/teacher/teachingQuality",
    }
  ]
}
// 教师考试作业
let ExamAssignment={
  icon: "icon-jiaoxue",
  id: 182,
  name: "考试作业",
  parent_id: 0,
  sort: 3,
  url: "",
  children:[
    {
      children: [],
      icon: "",
      id: 1247,
      name: "题 库",
      parent_id: 161,
      sort: 1,
      url: "/teacher/QuestionBank?currentTab=0",
    },
    {
      children: [],
      icon: "",
      id: 1248,
      name: "作 业",
      parent_id: 161,
      sort: 1,
      url: "/teacher/teacherAssignment",
    },
    {
      children: [],
      icon: "",
      id: 1249,
      name: "考 试",
      parent_id: 161,
      sort: 1,
      url: "/teacher/teacherExamination",
    },
  ]
}
// 管理端首页
let adminHome={
  icon: "icon-shouye1",
  id: 119,
  name: "首页",
  parent_id: 0,
  sort: 89,
  url: "/admin/home",
  children: [],
}
//管理端 教学资源管理
let TeachingResourceManagement={
  icon: "icon-jiaoxue",
  id: 175,
  name: "教学资源管理",
  parent_id: 0,
  sort: 5,
  url: "",
  children: [
    {
      children: [],
      icon: "",
      id: 1148,
      name: "方向规划",
      parent_id: 162,
      sort: 1,
      url: "/admin/TeachingResourceManagement/DirectionPlanning",
    },
    {
      children: [],
      icon: "",
      id: 1148,
      name: "课程管理",
      parent_id: 162,
      sort: 1,
      url: "/admin/TeachingResourceManagement/courseManagement",
    },
    {
      children: [],
      icon: "",
      id: 1148,
      name: "实验管理",
      parent_id: 162,
      sort: 1,
      url: "/admin/TeachingResourceManagement/experimentManagement",
    },
    {
      children: [],
      icon: "",
      id: 1148,
      name: "素材资源管理",
      parent_id: 162,
      sort: 1,
      url: "/admin/TeachingResourceManagement/resourcesManagement",
    },
    {
      children: [],
      icon: "",
      id: 1148,
      name: "镜像管理",
      parent_id: 162,
      sort: 1,
      url: "/admin/TeachingResourceManagement/mirrorImageManagement",
    },
  ],
}
// 管理端系统维护
let systemMaintenance={
  icon: "icon-weihu",
  id: 135,
  name: "系统维护",
  parent_id: 0,
  sort: 5,
  url: "",
  children:[
    {
      children: [],
      icon: "",
      id: 1135,
      name: "磁盘管理",
      parent_id: 131,
      sort: 1,
      url: "/admin/systemMaintenance/diskManagement",
    },
    {
      children: [],
      icon: "",
      id: 1136,
      name: "系统授权",
      parent_id: 132,
      sort: 1,
      url: "/admin/systemMaintenance/systemAuthorization",
    },
    {
      children: [],
      icon: "",
      id: 1137,
      name: "个性化设置",
      parent_id: 133,
      sort: 1,
      url: "/admin/systemMaintenance/personalization",
    },
    {
      children: [],
      icon: "",
      id: 1138,
      name: "用户登录信息",
      parent_id: 162,
      sort: 1,
      url: "/admin/systemMaintenance/userloginInformation",
    },
  ]
}
//管理端用户管理
let adminUserManagement={
  icon: "icon-yonghuguanli",
  id: 135,
  name: "用户管理",
  parent_id: 0,
  sort: 5,
  url: "",
  children:[
    {
      children: [],
      icon: "",
      id: 1135,
      name: "教师管理",
      parent_id: 131,
      sort: 1,
      url: "/admin/adminUserManagementTeach",
    },
    {
      children: [],
      icon: "",
      id: 1135,
      name: "学生管理",
      parent_id: 131,
      sort: 1,
      url: "/admin/adminUserManagementStudent",
    },
  ]
}
//管理管资源预约-排课
let coursePlan={
  icon: "icon-zuoyekaoshi1",
  id: 135,
  name: "资源预约",
  parent_id: 0,
  sort: 5,
  url: "/teacher/coursePlan",
  children: [],
}

// 学生首页
let statistics={
  icon: "icon-shouye1",
  id: 189,
  name: "首页",
  parent_id: 0,
  sort: 89,
  url: "/student/statistics",
  children: [],
}
//  学生课程
let studentCourse={
  icon: "icon-jiaoxue",
  id: 188,
  name: "学生课程",
  parent_id: 0,
  sort: 88,
  url: "/student/studentCourse",
  children: [],
}
//  学生作业
let studentAssignment={
  icon: "icon-jiaoxue",
  id: 128,
  name: "作业",
  parent_id: 0,
  sort: 88,
  url: "/student/studentAssignment",
  children: [],
}
//  学生考试
let studentExamination={
  icon: "icon-jiaoxue",
  id: 129,
  name: "考试",
  parent_id: 0,
  sort: 88,
  url: "/student/studentExamination",
  children: [],
}
export default function menusFn(){
  const role = lStorage.get("role") || 3;
  if(role === 5){
    teacherCourse.children.splice(3,1)
  }
  let menus:any={
    1:[],
    2:[adminHome,systemMaintenance,TeachingResourceManagement,adminUserManagement,coursePlan,forum],
    3:[teacherHome,center,material,teacherCourse,ExamAssignment,forum],
    4:[statistics,forum,studentCourse,studentAssignment,studentExamination],
    5:[center,material,teacherCourse,ExamAssignment]
  }
  // console.log(role)
  return menus[role]
}
