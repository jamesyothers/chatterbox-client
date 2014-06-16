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
  app.fetch();
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

app.fetch = function() {
  $.ajax({
    url: app.server,
    type: 'GET',
    contentType: 'application/json',
    success: function(data) {
      console.log('chatterbox: Message sent');
      app.render(data);
    },
    error: function(data) {
      console.error('chatterbox: Failed to send message');
    }
  });
};

app.render = function(messages) {
  console.log("===== ENTERING RENDER =====");
};

// initialize app with messages
app.init();

// render app messages and init refresh logic
$(document).ready(function() {
  app.render();
});
