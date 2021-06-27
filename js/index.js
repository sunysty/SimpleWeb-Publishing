//gnb
$(document).ready(function(){
    $("#skipNavi li a").on("focusin",function(){
        $(this).addClass("on"); 
    });
    $("#skipNavi li a").on("focusout",function(){
        $(this).removeClass("on"); 
    });
})    

$(document).ready(function(){
    //gnb
    var $header = $("#header");
    var $header_ht = $header.outerHeight();
    var $gnb_li = $(".gnb>li");
    var $sub_img = $(".sub div");

    $header.prepend("<div class='bgGnb'>");

    $(".bgGnb").css({
        position:"absolute", top:$header_ht, left:"0",
        width:"100%", height:0, backgroundColor:"#eee",
        transitionDuration:"0.4s", zIndex:"1"
    });

    $(".gnb").on("mouseleave",function(){
        $(".bgGnb").css({height:0});
    });

    $gnb_li.on("mouseenter focusin", function(){
        openSub(this);
    });
    $gnb_li.on("mouseleave focusout", function(){
        closeSub(this);
    })

    function openSub(el){
        var ht = $(el).find(".sub").outerHeight();
        $(".bgGnb").css({
            height:ht,
            transform:"translateY(1px)",
        });
        
        $(el).children(".sub").fadeIn(200);
        $(el).children("a").addClass("on");
    }

    function closeSub(el){
        
        $(el).children(".sub").fadeOut(100);
        $(el).children("a").removeClass("on");
    }
})


$(document).ready(function(){
    //search
    var $search_btn = $(".util button")
    var $search_input = $("util input")
    
    $search_btn.on("click", function(){
        $(".header-search")
            .append(
                $(`<input type='text' placeholder='Search here.'>`)
            )
            .css({
                'width':'100%',
                'height':'30px',
                'background':'rgba(211, 211, 211, 0.5)',
                'border':'none',
                'padding':'10',
                'font-size':'15px/1 Nanum Myeongjo',
            })

            if($search_input == ''){
                $("input").removeClass();
            }
    })

    // $search_btn.on("click", function(){
    //     if($search_input == ''){
    //         $(`<input type='text' placeholder='Search here.'>`).removeClass();
    //     }
    // })
})


$(document).ready(function(){
    //menuAll
    var $menuAll_btn = $(".menuAll-btn");
    var $menuAll_full = $(".menuAll-full");
    var $menuAll_close = $(".menuAll-close");

    $menuAll_btn.on("click", function(){
        $menuAll_full.show();
        $menuAll_close.show();
    })

    $menuAll_close.on("click", function(){
        $menuAll_full.hide();
        $menuAll_close.hide();
    })
})


