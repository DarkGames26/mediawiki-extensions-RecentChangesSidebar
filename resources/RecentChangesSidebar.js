$(document).ready(function () {
    // Función para obtener los cambios recientes
    function fetchRecentChanges() {
        return $.ajax({
            url: mw.util.wikiScript('api'),
            data: {
                action: 'feedrecentchanges',
                feedformat: 'json',
                days: 30, 
                limit: 5, 
                format: 'json'
            },
            dataType: 'json',
            cache: true
        });
    }

    // Función para renderizar los cambios
    function renderRecentChanges(changes) {
        var $list = $('#recent-changes-list');
        $list.empty();

        changes.forEach(function (change) {
            var $item = $('<li>').addClass('rc-sidebar-item');

            var $pageLink = $('<a>')
                .attr('href', mw.util.getUrl(change.title))
                .text(change.title)
                .addClass('rc-sidebar-page');

            var timeAgo = moment(change.timestamp).fromNow(true);
            timeAgo = timeAgo.replace("minutes", "m").replace("minute", "m")
                             .replace("hours", "h").replace("hour", "h")
                             .replace("days", "d").replace("day", "d");

            var $userInfo = $('<span>')
                .addClass('rc-sidebar-user')
                .html(`${timeAgo} ago - <a href="${mw.util.getUrl('User:' + change.user)}">${change.user}</a>`);

            $item.append($pageLink).append($userInfo);
            $list.append($item);
        });
    }

    // Verificar si ya tenemos los datos en caché
    var cachedChanges = sessionStorage.getItem('cachedRecentChanges');
    if (cachedChanges) {
        renderRecentChanges(JSON.parse(cachedChanges));
    } else {
        fetchRecentChanges().done(function (data) {
            console.log(data);  // Registrar los datos completos para verificar la estructura
            var changes = data.recentchanges;
            renderRecentChanges(changes);

            // Guardar en caché los cambios recientes
            sessionStorage.setItem('cachedRecentChanges', JSON.stringify(changes));
        });
    }
});
