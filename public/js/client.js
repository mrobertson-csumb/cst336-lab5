//// event listeners
$(document).ready(() => {
    $('.fav-icon').on('click', function () {
            let el = $(this);
            let imgUrl = $(this).prev().attr('src');

            if (el.attr('src') === 'img/fav_off.png') {
                el.attr('src', 'img/fav_on.png');
                callFavoriteApi(actions.INSERT, imgUrl);
            } else {
                el.attr('src', 'img/fav_off.png');
                callFavoriteApi(actions.DELETE, imgUrl);
            }
        }
    );

    $('.keyword').on('click', function () {
        console.log($(this).text());
        $.ajax({
            method: 'get',
            url: '/api/keyword-favorites',
            data: {
                keyword: $(this).text().trim()
            },
        }).done((rows, status) => {
                let el = $('#keyword-favorites');
                el.empty();
                el.append(`<input type="text" id="keyword" value="${$(this).text().trim()}" hidden/>`);
                rows.forEach((row, i) => {
                        el.append(`<div class="image-block">` +
                            `<img class="result-image" src="${row.image_url}"/>` +
                            `<img class="fav-icon" src="img/fav_on.png" width="12.5%"/>` +
                            `</div>`);
                    }
                );
                // todo -- don't like this redundant code
                $('.fav-icon').on('click', function () {
                        let el = $(this);
                        let imgUrl = $(this).prev().attr('src');

                        if (el.attr('src') === 'img/fav_off.png') {
                            el.attr('src', 'img/fav_on.png');
                            callFavoriteApi(actions.INSERT, imgUrl);
                        } else {
                            el.attr('src', 'img/fav_off.png');
                            callFavoriteApi(actions.DELETE, imgUrl);
                        }
                    }
                );
            }
        )
    })
});

//// functions
/**
 * calls the favorites api to Insert or Delete a favorite
 * @param action the action from (actions)
 * @param imgUrl the url for the image to be favorited
 */
function callFavoriteApi(action, imgUrl) {
    $.ajax({
        method: 'get',
        url: '/api/update-favorites',
        data: {
            img_url: imgUrl,
            keyword: $('#keyword').val(),
            action: action
        }
    })
}

/**
 * represents acceptable favorites api actions
 * @type {{DELETE: string, INSERT: string}}
 */
const actions = {
    INSERT: 'insert',
    DELETE: 'delete'
};
