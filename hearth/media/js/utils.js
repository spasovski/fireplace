define('utils', ['jquery', 'underscore'], function($, _) {
    _.extend(String.prototype, {
        strip: function(str) {
            // Strip all whitespace.
            return this.replace(/\s/g, '');
        }
    });

    function _pd(func) {
        return function(e) {
            e.preventDefault();
            if (func) {
                func.apply(this, arguments);
            }
        };
    }

    function escape_(s) {
        if (s === undefined) {
            return;
        }
        return s.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;')
                .replace(/'/g, '&#39;').replace(/"/g, '&#34;');
    }

    function fieldFocused(e) {
        var tags = /input|keygen|meter|option|output|progress|select|textarea/i;
        return tags.test(e.target.nodeName);
    }

    function querystring(url) {
        var qpos = url.indexOf('?');
        if (qpos === -1) {
            return {};
        } else {
            return getVars(url.substr(qpos + 1));
        }
    }

    function baseurl(url) {
        return url.split('?')[0];
    }

    function encodeURIComponent() {
        return window.encodeURIComponent.apply(this, arguments).replace(/%20/g, '+');
    }

    function decodeURIComponent() {
        return window.decodeURIComponent.apply(this, arguments).replace(/\+/g, ' ');
    }

    function urlencode(kwargs) {
        var params = [];
        if ('__keywords' in kwargs) {
            delete kwargs.__keywords;
        }
        var keys = _.keys(kwargs).sort();
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var value = kwargs[key];
            if (value === undefined) {
                params.push(encodeURIComponent(key));
            } else {
                params.push(encodeURIComponent(key) + '=' +
                            encodeURIComponent(value));
            }
        }
        return params.join('&');
    }

    function urlparams(url, kwargs) {
        return baseurl(url) + '?' + urlencode(_.defaults(kwargs, querystring(url)));
    }

    function urlunparam(url, params) {
        var qs = querystring(url);
        for (var i = 0, p; p = params[i++];) {
            if (!(p in qs)) {
                continue;
            }
            delete qs[p];
        }
        var base = baseurl(url);
        if (_.isEmpty(qs)) {
            return base;
        }
        return base + '?' + urlencode(qs);
    }

    function getVars(qs, excl_undefined) {
        if (typeof qs === 'undefined') {
            qs = location.search;
        }
        if (qs && qs[0] == '?') {
            qs = qs.substr(1);  // Filter off the leading ? if it's there.
        }
        if (!qs) return {};

        return _.chain(qs.split('&'))  // ['a=b', 'c=d']
                .map(function(c) {return c.split('=').map(decodeURIComponent);}) //  [['a', 'b'], ['c', 'd']]
                .filter(function(p) {  // [['a', 'b'], ['c', undefined]] -> [['a', 'b']]
                    return !!p[0] && (!excl_undefined || !_.isUndefined(p[1]));
                }).object()  // {'a': 'b', 'c': 'd'}
                .value();
    }

    return {
        '_pd': _pd,
        'escape_': escape_,
        'fieldFocused': fieldFocused,
        'getVars': getVars,
        'urlparams': urlparams,
        'urlunparam': urlunparam,
        'baseurl': baseurl,
        'querystring': querystring,
        'urlencode': urlencode
    };

});
