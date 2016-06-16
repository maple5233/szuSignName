>#后台API设计

#
>## 概述

<br>
<strong>后端API是在RESTful风格的,发送和返回内容均为`json`数据。<strong>

<br>
若操作成功：

* `GET` 直接返回获取的内容
* `POST` 返回修改或创建的条目的ID，以及成功消息
* `DELETE` 返回成功消息

  
```
正常返回数据：
{
    code : '0',		        // '0' 代表成功
    data : {data}		    // 按实际要求封装
}
```


```
无返回数据：
{
    code : '0',		        // '0' 代表成功
}
```


```
异常返回：
{
    code : '1001'          // 非 '0' 时表示异常代码
}
```

>## 数据

#
>### 老师相关

```

1001 注册
POST /regist
	Params
	{
	    registName	:  String （用户名）
	    registId	:  Number    （校园卡号）
	    registPass  :  String  (校园卡密码)
	}
	Response
	{
	    code : '0'
	}


Response Excetion ： { code : '', msg : ''}
code 	msg
1001A	登录名已存在

```

```

1002 登录
POST /login
	Params
	{
	    loginName	: String （用户名）
	    loginPass	: String （密码）
	}
	Response
	{
	    code : '0'
	}

Response Excetion ： {code : '', msg : ''}
code 	msg
1002A	用户不存在
1002B   密码不正确
1002C   尚未通过认证

```

```

1003 登出
GET /logout
	Params
	null
	Response
	{
	    code : '0'
	}

Response Excetion ： {code : '', msg : ''}
code	 msg
1003A	未知错误

```

```

1004 获取某个老师的所有班级
GET /class
	Params
	{
    	cardId : Number    (老师的校园卡号)
    }
	Response
	{
    	code : '0',
        data : 
        {
        	class : 
        	[{
        		className : String
        	}]
        }
    }

Response Excetion ： {code : '', msg : ''}
code	 msg
1004A	未知错误
1004B   教师不存在

```


>### 管理员相关

```

2001 获取所有班级
GET /manager/class
	Params
    null
	Response
	{
    	code : '0',
        data :
        {
            classInfo : 
            [{
                className : String
            }]
        }
    }

Response Excetion ： {code : '', msg : ''}
code	 msg
2001A	未知错误

```

```

2002 获取所有老师
GET /manager/teacher
	Params
    null
	Response
	{
    	code : '0',
        data : 
        {
            teacherInfo : 
                [{
                    teacherName : String,
                    cardId      : Number,
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

2003 通过老师
PUT /manager/teacher
	Params
    {
    	cardId : Number,
        passed : boolean
    }
	Response
	{
    	code : '0',
    }

Response Excetion ： {code : '', msg : ''}
code	 msg
2003A	未知错误
2003B   老师不存在

```

>### 班级相关

```

3001 获取班级签到时间
GET /signTime
	Params
    {
    	className : String    (班级名称)
    }
	Response
	{
    	code : '0',
        data : 
        {
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
    	className : String    (班级名称)
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
    	className : String    (班级名称)
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
    	className   : String,
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
3004B   信息不完整

```
```

3005 获取签到表
GET [/studentInfo][/timeInfo] //二者择一
	Params
    {
    	className   : String,
        [time        : String]
        [studentName : String]
        //以上二者择一
    }
	Response
	{
    	[{
    	    className   : String,
            time        : String,
            studentNo   : Number,       (学生校园卡号)
            studentName : String,
            signed  	: boolean    (签到状态)
    	}]
    }

Response Excetion ： {code : '', msg : ''}
code	 msg
3004A	未知错误
3004B    信息不完整

```