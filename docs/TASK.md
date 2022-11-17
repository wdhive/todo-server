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

### Add Collection

```http
POST /tasks/{task_id}/collection
```

|Body|Type|Description|
| :-------- | :------- | :------- |
| `collection`* | `string` | Collection ID |

## 

### Delete Collection

```http
DELETE /tasks/{task_id}/collection/{collection_id}
```

## 

### Invite Participants

```http
POST /tasks/{task_id}/participants
```

|Body|Type|Description|
| :-------- | :------- | :------- |
| `user`* | `string` | Participant Id |

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

