//jshint esversion: 6

var HTTPS = require('https');

var botID = process.env.BOT_ID;

var imageUrls = {
  benStillerImage: "https://i.groupme.com/199x212.jpeg.dc882ad81724453398237fb8cd23620d'",
};

var userIds = {
  luisUserId: "24104270"
};

function respond() {
  var request = JSON.parse(this.req.chunks[0]),
      botRegex = /^\/cool guy$/;

  console.log(request);
  if(request.text && botRegex.test(request.text)) {
    this.res.writeHead(200);
    postMessage("Suhh dude");
    this.res.end();
  } else if (request.text) {
    if (checkCussWords(request.text)) {
      postMessage("Excuse me!!1! This is a Christian minecraft server. Please keep satan language to a minimum. Thank you.");
    } else if (checkLookAtThisDood(request.text)) {
      postMessage("https://www.youtube.com/watch?v=ZXWI9oINBpA", request);
    } else if (isLuisABitch(request.text) && request.user_id == userIds.luisUserId) {
      postMessage("Luis stop being a lil bitch.");
    } else if (checkSamHarris(request.text)) {
      postMessage("", request, imageUrls.benStillerImage);
    } else if (doesJoeRoganJoinChat(request.text)) {
      postMessage("Joe Rogan has joined the chat.");
    } else if (checkAskingAboutMeeting(request.text)) {
      postMessage("SSA Meetings are Wednesdays 5:30-6:30pm in PAR 105");
    }

  } else {
    this.res.writeHead(200);
    this.res.end();
  }
}

function checkCussWords(text) {
  var cussCount = (text.toLowerCase().match(/fuck/g) || []).length;
  cussCount += (text.toLowerCase().match(/shit/g) || []).length;
  cussCount += (text.toLowerCase().match(/bitch/g) || []).length;

  if (cussCount >= 3) {
    return true;
  }
  return false;
}

function doesJoeRoganJoinChat(text) {
  var txt = text.toLowerCase()
  if (txt.indexOf("dmt") > -1 || txt.indexOf("cbd") > -1 || txt.indexOf("shroom") > -1) {
    return true
  }
  return false
}

function isLuisABitch(text) {
  return text.toLowerCase().indexOf("i hate") > -1;
}

function checkLookAtThisDood(text) {
  return text.toLowerCase().match(/dood/);
}

function checkSamHarris(text) {
  return text.toLowerCase().indexOf("sam harris") > -1;
}

function checkAskingAboutMeeting(text) {
  var meetingRegex = /[what\stime|when|where].+meeting/;
  return meetingRegex.test(text);
}

function mention(userId, name) {
  var nameLength = name.length;
  var attachments = {
    "type":"mentions",
    "user_ids":[
      userId
    ],
    "loci":[
      [0,nameLength + 1]
    ]
  };

  return attachments;
}

function image(url) {
  var attachments = {
    "type": "image",
    "url": url,
  };

  return attachments;
}

function postMessage(responseText, request, imageUrl) {
  request = request || null;
  var options, body, botReq;

  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  if (request == null) {
    body = {
      "bot_id" : botID,
      "text" : responseText
    };
  } else {
    body = {
      "attachments" : [mention(request.user_id, request.name),],
      "bot_id" : botID,
      "text" : "@" + request.name + " " + responseText
    };
  }
  if (imageUrl) {
    body.attachments.push(image(imageUrl));
  }


  console.log('sending ' + responseText + ' to ' + botID);
  console.log(body);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}


exports.respond = respond;
