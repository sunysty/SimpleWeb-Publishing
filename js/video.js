function Youtube(){
    this.init();
    this.bindingEvent();
}

Youtube.prototype.init = function(){
    this.frame = $("#videoGallery .inner");
    this.key = 'AIzaSyDL9_YYfFeGZJ7OOL7vOTVvTPBnDL4zH6k';
    this.playList = 'PLMYKu8djpRq9oJwzmW8Yze8Uv6IrhOMij';
    this.count = 16;
}

Youtube.prototype.bindingEvent= function(){
    this.callData();

    $("body").on("click", "article .pic", function(e){
        e.preventDefault();
        var vidID = $(this).attr("href");
        this.createPop(vidID);
        $("body").css({overflow:"hidden"})
    }.bind(this));

    $("body").on("click", ".youtube_pop .close", function(e){
        e.preventDefault();
        $(this).parent(".youtube_pop").remove();
        $("body").css({overflow:"auto"})
    });
}

Youtube.prototype.callData= function(){
    $.ajax({
        url: "https://www.googleapis.com/youtube/v3/playlistItems",
        dataType: "jsonp",
        data: {
            part: "snippet",
            key: this.key,
            playlistId: this.playList,
            maxResults: this.count
        }
    })
    .success(function(data){
        var item = data.items;  
        this.createList(item);
    }.bind(this))
    .error(function(err){
        console.error(err);
    })
};

Youtube.prototype.createList= function(items){
    $(items).each(function(index, data){  
        console.log(data);
        var txt = data.snippet.title;          
        var tit = data.snippet.videoOwnerChannelTitle;
        var date = data.snippet.publishedAt.split("T")[0];
        var imgSrc = data.snippet.thumbnails.high.url;
        var vidId = data.snippet.resourceId.videoId;
        if(txt.length>200) {txt= txt.substr(0,200)+"...";}   

        this.frame
            .append(
                $("<article>")
                    .append(
                        $("<a class='pic'>")
                            .attr({ href: vidId })
                            .css({ backgroundImage:"url("+imgSrc+")" }),
                        $("<div class='con'>")
                            .append(
                                $("<h2>").text(tit),
                                $("<p>").text(txt)
                            )
                    )
            )
    
    }.bind(this))
}

Youtube.prototype.createPop= function(vidID){
    $("body")
        .append(
            $("<aside class='youtube_pop'>")
                .css({
                    width: "100%", 
                    height: "100%",
                    position: "fixed", 
                    top: 0, 
                    left: 0,
                    backgroundColor: "rgba(0,0,0,0.9)",
                    display: "none", 
                    boxSizing: "border-box",
                    padding: 100,
                    zIndex:10
                })
                .append(
                    $("<a class='close'>").text("close")
                        .css({
                            position:"absolute",
                            top:20, right:20,
                            color:"#fff",
                            cursor:"pointer"
                        })
                )
                .append(
                    $("<img src='img/loading.gif'>")
                        .css({
                            width: 80,
                            position: "absolute",
                            top: '50%',
                            left: '50%',
                            transform: "translate(-50%, -50%)"
                        })
                )
                .append(
                    $("<div class='con'>")
                        .css({
                            width: "100%",
                            height: "100%",
                            position: "relative",
                            display: "none"
                        })
                        .append(
                            $("<iframe>")
                                .attr({
                                    src: "https://www.youtube.com/embed/"+vidID,
                                    width: "100%",
                                    height: "100%",
                                    frameborder: 0,
                                    allowfullscreen: true
                                })
                        )
                )
        )

        $(".youtube_pop").fadeIn();

        setTimeout(function(){
            $(".youtube_pop .con").fadeIn(500, function(){
                $(this).prev().remove();
            })
        },1000);
    }
