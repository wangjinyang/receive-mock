var express = require('express');
var router = express.Router();
var config = require('../config/index');

var util = require('../util/index');

var minInterval = config.updateInterval * 1000;

var mockStatus = util.getMockStatus();

router.all('*', function(req, res, next) {
    if (global.mockLock) {
        return res.json({state: 1, message: 'mock server is busy'});
    }
    var pathName = util.handelBaseUrl(req.baseUrl);
    if (!pathName) {
        return res.json({state: 2, message: 'mock url error', url: req.baseUrl});
    }
    var body = req.body;
    var method = body.method || 'GET';
    method = method.toLocaleUpperCase()
    var content = body.content || {};
    var contentStr = JSON.stringify(content);
    if (content) {
        if (!content.state || content.state !== 1) {
            return res.json({state: 1, message: 'content is error', content: content});
        }
    }
    if (!mockStatus[pathName] || !mockStatus[pathName][method]) {
        console.log(3333)
        mockStatus = util.updateMockStatus(mockStatus, pathName, content, contentStr, req.baseUrl, method);
    }
    else {
        var pathItem = mockStatus[pathName][method];
        if (pathItem && pathItem.size < contentStr.length && new Date().getTime() - pathItem.updateTime >= minInterval) {
            mockStatus = util.updateMockStatus(mockStatus, pathName, content, contentStr, req.baseUrl, method);
        }
    }
    return res.json({state: 1, message: 'get mock data success'});
});


module.exports = router;
