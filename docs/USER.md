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
PATCH /user/delete-me
```

|Body|Type|Description|
| :-------- | :------- | :------- |
| `password`* | `string` | ... |

## 

### Update settings

```http
PATCH /user/settings
```

|Body|Type|Description|
| :-------- | :------- | :------- |
| `theme` | `string` | Light/Dark |
| `hue` | `number` | between 0-360 |

## 

### Add Task Collection

```http
POST /user/collections
```

|Body|Type|Description|
| :-------- | :------- | :------- |
| `name`* | `string` | ... |
| `hue`* | `number` | between 0-360 |

## 

### Update Task Collection

```http
PATCH /user/collections/:collectionId
```

|Body|Type|Description|
| :-------- | :------- | :------- |
| `name` | `string` | ... |
| `hue` | `number` | between 0-360 |

## 

### Delete Task Collection

```http
DELETE /user/collections/:collectionId
```

