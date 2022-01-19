function isArray(value:any) {
  return Array.isArray
    ? Array.isArray(value)
    : window.toString.call(value) === "[object Array]";
}
function isObject(value:any) {
  return window.toString.call(value) === "[object Object]";
}
function isFunc(value:any) {
  return (
    window.toString.call(value) === "[object Function]" ||
    typeof value === "function"
  );
}
/**
 * sessionStorage,localStorage 简单包装
 * 支持 array Object 但不支持 function
 * @param {String} type
 * return Object
 */
function extStorage(type:any) {
  // if (["sessionStorage", "localStorage"].includes(type)) {
    const typeStorage:any=window[type]
    return {
      get(key:any) {
        let saveData = typeStorage.getItem(key);
        try {
          return JSON.parse(saveData);
        } catch (error) {
          return saveData || null;
        }
      },
      set(key:any, data:any) {
        // 检查保存数据是否为 array 或 object 将其转化为json字符串进行保存
        if (isArray(data) || isObject(data)) {
          // 去掉 function 情况
          !isFunc(data) && typeStorage.setItem(key, JSON.stringify(data));
        } else {
          typeStorage.setItem(key, data);
        }
      },
      del(key:any) {
        typeStorage.removeItem(key);
      },
      clean() {
        typeStorage.clear();
      },
    };
  // }
}

export default {
  sStorage: extStorage("sessionStorage"),
  lStorage: extStorage("localStorage"),
};

