import request from "./fetch.js";
// import qs from 'qs';
function GetRequest (){
    this.server=request
    this.nowHandle=null;
}
GetRequest.prototype.v=function(context){
  this.nowHandle=context;
  return this;
}
GetRequest.prototype.parseRouter=function(moduleName,obj){
  var moduleFun=this[moduleName]={}
  Object.keys(obj).forEach((item)=>{
    moduleFun[item]=this.sendServe.bind(this,moduleName,item,obj[item]);
      this[moduleName][item].customState='await';     
  })
}


GetRequest.prototype.sendServe=function(modulename,name,init,config){
  var bindName=config.bindName?config.bindName:'';                  // 传组件内的一个引用类型的字段  此字段会被直接赋值为res.data  使用此选项需先在组件内调用 serve.v(this)   // this 为上下文对象或引用值对象
  var concurrent=config.concurrent?config.concurrent:false          // 相同接口是否需要并发请求     
  var param=config.param||{};                                       //  调用接口需要的参数 格式为param
  var dataType=init.dataType?init.dataType:'urlencoded'             //  请求接口参数的数据格式   可选JSON   TEXT  FORMDATA
  var url=init.url                                                  // 接口地址
  var method=init.method                                            //  请求方式 
  var success=config.success?config.success:''                      //  自定义function 请求成功的回调
  var self=this;
  var defaultFn=function(response){
    if(bindName!=''){
      self.nowHandle[bindName]=response.data;
    }else{

    }
    return response
  };
  var successFun=success || defaultFn;
  var callback=function(response){
    self[modulename][name].customState='await'
    successFun(response);
    return response
  }
  if(self[modulename][name].customState=='await' || concurrent){
    self[modulename][name].customState='end';
    return request({
      url:url,
      method:method,
      body:param,
      dataType:dataType
    })
    .then(callback)
  }
  
}

export default new GetRequest()