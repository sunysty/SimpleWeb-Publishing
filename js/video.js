function Youtube(option){
    this.init(option);
    this.bindingEvent();
}

Youtube.prototype.init = function(opt){
    this.frame = $("#videoGallery> .inner");
    this.key = 'AIzaSyCP9goLwp0hdM2MgdhHMVZBwd6nQjlMn4Q';
    this.playList = 'PLMYKu8djpRq97DCnjPwHlg0sIb7xwoEGV';
    this.count = 5;
}
Youtube.prototype.bindingEvent= function(){
    this.callData();

    $("body").on("click", "article a", function(e){
        e.preventDefault();
        var vidID = $(e.currentTarget).attr("href");
        this.createPop(vidID);
    }.bind(this));

    $("body").on("click", ".pop .close", function(e){
        e.preventDefault();
        this.removePop();
    }.bind(this));
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
        var items = data.items;  
        this.createList(items);
    }.bind(this))
    .error(function(err){
        console.error(err);
    })
}
Youtube.prototype.createList= function(items){
    $(items).each(function(index, data){  
        console.log(data);
        var tit = data.snippet.title;
        var txt = data.snippet.description;          
        var date = data.snippet.publishedAt.split("T")[0];
        var imgSrc = data.snippet.thumbnails.high.url;
        var vidId = data.snippet.resourceId.videoId;

        if(txt.length>200) {
            txt= txt.substr(0,200)+"...";
        }   

        this.frame
            .append(
                $("<article>")
                    .append(
                        $("<a class='pic'>")
                            .attr({ href: vidId })
                            .css({ backgroundImage: "url("+imgSrc+")" }),
                        $("<div class='con'>")
                            .append(
                                $("<h2>").text(tit),
                                $("<p>").text(txt),
                                $("<span>").text(date)
                            )
                    )
            )
    
    }.bind(this))
}
Youtube.prototype.createPop= function(vidID){
    $("body")
        .append(
            $("<aside class='pop'>")
                .css({
                    width: "100%", height: "100%",
                    position: "fixed", top: 0, left: 0,
                    backgroundColor: "rgba(0,0,0,0.9)",
                    display: "none", boxSizing: "border-box",
                    padding: 100
                })
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
                .append(
                    $("<a href='#' class='close'>")
                        .text("close")
                        .css({
                            position: "absolute", top: 20, right: 20,
                            color: "#fff"
                        })
                ).fadeIn()
        );// pop append ends

        setTimeout(function(){
            $(".pop .con").fadeIn(500, function(){
                $(".pop > img").remove();
            })
        },2000);

}
Youtube.prototype.removePop= function(){
    $(".pop").fadeOut(500,function(){
        $(this).remove();
    })
}
