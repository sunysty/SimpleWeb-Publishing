var items = ["data/board.json", "data/board2.json", "data/board3.json"];

var item_data = callData(items[0]);
var target = $(".tab>div").eq(0);
createTable(target, item_data);

$(".tab ul li").on("click", function(e){
    e.preventDefault();
    var i = $(this).index();

    $(".tab ul li a").removeClass("on");
    $(".tab ul li").eq(i).children("a").addClass("on");

    //박스 비활성화
    $(".tab>div").removeClass("on");
    $(".tab>div").html("");

    //박스 활성화
    $(".tab>div").eq(i).addClass("on");

    //클릭한 순번의 데이터 주소로 callData함수 호출하여 변수에 배열저장
    var item_data = callData(items[i]);

    //해당 순번의 패널에만 해당 데이터의 테이블 동적생성
    var target = $(".tab>div").eq(i);
    createTable(target, item_data);
})

//데이터호출 함수 정의
function callData(url){
    var result;

    $.ajax({
        url: url,
        dataType: "json",
        async: false
    })
    .success(function(data){
        result = data.data;    
    })
    .error(function(err){
        console.error(err);
    });

    return result;
}

//테이블 생성 함수 정의
function createTable(target, items){

    //상단 thead와 tbody생성
    target.append(
        $("<table>")
            .append(
                $("<thead>")
                    .append(
                        $("<tr>")
                            .append(
                                "<th>번호</th>",
                                "<th>게시글 제목</th>",
                                "<th>작성자</th>",
                                "<th>작성일</th>",
                            )
                    ),
                $("<tbody>")
            )
    );

    $(items).each(function(index, data){
        target.find("tbody")
            .prepend(
                $("<tr>")
                    .append(
                        $("<td>").text(index+1),
                        $("<td>")
                            .append(
                                $("<a>").attr("href", data.link).text(data.title)
                            ),
                        $("<td>").text(data.writer),
                        $("<td>").text(data.date)
                    )
            )
    })
}