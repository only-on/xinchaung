import * as echarts from "echarts"
import choiceImg from "src/assets/exam/choice.png"
import judgementImg from "src/assets/exam/judgement.png"
import completionImg from "src/assets/exam/completion.png"
import shortAnswerImg from "src/assets/exam/shortAnswer.png"
import shicaoImg from "src/assets/exam/shicao.png"
import {theme} from "src/utils/theme"
// 成绩详情分布图
function scoreDetailEcharts(el: HTMLDivElement, data: Array<any>) {
    const my_score:Array<number>=[]
    const average_score:Array<number>=[]
    const xNames:Array<string>=[]
    data.forEach((item)=>{
        my_score.push(item.my_score)
        average_score.push(item.avg_score)
        xNames.push(item.question_type)
    })
    
    const chart = echarts.init(el)
    let options = {
        grid: {
            top: '20%',
            left: '0%',
            right: '0%',
            bottom: '10%',
            // containLabel: true
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
                shadowStyle: {
                    color: '#ceccdf',
                }
            },
            extraCssText: 'width:160px;height:90px;',
            backgroundColor: "rgba(30, 30, 30,0.8)",
            borderWidth: '0',
            textStyle: {
                color: '#fff'
            }
        },
        legend: {
            data: ['我的成绩', '平均分'],
            itemWidth: 28,
            itemHeight: 13,
            right: 10,
        },
        xAxis: [
            {
                data: xNames,
                type: 'category',
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    inside: false,
                    textStyle: {
                        color: '#6c6e72',
                        fontSize: '14'
                    },

                },
                itemStyle: {
                    normal: {
                        color: 'red',
                        emphasis: {
                            color: 'red',
                        }
                    }
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisTick: { show: false },
                interval: 50,
                itemStyle: {
                    normal: {
                        color: 'red',
                        emphasis: {
                            color: 'red',
                        }
                    }
                }
            }
        ],
        series: [
            {
                name: '我的成绩',
                type: 'bar',
                itemStyle: {
                    color: theme.themeColor,
                    normal: {
                        show: true,
                        color: theme.themeColor,
                        barBorderRadius: 5
                    }
                },
                zlevel: 2,
                barWidth: 28,
                label: {
                    show: true,
                    position: ['0', '-20'],
                    distance: 5,
                    formatter: '{c}' + '分',
                    color: theme.themeColor
                },
                data: my_score
            },
            {
                name: '平均分',
                type: 'bar',
                itemStyle: {
                    normal: {
                        show: true,
                        color: theme.nextThemeColor,
                        barBorderRadius: 5
                    }
                },
                zlevel: 1,
                barWidth: 28,
                label: {
                    show: true,
                    color: '#6C6E72',
                    position: ['0', '-20'],
                    formatter: '{c}' + '分'
                },
                data: average_score
            }
        ]
    }
    chart.setOption(options)
    return chart;
}

function accuracyEcharts(el: HTMLDivElement, data: any) {
    const rates:Array<number>=[]
    const xAxisData:Array<string>=[]
    data.forEach((item:any) => {
        rates.push(item.rate)
        xAxisData.push(item.question_type)
    });
    let accuracyChart = echarts.init(el)
    var series = [{
        name: '条',
        type: 'bar',
        xAxisIndex: 0,
        data: rates,
        barWidth: 12,
        label: {
            show: true,
            position: ['8', '-12'],
            distance: 5,
            formatter: function (parms: any) {
                return '{b|}' + '{d|>}' + (parms.value - 16) + '%'
            },
            rich: {
                d: { //箭头
                    color: theme.themeColor,
                },
                c: {
                    color: '#07a387',
                    align: 'left',
                },
                b: { //横线
                    width: 20,
                    height: 0,
                    borderWidth: 1,
                    borderColor: theme.themeColor,
                    align: 'left'
                },
            },
            textStyle: {
                color: theme.themeColor,
            }
        },
        itemStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: theme.themeColor // 0% 处的颜色
                }, {
                    offset: 1,
                    color: theme.themeColor // 100% 处的颜色
                }], false),
                barBorderRadius: [10, 10, 0, 0],
            }
        },
        z: 2
    },
    {
        name: '外框',
        type: 'bar',
        xAxisIndex: 2,
        barGap: '-100%',
        data: [130, 130, 130, 130, 130],
        barWidth: 28,
        itemStyle: {
            normal: {
                color: theme.nextThemeColor,
                barBorderRadius: [30, 30, 0, 0],
            }
        },
        z: 0
    },
    {
        name: '圆',
        type: 'scatter',
        hoverAnimation: false,
        data: [0, 0, 0, 0, 0],
        xAxisIndex: 0,
        symbolSize: 48,
        itemStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: theme.themeColor
                },
                {
                    offset: 1,
                    color: theme.nextThemeColor
                }
                ]),
                opacity: 1,
            }
        },
        label: {
            show: true,
            formatter: function (params: any) {
                switch (params.name) {
                    case '选择题': return '{a|}';
                    case '判断题': return '{b|}';
                    case '填空题': return '{c|}';
                    case '简答题': return '{d|}';
                    case '实操考核': return '{e|}';
                }
            },
            rich: {
                a: {
                    backgroundColor: {
                        image: window.location.origin + choiceImg
                    },
                    height: 24
                },
                b: {
                    backgroundColor: {
                        image: window.location.origin + judgementImg
                    },
                    height: 20
                },
                c: {
                    backgroundColor: {
                        image: window.location.origin + completionImg
                    },
                    height: 24
                },
                d: {
                    backgroundColor: {
                        image: window.location.origin + shortAnswerImg
                    },
                    height: 24
                },
                e: {
                    backgroundColor: {
                        image: window.location.origin + shicaoImg
                    },
                    height: 24
                }
            }
        },
        z: 2
    },
    {
        name: '外圆',
        type: 'scatter',
        hoverAnimation: false,
        data: [0, 0, 0, 0, 0],
        xAxisIndex: 2,
        symbolSize: 60,
        itemStyle: {
            normal: {
                color: theme.nextThemeColor,
                opacity: 1,
            }
        },
        z: 0
    }
    ];

    var AccuracyOption = {
        backgroundColor: 'transparent',
        boundaryGap: false,
        grid: {
            left: '0%',
            right: '10%',
            bottom: '0%',
            top: '0%',
            containLabel: true
        },
        tooltip: {
            show: false,
            trigger: 'item',
            padding: [8, 10], //内边距
            formatter: '{b}<br />正确率: {c0}%',
        },
        xAxis: [{
            type: 'category',
            axisTick: {
                show: false
            },
            axisLine: {
                show: false,
            },
            axisLabel: {
                textStyle: {
                    color: '#6c6e72',
                    fontSize: '14',
                },
                margin: 40,
            },
            data: xAxisData
        },
        {
            type: 'category',
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                show: false
            },
            splitArea: {
                show: false
            },
            splitLine: {
                show: false
            },
            data: xAxisData
        },
        {
            type: 'category',
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                show: false
            },
            splitArea: {
                show: false
            },
            splitLine: {
                show: false
            },
            data: xAxisData
        }, {
            show: false,
            min: -110,
            max: 100,

        }],
        yAxis: [{
            show: false,
            min: 0,
            max: 130,
        }, {
            show: false,
            data: [],
            min: 0,
            max: 130,
        }],
        series: series

    };
    accuracyChart.setOption(AccuracyOption)
    return accuracyChart
}

export {
    scoreDetailEcharts,
    accuracyEcharts
}

export default {
    scoreDetailEcharts,
    accuracyEcharts
}