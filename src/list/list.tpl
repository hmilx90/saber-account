<!--target: list-->
<div class="header">
    <span class="nav-btn"></span>
    <!--<a href="#list"><span class="icon-list"></span></a>-->
    收支明细
    <a href="#share"><span class="icon-share2"></span></a>
</div>

<div id="list-wrap">
<div id="main" class="main">
    <div class="time-line">
            <a href="javascript:void(0);" class="direction-left"> &lt; </a>
            <a href="javascript:void(0);" class="direction-right"> > </a>
            <span class="time">2015年3月</span>
        </div>

    <div class="detail">
        <div class="part">
            收入:<span class="value">1000</span>元
        </div>
        <div class="part">
            支出:<span class="value">500</span>元
        </div>
        <a href="detail.html" class="icon-pie-chart"></a>
    </div>
    <div class="list-header">
        <span>项目</span>
        <span>金额</span>
    </div>
    
    <div class="title">
        <h4><a class="open" href="javascript:void(0);"><span>2015年7月3日</span></a></h4>
        <dl>
        <!-- for: ${list} as ${listItem} -->
            <!-- if: ${listItem}.type == 'expense' -->
            <dd><span>餐饮</span><span class="red">-${listItem}.expense</span></dd>
            <!-- else -->
            <dd><span>餐饮</span><span class="red">${listItem}.income</span></dd>
            <!-- /if -->
        <!-- /for -->

        </dl>
    </div>

    <div class="title">
        <h4><a class="open" href="javascript:void(0);"><span>2015年7月3日</span></a></h4>
        <dl>
            <dd><span>餐饮</span><span class="red">-30</span></dd>
            <dd><span>餐饮</span><span class="red">-100</span></dd>
        </dl>
    </div>
</div>

<a href="#edit" class="edit-btn">记一笔</a>
</div>