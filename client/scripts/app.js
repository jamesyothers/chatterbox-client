// YOUR CODE HERE:

var testMsg = {
  'username': 'JamesYothers',
  'text': 'I am James',
  'roomname': '4chan'
};

var app = {
  server: undefined
};

app.init = function() {
  app.server = 'https://api.parse.com/1/classes/chatterbox';
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



// render app messages and init refresh logic
$(document).ready(function() {
  // initialize app with messages
  app.init();
  setInterval(app.refresh, 1000);

  app.addMessage(testMsg);
  app.addMessage(testMsg);
  app.addMessage(testMsg);
  app.clearMessages();
});
