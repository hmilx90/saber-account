<!--target: list-->
<div class="header">
    <span class="nav-btn"></span>
    收支明细
    <span class="icon-share2"></span>
</div>

<div id="list-wrap">
    <div id="main" class="main">
        <div class="time-line" data-time="">
            <a href="javascript:void(0);" class="direction-left"> &lt; </a>
            <a href="javascript:void(0);" class="direction-right"> > </a>
            <span class="time" id="time-line1">${year}年${month}月</span>
        </div>
        <!-- use: listBody(icm_total=${icm_total},exp_total=${exp_total},listData=${listData})-->
    </div>
    <a href="#edit" class="edit-btn">记一笔</a>
</div>

<!-- target: listBody -->
    <div class="detail">
        <div class="part">
            收入:<span class="income-value">${icm_total}</span>元
        </div>
        <div class="part">
            支出:<span class="expense-value">${exp_total}</span>元
        </div>
        <a class="icon-pie-chart"></a>
    </div>
    <div class="list-header">
        <span>项目</span>
        <span>金额</span>
    </div>
    <!-- for: ${listData} as ${sameDayItems}, ${key} -->
    <div class="title">
        <h4>
            <a class="open" href="javascript:void(0);">
                <span>${key}</span>
            </a>
        </h4>
        <dl>
        <!-- for: ${sameDayItems} as ${eachItem} -->
            
            <dd data-id="${eachItem.id}">
                <span>${eachItem.sort}</span>
                <!-- if: ${eachItem.type} == 'expense' -->
                <span class="red">-${eachItem.number}</span>
                <!-- else -->
                <span class="green">+${eachItem.number}</span>
                <!-- /if -->
                <div class="box-icon">
                    <img src="../src/common/img/bianji.png" class="edit-icon">
                    <img src="../src/common/img/shanchu.png" class="delete-icon">
                </div>
            </dd>
        <!-- /for -->
        </dl>
    </div>
    <!-- /for -->
