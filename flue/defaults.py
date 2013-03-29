from datetime import date, timedelta
import random

dummy_text = 'foo bar zip zap cvan fizz buzz something something'.split()

def ptext(len=10):
    return ' '.join(random.choice(dummy_text) for i in xrange(len))


def rand_bool():
    return random.choice((True, False))


def category(slug, name):
    return {
        'name': name,
        'slug': slug,
    }


MESSAGES = [
    ['be careful, cvan made it', 'loljk'],
    ["it's probably a game or something"],
    None
]

SCREENSHOT_MAP = [
    (70, 70367),
    (78, 78540),
    (72, 72384),
]

def _app_preview():
    url = ('https://marketplace-dev-cdn.allizom.org/'
           'img/uploads/previews/%%s/%d/%d.png' %
               random.choice(SCREENSHOT_MAP))
    return {
        'caption': ptext(5),
        'thumbURL': url % 'thumbs',
        'fullURL': url % 'full',
    }


def app(name, slug, **kwargs):
    # In the API everything here except `user` should be serialized and
    # keyed off app_id:region:locale.
    data = {
        'name': name,
        'slug': random.choice(dummy_text),
        'summary': kwargs.get('summary', ptext(50)),
        'description': kwargs.get('description', ptext(100)),
        'is_packaged': False,
        'manifest_url':
            'http://%s%s.testmanifest.com/manifest.webapp' % (ptext(1), random.randint(1, 50000)),  # Minifest if packaged
        'current_version': {
            'version': '%d.0' % int(random.random() * 20),
            'release_notes': kwargs.get('release_notes', ptext())
        },
        'icons': {
            16: '/media/img/icons/firefox-beta.png',
            48: '/media/img/icons/firefox-beta.png',
            64: '/media/img/icons/firefox-beta.png',
            128: '/media/img/icons/firefox-beta.png'
        },
        'previews': [_app_preview() for i in range(4)],
        'image_assets': {
            'desktop_tile': ['/media/img/icons/firefox-beta.png',
                             int(random.random() * 255)],
            'featured_tile': ['/media/img/icons/firefox-beta.png',
                              int(random.random() * 255)],
            'mobile_tile': ['/media/img/icons/firefox-beta.png',
                            int(random.random() * 255)],
        },
        'listed_authors': [
            {'name': 'basta'},
            {'name': 'cvan'},
            {'name': 'Chris Van Halen'}
        ],
        'reviews': {
            'average': random.random() * 4 + 1,
            'count': int(random.random() * 500),
        },
        'notices': random.choice(MESSAGES),
        'support_email': 'support@%s.com' % slug,
        'homepage': 'http://marketplace.mozilla.org/',
        'privacy_policy': kwargs.get('privacy_policy', ptext()),
        'public_stats': False,
        'upsell': False,
        # or { // False if no upsell or not available in user region.
        #    slug: 'slug',
        #    name: name,
        #    icons: ...,
        # },
        'content_ratings': {
            'dejus': {'name': '12', 'description': 'Ask your parents'},
            'esrb': {'name': 'L', 'description': 'L for BASTA'},
        },
    }
    data.update(app_user_data(data))
    return data


def app_user_data(data):
    data.update({
        'price': '0.00',
        'user': {
            'owns': rand_bool(),
            'has_purchased': rand_bool(),
            'can_review': rand_bool()
        }
    })
    if data['user']['can_review']:
        data['rating'] = random.randint(1, 5)
        data['user']['has_review'] = rand_bool()
    return data


def app_user_review(slug, **kwargs):
    data = {
        'body': kwargs.get('review', ptext()),
        'rating': 4
    }
    return data


user_names = ['Cvan', 'Basta', 'Potch', 'Queen Krupa']

def rand_posted():
    rand_date = date.today() - timedelta(days=random.randint(0, 600))
    return rand_date.strftime('%b %d %Y %H:%M:%S')

def rating():
    return {
        'id': random.randint(1000, 9999),
        'user_name': random.choice(user_names),
        'rating': 4,
        'body': ptext(20),
        'for_old_version': False,  # False or the old version number
        'is_flagged': False,
        'posted': rand_posted()
    }
