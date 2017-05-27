/**
 * Created by ALISURE on 2017/5/13.
 */
$(function () {

    /*参数设置*/
    var init_percent = 70;
    var bar_height = 0.5;

    /*缩放范围 百分比*/
    var up_value = 100;
    var down_value = 30;
    var current_value = 70;

    /*判断是否全屏*/
    var isFullScreen = false;

    /*全屏背景*/
    var full_bg = "#ffffff";

    /*双击，设置全屏*/
    $(".leftImg").dblclick(init_fullScreen);
    $("#fullscreen-img").dblclick(init_fullScreen);

    /*全屏初始化*/
    function init_fullScreen(event) {
        $(".fullscreen-root").fullScreen({
            "background":full_bg,
            "callback":function (isFullScreen) {
                isFullScreen ? fullScreen() : closeScreen();
            }
        });
        event.preventDefault();
    }

    /*全屏*/
    function fullScreen() {
        isFullScreen = true;

        var width  = $(document).width();
        $(".fullscreen-hide").hide();
        $(".fullscreen-root").show().css({"width":width});

        setSize(init_percent);
        setSlider(init_percent);
    }

    /*退出全屏*/
    function closeScreen() {
        isFullScreen = false;

        $(".fullscreen-hide").show();
        $(".fullscreen-root").hide();
    }

    /*设置二维码的大小*/
    function setSize(percent) {
        if(!isFullScreen) return;

        var width  = $(document).width();
        var height = $(document).height();
        /*二维码数据*/
        var size = parseInt((width > height ? height : width) * percent / 100);
        var margin_top  = parseInt(((width > height ? height : width) - size - 2) / 2) - 2;
        var margin_left = parseInt(((width > height ? width : height) - size - 2) / 2) - 2;
        var full_margin = margin_top + "px " + margin_left + "px";

        $(".fullscreen-show").css({"margin":full_margin});
        $(".fullscreen-show img").css({"width":size,"height":size});
    }

    /*设置bar，包括位置和初始化*/
    function setSlider(value) {
        /*设置位置*/
        var width  = $(document).width();
        var height = $(document).height();

        var max = width > height ? width : height;
        var slider_margin_top  = - height * (1 + bar_height) / 2;
        var slider_margin_left = parseInt(max - Math.abs(height - width) * init_percent / 2 / 100);

        $("#slider").css({"margin-top":slider_margin_top,"margin-left":slider_margin_left});

        /**************************************************/

        /*初始化*/
        $("#slider input.slider").range2DSlider({
            template:'vertical',
            axis:[[0,1],[down_value,up_value]],
            showLegend:[0,0],
            tooltip:['right'],
            value:[[0,value]],
            height:function(){ return height * bar_height + "px";}(),
            alwShowTooltip:[true],
            printLabel:function(val){
                var result = parseInt(val[1]);
                current_value = result;
                setSize(result);
                return result + "%";
            }
        });
    }

    /*滑轮滚动、按下上下键时该变大小*/
    function changeSizeAndSlider(per) {
        if(isFullScreen){
            current_value = current_value + per;
            if(current_value < down_value) current_value = down_value;
            if(current_value > up_value) current_value = up_value;
            $("#slider input.slider").range2DSlider("value",[[0,current_value]]);
        }
    }

    /*鼠标滑轮滚动*/
    $(".fullscreen-root").mousewheel(function (event) {
        changeSizeAndSlider(event.deltaY * 2);
    });
    /*按键*/
    $(document).keydown(function (event) {
        switch (event.which) {
            case 122:/*F11*/
                init_fullScreen(event);
                break;
            case 38:/*上*/
                changeSizeAndSlider(5);
                break;
            case 40:/*下*/
                changeSizeAndSlider(-5);
                break;
        }
    });

    $(window).resize(function(){
        if(isFullScreen){
            setSize(current_value);
            setSlider(current_value);
        }
    });

});