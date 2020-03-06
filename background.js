console.log("background running");

chrome.browserAction.onClicked.addListener(buttonClicked);



var request1 = new XMLHttpRequest(); var request2 = new XMLHttpRequest();

let htmltext1 = ""; let htmltext2 = "";

request1.open("GET",
              "https://services.housing.berkeley.edu/c1c/dyn/balance.asp",
              true);
request2.open("GET",
              "https://services.housing.berkeley.edu/c1c/dyn/bals.asp?pln=rb",
              true);

request1.send(null); request2.send(null);
request1.responseType = 'text'; request2.responseType = 'text';

var response1_text = "";
var response2_text = "";
request1.onreadystatechange = function() {
  if (request1.readyState == 4)
    response1_text = request1.responseText;
};

request2.onreadystatechange = function() {
  if (request2.readyState == 4)
    response2_text = request2.responseText;
};


function buttonClicked(tab) {
    console.log("button clicked!");
    var details = currentBalances(response1_text);
    details.push(currentSwipes(response2_text));
    alert("Debit: $" + details[0].toFixed(2) + "\nFlex Dollars: $" + details[1].toFixed(2) +
      "\nSwipes Remaining: " + details[2]);
}

/** Parses through RESPONSE and returns an array consisting of [0]debit and
  * [1]flex dollars available. */
function currentBalances(response) {
    var indexOfDebit = response.indexOf("Cal 1 Card Debit");
    var debit = response.substring(indexOfDebit + 21, indexOfDebit + 25);

    var indexOfFlexDollars = response.indexOf("Blue flex dollars:");
    var flexDollars = response.substring(indexOfFlexDollars + 21,
      indexOfFlexDollars + 27);

    var indexOfAddOnFlex = response.indexOf("Add-On flex dollars:");
    var addOnFlex = response.substring(indexOfAddOnFlex + 23,
      indexOfAddOnFlex + 28);

    var debitNum = parseFloat(debit);
    return [parseFloat(debit),
      parseFloat(flexDollars)+parseFloat(addOnFlex)];
}

/** Parses through RESPONSE and returns how many meal swipes are left. */
function currentSwipes(response) {;
    var today = new Date();
    var sunday = new Date();
    sunday.setDate(today.getDate() - today.getDay()); //most recent sunday
    sunday.setHours(0,0,0,0);
    console.log(sunday);
    var swipes = 0;
    let dates = response;
    for (let _ = 0; _ < 16; _++) {
      var indexOfDate = dates.indexOf("<tr>");
      var date = dates.substring(indexOfDate + 10, indexOfDate + 19);
      dates = dates.substring(indexOfDate + 19, dates.length);
      var swipeDay = new Date(date);
      console.log(swipeDay)
      var dayDiff = swipeDay - sunday;
      //console.log(dayDiff);
      if (dayDiff >= 0) {
        swipes++;
      }
      else {
        break;
      }
    }

    return (12 - swipes);
    //console.log(response); // TODO: calculate the number of swipes.
}

function haha() {
  console.log("button not clicked!");
  var details = currentBalances(response1_text);
  details.push(currentSwipes(response2_text));
  console.log(details);

}
setTimeout(haha, 2000);
