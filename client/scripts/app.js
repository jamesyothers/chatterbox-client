// YOUR CODE HERE:

var testMsg = {
  'username': 'JamesYothers',
  'text': 'I am James',
  'room': '4chan'
};

var app = {
  server: undefined,
  roomList: {},
  friendsList: {},
  room: undefined
};

app.init = function() {
  app.server = 'https://api.parse.com/1/classes/chatterbox';
  app.username = window.location.search.slice(window.location.search.indexOf('=') + 1);
  app.refresh();
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
    data: {order: '-createdAt', where: JSON.stringify({"roomname":app.room})},
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

  var $msgNode = $('<div class="message"></div>');
  var textHtml = '<text class="msgText"> ' + _.escape(message.text) + ' </text>';
  var timeHtml = '<text class="msgTime"> ' + _.escape(message.createdAt) + ' </text>';
  var roomHtml = '<text class="roomname">' + _.escape(message.roomname) + '</text>';
  $msgNode.append(buildUserNode(message.username));
  $msgNode.append($(roomHtml));
  $msgNode.append($(textHtml));
  $msgNode.append($(timeHtml));
  if (app.friendsList[message.username]) {
    //msgNode.wrap('<b></b>');
    $msgNode.css('font-weight', 'bold');
  }
  app.addRoomList(message.roomname);
  // console.log(app.friendsList);
  // console.log(app.friendsList[message.username]);
  // console.log(message.username);
  // console.log($msgNode);
  $('#chats').append($msgNode);
};

app.addRoomList = function(room) {
  console.log("room: " + room);
  if (!app.roomList[room]) {
    app.roomList[room] = true;
    var optionNode = $('<option value="' + _.escape(room) + '">' + _.escape(room) + '</option>');
    $('#roomDrop').append(optionNode);
  }
};

app.addRoom = function(room) {
  var room = $('<div class="room">' + _.escape(room) + '</div>');
  $('#roomSelect').append(room);
  app.refresh();
};

app.addFriend = function(friend) {
  var friendNode = $('<div class="friend">' + _.escape(friend) + '</div>');
  $('#friendsList').append(friendNode);
  app.friendsList[friend] = true;
  app.refresh();
};

app.handleSubmit = function() {
  var message = $('#message')[0].value;
  var msg = {
    'username': app.username,
    'text': message,
    'roomname': app.roomname
  };
  app.send(msg);
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

  $('#send .submit').submit(function(event) {
    app.handleSubmit();
    return false;
  });
  $('#send .submit').on('click', function(event) {
    app.handleSubmit();
    return false;
  });
  $('#roomSubmit').click('on', function() {
    var roomName = $('#newRoom')[0].value;
    app.addRoom(roomName);
  });
});
