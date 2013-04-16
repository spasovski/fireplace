define(
    ['utils', 'z'],
    function(utils, z) {

    var _pd = utils._pd;

    return function(builder, args, __, params) {

        builder.z('type', 'search');
        builder.z('title', gettext('Featured Apps'));

        builder.start('featured.html').done(function() {setTrays();});

    };

});
