define(['api', 'urls'], function(api, urls) {

    return function(builder, args) {
        builder.start('ratings/main.html');

        builder.get(api.url('ratings', args[0]))
               .parts([
            {dest: '.ratings-placeholder-inner', template: 'detail/rating.html', pluck: 'ratings'},
        ]).done().then(function() {
            $('#add-first-review a').attr('href', urls.reverse('apps.ratings.add', [args[0]]));
        });

        builder.z('type', 'leaf');
        builder.z('title', 'Ratings');  // No L10n for you!
    };
});
