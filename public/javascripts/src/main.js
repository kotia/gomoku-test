require.config({
    baseUrl: '/javascripts/out/',
    paths: {
        "underscore": "../libs/underscore",
        "react": "../libs/react-with-addons",
        "react-dom": "../libs/react-dom",
        "react-redux": "../libs/react-redux.min",
        "redux": "../libs/redux.min"
    },
    shim: {
        'underscore': {
            'exports': '_'
        },
        'react': {
            'exports': 'React'
        }
    }
});




require([
    "index"
], function (index) {
    index.start();
});
