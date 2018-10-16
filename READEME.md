通过post传输mock数据

```
http://localhost:3001/user/info2
{
    "method":"GET", // mock的方法
    "content":{     // mock的数据
        "state":1,
        "message":"success"
    }

```

保存结果为

```
mock数据的状态
{
	"UserInfo2": {
		"url": "/user/info2",
		"POST": {
			"jsonPath": "POSTUserInfo2.json",
			"updateTime": 1539690818669,
			"size": 31
		},
		"GET": {
			"jsonPath": "GETUserInfo2.json",
			"updateTime": 1539690952886,
			"size": 31
		}
	}
}

mock数据的map对象

module.exports = {
	"/user/info2": {
		"POST": "POSTUserInfo2.json",
		"GET": "GETUserInfo2.json"
	}
}
```