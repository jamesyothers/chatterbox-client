// YOUR CODE HERE:

var testMsg = {
  'username': 'JamesYothers',
  'text': 'I am James',
  'room': '4chan'
};

var app = {
  server: undefined,
  roomList: {},
  friendsList: {}
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
  var buildUserNode = function(user) {
    var userHtml = '<a class="username" href="#"> ' + _.escape(user) + ' </a>';
    var node = $(userHtml);
    node.click('on', function() {
      app.addFriend(user);
    });
    return node;
  };

  var msgNode = $('<div class="message"></div>');
  var textHtml = '<text class="msgText"> ' + _.escape(message.text) + ' </text>';
  var timeHtml = '<text class="msgTime"> ' + _.escape(message.createdAt) + ' </text>';
  msgNode.append(buildUserNode(message.username));
  msgNode.append($(textHtml));
  msgNode.append($(timeHtml));
  $('#chats').append(msgNode);
};

app.addRoom = function(room) {
  var room = $('<div class="room">' + _.escape(room) + '</div>');
  $('#roomSelect').append(room);
};

app.addFriend = function(friend) {
  var friendNode = $('<div class="friend">' + _.escape(friend) + '</div>');
  $('#friendsList').append(friendNode);
  app.friendsList[friend] = true;
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
    app.addRoom(roomName);
  });
});
