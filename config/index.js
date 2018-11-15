var path = require('path');

module.exports = {
    mockStatusStatusFilePath: path.join(__dirname, '../mockDir/mockStatus.json'), // 保存mock数据的状态，增量保存数据
    mockDataMapFilePath: path.join(__dirname, '../mockDir/mockDataMap.js'), // 保存mock数据map对象
    mockDataStorageDir: path.join(__dirname, '../mockDir/mockData/'), // 保存mock数据的目录
    mockDataDir: '/mockData/', // 保存mock数据的目录
    updateInterval: 60, // 默认更新时间
    extend: '.json' // 默认生成文件的后缀
};