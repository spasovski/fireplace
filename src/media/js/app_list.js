define('app_list',
    ['capabilities', 'log', 'storage', 'tracking', 'utils', 'z'],
    function(caps, log, storage, tracking, utils, z) {

    var logger = log('app_list');

    // If we've set this value in localStorage before, then always use it.
    var expand = !!storage.getItem('expand-listings');
    if (expand === null) {
        // Default to the graphical view at desktop widths and traditional
        // list view at lesser widths.
        expand = caps.widescreen();
    }

    function setTrays(expanded) {
        if (expanded !== undefined) {
            expand = expanded;
        }
        $('.app-list').toggleClass('expanded', expanded);
        $('.expand-toggle').toggleClass('active', expand);
        storage.setItem('expand-listings', !!expanded);
        if (expanded) {
            z.page.trigger('populatetray');
            // Set the `src` for hidden images so they get loaded.
            $('img[data-src]:not([src])').each(function () {
                this.src = $(this).data('src');
            });
        }
    }

    z.body.on('click', '.expand-toggle', utils._pd(function() {
        setTrays(expand = !expand);

        tracking.trackEvent(
            'View type interactions',
            'click',
            expand ? 'Expanded view' : 'List view'
        );

        z.doc.trigger('scroll');  // For defer image loading.
    }));

    z.page.on('loaded reloaded_chrome', function() {
        if ($('.app-list').length) {
            setTrays(expand);
        }
    });

    // Remove paginated class from app lists if .loadmore goes away.
    z.page.on('loaded_more', function() {
        if (!$('.loadmore').length) {
            $('.app-list').removeClass('paginated');
        }
    });

    logger.log('initialized');
});
