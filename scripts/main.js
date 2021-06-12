//#region 地图初始化
mapboxgl.accessToken = 'pk.eyJ1Ijoiam9obm55dCIsImEiOiJja2xxNXplNjYwNnhzMm5uYTJtdHVlbTByIn0.f1GfZbFLWjiEayI6hb_Qvg';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/johnnyt/ckp3ijl0l093w17pqe4bl8s9b',
    center: [115.981,29.527],
    zoom: 11.6,
    bearing: 60,
    pitch: 70
});

//放大、缩小以及指北针按钮
let nav = new mapboxgl.NavigationControl();
map.addControl(nav,"top-left");

//比例尺
let scaleBar = new mapboxgl.ScaleControl({
    maxWidth: 80,//控件的最大宽度
    unit: 'metric'//单位为米
});
map.addControl(scaleBar);

map.on('load', function () {
    // add a sky layer that will show when the map is highly pitched
    map.addLayer({
        'id': 'sky',
        'type': 'sky',
        'paint': {
            'sky-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0,
            0,
            5,
            0.3,
            8,
            1
            ],
            'sky-type': 'atmosphere',
            'sky-atmosphere-sun-intensity': 5
        }
    });
});
//#endregion

//#region For Window Control
// 各类的基本信息存储
let layerBasics = {
    'above': {
        layerName: null,  // 对应style中的图层名称
        flySet: { // 传输地图飞行位置参数
            bearing: 0,
            center: [115.986,29.527],
            zoom: 11.3,
            pitch: 0,
            speed: 0.3, 
            curve: 1
        },
        paintColor: null, // 填充颜色 用于创建图例
        icon: null, // 是否为icon 不是为null 是则存储其icon的url
        legendText: null, // 图例的文字标注
        // illustration: null, 
        hasLegend: false // 是否已为其创建图例
    }, 
    'wulaofeng': {
        layerName: 'fiveoldpeakviewpointsimplify', 
        flySet: {
            center: [116.016,29.549],
            zoom: 15,
            bearing: 0, 
            pitch: 75,
            speed: 0.6
        },
        paintColor: null,
        icon: true,
        legendText: '五老峰', 
        //illustration: '', 
        hasLegend: false
    },
    'jingfurong': {
        layerName: 'lushanqifudu100plussmooth', 
        flySet: {
            bearing: 20,
            center: [116.008,29.546],
            zoom: 13.5,
            pitch: 75, 
            speed: 0.6
        },
        paintColor: '#f0f353',
        icon: null,
        legendText: '地形起伏度>100', 
        //illustration: '', 
        hasLegend: false
    },
    'kelanjie' : {
        layerName: 'fiveoldpeak-sight-smooth', 
        flySet: {
            bearing: 165.60,
            center: [116.028212, 29.500114],
            zoom: 12.94,
            pitch: 68.44, 
            speed: 0.6
        },
        paintColor: '#e8eef2',
        icon: null,
        legendText: '五老峰全视域', 
        //illustration: '', 
        hasLegend: false
    }, 
    'songshu': {
        layerName: 'songtree', 
        flySet: {
            bearing: 0,
            center: [115.986,29.527],
            zoom: 12,
            pitch: 0, 
            speed: 0.6
        },
        paintColor: '#33a335',
        icon: null,
        legendText: '松树分布', 
        //illustration: '', 
        hasLegend: false
    }, 
    'rizhao': {
        layerName: 'sundir', 
        flySet: {
            bearing: 0,
            center: [115.962185, 29.474630],
            zoom: 15.03,
            pitch: 47.33, 
            speed: 0.6
        },
        paintColor: '#f0f863',
        icon: null,
        legendText: '太阳直射>4Kwh/㎡', 
        //illustration: '', 
        hasLegend: false
    }, 
    'seepubu': {
        layerName: 'puburange', 
        flySet: {
            bearing: -70.15,
            center: [115.966579, 29.474793],
            zoom: 15.31,
            pitch: 48.30, 
            speed: 0.6
        },
        paintColor: '#0636f4',
        icon: null,
        legendText: '瀑布范围', 
        //illustration: '', 
        hasLegend: false
    }, 
    'zhixia': {
        layerName: 'qifudu', 
        flySet: {
            bearing: 0,
            center: [115.964592, 29.476601],
            zoom: 14.40,
            pitch: 72.08, 
            speed: 0.6
        },
        paintColor: '#f4fdc3',
        icon: null,
        legendText: '起伏度>60', 
        //illustration: '', 
        hasLegend: false
    }, 
    'puburiver': {
        layerName: 'riverrange', 
        paintColor: '#6fc5e7',
        icon: null,
        legendText: '河流', 
        //illustration: '', 
        hasLegend: false
    }, 
    'xianglu': {
        layerName: 'xianglurange', 
        paintColor: '#af4804',
        icon: null,
        legendText: '香炉峰范围', 
        //illustration: '', 
        hasLegend: false
    }, 
    'puburst': {
        layerName: 'puburst', 
        paintColor: '#d3d1cf',
        icon: null,
        legendText: '推测李白位置范围', 
        //illustration: '', 
        hasLegend: false
    }, 
    'nothing': {}
};

let resultView = {
    'wulaofeng': {
        bearing: 165.60,
        center: [116.028212, 29.500114],
        zoom: 12.94,
        pitch: 68.44, 
        speed: 0.6
    },
    'pubu': {
        bearing: -27.38,
        center: [115.962325, 29.476272],
        zoom: 15.62,
        pitch: 45.47, 
        speed: 0.6
    }
};

let resultHtml = {
    'wulaofeng': '<br><a result>请欣赏李白作诗所见之景！</a>', 
    'pubu':'<a result>据诗句分析李白极有可能位于此区域内。</a>'
};
let rstTime = {'wulaofeng':0, 'pubu':0};

// On every scroll event, check which element is on screen
let chapterNames = ["wulaofeng", "pubu"];
window.onscroll = function () {
    for (var i = 0; i < chapterNames.length; i++) {
        var chapterName = chapterNames[i];
        if (isElementOnScreen(chapterName)) {
            setActiveChapter(chapterName);
            break;
        }
    }
};

function ReInvisibleLayers() {
    let names = Object.keys(layerBasics);
    for(let i = 0; i< names.length; i++) {
        if(layerBasics[names[i]].hasLegend == true) {
            map.setLayoutProperty(layerBasics[names[i]].layerName, "visibility", "none");
            document.getElementById('legend').innerHTML = ""; // 清空图例
            layerBasics[names[i]].hasLegend = false;
        }
    }
}

function InitSecChapter() {
    map.flyTo({
        bearing: 0,
        center: [115.969462, 29.472374],
        zoom: 14.28,
        pitch: 12.59, 
        speed: 0.3
    });
    map.setLayoutProperty('riverrange', "visibility", "visible");
    map.setLayoutProperty('xianglurange', "visibility", "visible");
    AddLegend('puburiver');
    AddLegend('xianglu');
}

// 设置当前页面之间位置的卡片为active，激活相应功能
let activeChapterName = 'wulaofeng';

function setActiveChapter(chapterName) {
    if (chapterName === activeChapterName) return;
    ReInvisibleLayers();
    
    n = 0; // 更换chapter重置n
    if(chapterName == "pubu") {
        InitSecChapter();
    }
    
    let activeChapter = document.getElementById(chapterName);
    activeChapter.setAttribute('class', 'active');
    document.getElementById(activeChapterName).setAttribute('class', '');
    
    activeChapterName = chapterName;
}
// 判断是否在屏幕之间位置
function isElementOnScreen(id) {
    var element = document.getElementById(id);
    var bounds = element.getBoundingClientRect();
    return bounds.top < window.innerHeight/2 && bounds.bottom > window.innerHeight/2;// 上端在网页中间之上，下端在网页中间之下
}

// 添加相对应图层的图例
function AddLegend(id) {
    if(layerBasics[id].paintColor && layerBasics[id].hasLegend == false) {
        let item = document.createElement('div');
        let key = document.createElement('span');
        let br = document.createElement('br');
        key.className = 'legend-key';
        key.style.backgroundColor = layerBasics[id].paintColor;
        key.style.borderColor = 'black';
        key.style.borderWidth = '1px';
    
        let text = document.createElement('span');
        text.innerHTML = layerBasics[id].legendText;
        item.appendChild(key);
        item.appendChild(br);
        item.appendChild(text);
        legend.appendChild(item);
        layerBasics[id].hasLegend = true;
    }
}

// 控制各个section中文字的滚动及相应事件
function SectionScrolleDown() {
    let activeSec = document.getElementById(activeChapterName);
    const show = activeSec.querySelector('span[data-show]');
    const next = show.nextElementSibling || activeSec.querySelector('span:first-child');

    let nextId = next.id;
    if(layerBasics[nextId].hasOwnProperty("flySet")) {
        map.flyTo(layerBasics[nextId].flySet);
        AddLegend(nextId);
    }
    if(layerBasics[nextId].layerName) {
        map.setLayoutProperty(layerBasics[next.id].layerName, 'visibility', 'visible');
    }

    const up = activeSec.querySelector('span[data-up]');
    if (up) {
      up.removeAttribute('data-up');
    }
    
    show.removeAttribute('data-show');
    show.setAttribute('data-up', '');
    
    next.setAttribute('data-show', '');
    if(next == activeSec.querySelector('span:first-child')) { // 表示已经看完一遍过程
        ChangeBtnState(0); // 暂停
        ReInvisibleLayers(); // 消除可见的图层和图例
        if(activeChapterName == "pubu") {
            map.setLayoutProperty("puburst", "visibility", "visible");
            AddLegend("puburst");
        }
        map.flyTo(resultView[activeChapterName]);
        if(rstTime[activeChapterName] == 0) {
            next.innerHTML += resultHtml[activeChapterName];
            rstTime[activeChapterName] += 1;
        }
    }
}

// 控制播放按钮设置部分
let loopShow = null; // 存储setInterval
let btn = document.getElementById('ctrButton');
let libaiBg = document.getElementById('libaibg');
let n = 0; // 用于记录当前是否为此部分第一次开始
function ChangeBtnState(state) { // state 1为播放状态 0为暂停状态
    if(state == 1) {
        btn.className = "pause";
        btn.title = "Click to pause and view details";
        libaiBg.removeAttribute('playbg');
        libaiBg.setAttribute('pausebg',"");
        loopShow = window.setInterval(SectionScrolleDown,5000);// 开始setInterval播放
    }
    else {
        btn.className = "play";
        btn.title = "Click to follow Libai";
        libaiBg.removeAttribute('pausebg');
        libaiBg.setAttribute('playbg',"");
        window.clearInterval(loopShow); // 去除setInterval播放
    }
}
btn.onclick = function() {
    if(btn.className == "play") { // 点击按钮播放
        if(n == 0) {
            map.flyTo(layerBasics['above'].flySet);
            n += 1;
        }
        ChangeBtnState(1);
    }
    else { // 点击按钮暂停
        ChangeBtnState(0);
    }
};
//#endregion
