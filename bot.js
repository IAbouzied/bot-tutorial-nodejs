//jshint esversion: 6

var HTTPS = require('https');

var botID = process.env.BOT_ID;

var urls = {
  benStillerImage: "https://i.groupme.com/199x212.jpeg.dc882ad81724453398237fb8cd23620d'",
  mango1: "https://i.groupme.com/512x512.jpeg.7ffb11da0be14ced9f060573e4e70927",
  mango2: "https://i.groupme.com/512x512.jpeg.85fff75b16244668aae4e36cbb7bb937",
  mango3: "https://i.groupme.com/512x512.jpeg.7f676d6217464734b6b9d85eaffc9ec6",
  mango4: "https://i.groupme.com/512x512.jpeg.8b109a8595744866a678f508600f0bc4",
  mango5: "https://i.groupme.com/512x512.jpeg.9a38932f66884f79aadc2364f66a9013",
  podcast: "https://www.youtube.com/playlist?list=PLY6l98_nZ6T2WR7Jhb7q4adgkIVy1bM53"
};

var simpleResponses = [
	"k",
	"cool",
	"wow",
	"nice",
	"dope",
	"that's lit",
	"bruh",
	"damn",
	"ok"
]

var mangoStage = 1;
var dickStage = 1;
var messagedAlexander = false;

var userIds = {
  luisUserId: "24104270",
  tarekUserId: "31433361",
  phillipUserId: "48552024",
  ejUserId: "26034029",
  alexandersUserId: "30606247"
};

var lastMentionResponseTime = 0;
var lastMessagedAlexanderTime = 0;
var lastAskedForRideTime = 0;

var mentionResponses = [
  "I have an exam coming up so I can't really talk right now :(",
  "Lets talk next meeting",
  "I'm willing to talk about this but I don't like groupme shoot me a text",
  "Phones about to die I'll follow up later",
  "Driving rn",
];

var randomBibleVerses = [
  '“Slaves, submit yourselves to your masters with all respect, not only to the good and gentle but also to the cruel.” (1 Peter 2:18)',
  '“Wives, submit to your husbands as to the Lord.” (Ephesians 5:22)',
  '“This is what the Lord Almighty says... ‘Now go and strike Amalek and devote to destruction all that they have. Do not spare them, but kill both man and woman, child and infant, ox and sheep, camel and donkey.’” (1 Samuel 15:3)',
  '“I do not permit a woman to teach or to have authority over a man; she must be silent.” (1 Timothy 2:12)',
  '"Master, Moses wrote unto us, If a man&#39;s brother die, and leave his wife behind him, and leave no children, that his brother should take his wife, and raise up seed unto his brother." (Mark 12:19)',
  '"...thou shalt not approach unto a woman to uncover her nakedness, as long as she is put apart for her uncleanness." (Leviticus 18:19)',
];


function respond() {
  var request = JSON.parse(this.req.chunks[0]);
	setTimeout(myRespond, 500, request);
}

function myRespond(request) {
  var botRegex = /^\/cool guy$/;

  console.log(request);
  for (var i=0; i < request.attachments.length; i++) {
    if (request.attachments[i].type == "mentions") {
      console.log(request.attachments[i].user_ids);
    }
  }
  if (request.sender_type != "bot") {
    if(request.text && botRegex.test(request.text)) {
      this.res.writeHead(200);
      postMessage("Suhh dude");
      this.res.end();
    } else if (request.text) {
      if (checkBotMention(request.text)) {
        setTimeout(botMentionResponse, 4 *1000, request.text, request);
      } else if (checkCussWords(request.text)) {
        postMessage("Excuse me!!1! This is a Christian minecraft server. Please keep satan language to a minimum. Thank you.");
      } else if (checkLookAtThisDood(request.text)) {
        postMessage("https://www.youtube.com/watch?v=ZXWI9oINBpA", request);
      } else if (isLuisABitch(request.text) && request.user_id == userIds.luisUserId) {
        postMessage("Luis stop being a lil bitch.");
      } else if (request.text.toLowerCase() === "grow" && request.user_id == userIds.luisUserId) {
        growMangoTree(request);
      } else if (checkSamHarris(request.text)) {
        postMessage("", request, urls.benStillerImage);
      } else if (doesJoeRoganJoinChat(request.text)) {
        postMessage("Joe Rogan has joined the chat.");
      } else if (checkAskingAboutMeeting(request.text)) {
        postMessage("SSA Meetings are Wednesdays 5:30-6:30pm in PAR 105");
      } else if (checkBlackHole(request.text)) {
        postMessage("I am glad to see you are a holes of color ally.");
      } else if (request.text.toLowerCase() === "grow" && request.user_id == userIds.phillipUserId) {
        growDick();
      } else if (request.user_id == userIds.alexandersUserId) {
        crushAlexander(request);
      } else if (checkNeedsRide(request.text, request)) {
      	postMessage("Can I get a ride too?")
      } else if (checkPodcast(request.text)) {
        postMessage("Speaking of podcasts this is one of my personal favorites: " + urls.podcast);
      } else if (checkBible(request.text)) {
        postMessage("Speaking of the Bible, this verse really spoke to me the other day: " + randomBibleVerses[Math.floor(Math.random() * randomBibleVerses.length)], request);
      } else {
      	// 1/75 chance
      	simpleResponse()
      }
    } else if (request.attachments.length > 0 && request.attachments[0].type == "image" && request.user_id == userIds.ejUserId) {
      postMessage("So cute <3 <3 <3")
    }
    else {
      this.res.writeHead(200);
      this.res.end();
    }
  }
}

// OUR CHECKS

function simpleResponse() {
	if (Math.floor(Math.random() * 25) == 0) {
		postMessage(simpleResponses[Math.floor(Math.random()*simpleResponses.length)])
	}
}

function checkCussWords(text) {
  var cussCount = (text.toLowerCase().match(/fuck|shit|bitch/g) || []).length;

  if (cussCount >= 3) {
    return true;
  }
  return false;
}

// function poll(title, itemList) {
//   if ()
//   postMessage("*** NEW POLL ***\n" + title)
//   for(var i = 0; i < itemList.length; i++)  {
//     postMessage("Like this message to vote for " + itemList[i].toUpperCase());
//   }
// }

function doesJoeRoganJoinChat(text) {
  var txt = text.toLowerCase();
  if (txt.indexOf("dmt") > -1 || txt.indexOf("cbd") > -1 || txt.indexOf("shroom") > -1) {
    return true;
  }
  return false;
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

function growDick() {
  switch(dickStage) {
    case 1:
      postMessage("8=D");
      dickStage++;
      break;
    case 2:
      postMessage("8==D");
      dickStage++;
      break;
    case 3:
      postMessage("8===D");
      dickStage++;
      break;
    case 4:
      postMessage("8====D");
      dickStage++;
      break;
    case 5:
      postMessage("8=====D~~~")
      dickStage = 1;
      break;
    default:
      dickStage = 1;
      break;
  }
}

function growMangoTree(request) {

  switch (mangoStage) {
    case 1:
      postMessage("A wild mango tree has appeared!", request, urls.mango1);
      mangoStage++;
      break;
    case 2:
      postMessage("The baby mango tree transforms himself into adolescence! Unfortunately, his peers still think he is a loser for he has no mangos yet.", request, urls.mango2);
      mangoStage++;
      break;
    case 3:
      postMessage("Amazing! Despite being orphaned at birth, the mango tree continues to grow thanks to his new gentle caregiver.", request, urls.mango3);
      mangoStage++;
      break;
    case 4:
      postMessage("Success!! Mangos start to grow! Sadly, not enough mangos to feed the nearby village, which is currently suffering under the cruel fist of fascism.", request, urls.mango4);
      mangoStage++;
      break;
    case 5:
      postMessage("You did it!! The mango tree grew enough mangos to feed the village. All of the mango tree's friends apologized and everyone is happy. All thanks to the one and only Luis!", request, urls.mango5);
      mangoStage = 1;
      break;
    default:
      mangoStage = 1;
      postMessage("uh oh, the mango tree needs more help. Try again!", request);
      break;
  }

}

function checkAskingAboutMeeting(text) {
  var meetingRegex = /[what\stime|when|where].+meeting/;
  return meetingRegex.test(text.toLowerCase());
}

function checkBlackHole(text) {
  var regex = /black\shole/;
  return regex.test(text.toLowerCase());
}

function checkBible(text) {
  return text.toLowerCase().match(/bible/);
}

function checkBotMention(text) {
  var regex = /@cameron|@cam/;
  return regex.test(text.toLowerCase());
}

function checkPodcast(text) {
  var regex = /podcast/;
  return regex.test(text.toLowerCase());
}

function checkNeedsRide(text, request) {
	var regex = /a\sride/;
	var delay = 60 * 60 * 24;
	if (lastAskedForRideTime + delay < request.created_at) {
		lastAskedForRideTime = request.created_at;
		return regex.test(text.toLowerCase());
	}
	return false;
}

function botMentionResponse(text, request) {
  var sexualWordsRegex = /sex|blowjob|naked|suck\smy\sdick|cock|fuck\sme|girlfriend|boyfriend|gay|lesbian/;
  var insultRegex = /fuck\syou|go\sto\shell|i\shate\syou|you\ssuck|suck\smy\sdick|die|dumb|stupid|annoying|leave|stop|shut\sup|be\squiet|fuck\soff/;
  var delay = 7 * 60;
  if (sexualWordsRegex.test(text.toLowerCase())) {
    postMessage("Umm I don't talk to perverts", request);
  } else if (insultRegex.test(text.toLowerCase()) && request.avatar_url != null) {
    postMessage("bruh... look at this dood", request, request.avatar_url);
  } else if (request.created_at > lastMentionResponseTime + delay) {
    lastMentionResponseTime = request.created_at;
    postMessage(mentionResponses[Math.floor(Math.random() * mentionResponses.length)], request);
  } else {
    console.log("Need to wait " + (lastMentionResponseTime + delay - request.created_at));
  }
}

function crushAlexander(request) {
  var delay = 60 * 60 * 24;
  var shouldMessage = Math.floor(Math.random() * 5) == 0;
  if (lastMessagedAlexanderTime + delay < request.created_at) {
    if (messagedAlexander === false && shouldMessage) {
      postMessage("Why do you think that?", request);
      messagedAlexander = true;
    } else if (messagedAlexander) {
      postMessage("Actually sorry nevermind I don't give a shit", request);
      messagedAlexander = false;
      lastMessagedAlexanderTime = request.created_at;
    }
  }
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
  imageUrl = imageUrl || null;
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
