function parseUrl(url) {
    var parser = document.createElement("a");
    parser.href = url;
    return parser;
    parser.protocol;
    parser.hostname;
    parser.port;
    parser.pathname;
    parser.search;
    parser.hash;
    parser.host
}