# User

This page covers everything related to user

# 

<br/>

### Get User

```http
GET /account
```

|Query|Type|Description|
| :-------- | :------- | :------- |
| `settings` | `string` | ... |

## 

### Update User

```http
PATCH /account
```

|Body|Type|Description|
| :-------- | :------- | :------- |
| `name` | `string` | ... |
| `image` | `string` | ... |

## 

### Delete User

```http
DELETE /account
```

|Body|Type|Description|
| :-------- | :------- | :------- |
| `password`* | `string` | ... |

## 

### Change Thene

```http
PATCH /account/change-theme
```

|Body|Type|Description|
| :-------- | :------- | :------- |
| `theme` | `string` | Light/Dark |
| `hue` | `number` | between 0-360 |

## 

### Add Task Category

```http
POST /account/task-category
```

|Body|Type|Description|
| :-------- | :------- | :------- |
| `name`* | `string` | ... |
| `hue`* | `number` | between 0-360 |

## 

### Update Task Category

```http
PATCH /account/task-category/{category_id}
```

|Body|Type|Description|
| :-------- | :------- | :------- |
| `name` | `string` | ... |
| `hue` | `number` | between 0-360 |

## 

### Delete Task Category

```http
DELETE /account/task-category/{category_id}
```

