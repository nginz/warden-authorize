# warden-authorize

> Authorize access to [socket.io](http://socket.io) against [warden](https://github.com/hassox/warden)-based sessions.


## Installation

```
npm install warden-authorize
```

## Example usage


```javascript

// initialize our modules
var io               = require("socket.io")(server),
    sessionStore     = require('sharedSessionStore'),
    WardenAuth       = require("warden-authorize");

io.use(WardenAuth.authorize({
  key:          'user',       // *optional* (default: user) the name of the model for warden session
  store:        sessionStore,        // we NEED to use a sessionstore. no memorystore please
  success:      onAuthorizeSuccess,  // *optional* callback on success
  fail:         onAuthorizeFail,     // *optional* callback on fail/error
}));

function onAuthorizeSuccess(data, accept){
  console.log('successful connection to socket.io');

  // The accept-callback still allows us to decide whether to
  // accept the connection or not.
  accept(null, true);
}

function onAuthorizeFail(data, message, error, accept){
  console.log('failed connection to socket.io:', message);

  if(error)
    accept(new Error(message));
}
```

## Client-side
You have to provide the session-id as a query parameter like this. 
```javascript
socket = io.connect(socketIOURL, {
  // Note: you can get <server-session-id> from the session_id cookie
  query: 'session_id=' + '<server-session-id>'
});
```
