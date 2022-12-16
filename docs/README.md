# Docs

### _Base URL_: https://baby-todo.onrender.com

### _Socket URL_: https://baby-todo.onrender.com

## **[> Check Docs Folder <](https://github.com/BabyDevs/Todo-App.backend/blob/master/docs)**

<br/>

# Remember:

- After sign in you need to provide `authorization` header that will contain `Bearer` token. eg: `Bearer YOUR_TOKEN` and for WebSocket you need send this token as `handshake.auth.token` .

- You also need to provide `exclude-socket` header that will not resend you any data that you don't need. this header will contain your connected socket id.

<br/>
<br/>

# Socket Events:

### `task-update` When someone updates any joined task

### `task-delete` When someone deletes a joined task

### `task-invitation` When someone invites you to join a task

### `task-participant-delete` When someone removes you from a task

