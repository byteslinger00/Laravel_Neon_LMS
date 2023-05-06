// Adapted from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
var _seed = new Date();

function srand(seed) {
  _seed = seed;
}

function rand(min, max) {
  min = valueOrDefault(min, 0);
  max = valueOrDefault(max, 0);
  _seed = (_seed * 9301 + 49297) % 233280;
  return min + (_seed / 233280) * (max - min);
}

function valueOrDefault(arg, def) {
  if(arg != null){
    return arg;
  }else{
    return def;
  }
}

function numbers(config) {
  var cfg = config || {};
  var old = valueOrDefault(cfg.data, []);
  var from = valueOrDefault(cfg.from, []);
  var count = valueOrDefault(cfg.count, 8);
  var decimals = valueOrDefault(cfg.decimals, 8);
  var continuity = valueOrDefault(cfg.continuity, 1);
  var dfactor = Math.pow(10, decimals) || 0;
  var data = [];
  var i, value;

  for (i = 0; i < count; ++i) {
    value = (from[i] || 0) + old[i];
    if (this.rand() <= continuity) {
      data.push(Math.round(dfactor * value) / dfactor);
    } else {
      data.push(null);
    }
  }

  return data;
}

function points(config) {
  const xs = this.numbers(config);
  const ys = this.numbers(config);
  return xs.map((x, i) => ({x, y: ys[i]}));
}

function bubbles(config) {  
  const array1 = config.data;
  let max = Math.max(...array1);
  return this.points(config).map(pt => {
    if(pt.x){      
      pt.r = config.rmax * pt.x / max;
    }else{
      pt.r = config.rmin;
    }
    return pt;
  });
}

function labels(config) {
  var cfg = config || {};
  var min = cfg.min || 0;
  var max = cfg.max || 100;
  var count = cfg.count || 8;
  var step = (max - min) / count;
  var decimals = cfg.decimals || 8;
  var dfactor = Math.pow(10, decimals) || 0;
  var prefix = cfg.prefix || '';
  var values = [];
  var i;

  for (i = min; i < max; i += step) {
    values.push(prefix + Math.round(dfactor * i) / dfactor);
  }

  return values;
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

function months(config) {
  var cfg = config || {};
  var count = cfg.count || 12;
  var section = cfg.section;
  var values = [];
  var i, value;

  for (i = 0; i < count; ++i) {
    value = MONTHS[Math.ceil(i) % 12];
    values.push(value.substring(0, section));
  }

  return values;
}

const COLORS = [
  '#4dc9f6',
  '#f67019',
  '#f53794',
  '#537bc4',
  '#acc236',
  '#166a8f',
  '#00a950',
  '#58595b',
  '#8549ba'
];

function color(index) {
  return COLORS[index % COLORS.length];
}

function transparentize(value, opacity) {
  var alpha = opacity === undefined ? 0.5 : 1 - opacity;
  return colorLib(value).alpha(alpha).rgbString();
}

function convertToTranscolors(colors){
  return colors.map((color) => { 
    return color + Number(60).toString(16);
  })
}

function convertToTransparentColor(color, opacity){
  var alpha = opacity === undefined ? 0.5 : 1 - opacity;
  return color + Number(alpha * 255).toString(16).split(".")[0];
}

function generateRandomColor(){
  let maxVal = 0xFFFFFF; // 16777215
  let randomNumber = Math.random() * maxVal; 
  randomNumber = Math.floor(randomNumber);
  randomNumber = randomNumber.toString(16);
  let randColor = randomNumber.padStart(6, 0);   
  return `#${randColor.toUpperCase()}`
}

function convertToTransCustomColors(colors, alpha){
  return colors.map((color) => { 
    return color + Number(parseInt(alpha * 255)).toString(16).toString();
  })
}

const CHART_COLORS = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(201, 203, 207)'
};

const NAMED_COLORS = [
  CHART_COLORS.red,
  CHART_COLORS.orange,
  CHART_COLORS.yellow,
  CHART_COLORS.green,
  CHART_COLORS.blue,
  CHART_COLORS.purple,
  CHART_COLORS.grey,
];

function namedColor(index) {
  return NAMED_COLORS[index % NAMED_COLORS.length];
}

function newDate(days) {
  return DateTime.now().plus({days}).toJSDate();
}

function newDateString(days) {
  return DateTime.now().plus({days}).toISO();
}

function parseISODate(str) {
  return DateTime.fromISO(str);
}


function generateData(content, colors)
{
    var titles = [];
    for(var i = 1; i < content[0].length; i++){
        titles.push(content[0][i])
    }

    var labels = [];
    for(var j = 1; j < content.length; j++){
        labels.push(content[j][0]);
    }

    var datasets = [];
    for(var k = 0; k < titles.length; k++){
        var tmpData = [];
        for(var v = 1; v < content.length; v++){
            tmpData.push(content[v][k+1]);
        }
        
        var dataset = {
            label: titles[k],
            backgroundColor:  (Array.isArray(colors[k]))?colors[k]:convertToTransparentColor(colors[k], 0.5),
            borderColor: colors[k],
            data: tmpData,
            fill: false,
            borderWidth: 1,
        };
        datasets.push(dataset);
    }

    var data = {
        labels: labels,
        datasets: datasets
    };
    return data;
}
function generatePieData(content, colors)
{
  
  var labels = [];  
  var dataset = [];
  for(var j = 1; j < content.length; j++){
        labels.push(content[j][0]);
  }
  
  

  for(var k=1;k<content[0].length;k++){
    var backgroundColors = []
    var bcolors = [];
    var tmpData = [];
    for(var v = 1; v < content.length; v++){
      tmpData.push(content[v][k]);
      bcolors.push(colors[v]);
      backgroundColors.push( (Array.isArray(colors[v]))?colors[v]:convertToTransparentColor(colors[v], 0.5))
    }
    var datas = {
      label: content[0][k],
      backgroundColor: backgroundColors,
      borderColor: bcolors,
      data: tmpData,
      fill: false,
      borderWidth: 1,
    };
    dataset.push(datas)
  } 
  var data = {
    labels: labels,
    datasets: dataset
  };
  return data;
}
function generateBubbleData(content, colors)
{
    var titles = [];
    for(var i = 1; i < content[0].length; i++){
        titles.push(content[0][i])
    }

    var labels = [];
    for(var j = 1; j < content.length; j++){
        labels.push(content[j][0]);
    }

    var datasets = [];
    for(var k = 0; k < titles.length; k++){
        var tmpData = [];
        for(var v = 1; v < content.length; v++){
            tmpData.push(content[v][k+1]);
        }
        var DATA_COUNT = tmpData.length;
        var NUMBER_CFG = {count: DATA_COUNT, rmin: 5, rmax: 20, data : tmpData};
        var dataset = {
            label: titles[k],
            backgroundColor:  (Array.isArray(colors[k]))?colors[k]:convertToTransparentColor(colors[k], 0.5),
            borderColor: colors[k],
            data: bubbles(NUMBER_CFG),
            fill: false,
            borderWidth: 2,
        };
        datasets.push(dataset);
    }

    var data = {
        labels: labels,
        datasets: datasets
    };
    return data;
}

function invertMatrix(matrix) {
  return matrix.reduce(
    (acc, cv)=> {
      cv.reduce(
        (acc2, cv2, idx2)=> {
          if(acc[idx2]==undefined) acc[idx2]=[];
          acc[idx2].push(cv2);
        },[]
      );
      return acc;
    },[]
  );
};