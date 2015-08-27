/**
 * @file 
 * @author wangshuo16
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
        pieChartExp.call(this);
        pieChartInc.call(this);
    };

    config.renderTotal = function (data) {
        dom.g('icm_value').innerHTML = data.icm_total;
        dom.g('exp_value').innerHTML = data.exp_total;
    };

    config.domEvents = {
        'click:.direction-left': function () {
            this.emit('lastmonth');
        },
        'click:.direction-right': function () {
            this.emit('nextmonth');
        }
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
    /**
     * 绘制支出饼图
     */
    function pieChartExp() {
        var data = this.detail_Data;

        var mypieChart = echarts.init(dom.g('pie-chart-exp'));
        var option = {
            tooltip : {
                trigger: 'item',
                formatter: "{b} : <br/>{c} ({d}%)"
            },
            calculable : true,
            series : [
                {
                    name:'分类',
                    type:'pie',
                    radius : '55%',
                    center: ['50%', '40%'],
                    data: data.sorts_count_exp
                }
            ]
        };
        mypieChart.setOption(option);
    }
    /**
     * 绘制收入饼图
     */
    function pieChartInc() {
        var data = this.detail_Data;

        var mypieChart = echarts.init(dom.g('pie-chart-inc'));
        var option = {
            tooltip : {
                trigger: 'item',
                formatter: "{b} : <br/>{c} ({d}%)"
            },
            calculable : true,
            series : [
                {
                    name:'分类',
                    type:'pie',
                    radius : '55%',
                    center: ['50%', '40%'],
                    data: data.sorts_count_inc
                }
            ]
        };
        mypieChart.setOption(option);
    }

    return config;

});
