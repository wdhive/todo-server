# User

This page covers everything related to user

# 

<br/>

### Get User

```http
GET /user
```

|Query|Type|Description|
| :-------- | :------- | :------- |
| `settings` | `string` | ... |

## 

### Update User

```http
PATCH /user
```

|Body|Type|Description|
| :-------- | :------- | :------- |
| `name` | `string` | ... |
| `avatar` | `string` | ... |

## 

### Delete User

```http
DELETE /user
```

|Body|Type|Description|
| :-------- | :------- | :------- |
| `password`* | `string` | ... |

## 

### Change Thene

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

