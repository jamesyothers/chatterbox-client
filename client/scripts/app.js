// YOUR CODE HERE:

var testMsg = {
  'username': 'JamesYothers',
  'text': 'I am James',
  'room': '4chan'
};

var app = {
  server: undefined
};

app.init = function() {
  app.server = 'https://api.parse.com/1/classes/chatterbox';
  app.refresh();
  app.username = window.location.search.slice(window.location.search.indexOf('=') + 1);
  app.room = '4chan';
};

app.refresh = function() {
  app.fetch(app.render);
};

app.send = function(message) {
  $.ajax({
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function(data) {
      console.log('chatterbox: Message sent');
    },
    error: function(data) {
      console.error('chatterbox: Failed to send message');
    }
  });
};

app.fetch = function(callback) {
  $.ajax({
    url: app.server,
    type: 'GET',
    contentType: 'application/json',
    data: {order: '-createdAt'},
    success: function(data) {
      console.log('chatterbox: Messages retrieved');
      callback(data);
    },
    error: function(data) {
      console.error('chatterbox: Failed to retrieve messages');
    }
  });
};

app.render = function(messages) {
  app.clearMessages();
  var msgs = messages.results;
  for (var i = 0; i < msgs.length; i++) {
    app.addMessage(msgs[i]);
  }
};

app.clearMessages = function() {
  $('#chats').empty();
};

app.addMessage = function(message) {
  var msgNode = $('<div class="message"></div>');
  var userHtml = '<text class="msgUser"> ' + _.escape(message.username) + ' </text>';
  var textHtml = '<text class="msgText"> ' + _.escape(message.text) + ' </text>';
  var timeHtml = '<text class="msgTime"> ' + _.escape(message.createdAt) + ' </text>';
  msgNode.append($(userHtml));
  msgNode.append($(textHtml));
  msgNode.append($(timeHtml));
  $('#chats').append(msgNode);
};

app.addRoom = function(room) {
  var room = $('<div class="room">' + _.escape(room) + '</div>');
  $('#roomSelect').append(room);
};

// render app messages and init refresh logic
$(document).ready(function() {
  // initialize app with messages
  app.init();
  setInterval(app.refresh, 1000);

  app.addMessage(testMsg);
  app.addMessage(testMsg);
  app.addMessage(testMsg);
  app.clearMessages();

  $('#msgSubmit').click('on', function() {
    var message = $('#newText')[0].value;
    var msg = {
      'username': app.username,
      'text': message,
      'room': '4chan'
    };
    // console.log(msg);
    // app.refresh();
    app.send(msg);
  });
  $('#roomSubmit').click('on', function() {
    var roomName = $('#newRoom')[0].value;
    console.log('roomName' + roomName);
    app.addRoom(roomName);
  });
});
