function createOptionsLocation(locations) {
    var $location = $('.location');

    $(_.sortBy(locations, ['name'])).each(function (index, element) {
        var str = element.name;

        var optionText = str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();

        $location.append(
            $('<option value="' + element.value + '">' + optionText + '</option>')
        );
    })
}

function createOptionsWeight(max_weight)  {
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
            createOptionsLocation(response.rsp.locations);
        },
        error: function () {
            $('#ui-message').text('Ошибка загрузки');
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
            createOptionsWeight(response.rsp.max_weight);
        },
        error: function () {
            $('#ui-message').text('Ошибка загрузки');
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
             $('#ui-message').html('<img id="preloder" src="./img/preloder.gif">');
             },
            data: {
                format: 'json'
            },
            success: function (response) {
                $('#preloder').remove();
                $('.result-group').removeClass('not-active');
                $('#price').text(response.rsp.price);
                $('#term').text(response.rsp.term.min + '-' + response.rsp.term.max);
            },
            error: function () {
                $('#preloder').remove();
                $('#ui-message').text('Ошибка загрузки');
                $('.result-group').addClass('not-active');
            }
        });
    });
});