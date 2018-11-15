var fs = require('fs');
var path = require('path');

var config = require('../config/index');


var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？%+_]", 'g');

var mockStatusWriteFileTimer = null;

var mockDataStorageDir = config.mockDataStorageDir;
var mockDataDir = config.mockDataDir;

var mockStatusStatusFile = config.mockStatusStatusFilePath;
var mockDataMapFilePath = config.mockDataMapFilePath;

function getMockStatus() {
    var mockStatus = {};
    try {
        mockStatus = fs.readFileSync(mockStatusStatusFile, 'utf-8');
        mockStatus = JSON.parse(mockStatus);
    }
    catch (e) {
        console.log(e);
    }
    return mockStatus;
}

function setMockStatus(mockStatus) {
    try {
        fs.writeFileSync(mockStatusStatusFile, JSON.stringify(mockStatus, null, '\t'));
    }
    catch (e) {
        console.log(e);
    }
    return mockStatus;
}

function updateMockStatus(mockStatus, pathName, content, contentStr, baseUrl, method) {
    if (!mockStatus[pathName]) {
        mockStatus[pathName] = {};
        mockStatus[pathName]['url'] = baseUrl;
    }
    var jsonPath = path.join(method + pathName + config.extend);
    mockStatus[pathName][method] = {
        jsonPath: jsonPath,
        updateTime: new Date().getTime(),
        size: contentStr.length || 0
    };
    fs.writeFile(path.join(mockDataStorageDir + jsonPath), contentStr, 'utf-8', function (err, data) {
        if (err) {
            console.log('error 创建文件失败，文件路径:' + jsonPath);
        }
        else {
            console.log('success 创建文件成功，文件路径:' + jsonPath);
        }
    });
    if (mockStatusWriteFileTimer) {
        clearTimeout(mockStatusWriteFileTimer);
    }
    mockStatusWriteFileTimer = setTimeout(function () {
        setMockStatus(mockStatus);
        updateMockDataMap(mockStatus);
    }, 10000);
    return mockStatus;
}

function updateMockDataMap(mockStatus) {
    var tempObj = {};
    var mockStatusKeys = Object.keys(mockStatus);
    mockStatusKeys.forEach(function (item) {
        var mockStatusItem = mockStatus[item];
        var itemKeys = Object.keys(mockStatusItem);
        if (itemKeys.length > 1) {
            tempObj[mockStatusItem['url']] = {};
            var tempObjUrl = tempObj[mockStatusItem['url']];
            itemKeys.forEach(function (itemKey) {
                if (itemKey !== 'url') {
                    tempObjUrl[itemKey] = mockDataDir + mockStatusItem[itemKey]['jsonPath'];
                }
            });
        }
    });
    try {
        fs.writeFile(mockDataMapFilePath, 'module.exports = ' + JSON.stringify(tempObj, null, '\t'));
    }
    catch (e) {
        console.log(e);
    }
    return tempObj;
}

function handelBaseUrl(url) {
    if (!url || typeof url !== 'string') {
        return '';
    }
    var extend = path.extname(url);
    var tempUrl = '';
    if (extend) {
        tempUrl = url.slice(0, url.indexOf(extend));
    }
    else {
        tempUrl = url;
    }
    var tempArr = tempUrl.split('/');
    tempArr = tempArr.map(function (item) {
        return filterStr(decodeURIComponent(item));
    });
    if (tempArr.length >= 5) {
        tempArr = tempArr.slice(0, 6);
    }
    return tempArr.join('');
}

function filterStr(str) {
    var specialStr = '';
    specialStr += str.replace(pattern, '');
    if (specialStr.length > 0) {
        specialStr = specialStr.slice(0, 1).toUpperCase() + specialStr.slice(1);
    }
    return specialStr;
}

module.exports = {
    getMockStatus: getMockStatus,
    setMockStatus: setMockStatus,
    handelBaseUrl: handelBaseUrl,
    updateMockStatus: updateMockStatus,
};