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
| `completed` | `boolean` | ... |

## 

### Add Category

```http
POST /tasks/{task_id}/category
```

|Body|Type|Description|
| :-------- | :------- | :------- |
| `category` | `string` | Category ID |

## 

### Delete Category

```http
DELETE /tasks/{task_id}/category/{category_id}
```

## 

### Invite Participants

```http
POST /tasks/{task_id}/participants
```

|Body|Type|Description|
| :-------- | :------- | :------- |
| `participant`* | `string` | Participant Id |

## 

### Remove Participant

```http
DELETE /tasks/{task_id}/participants/{participantId}
```

## 

### Change Participant Role

```http
PATCH /tasks/{task_id}/participants/{participantId}
```

|Body|Type|Description|
| :-------- | :------- | :------- |
| `role` | `string` | admin | mod | assigner |

