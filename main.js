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
    var i = 0;
    var $selectWeight = $("#selectWeight");

    while (i < max_weight) {
        $selectWeight.append(
            $('<option value="' + (i + 0.1).toFixed(1) + '">' + i.toFixed(1) + '-' + (i + 0.1).toFixed(1) + '</option>')
        );

        i = i + 0.1;
    }
}

$(function () {
    $.ajax({
        url: "http://emspost.ru/api/rest/?method=ems.get.locations&type=russia&plain=true",
        jsonp: "callback",
        dataType: "jsonp",
        data: {
            format: "json"
        },

        success: function (response) {
            formSelectLocation(response.rsp.locations);
        }
    });

    $.ajax({
        url: "http://emspost.ru/api/rest/?method=ems.get.max.weight",
        jsonp: "callback",
        dataType: "jsonp",
        data: {
            format: "json"
        },

        success: function (response) {
            dataWeight = response;

            formSelectWeight(response.rsp.max_weight);
        }
    });

    $('form').submit(function (eventObject) {
        eventObject.preventDefault();

        var params = 'http://emspost.ru/api/rest?method=ems.calculate&from=' +
            encodeURIComponent($("#selectSend").val()) +
            '&to=' + encodeURIComponent($("#selectGet").val()) +
            '&weight=' + encodeURIComponent($("#selectWeight").val());

        $.ajax({
            url: params,
            jsonp: "callback",
            dataType: "jsonp",
            data: {
                format: "json"
            },

            success: function (response) {
                $('div').removeClass('not-active');
                $('#price').text(response.rsp.price);
                $('#term').text(response.rsp.term.min + '-' + response.rsp.term.max);
            }
        });
    });
});