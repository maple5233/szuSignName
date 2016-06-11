#后台API设计

## 概述

后端API是在RESTful风格的基础上进行一些修改而来的，运行在`/api`下。以`class`为例子：

* `GET` `/class` 获取所有班级
* `GET` `/class?id=...` 获取`id`为`...`的歌曲
* `POST` `/class?id=...` 修改`id`为`...`的歌曲
* `POST` `/class` 添加一首歌曲
* `DELETE` `/class?id=...` 删除`id`为`...`的歌曲

返回内容均为`json`数据。

若操作成功：

* `GET` 直接返回获取的内容
* `POST` 返回修改或创建的条目的ID，以及成功消息
* `DELETE` 返回成功消息

> 正常返回数据：
```
{
    code : '0',		// '0' 代表成功
    data : {data}		// 按实际要求封装
}
```

> 无返回数据：
```
{
    code : '0',		// '0' 代表成功
}
```

> 异常返回：
```
{
    code : '1001',           // 非 '0' 时表示异常代码
    msg  : 'error'
}
```

## 数据

### 老师相关

```
1001 注册
POST /register
	Params
	{
	    loginName	: String （用户名）
	    password	: String （密码）
	    cardPass    : String  (校园卡密码)
	}
	Response
	{
	    code : '0'
	}


Response Excetion ： {code : '', msg : ''}
code 	msg
1001A	${loginName}登录名已存在

```

```
1002 登录
POST /login
	Params
	{
	    loginName	: String （用户名）
	    password	: String （密码）
	}
	Response
	{
	    code : '0'
	}

Response Excetion ： {code : '', msg : ''}
code 	msg
1002A	用户不存在
1002B    密码不正确
1002C    用户未通过验证

```

```
1003 登出
GET /logout
	Params
	null
	Response
	{code : '0'}

Response Excetion ： {code : '', msg : ''}
code	 msg
1003A	未知错误

```

```
1004 获取某个老师的所有班级
GET /class
	Params
	{
    	teacherId : int
    }
	Response
	{
    	code : '0',
        data : {
        	class : [{
        				className : String,
            			_id       : int    (班级id)
        			}]
        }
    }

Response Excetion ： {code : '', msg : ''}
code	 msg
1004A	未知错误
1004B    教师不存在

```


### 管理员相关
```
2001 获取所有班级[管理员用]
GET /manager/class
	Params
    null
	Response
	{
    	code : '0',
        data : {
                classInfo : [{
                                className : String,
                                _id       : int    (班级id)
                            }]
        		}
    }

Response Excetion ： {code : '', msg : ''}
code	 msg
2001A	未知错误

```

```
2002 获取所有老师[管理员用]
GET /manager/teacher
	Params
    null
	Response
	{
    	code : '0',
        data : {
                teacherInfo : [{
                				teacherId   : int,
                            	teacherName : String,
                                cardId      : int,
                                cardPass    : String,
                                passed      : boolean
                       		}]
        		}
    }

Response Excetion ： {code : '', msg : ''}
code	 msg
2002A	未知错误

```

```
2003 通过老师[管理员用]
GET /manager/pass
	Params
    {
    	tecaherId : int,
        passed : boolean
    }
	Response
	{
    	code : '0',
    }

Response Excetion ： {code : '', msg : ''}
code	 msg
2002A	未知错误

```

### 班级相关
```
3001 获取班级签到时间
GET /signtime
	Params
    {
    	classId : int
    }
	Response
	{
    	code : '0',
        data : {
        	timeInfo : [String]
        }
    }

Response Excetion ： {code : '', msg : ''}
code	 msg
3001A	未知错误

```
```
3002 获取班级学生列表
GET /student
	Params
    {
    	classId : int
    }
	Response
	{
    	code : '0',
        data : {
        	studentInfo : [String]
        }
    }

Response Excetion ： {code : '', msg : ''}
code	 msg
3002A    未知错误

```
```
3003 开始签到
POST /sign
	Params
    {
    	classId : int
    }
	Response
	{
    	code : '0'
    }

Response Excetion ： {code : '', msg : ''}
code	 msg
3003A	未知错误

```
```
3004 签到
PUT /sign
	Params
    {
    	className   : int,
        time        : String,
        studentNo   : int,       (学号)
        studentName : String,
        signed  	: boolean    (签到状态)
    }
	Response
	{
    	code : '0'
    }

Response Excetion ： {code : '', msg : ''}
code	 msg
3004A	未知错误
3004B    信息不完整

```
