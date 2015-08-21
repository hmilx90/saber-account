/**
 * @file 
 * @author ()
 */

define(function (require) {

    var echarts = window.echarts;
    var dom = require('saber-dom');
    var dataManager = require('common/js/Data-manage');

    var config = {};

    config.template = require('./detail.tpl');

    /**
     * 渲染页面
     * @param data
     */
    config.renderCharts = function (data) {
        //var myChart = echarts.init(dom.g('line-chart'));
        //var option = {
        //    tooltip : {
        //        trigger: 'axis'
        //    },
        //    legend: {
        //        data:['最高气温','最低气温']
        //    },
        //    toolbox: {
        //        show : false
        //
        //    },
        //    calculable : true,
        //    xAxis : [
        //        {
        //            type : 'category',
        //            boundaryGap : false,
        //            data : ['周一','周二','周三','周四','周五','周六','周日']
        //        }
        //    ],
        //    yAxis : [
        //        {
        //            type : 'value',
        //            axisLabel : {
        //                formatter: '{value} °C'
        //            }
        //        }
        //    ],
        //    series : [
        //        {
        //            name:'最高气温',
        //            type:'line',
        //            data:[11, 11, 15, 13, 12, 13, 10],
        //        },
        //        {
        //            name:'最低气温',
        //            type:'line',
        //            data:[1, -2, 2, 5, 3, 2, 0],
        //        }
        //    ]
        //};
        //myChart.setOption(option);
        lineChart.call(this);
    };

    //config.render = function () {
    //    lineChart.call(this);
    //};

    function lineChart() {
        var data = this.detail_Data;

        var myChart = echarts.init(dom.g('line-chart'));
        var option = {
            title : {
                text: '月收支曲线'
            },
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:['收入','支出']
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    dataView : {show: true, readOnly: false},
                    magicType : {show: true, type: ['line', 'bar']},
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : data.days_array
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    axisLabel : {
                        formatter: '{value}元'
                    }
                }
            ],
            series : [
                {
                    name: '收入',
                    type: 'line',
                    data: data.icn_count,
                    markLine : {
                        data : [
                            {type : 'average', name: '平均值'}
                        ]
                    }
                },
                {
                    name: '支出',
                    type: 'line',
                    data: data.exp_count,
                    markLine : {
                        data : [
                            {type : 'average', name : '平均值'}
                        ]
                    }
                }
            ]
        };
        myChart.setOption(option);
    }

    return config;

});
