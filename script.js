$(function () {
    $("#input").keypress(function (e) {

        var search = $('#input').val();
        var key = event.which || event.keyCode;
        if (search === '' && key === 13) return;
        if (search && key === 13) {
            while ($(".elem")[0]) {
                $(".elem")[0].remove();
            }

            var url = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + search + "&format=json&callback=?";
            $.ajax({
                url: url,
                type: 'GET',
                contentType: "text/plain; charset=utf-8",
                async: true,
                dataType: "json",
                success: function (data, status, jqXHR) {
                    $("#output").html();
                    for (var j = 0, i = 1; j < data[i].length; j++) {
                        $("#output").prepend("<li class='elem'><a href=" + data[3][j] + "><h2>" + data[1][j] + "</h2>" + "<p>" + data[2][j] + "</p></a></li>");
                    }
                }
            })
                .done(function () {
                    console.log('success');
                })
                .fail(function () {
                    console.log('error');
                })
                .always(function () {
                    console.log('complete');
                    $('#input')[0].value = '';
                });
        }
    });
});