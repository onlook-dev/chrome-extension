export const consoleLogImage = function (url: string, size = 10) {
    const image = new Image();
    image.src = url;
    image.onload = function () {
        var style = [
            'font-size: 1px;',
            'padding: ' + this.height / 100 * size + 'px ' + this.width / 100 * size + 'px;',
            'background: url(' + url + ') no-repeat;',
            'background-size: contain;'
        ].join(' ');
        console.log('%c ', style);
    };
};