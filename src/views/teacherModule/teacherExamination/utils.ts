// 正整数验证
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
// 编程题相似度
export const simList = [
  {
    value: 60,
    label: "60%",
  },
  {
    value: 70,
    label: "70%",
  },
  {
    value: 80,
    label: "80%",
  },
  {
    value: 90,
    label: "90%",
  },
  {
    value: 100,
    label: "100%",
  },
];
// 防作弊设置
export const initialData = {
  topic_chaotic: false,
  options_chaotic: false,
  no_copy: false,
  no_switch: false,
  no_quit: false,
  face_verify: false,
  dystropic: false
}
