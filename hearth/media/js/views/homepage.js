define('views/homepage',
    ['cat-dropdown', 'format', 'l10n', 'newsletter', 'underscore', 'urls'],
    function(cdd, format, l10n, newsletter, _, urls) {
    'use strict';

    var gettext = l10n.gettext;
    var operatorInjected = false;

    return function(builder, args, params) {
        params = params || {};

        builder.z('title', '');  // We don't want a title on the homepage.

        builder.z('type', 'root');
        builder.z('search', params.name);
        builder.z('title', params.name);

        builder.z('cat', 'all');
        builder.z('show_cats', true);

        if ('src' in params) {
            delete params.src;
        }

        builder.start('category/main.html', {
            endpoint: urls.api.url('category', [''], params),
            sort: params.sort
        }).done(function() {
            newsletter.init();

            var catElm = '<li><a class="cat-{0} cat-icon-a" data-cat-slug="{0}" href="{1}">{2}</a></li>';

            cdd.catrequest.done(function() {
                var $opElm = $('#operator');
                if (!$opElm.length || operatorInjected) return;

                var opVisible = !!$opElm.filter(':visible').length;
                var slug = $opElm.data('slug');
                var name = $opElm.find('header h3').text();
                var link = $opElm.find('header a').attr('href');
                var item = format.format(catElm, slug, link, name);

                // We have an op shelf so hide any collection hero. (bug 923236)
                if (opVisible) $('.collection.main').hide();

                // Inject op shelf to the category dropdown.
                $('menu.cat-menu').append(item);
                operatorInjected = true;
            });
        });
    };
});
