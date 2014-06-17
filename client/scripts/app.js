// initialize global object
var app = {
  server: undefined,
  roomList: {},
  friendsList: {},
  room: undefined
};

// initialize server
// get username from URL
// start sequence of getting messages from server
app.init = function() {
  app.server = 'https://api.parse.com/1/classes/chatterbox';
  app.username = window.location.search.slice(window.location.search.indexOf('=') + 1);
  app.refresh();
};

// pass a callback function to request for messages
// that will render the messages on the page
app.refresh = function() {
  app.fetch(app.render);
};

// upload messages submitted in input field
app.send = function(message) {
  $.ajax({
    url: app.server,
    type: 'POST',
    // Parse needs message in JSON format
    // HTTP server requires string of information vs object
    data: JSON.stringify(message),
    // type of content we are sending to server
    contentType: 'application/json',
    // call function on success
    // 'data' is an object with createdAt and objectId properties
    // from the server, about the message we sent
    success: function(data) {
      console.log('chatterbox: Message sent');
    },
    // if not uploaded to server, will trigger 'error' function
    error: function(data) {
      console.error('chatterbox: Failed to send message');
    }
  });
};

// request for messages from server
// utilizing callback for customized functionality dealing with returned data
app.fetch = function(callback) {
  $.ajax({
    url: app.server,
    type: 'GET',
    // type of content we are sending to server is JSON (data sending to server)
    // do not need dataType because JSON is the Parse default for returned data
    contentType: 'application/json',
    // 'where' will default to all messages if app.room is undefined
    // otherwise it will select 'where' app.room name defined, and send back messages only from that room
    // similar to SQL verbiage
    data: {order: '-createdAt', where: JSON.stringify({"roomname":app.room})},
    // returned 'data' with Parse specific properties
    success: function(data) {
      console.log('chatterbox: Messages retrieved');
      // utilize callback for data usage functionality
      callback(data);
    },
    error: function(data) {
      console.error('chatterbox: Failed to retrieve messages');
    }
  });
};

// receives messages to render to page
app.render = function(messages) {
  // empty messages from page
  app.clearMessages();
  // results property of messages is an array of message objects
  var msgs = messages.results;
  for (var i = 0; i < msgs.length; i++) {
    app.addMessage(msgs[i]);
  }
};

// clear messages from page
app.clearMessages = function() {
  $('#chats').empty();
};

// parsing of message obtained from input field
app.addMessage = function(message) {
  // create a DOM node from the message
  var buildUserNode = function(user) {
    // _.escape will escape 4 characters for HTML display
    // limit SSX attacks
    var userHtml = '<a class="username" href="#"> ' + _.escape(user) + ' </a>';
    // convert HTML tag to a DOM node
    var node = $(userHtml);
    // event listener for clicking on user to add to friend list and bold
    node.click('on', function() {
      app.addFriend(user);
    });
    return node;
  };

  // start building our message node
  var $msgNode = $('<div class="message"></div>');
  // build text portion of node, etc.
  var textHtml = '<text class="msgText"> ' + _.escape(message.text) + ' </text>';
  var timeHtml = '<text class="msgTime"> ' + _.escape(message.createdAt) + ' </text>';
  var roomHtml = '<text class="roomname">' + _.escape(message.roomname) + '</text>';
  // construct entire message node to be displayed
  $msgNode.append(buildUserNode(message.username));
  $msgNode.append($(roomHtml));
  $msgNode.append($(textHtml));
  $msgNode.append($(timeHtml));
  // if username is in our friends list bold entire message node
  if (app.friendsList[message.username]) {
    $msgNode.css('font-weight', 'bold');
  }
  // add roomname to room list
  app.addRoomList(message.roomname);
  // append the final message node to the id Chat 'div' element
  $('#chats').append($msgNode);
};

// add room to drop down menu if not already there
app.addRoomList = function(room) {
  if (!app.roomList[room]) {
    app.roomList[room] = true;
    // building and attaching drop down node for new room
    var optionNode = $('<option value="' + _.escape(room) + '">' + _.escape(room) + '</option>');
    $('#roomDrop').append(optionNode);
  }
};

// to add a room by entering input field
// full functionality not complete
app.addRoom = function(room) {
  var room = $('<div class="room">' + _.escape(room) + '</div>');
  $('#roomSelect').append(room);
  app.refresh();
};

// add friend to friend list
// friend list used to bold friends' messages
app.addFriend = function(friend) {
  var friendNode = $('<div class="friend">' + _.escape(friend) + '</div>');
  $('#friendsList').append(friendNode);
  app.friendsList[friend] = true;
  app.refresh();
};

// set message to contents of input field
app.handleSubmit = function() {
  // need to access 0th element b/c $('#message') is an array
  // in this case an array of length 1
  var message = $('#message')[0].value;
  // build msg object for sending to server
  var msg = {
    'username': app.username,
    'text': message,
    'roomname': app.roomname
  };
  app.send(msg);
};

// render app messages and init refresh logic
// initilize the program and set event handlers only after DOM is loaded
$(document).ready(function() {
  // initialize app with messages
  app.init();
  // fetch, delete, and re-display messages every 1 second
  setInterval(app.refresh, 1000);

  app.clearMessages();

  // utilize 'submit' event handler to pass specs
  $('#send .submit').submit(function(event) {
    app.handleSubmit();
    return false;
  });
  // utilize 'click' handler on input field to send message to server
  $('#send .submit').on('click', function(event) {
    app.handleSubmit();
    return false;
  });
  // click handler for user created rooms
  // functionality not fully implemented
  $('#roomSubmit').click('on', function() {
    var roomName = $('#newRoom')[0].value;
    app.addRoom(roomName);
  });
  // when user select a different room on the drop down selector
  // display only messages from that room
  $('#roomDrop').on('change', function() {
    app.room = $('#roomDrop')[0].value;
    app.refresh();
  });
});
