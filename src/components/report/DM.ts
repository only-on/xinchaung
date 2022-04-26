import { WidgetDataModelMap, WidgetModel } from './templateTyping'
import { genFieldName } from './utils'

export const DM1: WidgetModel = {
  type: 'w1',
  fields: [
    {
      name: genFieldName('w1', 'tt', 1),
      value: '',
      placeholder: '题目描述',
      readonly: false,
      align: 'left',
      colspan: 4,
    },
  ],
  toolbar: true,
}

export const DM2: WidgetModel = {
  type: 'w2',
  fields: [
    {
      name: genFieldName('w2', 'st', 1),
      value: '',
      readonly: false,
      placeholder: '题目',
      align: 'left',
    },
    {
      name: genFieldName('w2', 'ct', 1),
      value: '',
      readonly: false,
      placeholder: '答案',
      align: 'left',
      colspan: 3,
    },
  ],
  toolbar: true,
}

export const DM3: WidgetModel = {
  type: 'w3',
  fields: [
    {
      name: genFieldName('w3', 'st', 1),
      value: '',
      readonly: false,
      placeholder: '题目',
      align: 'left',
    },
    {
      name: genFieldName('w3', 'ct', 1),
      value: '',
      readonly: false,
      placeholder: '答案',
      align: 'left',
    },
    {
      name: genFieldName('w3', 'st', 2),
      value: '',
      readonly: false,
      placeholder: '题目',
      align: 'left',
    },
    {
      name: genFieldName('w3', 'ct', 2),
      value: '',
      readonly: false,
      placeholder: '答案',
      align: 'left',
    },
  ],
  toolbar: true,
}

export const DM4: WidgetModel = {
  type: 'w4',
  fields: [
    {
      name: genFieldName('w4', 'st', 1),
      value: '',
      readonly: false,
      placeholder: '题目描述',
      align: 'left',
    },
    {
      name: genFieldName('w4', 'ct', 1),
      value: '',
      readonly: false,
      placeholder: '答案',
      align: 'left',
    },
  ],
  toolbar: true,
}

export const DM5: WidgetModel = {
  type: 'w5',
  fields: [
    {
      name: genFieldName('w5', 'st', 1),
      value: '',
      readonly: false,
      placeholder: '题目',
      align: 'left',
    },
    {
      name: genFieldName('w5', 'ct', 1),
      value: '',
      readonly: false,
      placeholder: '答案',
      align: 'left',
    },
  ],
  toolbar: true,
}

export const DM6: WidgetModel = {
  type: 'w6',
  fields: [
    {
      name: genFieldName('w6', 'st', 1),
      value: '',
      readonly: false,
      placeholder: '题目描述',
      align: 'left',
    },
    {
      name: genFieldName('w6', 'ct', 1),
      value: '',
      readonly: false,
      placeholder: '答案',
      align: 'left',
    },
  ],
  toolbar: true,
}

export const DM7: WidgetModel = {
  type: 'w7',
  fields: [
    {
      name: genFieldName('w7', 'st', 1),
      value: '',
      readonly: false,
      placeholder: '题目',
      align: 'left',
    },
    {
      name: genFieldName('w7', 'ct', 1),
      value: '',
      readonly: false,
      placeholder: '答案',
      align: 'left',
    },
  ],
  toolbar: true,
}

export const DM8: WidgetModel = {
  type: 'w8',
  fields: [
    {
      name: genFieldName('w8', 'st', 1),
      value: '',
      readonly: false,
      placeholder: '题目描述',
      align: 'left',
    },
    {
      name: genFieldName('w8', 'ct', 1),
      value: '',
      readonly: false,
      placeholder: '答案',
      align: 'left',
    },
  ],
  toolbar: true,
}

export const widgetDataModel: WidgetDataModelMap = {
  w1: DM1,
  w2: DM2,
  w3: DM3,
  w4: DM4,
  w5: DM5,
  w6: DM6,
  w7: DM7,
  w8: DM8,
}
