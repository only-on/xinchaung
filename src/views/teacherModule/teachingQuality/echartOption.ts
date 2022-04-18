let option:any= {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        }
      }
    },
    legend: {
      data: ['Precipitation', 'Temperature']
    },
    xAxis: [
      {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisPointer: {
          type: 'shadow'
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: 'Precipitation',
        min: 0,
        max: 250,
        interval: 50,
        axisLabel: {
          formatter: '{value} ml'
        }
      },
      {
        type: 'value',
        name: 'Temperature',
        min: 0,
        max: 25,
        interval: 5,
        axisLabel: {
          formatter: '{value} °C'
        }
      }
    ],
    series: [
      {
        name: 'Precipitation',
        type: 'bar',
        tooltip: {
          valueFormatter: function (value:any) {
            return value + ' ml';
          }
        },
        data: [
          2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
        ]
      },
      {
        name: 'Temperature',
        type: 'line',
        yAxisIndex: 1,
        tooltip: {
          valueFormatter: function (value:any) {
            return value + ' °C';
          }
        },
        data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
      }
    ]
  };
let option1:any = {
    title: {
      text: ''
    },
    legend: {
      data: ['Allocated Budget', 'Actual Spending']
    },
    radar: {
      // shape: 'circle',
      indicator: [
        { name: 'Sales', max: 6500 },
        { name: 'Administration', max: 16000 },
        { name: 'Information Technology', max: 30000 },
        { name: 'Customer Support', max: 38000 },
        { name: 'Development', max: 52000 },
        { name: 'Marketing', max: 25000 }
      ]
    },
    series: [
      {
        name: 'Budget vs spending',
        type: 'radar',
        data: [
          {
            value: [4200, 3000, 20000, 35000, 50000, 18000],
            name: 'Allocated Budget'
          },
          {
            value: [5000, 14000, 28000, 26000, 42000, 21000],
            name: 'Actual Spending'
          }
        ]
      }
    ]
  };
let option2:any = {
    series: [
      {
        type: 'treemap',
        data: [
          {
            name: 'nodeA',
            value: 10,
            children: [
              {
                name: 'nodeAa',
                value: 4
              },
              {
                name: 'nodeAb',
                value: 6
              }
            ]
          },
          {
            name: 'nodeB',
            value: 20,
            children: [
              {
                name: 'nodeBa',
                value: 20,
                children: [
                  {
                    name: 'nodeBa1',
                    value: 20
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };
  let option3:any = {
    title: [
      {
        text: 'Michelson-Morley Experiment',
        left: 'center'
      },
      {
        text: 'upper: Q3 + 1.5 * IQR \nlower: Q1 - 1.5 * IQR',
        borderColor: '#999',
        borderWidth: 1,
        textStyle: {
          fontWeight: 'normal',
          fontSize: 14,
          lineHeight: 20
        },
        left: '10%',
        top: '90%'
      }
    ],
    dataset: [
      {
        // prettier-ignore
        source: [
                  [850, 740, 900, 1070, 930, 850, 950, 980, 980, 880, 1000, 980, 930, 650, 760, 810, 1000, 1000, 960, 960],
                  [960, 940, 960, 940, 880, 800, 850, 880, 900, 840, 830, 790, 810, 880, 880, 830, 800, 790, 760, 800],
                  [880, 880, 880, 860, 720, 720, 620, 860, 970, 950, 880, 910, 850, 870, 840, 840, 850, 840, 840, 840],
                  [890, 810, 810, 820, 800, 770, 760, 740, 750, 760, 910, 920, 890, 860, 880, 720, 840, 850, 850, 780],
                  [890, 840, 780, 810, 760, 810, 790, 810, 820, 850, 870, 870, 810, 740, 810, 940, 950, 800, 810, 870]
              ]
      },
      {
        transform: {
          type: 'boxplot',
          config: { itemNameFormatter: 'expr {value}' }
        }
      },
      {
        fromDatasetIndex: 1,
        fromTransformResult: 1
      }
    ],
    tooltip: {
      trigger: 'item',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '10%',
      right: '10%',
      bottom: '15%'
    },
    xAxis: {
      type: 'category',
      boundaryGap: true,
      nameGap: 30,
      splitArea: {
        show: false
      },
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      name: 'km/s minus 299,000',
      splitArea: {
        show: true
      }
    },
    series: [
      {
        name: 'boxplot',
        type: 'boxplot',
        datasetIndex: 1
      },
      {
        name: 'outlier',
        type: 'scatter',
        datasetIndex: 2
      }
    ]
  };
  let graph:any={
    "nodes": [
      {
        "id": "0",
        "name": "Myriel",
        "symbolSize": 19.12381,
        "x": -266.82776,
        "y": 299.6904,
        "value": 28.685715,
        "category": 0
      },
      {
        "id": "1",
        "name": "Napoleon",
        "symbolSize": 2.6666666666666665,
        "x": -418.08344,
        "y": 446.8853,
        "value": 4,
        "category": 0
      },
      {
        "id": "2",
        "name": "MlleBaptistine",
        "symbolSize": 6.323809333333333,
        "x": -212.76357,
        "y": 245.29176,
        "value": 9.485714,
        "category": 1
      },
      {
        "id": "3",
        "name": "MmeMagloire",
        "symbolSize": 6.323809333333333,
        "x": -242.82404,
        "y": 235.26283,
        "value": 9.485714,
        "category": 1
      }
    ],
    "links": [
      {
        "source": "1",
        "target": "0"
      },
      {
        "source": "2",
        "target": "0"
      },
      {
        "source": "3",
        "target": "0"
      },
      {
        "source": "3",
        "target": "2"
      },
      {
        "source": "4",
        "target": "0"
      },
      {
        "source": "5",
        "target": "0"
      },
      {
        "source": "6",
        "target": "0"
      },
      {
        "source": "7",
        "target": "0"
      },
      {
        "source": "8",
        "target": "0"
      },
      {
        "source": "9",
        "target": "0"
      },
      {
        "source": "11",
        "target": "0"
      },
      {
        "source": "11",
        "target": "2"
      },
      {
        "source": "11",
        "target": "3"
      },
      {
        "source": "11",
        "target": "10"
      },
      {
        "source": "12",
        "target": "11"
      },
      {
        "source": "13",
        "target": "11"
      },
      {
        "source": "14",
        "target": "11"
      },
      {
        "source": "15",
        "target": "11"
      },
      {
        "source": "17",
        "target": "16"
      },
      {
        "source": "18",
        "target": "16"
      },
      {
        "source": "18",
        "target": "17"
      },
      {
        "source": "19",
        "target": "16"
      },
      {
        "source": "19",
        "target": "17"
      },
      {
        "source": "19",
        "target": "18"
      },
      {
        "source": "20",
        "target": "16"
      },
      {
        "source": "20",
        "target": "17"
      },
      {
        "source": "20",
        "target": "18"
      },
      {
        "source": "20",
        "target": "19"
      },
      {
        "source": "21",
        "target": "16"
      },
      {
        "source": "21",
        "target": "17"
      },
      {
        "source": "21",
        "target": "18"
      },
      {
        "source": "21",
        "target": "19"
      },
      {
        "source": "21",
        "target": "20"
      },
      {
        "source": "22",
        "target": "16"
      },
      {
        "source": "22",
        "target": "17"
      },
      {
        "source": "22",
        "target": "18"
      },
      {
        "source": "22",
        "target": "19"
      },
      {
        "source": "22",
        "target": "20"
      },
      {
        "source": "22",
        "target": "21"
      },
      {
        "source": "23",
        "target": "11"
      },
      {
        "source": "23",
        "target": "12"
      },
      {
        "source": "23",
        "target": "16"
      },
      {
        "source": "23",
        "target": "17"
      },
      {
        "source": "23",
        "target": "18"
      },
      {
        "source": "23",
        "target": "19"
      },
      {
        "source": "23",
        "target": "20"
      },
      {
        "source": "23",
        "target": "21"
      },
      {
        "source": "23",
        "target": "22"
      },
      {
        "source": "24",
        "target": "11"
      },
      {
        "source": "24",
        "target": "23"
      },
      {
        "source": "25",
        "target": "11"
      },
      {
        "source": "25",
        "target": "23"
      },
      {
        "source": "25",
        "target": "24"
      },
      {
        "source": "26",
        "target": "11"
      },
      {
        "source": "26",
        "target": "16"
      },
      {
        "source": "26",
        "target": "24"
      },
      {
        "source": "26",
        "target": "25"
      },
      {
        "source": "27",
        "target": "11"
      },
      {
        "source": "27",
        "target": "23"
      },
      {
        "source": "27",
        "target": "24"
      },
      {
        "source": "27",
        "target": "25"
      },
      {
        "source": "27",
        "target": "26"
      },
      {
        "source": "28",
        "target": "11"
      },
      {
        "source": "28",
        "target": "27"
      },
      {
        "source": "29",
        "target": "11"
      },
      {
        "source": "29",
        "target": "23"
      },
      {
        "source": "29",
        "target": "27"
      },
      {
        "source": "30",
        "target": "23"
      },
      {
        "source": "31",
        "target": "11"
      },
      {
        "source": "31",
        "target": "23"
      },
      {
        "source": "31",
        "target": "27"
      },
      {
        "source": "31",
        "target": "30"
      },
      {
        "source": "32",
        "target": "11"
      },
      {
        "source": "33",
        "target": "11"
      },
      {
        "source": "33",
        "target": "27"
      },
      {
        "source": "34",
        "target": "11"
      },
      {
        "source": "34",
        "target": "29"
      },
      {
        "source": "35",
        "target": "11"
      },
      {
        "source": "35",
        "target": "29"
      },
      {
        "source": "35",
        "target": "34"
      },
      {
        "source": "36",
        "target": "11"
      },
      {
        "source": "36",
        "target": "29"
      },
      {
        "source": "36",
        "target": "34"
      },
      {
        "source": "36",
        "target": "35"
      },
      {
        "source": "37",
        "target": "11"
      },
      {
        "source": "37",
        "target": "29"
      },
      {
        "source": "37",
        "target": "34"
      },
      {
        "source": "37",
        "target": "35"
      },
      {
        "source": "37",
        "target": "36"
      },
      {
        "source": "38",
        "target": "11"
      },
      {
        "source": "38",
        "target": "29"
      },
      {
        "source": "38",
        "target": "34"
      },
      {
        "source": "38",
        "target": "35"
      },
      {
        "source": "38",
        "target": "36"
      },
      {
        "source": "38",
        "target": "37"
      },
      {
        "source": "39",
        "target": "25"
      },
      {
        "source": "40",
        "target": "25"
      },
      {
        "source": "41",
        "target": "24"
      },
      {
        "source": "41",
        "target": "25"
      },
      {
        "source": "42",
        "target": "24"
      },
      {
        "source": "42",
        "target": "25"
      },
      {
        "source": "42",
        "target": "41"
      },
      {
        "source": "43",
        "target": "11"
      },
      {
        "source": "43",
        "target": "26"
      },
      {
        "source": "43",
        "target": "27"
      },
      {
        "source": "44",
        "target": "11"
      },
      {
        "source": "44",
        "target": "28"
      },
      {
        "source": "45",
        "target": "28"
      },
      {
        "source": "47",
        "target": "46"
      },
      {
        "source": "48",
        "target": "11"
      },
      {
        "source": "48",
        "target": "25"
      },
      {
        "source": "48",
        "target": "27"
      },
      {
        "source": "48",
        "target": "47"
      },
      {
        "source": "49",
        "target": "11"
      },
      {
        "source": "49",
        "target": "26"
      },
      {
        "source": "50",
        "target": "24"
      },
      {
        "source": "50",
        "target": "49"
      },
      {
        "source": "51",
        "target": "11"
      },
      {
        "source": "51",
        "target": "26"
      },
      {
        "source": "51",
        "target": "49"
      },
      {
        "source": "52",
        "target": "39"
      },
      {
        "source": "52",
        "target": "51"
      },
      {
        "source": "53",
        "target": "51"
      },
      {
        "source": "54",
        "target": "26"
      },
      {
        "source": "54",
        "target": "49"
      },
      {
        "source": "54",
        "target": "51"
      },
      {
        "source": "55",
        "target": "11"
      },
      {
        "source": "55",
        "target": "16"
      },
      {
        "source": "55",
        "target": "25"
      },
      {
        "source": "55",
        "target": "26"
      },
      {
        "source": "55",
        "target": "39"
      },
      {
        "source": "55",
        "target": "41"
      },
      {
        "source": "55",
        "target": "48"
      },
      {
        "source": "55",
        "target": "49"
      },
      {
        "source": "55",
        "target": "51"
      },
      {
        "source": "55",
        "target": "54"
      },
      {
        "source": "56",
        "target": "49"
      },
      {
        "source": "56",
        "target": "55"
      },
      {
        "source": "57",
        "target": "41"
      },
      {
        "source": "57",
        "target": "48"
      },
      {
        "source": "57",
        "target": "55"
      },
      {
        "source": "58",
        "target": "11"
      },
      {
        "source": "58",
        "target": "27"
      },
      {
        "source": "58",
        "target": "48"
      },
      {
        "source": "58",
        "target": "55"
      },
      {
        "source": "58",
        "target": "57"
      },
      {
        "source": "59",
        "target": "48"
      },
      {
        "source": "59",
        "target": "55"
      },
      {
        "source": "59",
        "target": "57"
      },
      {
        "source": "59",
        "target": "58"
      },
      {
        "source": "60",
        "target": "48"
      },
      {
        "source": "60",
        "target": "58"
      },
      {
        "source": "60",
        "target": "59"
      },
      {
        "source": "61",
        "target": "48"
      },
      {
        "source": "61",
        "target": "55"
      },
      {
        "source": "61",
        "target": "57"
      },
      {
        "source": "61",
        "target": "58"
      },
      {
        "source": "61",
        "target": "59"
      },
      {
        "source": "61",
        "target": "60"
      },
      {
        "source": "62",
        "target": "41"
      },
      {
        "source": "62",
        "target": "48"
      },
      {
        "source": "62",
        "target": "55"
      },
      {
        "source": "62",
        "target": "57"
      },
      {
        "source": "62",
        "target": "58"
      },
      {
        "source": "62",
        "target": "59"
      },
      {
        "source": "62",
        "target": "60"
      },
      {
        "source": "62",
        "target": "61"
      },
      {
        "source": "63",
        "target": "48"
      },
      {
        "source": "63",
        "target": "55"
      },
      {
        "source": "63",
        "target": "57"
      },
      {
        "source": "63",
        "target": "58"
      },
      {
        "source": "63",
        "target": "59"
      },
      {
        "source": "63",
        "target": "60"
      },
      {
        "source": "63",
        "target": "61"
      },
      {
        "source": "63",
        "target": "62"
      },
      {
        "source": "64",
        "target": "11"
      },
      {
        "source": "64",
        "target": "48"
      },
      {
        "source": "64",
        "target": "55"
      },
      {
        "source": "64",
        "target": "57"
      },
      {
        "source": "64",
        "target": "58"
      },
      {
        "source": "64",
        "target": "59"
      },
      {
        "source": "64",
        "target": "60"
      },
      {
        "source": "64",
        "target": "61"
      },
      {
        "source": "64",
        "target": "62"
      },
      {
        "source": "64",
        "target": "63"
      },
      {
        "source": "65",
        "target": "48"
      },
      {
        "source": "65",
        "target": "55"
      },
      {
        "source": "65",
        "target": "57"
      },
      {
        "source": "65",
        "target": "58"
      },
      {
        "source": "65",
        "target": "59"
      },
      {
        "source": "65",
        "target": "60"
      },
      {
        "source": "65",
        "target": "61"
      },
      {
        "source": "65",
        "target": "62"
      },
      {
        "source": "65",
        "target": "63"
      }
    ],
    "categories": [
      {
        "name": "A"
      },
      {
        "name": "B"
      },
      {
        "name": "C"
      },
      {
        "name": "D"
      },
      {
        "name": "E"
      },
      {
        "name": "F"
      },
      {
        "name": "G"
      },
      {
        "name": "H"
      },
      {
        "name": "I"
      }
    ]
  }

    // graph.nodes.forEach(function (node:any) {
    //   node.label = {
    //     show: node.symbolSize > 30
    //   };

  let option4:any = {
    title: {
      text: 'Les Miserables',
      subtext: 'Default layout',
      top: 'bottom',
      left: 'right'
    },
    tooltip: {},
    legend: [
      {
        // selectedMode: 'single',
        data: graph.categories.map(function (a:any) {
          return a.name;
        })
      }
    ],
    animationDuration: 1500,
    animationEasingUpdate: 'quinticInOut',
    series: [
      {
        name: 'Les Miserables',
        type: 'graph',
        layout: 'none',
        data: graph.nodes,
        links: graph.links,
        categories: graph.categories,
        roam: true,
        label: {
          position: 'right',
          formatter: '{b}'
        },
        lineStyle: {
          color: 'source',
          curveness: 0.3
        },
        emphasis: {
          focus: 'adjacency',
          lineStyle: {
            width: 10
          }
        }
      }
    ]
  };
  export {option,option1,option2,option3,option4}