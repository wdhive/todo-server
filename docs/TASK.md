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

## 

### Update Task

```http
PATCH /tasks/{task_id}
```

|Body|Type|Description|
| :-------- | :------- | :------- |
| `title` | `string` | ... |
| `description` | `string` | ... |
| `startingDate` | `date` | ... |
| `endingDate` | `date` | ... |
| `participants` | `array` | ... |

## 

### Delete Task

```http
DELETE /tasks/{task_id}
```

## 

### Complete Task

```http
PATCH /tasks/{task_id}/complete
```

## 

### Uncomplete Task

```http
PATCH /tasks/{task_id}/uncomplete
```

## 

### Remove Participant

```http
DELETE /tasks/{task_id}/participants/{user}
```

## 

### Change Participant Role

```http
PATCH /tasks/{task_id}/participants/{user}
```

|Body|Type|Description|
| :-------- | :------- | :------- |
| `role`* | `string` | admin \| moderator \| assigner |

