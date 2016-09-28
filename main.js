function formSelectLocation(locations) {
    var $location = $('.location');

    $(locations).each(function (index, element) {
        var str = element.name;
        var optionText = str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();

        $location.append(
            $('<option value="' + element.value + '">' + optionText + '</option>') //точка с запятой
        );
    })
}

function formSelectWeight(max_weight) {
    var i = 0;
    var $selectWeight = $('#selectWeight');

    while (i < max_weight) { // цикл for в себе содержит увеличение инкремента, и больше туту подходит (дополнительно, по желанию)
        $selectWeight.append(
            $('<option value="' + (i + 0.1).toFixed(1) + '">' + i.toFixed(1) + '-' + (i + 0.1).toFixed(1) + '</option>') //точка с запятой
        );

        i = i + 0.1;
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
        // пустая строка, ненужна!
        success: function (response) {
            formSelectLocation(response.rsp.locations);
        }
    });

    $.ajax({
        url: 'http://emspost.ru/api/rest/?method=ems.get.max.weight',
        jsonp: 'callback',
        dataType: 'jsonp',
        data: {
            format: 'json'
        },
// пустая строка, ненужна!
        success: function (response) {
// пустая строка, ненужна!
            formSelectWeight(response.rsp.max_weight);
        }
    });

    $( "form" ).on( "submit", function( event ) {
        event.preventDefault();
        var params ='http://emspost.ru/api/rest?method=ems.calculate&' +  $( this ).serialize();
        console.log(params);

        $.ajax({
            url: params,
            jsonp: 'callback',
            // нет обработки начала запроса, повешать прелоадер например или еще что то (дополнительно, по желанию), снять когда запрос вернется
            dataType: 'jsonp',
            data: {
                format: 'json'
            },
// пустая строка, ненужна!
            success: function (response) {
                $('div').removeClass('not-active'); // не конкретно, дивов может стать больше
                // стоит скрвватиь эти элеменьы если значения в форме были изменены? (дополнительно, по желанию)
                $('#price').text(response.rsp.price);
                $('#term').text(response.rsp.term.min + '-' + response.rsp.term.max);
            }
            // не обрабатываешь ошибки ни в одном запросе, если что то случитьсяпользователь даже не узнает, не попробует еще раз и перестанет пользоваться сервисом (дополнительно, по желанию)
        });
    });
});