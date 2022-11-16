# User

This page covers everything related to user

# 

<br/>

### Get a new token

```http
GET /user/new-token
```

## 
## 

### Get User

```http
GET /user
```

|Query|Type|Description|
| :-------- | :------- | :------- |
| `settings` | `string` | Also get the settings |

## 

### Update User

```http
PATCH /user
```

|Body|Type|Description|
| :-------- | :------- | :------- |
| `name` | `string` | ... |
| `avatar` | `String \| File(FormData)` | ... |

## 

### Delete User

```http
DELETE /user
```

|Body|Type|Description|
| :-------- | :------- | :------- |
| `password`* | `string` | ... |

## 

### Change Theme

```http
PATCH /user/change-theme
```

|Body|Type|Description|
| :-------- | :------- | :------- |
| `theme` | `string` | Light/Dark |
| `hue` | `number` | between 0-360 |

## 

### Add Task Category

```http
POST /user/task-category
```

|Body|Type|Description|
| :-------- | :------- | :------- |
| `name`* | `string` | ... |
| `hue`* | `number` | between 0-360 |

## 

### Update Task Category

```http
PATCH /user/task-category/{category_id}
```

|Body|Type|Description|
| :-------- | :------- | :------- |
| `name` | `string` | ... |
| `hue` | `number` | between 0-360 |

## 

### Delete Task Category

```http
DELETE /user/task-category/{category_id}
```

