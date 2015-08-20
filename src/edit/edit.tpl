<!-- target:edit -->
    <div class="header">
        <span class="nav-btn"></span>
        <!--<a href="#list"><span class="icon-list"></span></a>-->
        记一笔
        <span class="icon-share2"></span>
    </div>
<div id="edit-wrap">
    <div class="sortlist">
        <div class="classify" id="expenseBtn">
            <ul class="classify-list">
                <li class="active-cls" sort="food"><div class="item-bg item-bg-1 active"><span class="icon-food"></span></div>餐饮</li>
                <li sort="shopping"><div class="item-bg item-bg-2"><span class="icon-shopping"></span></div>购物</li>
                <li sort="hotel"><div class="item-bg item-bg-3"><span class="icon-hotel"></span></div>酒店</li>
                <li sort="transtation"><div class="item-bg item-bg-4"><span class="icon-truck"></span></div>交通</li>
            </ul>
            <ul class="classify-list">
                <li sort="enternment"><div class="item-bg item-bg-5"><span class="icon-music"></span></div>娱乐</li>
                <li sort="phoneFee"><div class="item-bg item-bg-6"><span class="icon-earth"></span></div>通讯</li>
                <li sort="hospital"><div class="item-bg item-bg-7"><span class="icon-health"></span></div>医疗</li>
                <li sort="investion"><div class="item-bg item-bg-8"><span class="icon-investion"></span></div>投资理财</li>
            </ul>
        </div>
        <div class="classify" id="incomeBtn" style="display:none;">
            <ul class="classify-list">
                <li sort="salary"><div class="item-bg item-bg-5"><span class="icon-music"></span></div>工资</li>
                <li sort="investIncome"><div class="item-bg item-bg-6"><span class="icon-earth"></span></div>投资收入</li>
                <li sort="extraSalary"><div class="item-bg item-bg-7"><span class="icon-health"></span></div>兼职收入</li>
                <li sort="bonus"><div class="item-bg item-bg-8"><span class="icon-investion"></span></div>红包</li>
                <li sort="others"><div class="item-bg item-bg-8"><span class="icon-investion"></span></div>其他</li>
            </ul>
        </div>
    </div>
    <div id="tab-bnt" class="tab-line">
        <span type="expense" class="tab-1 active" other="income">支出</span>
        <span class="tab-2" type="income" other="expense">收入</span>
    </div>
    <div class="ipt-box">
        <div class="ipt-box-i"><span class="pay-income">支出</span>：<span class="sum" node-type="num" origin="0.0">0.0</span>元</div>
        <div>备注：<input class="ipt-remark" type="text" name="remark" node-type="remark"></div>
    </div>
    <div class="keyboard">
        <table>
            <tr>
                <td>
                    <p num="1">1</p>
                    <p class="p-btm" num="4">4</p>
                </td>
                <td>
                    <p num="2">2</p>
                    <p class="p-btm" num="5">5</p>
                </td>
                <td>
                    <p num="3">3</p>
                    <p class="p-btm" num="6">6</p>
                </td>
                <td class="back key-cn">
                    回退
                </td>
            </tr>
            <tr>
                <td>
                    <p num="7">7</p>
                    <p class="key-cn p-btm clear">清零</p>
                </td>
                <td>
                    <p num="8">8</p>
                    <p class="p-btm" num="0">0</p>
                </td>
                <td>
                    <p num="9">9</p>
                    <p class="p-btm" num=".">.</p>
                </td>
                <td class="key-cn save">
                    确认
                </td>
            </tr>
        </table>
    </div>
</div>