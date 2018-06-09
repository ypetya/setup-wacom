const chainprocess = require('chainprocess');

const toNumber = n => Number(n);
/**
 * The desired dot per pixel resolution is measured against the screen
 * pad resolution = screenX * DPP 
 */
const needToSetResolution = (screenX, padX, DPP) => screenX * DPP > padX;

let deviceName = 'Unknown device';
let videoResolution = [0, 0];
let padArea;

module.exports = DPP => chainprocess(`xrandr | fgrep '*'`)
    .chain(videoLine => videoLine.split(' ')[0])
    .chain(videoStr => videoResolution = videoStr.split('x').map(toNumber))

    .chain(`xsetwacom --list devices`)
    .chain(lines => lines.split('\n').find(n => n.indexOf('stylus') > -1))
    .chain(stylusLine => deviceName = stylusLine.split('\t')[0].trim())
    .chain(deviceName => `xsetwacom --get "${deviceName}" Area`)
    .chain()
    .chain(areaStr => padArea = areaStr.split(' ').map(toNumber))
    .chain(padArea =>
        needToSetResolution(videoResolution[0], padArea[2], DPP) ?
            `xsetwacom --set "${deviceName}" Area 0 0 ${videoResolution[0] * DPP} ${Math.floor(videoResolution[0] * DPP * padArea[3] / padArea[2])}` :
            () => console.log('Resolution already set.')
    )
    .chain();
