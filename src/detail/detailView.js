/**
 * @file 
 * @author ()
 */

define(function (require) {

    var echarts = window.echarts;
    var dom = require('saber-dom');

    var config = {};

    config.template = require('./detail.tpl');

    /**
     * 渲染页面
     */
    config.renderCharts = function () {
        lineChart.call(this);
        pieChart.call(this);
    };

    /**
     * 绘制折线图
     */
    function lineChart() {
        var data = this.detail_Data;

        var myChart = echarts.init(dom.g('line-chart'));
        var option = {
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:['收入','支出']
            },
            toolbox: {
                show : false,
                feature : {
                    mark : {show: true},
                    dataView : {show: true, readOnly: false},
                    magicType : {show: true, type: ['line']},
                    restore : {show: true},
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

    function pieChart() {

        var mypieChart = echarts.init(dom.g('pie-chart'));
        var option = {
            title : {
                subtext: '支出',
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient : 'vertical',
                x : 'left',
                data:['餐饮','购物','酒店','交通','娱乐','通讯','医疗','投资理财']
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    dataView : {show: true, readOnly: false},
                    magicType : {
                        show: true,
                        type: ['pie'],
                        option: {
                            funnel: {
                                x: '25%',
                                width: '50%',
                                funnelAlign: 'left',
                                max: 1548
                            }
                        }
                    },
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            calculable : true,
            series : [
                {
                    name:'分类',
                    type:'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:[
                        {value:335, name:'餐饮'},
                        {value:310, name:'购物'},
                        {value:234, name:'酒店'},
                        {value:135, name:'交通'},
                        {value:1548, name:'娱乐'},
                        {value:1548, name:'通讯'},
                        {value:1548, name:'医疗'},
                        {value:1548, name:'投资理财'},
                    ]
                }
            ]
        };
        mypieChart.setOption(option);
    }

    return config;

});
