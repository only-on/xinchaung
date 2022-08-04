export const validateNum = {
  validator: async (rule: any, value: string) => {
    let validateor = /^([1-9]{1}[0-9]*|0)$/;
    if (!validateor.test(value)) {
      return Promise.reject("请输入正整数");
    } else {
      return Promise.resolve();
    }
  },
  trigger: "blur",
};
