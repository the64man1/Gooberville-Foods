// Variables to get element IDs/class(es)
var greetingMsgEl = $(".time-of-day");
var txbFoodEl = $("#input_text");
var btnEnter = $("#btn-submit");
var divApiData = $("#api-data");
var divSpoonnac = $("#spoonacular-data");
var divEdamam = $("#edamam-data");

function onLoad() {
  
  //#region Message to display in developer tools info
      console.log("Started onLoad");
  //#endregion

  var dTimMs = new Date();
  var dTim = dTimMs.getHours();

  greetingMsgEl.append("Good ");

  if(dTim < 12) {
    greetingMsgEl.append("morning!");
  }
  else if (dTim < 18)
    greetingMsgEl.append("afternoon!");
  else {
    greetingMsgEl.append("evening!");
  }

  //#region Message to display in developer tools
      console.log("Finished onLoad");
  //#endregion
  
}

function getFood() {

  // Gets the value of the textbox
  var foodTx = txbFoodEl.val();

  // Clear out divs before entering new data
  divSpoonnac.empty();
  divEdamam.empty();

  var sourceUrl = "spoonacular";
  var spoonAppKeyRef = "&apiKey=";
  var spoonacularKey = "27864d4f1b024cfb9af0eadf74ac4b8a";
  var spoonacularAuth = spoonAppKeyRef + spoonacularKey;
  var spoonacularCall = "https://api.spoonacular.com/food/search?query=" + foodTx + spoonacularAuth;

  fetchFromWeb(sourceUrl, spoonacularCall);

  var sourceUrl = "edamam";
  var edamamAppIdRef = "&app_id=";
  var edamamAppIdVal = "5a358cfa";
  var edamamAppKeyRef = "&app_key=";
  var edamamKey = "0dd5eb6b500039468f7950a5fb8851fb";
  var edamamAuth = edamamAppIdRef + edamamAppIdVal + edamamAppKeyRef + edamamKey;
  var edamamCall = "https://api.edamam.com/search?q=" + foodTx + edamamAuth;

  //fetchFromWeb(sourceUrl, edamamCall);

  foodTx = "";
    
}

function fetchFromWeb(webName, website) {

    fetch(website)
      .then(function (response) {
        if ((response.ok) || (response.status == 200)) {
          return response.json();
        }
        else {
          throw new Error('Response get failed');
        }
      })
      .then(function (data) {
        
        var spoonData = data.searchResults;
        var edamData = data.hints;
        var food;

        if (webName == "spoonacular") {
          food = spoonData;
          //console.log(food);
        }

        for (var i = 0; i < food.length; i++) {

          if ((webName == "spoonacular") && (food[i].name == "Recipes")) {
            //console.log(food[i]);

            for (var j = 0; j < food[i].results.length; j++) {
              console.log(food[i].results[j]);

              //var 

            }
          }
            
        }

        //#region Original code
        /*
        if(webName == "spoonacular") {
            results = spoonData;
            console.log("spoonData");
            console.log(results);
        }
        else {
            results = edamData;
            console.log("emdData");
            console.log(results);
        }

        for(var i = 0; i < results.length; i++) {

            var pEl = document.createElement("p");

            if(webName == "spoonacular") {
                pEl.append(results[i].title);
                divSpoonnac.append(pEl);
            }
            else {
                pEl.append(results[i].food.label);
                divEdamam.append(pEl);
            }            
        }*/
        //#endregion
        
        
      })
      .catch(function (error) {
        console.error('There has been a problem with your fetch operation:', error);
      });

}

window.onload = onLoad;
btnEnter.click("click", getFood);