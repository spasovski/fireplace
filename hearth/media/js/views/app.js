define('views/app',
    ['l10n', 'utils', 'requests', 'urls', 'z', 'templates', 'overflow'],
    function(l10n, utils, requests, urls, z, nunjucks, overflow) {
    'use strict';

    z.page.on('click', '#product-rating-status .toggle', utils._pd(function() {
        // Show/hide scary content-rating disclaimers to developers.
        $(this).closest('.toggle').siblings('div').toggleClass('hidden');

    })).on('click', '.show-toggle', utils._pd(function() {
        var $this = $(this),
            newTxt = $this.attr('data-toggle-text');
        // Toggle "more..." or "less..." text.
        $this.attr('data-toggle-text', $this.text());
        $this.text(newTxt);
        // Toggle description.
        $this.closest('.blurbs').find('.collapsed').toggle();

    })).on('click', '.approval-pitch', utils._pd(function() {
        $('#preapproval-shortcut').submit();

    })).on('click', '.product-details .icon', utils._pd(function(e) {
        // When I click on the icon, append `#id=<id>` to the URL.
        window.location.hash = 'id=' + $('.product').data('product')['id'];
        e.stopPropagation();

    }));

    return function(builder, args) {
        builder.start('detail/main.html', {slug: args[0]}).done(function() {
            z.page.trigger('populatetray');
        });

        builder.z('type', 'leaf');
        builder.z('reload_on_login', true);
        builder.z('title', gettext('Loading...'));
        builder.z('pagetitle', gettext('App Details'));

        builder.onload('app-data', function() {
            builder.z('title', builder.results['app-data'].name);
            overflow.init();
        }).onload('ratings', function() {
            var reviews = $('.detail .reviews li');
            if (reviews.length < 3) return;

            for (var i = 0; i < reviews.length - 2; i += 2) {
                var hgt = Math.max(reviews.eq(i).find('.review-inner').height(),
                                   reviews.eq(i + 1).find('.review-inner').height());
                reviews.eq(i).find('.review-inner').height(hgt);
                reviews.eq(i + 1).find('.review-inner').height(hgt);
            }
        });
    };
});
