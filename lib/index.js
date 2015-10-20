var xtend = require('xtend');

function authorize(options) {
  var defaults = {
    key:          'user',
    store:        null,
    success:      function (data, accept){
      if (data.socketio_version_1) {
        accept();
      } else {
        accept(null, true);
      }
    },
    fail:         function (data, message, critical, accept) {
      if (data.socketio_version_1) {
        accept(new Error(message));
      } else {
        accept(null, false);
      }
    }
  };

  var auth = xtend(defaults, options);

  auth.wardenKey = 'warden.user.' + auth.key.toLowerCase() + '.key'

  return function(data, accept){
    if (data.request) {
      data = data.request;
      data.socketio_version_1 = true;
    }

    data.sessionID = (data.query && data.query.session_id) || (data._query && data._query.session_id);

    if(!data.sessionID)
      return auth.fail(data, 'A session id query parameter is required.', false, accept);

    auth.store.get(data.sessionID, function(err, session){
      if(err)
        return auth.fail(data, 'Error in session store:\n' + err.message, true, accept);
      if(!session)
        return auth.fail(data, 'No session found with id: ' + data.sessionID, false, accept);

      var userKey = session[auth.wardenKey];
      if(typeof(userKey) === 'undefined')
        return auth.fail(data, 'User not authorized. (User Property not found)', false, accept);

      data['userKey'] = userKey
      auth.success(data, accept);
    });
  };
}
exports.authorize = authorize;
