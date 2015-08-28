require.config({
    baseUrl: './',
    paths: {
        'q': 'bower_components/q/q',
        'jquery': 'bower_components/jquery/dist/jquery.min',
        'bootstrap': 'bower_components/bootstrap/dist/js/bootstrap.min',
        'angular': 'bower_components/angular/angular',
        'lodash': 'scripts/utils/_mixins',
        'modules': 'scripts/utils/modules',
        'lodash_src': 'bower_components/lodash/lodash',

        'index': 'scripts/index'
    },
    shim: {
        'modules': {
            deps: ['lodash']
        },
        'lodash': {
            deps: ['lodash_src'],
            exports: 'lodash'
        },
        q: {
            exports: 'q'
        },
        'angular': {
            deps: ['jquery'],
            exports: 'angular'
        },
        'ngDraggable': {
            deps: ['angular'],
            exports: 'ngDraggable'
        }
    }
});
