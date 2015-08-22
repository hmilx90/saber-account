<!--target: list-->
<div class="header">
    <span class="nav-btn"></span>
    <!--<a href="#list"><span class="icon-list"></span></a>-->
    收支明细
    <span class="icon-share2"></span>
</div>

<div id="list-wrap">
    <div id="main" class="main">
        <div class="time-line" data-time="">
            <a href="javascript:void(0);" class="direction-left"> &lt; </a>
            <a href="javascript:void(0);" class="direction-right"> > </a>
            <span class="time">${year}年${month}月</span>
        </div>
        <!-- use: listBody-->
    </div>
    <a href="#edit" class="edit-btn">记一笔</a>
</div>

<!-- target: listBody -->
    <div class="detail">
        <div class="part">
<<<<<<< HEAD
            收入:<span class="value">${totalIncome}</span>元
        </div>
        <div class="part">
            支出:<span class="value">${totalExpense}</span>元
=======
            收入:<span class="value">${icm_total}</span>元
        </div>
        <div class="part">
            支出:<span class="value">${exp_total}</span>元
>>>>>>> d11c6e5a75084c269ba536b9b87a224d907c36c1
        </div>
        <a href="#detail" class="icon-pie-chart"></a>
    </div>
    <div class="list-header">
        <span>项目</span>
        <span>金额</span>
    </div>
    <!-- for: ${listData} as ${sameDayItems}, ${key} -->
    <div class="title">
        <h4><a class="open" href="javascript:void(0);"><span>${key}</span></a></h4>
        <dl>
        <!-- for: ${sameDayItems} as ${eachItem} -->
            <!-- if: ${eachItem}.type == 'expense' -->
            <dd>
                <span>餐饮</span>
                <span class="red">-${eachItem}.expense</span>
                <div class="icon-box">
                    <img src="../common/img/bianji.png" class="edit-icon">
                    <img src="../common/img/shanchu.png" class="delete-icon">
                </div>
            </dd>
            <!-- else -->
            <dd><span>餐饮</span><span class="red">${eachItem}.income</span></dd>
            <!-- /if -->
        <!-- /for -->
        </dl>
    </div>
    <!-- /for -->
