# Task

This page covers everything related to Task

# 

<br/>

### Get All Tasks

```http
GET /tasks
```

## 

### Create Task

```http
POST /tasks
```

|Body|Type|Description|
| :-------- | :------- | :------- |
| `title`* | `string` | ... |
| `description`* | `string` | ... |
| `startingDate` | `date` | ... |
| `endingDate` | `date` | ... |
| `participants` | `array` | ... |
| `collection` | `string` | ... |

## 

### Update Task

```http
PATCH /tasks/:taskId
```

|Body|Type|Description|
| :-------- | :------- | :------- |
| `title` | `string` | ... |
| `description` | `string` | ... |
| `startingDate` | `date` | ... |
| `endingDate` | `date` | ... |
| `participants` | `array` | ... |
| `collection` | `string` | ... |

## 

### Delete Task

```http
DELETE /tasks/:taskId
```

## 

### Complete Task

```http
PATCH /tasks/:taskId/complete
```

## 

### Uncomplete Task

```http
PATCH /tasks/:taskId/uncomplete
```

## 

### Remove Participant

```http
DELETE /tasks/:taskId/participants/{user}
```

## 

### Change Participant Role

```http
PATCH /tasks/:taskId/participants/:userId
```

|Body|Type|Description|
| :-------- | :------- | :------- |
| `role`* | `string` | admin \| assigner |

