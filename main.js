function formSelectLocation(locations) {
    var $location = $('.location');

    $(locations).each(function (index, element) {
        var str = element.name;
        var optionText = str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();

        $location.append(
            $('<option value="' + element.value + '">' + optionText + '</option>')
        );
    })
}

function formSelectWeight(max_weight) {
    var $selectWeight = $('#selectWeight');

    for (var i = 0; i < max_weight; i = i + 0.1) {
        $selectWeight.append(
            $('<option value="' + (i + 0.1).toFixed(1) + '">' + i.toFixed(1) + '-' + (i + 0.1).toFixed(1) + '</option>')
        );
    }
}

$(function () {
    $.ajax({
        url: 'http://emspost.ru/api/rest/?method=ems.get.locations&type=russia&plain=true',
        jsonp: 'callback',
        dataType: 'jsonp',
        data: {
            format: 'json'
        },
        success: function (response) {
            formSelectLocation(response.rsp.locations);
        },
        error: function () {
            $('#spanimg').text('Ошибка загрузки');
        }
    });

    $.ajax({
        url: 'http://emspost.ru/api/rest/?method=ems.get.max.weight',
        jsonp: 'callback',
        dataType: 'jsonp',
        data: {
            format: 'json'
        },
        success: function (response) {
            formSelectWeight(response.rsp.max_weight);
        },
        error: function () {
            $('#spanimg').text('Ошибка загрузки');
        }
    });

    $("form").on("submit", function (event) {
        event.preventDefault();
        var params = 'http://emspost.ru/api/rest?method=ems.calculate&' + $(this).serialize();

        $.ajax({
            url: params,
            jsonp: 'callback',
            dataType: 'jsonp',
             beforeSend: function () {
             $('#spanimg').html('<img id="imgcode" src="./img/preloder.gif">');
             },
            data: {
                format: 'json'
            },
            success: function (response) {
                $('#imgcode').remove();
                $('.result-group').removeClass('not-active');
                $('#price').text(response.rsp.price);
                $('#term').text(response.rsp.term.min + '-' + response.rsp.term.max);
            },
            error: function () {
                $('#spanimg').text('Ошибка загрузки');
            }
        });
    });
});