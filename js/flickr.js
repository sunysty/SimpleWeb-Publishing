// /192991255@N08

(function($){
    $.defaults = {
        key : undefined,
        gallery : "#gallery",
        search : "#search",
        count : 50,
        enableIso : true,
        type: "user",
        date_posted: false
    }

    $.fn.myFlickr = function(opt){
        opt = $.extend({}, $.defaults, opt);
        if(opt.key == undefined) {
            console.error("key는 필수 입력 사항입니다.");
        }
        new Flickr(this, opt);
        return this;
    }

    function Flickr(el, opt){
        this.init(el, opt);
        this.bindingEvent();
    }

    Flickr.prototype.init = function(el, opt){     
        this.url = "https://www.flickr.com/services/rest/?method=flickr.interestingness.getList";
        this.url_search = "https://www.flickr.com/services/rest/?method=flickr.photos.search";
        this.url_user = "https://www.flickr.com/services/rest/?method=flickr.people.getPhotos";
        this.key = opt.key;
        this.count = opt.count;
        this.frame = el;
        this.gallery = el.find(opt.gallery); //$("#wrap").find("#gallery")
        this.search = opt.search; 
        this.enableIso = opt.enableIso;
        this.type = opt.type;
        this.date_posted = opt.dateposed;
    }

    Flickr.prototype.bindingEvent = function(){ 
        this.getList({
            type: this.type
        });

        $(".quickList").children("ul").find("li a").on("click", function(e){
            e.preventDefault();
            var target = $(e.currentTarget).children('p').text();

            this.clickTag(target)
        }.bind(this));
        
        $("body").on("mouseenter", ".item", function(e){
            $(".item").removeClass("on");
            $(e.currentTarget).addClass("on");
            // $(".viewCursor").stop().fadeIn(100);
        });

        $("body").on("mouseleave", ".item", function(){
            $(".item").removeClass("on");
        });
    
        $(".galleryTxt>ul").children("li").eq(0).children("a").on("click", function(e){
            e.preventDefault();
            this.getList({
                type: this.type
            });
        }.bind(this));

        
        //"#search"
        // console.log(this.search.selector);
        var btn = $(this.search).children("button");

        btn.on("click", function(e){
            e.preventDefault();
            this.searchTag();
        }.bind(this));

        $(".pic_search>button").on("keypress", function(e){
            if(e.keyCode == 13 ) this.searchTag();
        }.bind(this));

        var btnGallery = this.gallery.find("li a").selector;

        $("body").on("click", ".item", function(e){
            var imgSrc = $(e.currentTarget).find("a").attr("href");
            var titTxt = $(e.currentTarget).children(".inner").children("p").text();
            var li_index = $(e.currentTarget).index() + 1;
            if(li_index < 10) li_index = "0" + li_index; if(titTxt.length > 13){
                titTxt = titTxt.substr(0, 13)+"...";
            };
            this.createPop(imgSrc, titTxt, li_index);
        }.bind(this));
     
        $("body").on("click", btnGallery, function(e){
            e.preventDefault();
        }.bind(this));

       

        $("body").on("click", ".pop .popClose", function(){
            $(".popMask").remove();
            $(".pop").fadeOut(500,function(){
                $(".pop").remove();
                $("body").removeClass("hidden");
            })
        });

        $("body").on("click", ".pop .popPic", function(){
            $(".popMask").remove();
            $(".pop").fadeOut(500,function(){
                $(".pop").remove();
                $("body").removeClass("hidden");
            });
        });

        // 사용자 아이디 클릭시 사용자 갤러리 이미지 출력
        $("body").on("click", "#gallery li .profile", function(e){
            var userId = $(e.currentTarget).find("span").text();

            this.gallery.removeClass("on");
            $(".galleryTxt_wrap").removeClass("on");
            $(".loading").addClass("on");

            this.getList({
                type: "user",
                user: userId
            });
        }.bind(this));
        
        //타이틀 클릭시 초기화면보기
        var tit = this.frame.find("h1")
        tit.on("click", function(){
            this.gallery.removeClass("on");
            $(".loading").addClass("on");

            this.getList({
                type: "interest"
            });
        }.bind(this));

  
    }

    Flickr.prototype.getList = function(opt){
        //type에 따라 ajax 호출 구문 변경
        var result_opt;

        //타입이 interest일때 ajax전용 옵션을 result_opt에 저장
        if(opt.type == "interest"){
            result_opt = {
                url: this.url,
                dataType: "json",
                data: {
                    api_key: this.key,
                    per_page: this.count,
                    format: "json",
                    nojsoncallback: 1,
                    tagmode: "any",
                    privacy_filter: 5
                }
            }
        };
        //타입이 search일때 ajax 전용 옵션을 result_opt에 저장
        if(opt.type == "search"){
            result_opt = {
                url: this.url_search,
                dataType: "json",
                data: {
                    api_key: this.key,
                    per_page: this.count,
                    format: "json",
                    nojsoncallback: 1,
                    tagmode: "any",
                    privacy_filter: 5,
                    tags: opt.tag
                }
            }
        };
         //타입이 user일때 ajax 전용 옵션을 result_opt에 저장
        if(opt.type == "user"){
            result_opt = {
                url: this.url_user,
                dataType: "json",
                data: {
                    api_key: this.key,
                    per_page: this.count,
                    format: "json",
                    nojsoncallback: 1,
                    tagmode: "any",
                    privacy_filter: 5,
                    tags: opt.tag,
                    user_id: "192991255@N08",
                    date_posted: this.date_posted
                }
            }
        }
        
        $.ajax(result_opt)
        .success(function(data){   
            console.log(data);
            var item = data.photos.photo;  
            this.createList(item);
        }.bind(this))
        .error(function(err){
            console.error(err);
        })
    };

    Flickr.prototype.createList = function(data){    
        var $gallery = $(this.gallery.selector);  

        $gallery.empty();
        $gallery.append("<ul>");

        // $gallery.children("ul").append("<li class='item-sizer'>");

        $(data).each(function(index, data){
            var text = data.title;   
            if(text.length > 20) text = text.substr(0,20) + "...";
            
            index = index +1;
            if(index < 10) index = "0"+index;
            if(!data.title) text = "No description in this photo.";
 

            $gallery.children("ul")
                .append(
                    $("<li class='item'>").append(
                        $("<div class='inner'>")
                        .append(
                            $("<div class='picTxt'>")
                                .append(
                                    $("<span>").text(index),
                                    $("<p>").text(text)
                                ),
                            $("<a>").attr({
                                href : "https://live.staticflickr.com/"+data.server+"/"+data.id+"_"+data.secret+"_b.jpg"
                            })
                                .append(
                                    $("<img>").attr({
                                        src : "https://live.staticflickr.com/"+data.server+"/"+data.id+"_"+data.secret+"_w.jpg",
                                        onerror : "javascript:this.parentNode.parentNode.parentNode.style='display:none;'"
                                    })
                                ),
                            $("<p class='h'>").text(text)
                        )
                        
                
                    // .append(
                    //     $("<div class='profile'>")
                    //         .append(
                    //             $("<img>").attr({src: "https://www.flickr.com/buddyicons/"+data.owner+".jpg"}),
                    //             $("<span>").text(data.owner)
                    //         )                        
                    // )
                    
                )
            )
        }.bind(this));       
        
        if(this.enableIso) {
            this.isoLayout();
        } else {
            this.gallery.addClass("on");
            $(".loading").removeClass("on");
        };
    }

    Flickr.prototype.isoLayout = function(){  
        var $gallery = $(this.gallery.selector);
        var frame = $gallery.find("ul").selector;
        var imgs = $gallery.find("img");
        var imgNum = 0;  

        
        $(imgs).each(function(index, data){ 
            
            data.onload = function(){
                
                imgNum++;                                 
                
                if(imgNum === imgs.length) {                 
                    new Isotope( frame, {
                        itemSelector : ".item",
                        percentPosition: true,
                        transitionDuration: "0.8s",
                        // masonry: {
                        //     columnWidth : ".item-sizer",
                        // }              
                    });

                    $gallery.addClass("on");
                    $(".loading").removeClass("on");
                }
            }  
        }.bind(this));
    }

    Flickr.prototype.searchTag = function(){
        var inputs = $(this.search).find("input").val();
        
        $(".picNum").children("strong").text("1");
        if(inputs == "") {
            alert("검색어를 입력해주세요.");
            return;
        };
        $(".tit_list").children("ul").empty();
        $(".gallery_pic").removeClass("on");
        $(".galleryTxt_wrap").removeClass("on");
        $(".loading").addClass("on");
        $(".gallery_box").removeClass("on");
        
        $(".gallery_pic").animate({scrollLeft: 0}, 0);

        this.getList({
            type: "search",
            tag: inputs
        });
        $(this.search).children("input").val("");
        $(".searchTit").text(inputs);
    }

    Flickr.prototype.clickTag = function(target){


        this.gallery.removeClass("on");
        $(".galleryTxt_wrap").removeClass("on");

        this.getList({
            type: "search",
            tag: target
        });
    };

    Flickr.prototype.createPop = function(imgSrc, titTxt, li_index){
         
        $("body")
            .append(
                $("<div class='popMask'>")
                    .append(
                        $("<div class='mask1'>"),
                        $("<div class='mask2'>"),
                        $("<div class='mask3'>"),
                        $("<div class='mask4'>"),
                    )
            )
     
        $("body").append(
            $("<aside class='pop'>")
                .css({
                    width: '100%', height: "100%", position: "fixed", top: 0, left: 0, zIndex: 21,
                    boxSizing: "border-box", padding: "3vw", background: "#fff", display: "none", cursor: "pointer"
                })
                .append(
                    $("<img class='popPic'>").attr("src", imgSrc).css({
                        width: "100%", height:"100%", objectFit: "contain"
                    }),
                    $("<span class='popClose'>").text("BACK TO GALLERY").css({
                        cursor:"pointer", color:"#000", position: "absolute", top: 20, right: 20, font: "15px/1 'Lato', sans-serif"
                    }),
                    $("<span class='picTit'>")
                        .text(titTxt)
                        .css({
                            position: "absolute",
                            top: 40,
                            left: 30,
                            font: "8vw/1 'Jost', sans-serif",
                            fontWeight: 400,
                            color: "#000",
                            opacity: 0.5
                        }),
                    $("<div class='picNum'>")
                        .css({
                            position: "absolute",
                            bottom: 10,
                            right: 30
                        })
                        .append(
                            $("<span>").text("#"+li_index+" ")
                                .css({
                                    font: "bold 30px/1 'Lato', sans-serif",
                                    color: "#000",
                                    opacity: 0.5,
                                    fontStyle: "italic"
                                }),
                            // $("<span>").text("/ " +li_len)
                            //     .css({
                            //         font: "27px/1 'arial'",
                            //         color: "#000",
                            //         opacity: 0.5
                            //     })
                        )
                )
        )
        
        $(".popMask").find('.mask1').stop().delay().animate({
            left: 0
        }, 500);
        $(".popMask").find('.mask2').stop().delay(200).animate({
            left: 0
        }, 500);
        $(".popMask").find('.mask3').stop().delay(400).animate({
            left: 0
        }, 500);
        $(".popMask").find('.mask4').stop().delay(600).animate({
            left: 0
        }, function(){
            $('.pop').fadeIn(200);
            $("body").addClass("hidden");
        });

       
    }
   

})(jQuery);