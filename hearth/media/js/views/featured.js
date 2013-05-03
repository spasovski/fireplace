define('views/featured', ['urls', 'z'], function(urls, z) {

    return function(builder, args, __, params) {
        var category = args[0] || '';
        params = params || {};

        if (category === 'all' || category === undefined) {
            category = '';
        }

        builder.z('type', 'search');
        builder.z('search', params.name || category);
        builder.z('title', params.name || category);

        builder.start('featured.html', {
            category: category,
            endpoint: urls.api.url('category', [category])
        });
    };

});
