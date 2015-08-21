<!-- target:detail -->
<div class="header">
    <span class="nav-btn"></span>
    统计分析
    <span class="icon-share2"></span>
</div>
<div id="detail-wrap">
    <div id="main" class="main">
        <div class="time-line">
            <a href="javascript:void(0);" class="direction-left"> &lt; </a>
            <a href="javascript:void(0);" class="direction-right"> > </a>
            <span class="time">2015年3月</span>
        </div>

        <div class="detail">
            <div class="part">
                收入:
                <!-- if: ${icm_total} -->
                <span class="value">${icm_total}</span>
                <!-- else -->
                <span class="value">0</span>
                <!-- /if -->
                元
            </div>
            <div class="part">
                支出:
                <!-- if: ${exp_total} -->
                <span class="value">${exp_total}</span>
                <!-- else -->
                <span class="value">0</span>
                <!-- /if -->
                元
            </div>
        </div>

        <p class="table-title">月收支曲线图</p>

        <div class="canvas-wrap">
        </div>
        <p class="table-title">消费类别饼状图</p>

        <div class="canvas-wrap">
        </div>
    </div>
</div>