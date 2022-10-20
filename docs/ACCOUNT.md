# Account

This page covers everything related to authentication

# 

<br/>

### Get an OTP to verify your email

```http
POST /account/request-email-verify
```

|Body|Type|Description|
| :-------- | :------- | :------- |
| `email`* | `string` | ... |

## 

### Signup

```http
POST /account/signup
```

|Body|Type|Description|
| :-------- | :------- | :------- |
| `email`* | `string` | ... |
| `username`* | `string` | ... |
| `name`* | `string` | ... |
| `avatar` | `string` | ... |
| `password`* | `string` | ... |
| `code`* | `string` | ... |

## 

### Login

```http
POST /account/login
```

|Body|Type|Description|
| :-------- | :------- | :------- |
| `login`* | `string` | login should contain `email` or `username` |
| `password`* | `string` | ... |

## 

### Forget Password

```http
POST /account/password-forget
```

|Body|Type|Description|
| :-------- | :------- | :------- |
| `login`* | `string` | login should contain `email` or `username` |

## 

### Reset Password

```http
POST /account/password-reset
```

|Body|Type|Description|
| :-------- | :------- | :------- |
| `login`* | `string` | login should contain `email` or `username` |
| `code`* | `string` | The code you received in the email |
| `new_password`* | `string` | ... |

## 

### Update Email

```http
PATCH /account/change-email
```

|Body|Type|Description|
| :-------- | :------- | :------- |
| `password`* | `string` | ... |
| `new_email`* | `string` | new email |
| `code`* | `string` | The code you received in the email |

## 

### Update Username

```http
PATCH /account/change-username
```

|Body|Type|Description|
| :-------- | :------- | :------- |
| `password`* | `string` | current password |
| `new_username`* | `string` | new username |

## 

### Update Password

```http
PATCH /account/change-password
```

|Body|Type|Description|
| :-------- | :------- | :------- |
| `password`* | `string` | current password |
| `new_password`* | `string` | new password |

