//jshint esversion: 6

var HTTPS = require('https');
var axios = require('axios');

var botID = process.env.BOT_ID;

var urls = {
  benStillerImage: "https://i.groupme.com/199x212.jpeg.dc882ad81724453398237fb8cd23620d",
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
	"bruh",
	"damn",
	"ok"
];

var mangoStage = 1;
var dickStage = 1;
var messagedAlexander = false;

var userIds = {
  luisUserId: "24104270",
  tarekUserId: "31433361",
  phillipUserId: "48552024",
  ejUserId: "26034029",
  alexandersUserId: "30606247",
  elizasId: "38581233",
  kristensId: "60539381",
  elizabethsId: "60967504",
  ibrahimsId: "38190059",
  adamsId: "30279300"
};

var timers = {
  lastMentionResponseTime: 0,
  lastMessagedAlexanderTime: 0,
  lastAskedForRideTime: 0,
  lastCheckedCussWordsTime: 0,
  lastDoodVideoTime: 0,
  lastBenStillerPicTime: 0,
  lastJoeRoganChatTime: 0,
  lastBlackHolesTime: 0,
  lastPodcastTime: 0,
  lastBibleTime: 0,
  lastCatTime: 0,
  lastMeetingTime: 0,
  lastRespondToJoinTime: 0,
  lastRespondToLeaveTime: 0
};


var mentionResponses = [
  "I have an exam coming up so I can't really talk right now :(",
  "Lets talk next meeting 👍",
  "I'm willing to talk about this but I don't like groupme shoot me a text",
  "Phones about to die I'll follow up later",
  "Driving rn",
];

var ejCatResponses = [
  "So cute <3 <3 <3",
  "Awwww",
  "That's adorable 😍",
  "omg what a floof ball 😍",
  "😭😍"
];

var randomBibleVerses = [
  '“Slaves, submit yourselves to your masters with all respect 💯, not only to the good and gentle 😇 but also to the cruel 👿.” (1 Peter 2:18)',
  '“Wives, submit to your husbands 🏈 as to the Lord 🙌.” (Ephesians 5:22)',
  '“This is what the Lord 🎅 Almighty says... ‘Now go and strike 👊 Amalek and devote to destruction all that they have. Do not 🚫 spare them 🚫, but kill both man 👨‍🔧 and woman 🙍‍♀️, child 🧒 and infant 👶, ox 🐂 and sheep 🐑, camel 🐪 and donkey 🐴.’” (1 Samuel 15:3)',
  '“I do not permit a woman to teach 👩‍🏫 or to have authority over a man 💪; she must be silent 🤫.” (1 Timothy 2:12)',
  '"Master, Moses wrote 📝 unto us, If a man&#39;s brother die 💀, and leave his wife behind him 😜, and leave no children 😏, that his brother should take his wife 🤪, and raise up seed 🌱 unto his brother." (Mark 12:19)',
  '"...thou shalt not approach unto a woman to uncover her nakedness 🍑, as long as she is put apart for her uncleanness 🍷." (Leviticus 18:19)',
];

var greetings = [
  "Hey welcome to the org! So glad you joined! 😄",
  "Hi I am Cameron I can't wait to meet you! 😄",
  "Yaay a new friend! Can't wait to meet you! 😊"
]

var eventReactions = [
  "I'm so excited!",
  "Its gonna be LIT! 🔥",
  "Lets fuckin goooooooo!"
]


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
    } else if (request.attachments.length > 0 && request.attachments[0].type == "image" && request.user_id == userIds.ejUserId) {
      postMessage(ejCatResponses[Math.floor(Math.random() * ejCatResponses.length)]);
    } else if (request.text) {
      if (checkBotMention(request)) {
        //setTimeout(botMentionResponse, 4 *1000, request.text, request);
        postMessage("Please don't spam the chat.", request)
      } else if (checkCussWords(request)) {
        postMessage("Excuse me!!1! This is a Christian minecraft server 🙏😤. Please keep satan language to a minimum 👿🚫. Thank you.");
      } else if (checkLookAtThisDood(request)) {
        postMessage("https://www.youtube.com/watch?v=ZXWI9oINBpA", request);
      } else if (isLuisABitch(request.text) && request.user_id == userIds.luisUserId) {
        postMessage("Luis stop being a lil bitch.");
      } else if (request.text.toLowerCase() === "grow" && request.user_id == userIds.luisUserId) {
        growMangoTree(request);
      } else if (checkSamHarris(request)) {
        postMessage("The face of wisdom", request, urls.benStillerImage);
      } else if (doesJoeRoganJoinChat(request)) {
        postMessage("Joe Rogan has joined the chat.");
      } else if (checkAskingAboutMeeting(request)) {
        postMessage("SSA Meetings are Wednesdays 5:30-6:30pm in PAR 105");
      } else if (checkBlackHole(request)) {
        postMessage("I am glad to see you are a holes of color ally.");
      } else if (request.text.toLowerCase() === "grow" && request.user_id != userIds.luisUserId) {
        // growDick(request);
      } else if (request.user_id == userIds.alexandersUserId) {
        crushAlexander(request);
      } else if (checkNeedsRide(request, request)) {
      	postMessage("Can I get a ride too?")
      } else if (checkPodcast(request)) {
        postMessage("Speaking of podcasts this is one of my personal favorites: " + urls.podcast);
      } else if (checkBible(request)) {
        postMessage("Speaking of the Bible, this verse really spoke to me the other day: " + randomBibleVerses[Math.floor(Math.random() * randomBibleVerses.length)], request);
      } else if (checkJoinedGroup(request)) {
        postMessage(greetings[Math.floor(Math.random() * greetings.length)]);
      } else if (checkRejoinedGroup(request)) {
        postMessage("Yay this chat is cool again!");
      } else if (checkLeftGroup(request)) {
        postMessage("These bitches ain't loyal");
      } else if (checkEventStarting(request)) {
        postMessage(eventReactions[Math.floor(Math.random() * eventReactions.length)]);
      } else if (checkCatMention(request)) {
        getCatFact();
      } else if (checkOfficers(request.text)) {
        postMessage("Notifying Officers...", null, null, [userIds.elizabethsId, userIds.luisUserId, userIds.kristensId, userIds.phillipUserId, userIds.elizasId]);
      } else {
      	// 1/100 chance
      	simpleResponse()
      }
    } 
    else {
      this.res.writeHead(200);
      this.res.end();
    }
  }
}

// OUR CHECKS

function checkOfficers(text) {
  var regex = /@officers/;
  return regex.test(text.toLowerCase());
}

function simpleResponse() {
	if (Math.floor(Math.random() * 200) == 0) {
		postMessage(simpleResponses[Math.floor(Math.random()*simpleResponses.length)])
	}
}

function checkCussWords(request) {
  var text = request.text;
  var cussCount = (text.toLowerCase().match(/fuck|shit|bitch/g) || []).length;

  if (notDoneInLast24Hours(timers.lastCheckedCussWordsTime, request.created_at) && cussCount >= 3) {
    timers.lastCheckedCussWordsTime = request.created_at;
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

function doesJoeRoganJoinChat(request) {
  var regex = /dmt|cbd|shroom/;
  var text = request.text;
  if (notDoneInLast24Hours(timers.lastJoeRoganChatTime, request.created_at) && regex.test(text.toLowerCase())) {
    timers.lastJoeRoganChatTime = request.created_at;
    return true;
  }
  return false;
}

function isLuisABitch(text) {
  return text.toLowerCase().indexOf("i hate") > -1;
}

function checkLookAtThisDood(request) {
  var regex = /dood/;
  var text = request.text;
  if (notDoneInLast24Hours(timers.lastDoodVideoTime, request.created_at) && regex.test(text.toLowerCase())) {
    timers.lastDoodVideoTime = request.created_at;
    return true;
  }
  return false;
}

function checkSamHarris(request) {
  var regex = /sam\sharris/;
  var text = request.text;
  if (notDoneInLast24Hours(timers.lastBenStillerPicTime, request.created_at) && regex.test(text.toLowerCase())) {
    timers.lastBenStillerPicTime = request.created_at;
    return true;
  }
  return false;
}

function growDick(request) {
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
      postMessage("8======D");
      dickStage++;
      break;
    case 5:
      postMessage("8=========D~~~~")
      postMessage("Congratulations you made it ejaculate!!!😩🍆💦", request)
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

function checkAskingAboutMeeting(request) {
  var meetingRegex = /(what\stime|when|where).+meeting/;
  var text = request.text;
  if (notDoneInLastHour(timers.lastMeetingTime, request.created_at) && meetingRegex.test(text.toLowerCase())) {
    timers.lastMeetingTime = request.created_at;
    return true;
  }
  return false
}

function checkBlackHole(request) {
  var regex = /black\shole/;
  var text = request.text;
  if (notDoneInLast24Hours(timers.lastBlackHolesTime, request.created_at) && regex.test(text.toLowerCase())) {
    timers.lastBlackHolesTime = request.created_at;
    return true;
  }
  return false;
}

function checkBible(request) {
  var regex = /bible/;
  var text = request.text;
  if (notDoneInLast24Hours(timers.lastBibleTime, request.created_at) && regex.test(text.toLowerCase())) {
    timers.lastBibleTime = request.created_at;
    return true;
  }
  return false;
}

function checkBotMention(request) {
  var regex = /@cameron|@cam/;
  var text = request.text;

  if (notDoneInLast24Hours(timers.lastMentionResponseTime, request.created_at) && regex.test(text.toLowerCase())) {
    timers.lastMentionResponseTime = request.created_at;
    return true;
  }
  return false;
}

function checkPodcast(request) {
  var regex = /podcast/;
  var text = request.text;
  if (notDoneInLast24Hours(timers.lastPodcastTime, request.created_at) && regex.test(text.toLowerCase())) {
    timers.lastPodcastTime = request.created_at;
    return true;
  }
  return false;
}

function checkNeedsRide(request) {
	var regex = /a\sride/;
  var text = request.text;
	if (notDoneInLast24Hours(timers.lastAskedForRideTime, request.created_at) && regex.test(text.toLowerCase())) {
		timers.lastAskedForRideTime = request.created_at;
		return true;
	}
	return false;
}

function checkCatMention(request) {
  var catRegex = /cat\sfact/;
  var text = request.text;

  if (notDoneInLastHour(timers.lastCatTime, request.created_at) && catRegex.test(text.toLowerCase())) {
    timers.lastCatTime = request.created_at;
    return true;
  }
  return false;
}

function getCatFact() {
  axios.get("https://cat-fact.herokuapp.com/facts/random")
      .then(function(res) {
        return postMessage("Dude, did you know that " + res.data.text);
      })
      .catch(function(err) { console.log(err)});
}

function checkLeftGroup(request) {
    var regex = /has\sleft\sthe\sgroup/;
    var text = request.text;

    if (notDoneInLastHour(timers.lastRespondToLeaveTime, request.created_at) && (request.sender_type == "system") && regex.test(text.toLowerCase())) {
      timers.lastRespondToLeaveTime = request.created_at;
      return true;
    }
    return false;
}

function checkJoinedGroup(request) {
  var regex = /(added\s.+to\sthe\sgroup)|(has\sjoined\sthe\sgroup)/;
  var text = request.text;

  if (notDoneInLast24Hours(timers.lastRespondToJoinTime, request.created_at) && (request.sender_type == "system") && regex.test(text.toLowerCase())) {
    timers.lastRespondToJoinTime = request.created_at;
    return true;
  }
  return false;
}

function checkRejoinedGroup(request) {
    var regex = /has\srejoined\sthe\sgroup/;
    return (request.sender_type == "system") && regex.test(request.text.toLowerCase());
}

function checkEventStarting(request) {
    var regex = /is\sstarting\sin\s/;
    return (request.sender_id == "calendar") && regex.test(request.text.toLowerCase());
}

function botMentionResponse(text, request) {
  var sexualWordsRegex = /dick|sex|blowjob|naked|suck|penis|cock/;
  var insultRegex = /fuck\syou|go\sto\shell|i\shate\syou|you\ssuck|suck\smy\sdick|die|dumb|stupid|annoying|leave|stop|shut\sup|be\squiet|fuck\soff/;
  var delay = 0;
  if (sexualWordsRegex.test(text.toLowerCase())) {
    postMessage("Umm I don't talk to perverts😐", request);
  } else if (insultRegex.test(text.toLowerCase()) && request.avatar_url != null) {
    postMessage("Don't @ me if you don't want me to spam you dumb-dumb", request);
  } else if (request.created_at > timers.lastMentionResponseTime + delay) {
    timers.lastMentionResponseTime = request.created_at;
    postMessage(mentionResponses[Math.floor(Math.random() * mentionResponses.length)], request);
  } else {
    console.log("Need to wait " + (timers.lastMentionResponseTime + delay - request.created_at));
  }
}

function crushAlexander(request) {
  var delay = 60 * 60 * 24 * 5;
  var shouldMessage = Math.floor(Math.random() * 5) == 0;
  if (timers.lastMessagedAlexanderTime + delay < request.created_at) {
    if (messagedAlexander === false && shouldMessage) {
      postMessage("Why do you think that?🤔", request);
      messagedAlexander = true;
    } else if (messagedAlexander) {
      postMessage("Actually sorry nevermind I don't give a shit", request);
      messagedAlexander = false;
      timers.lastMessagedAlexanderTime = request.created_at;
    }
  }
}

function mention(ids, name) {
  var nameLength = name.length;
  var attachments = {
    "type":"mentions",
    "user_ids":ids,
    "loci":[
      [0,nameLength + 1]
    ]
  };

  return attachments;
}

// Used for officers. # of loci = number of officers
function namelessMention(ids) {
  var attachments = {
    "type":"mentions",
    "user_ids":ids,
    "loci":[
      [0,0],
      [0,0],
      [0,0],
      [0,0],
      [0,0]
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

function notDoneInLast24Hours(timer, created_at) {
  var delay = 60 * 60 * 24;
  return timer + delay < created_at;
}

function notDoneInLastHour(timer, created_at) {
  var delay = 60 * 60;
  return timer + delay < created_at;
}


// Either request or mentions must be null, or both. If they both are not null,
// that creates problems. This code is horrific cuz we didn't plan it out properly.
function postMessage(responseText, request, imageUrl, mentions) {
  request = request || null;
  imageUrl = imageUrl || null;
  mentions = mentions || null;
  var options, body, botReq;

  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  // This code is horrible but fixing it requires a big overhaul. 
  if (request == null) {
    body = {
      "bot_id" : botID,
      "text" : responseText
    };
  }
  if (mentions != null) {
    body["attachments"] = [namelessMention(mentions),]
  } 
  if (request != null && mentions == null) {
    body = {
      "attachments" : [mention([request.user_id], request.name),],
      "bot_id" : botID,
      "text" : "@" + request.name + " " + responseText
    };
  }
  if (imageUrl) {
    body.attachments.push(image(imageUrl));
  }


  console.log('sending ' + responseText + ' to ' + botID);
  console.log(body);
  console.log("\n")

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
