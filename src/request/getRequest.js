import serve from "./fetch.js";
// import qs from 'qs';
function MyServer (){
    this.server=serve
    this.nowHandle=null;
}
MyServer.prototype.v=function(context){
  this.nowHandle=context;
  return this;
}
MyServer.prototype.parseRouter=function(moduleName,obj){
  var moduleFun=this[moduleName]={}
  Object.keys(obj).forEach((item)=>{
    moduleFun[item]=this.sendServe.bind(this,moduleName,item,obj[item]);
      this[moduleName][item].customState='await';     
  })
}


MyServer.prototype.sendServe=function(modulename,name,initUrl,config){
  var bindName=config.bindName?config.bindName:'';                  // 传组件内的一个引用类型的字段  此字段会被直接赋值为res.data  使用此选项需先在组件内调用 serve.v(this)   // this 为上下文对象或引用值对象
  var concurrent=config.concurrent?config.concurrent:false          // 相同接口是否需要并发请求
  var param=config.param||{};                                       //  调用接口需要的参数 格式为param
  var dataType=initUrl.dataType?initUrl.dataType:'urlencoded'       //  请求接口参数的数据格式   可选JSON   TEXT  FORMDATA
  var url=initUrl.url                                               // 接口地址
  var method=initUrl.method                                         //  请求方式 
  var self=this;
  var defaultFn=function(response){
    if(bindName!=''){
      self.nowHandle[bindName]=response.data;
    }else{

    }
    return response
  };
  var success=config.success || defaultFn;
  var callback=function(response){
    self[modulename][name].customState='await'
    success(response);
    return response
  }
  if(self[modulename][name].customState=='await' || concurrent){
    self[modulename][name].customState='end';
    return serve({
      url:url,
      method:method,
      body:param,
      dataType:dataType
    })
    .then(callback)
  }
  
}

export default new MyServer()