/**
 * @file 
 * @author wangshuo16
 */

define(function (require) {

    var echarts = window.echarts;
    var dom = require('saber-dom');

    var config = {};

    config.template = require('./detail.tpl');

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
     * @param node 绘制节点
     * @param xdata x轴名称
     * @param ydata y轴数据数组
     */
    config.lineChart = function (node, xdata, ydata) {

        var myChart = echarts.init(node);
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
                    data : xdata
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
                    data: ydata[0],
                    markLine : {
                        data : [
                            {type : 'average', name: '平均值'}
                        ]
                    }
                },
                {
                    name: '支出',
                    type: 'line',
                    data: ydata[1],
                    markLine : {
                        data : [
                            {type : 'average', name : '平均值'}
                        ]
                    }
                }
            ]
        };
        myChart.setOption(option);
    };

    /**
     * 绘制饼图
     * @param node 绘图节点
     * @param values 绘图数据
     */
    config.pieChart = function (node, values) {

        var mypieChart = echarts.init(node);
        var option = {
            tooltip : {
                trigger: 'item',
                formatter: "{b} : <br/>{c} ({d}%)"
            },
            calculable : true,
            series : [
                {
                    name: '分类',
                    type:'pie',
                    radius : '55%',
                    center: ['50%', '40%'],
                    data: values
                }
            ]
        };
        mypieChart.setOption(option);
    };

    return config;

});
