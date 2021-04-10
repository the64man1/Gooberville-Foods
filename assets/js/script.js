var txbFoodEl = $("#txb-food");
var btnEnter = $("#btn-Enter");
var divApiData = $("#api-data");

var divSpoonnac = $("#spoonacular");
var divOpenFood = $("#edamam");

function getFood() {

    var foodTx = txbFoodEl.val();
    var sourceUrl = "spoonacular";
    var spoonacularKey = "27864d4f1b024cfb9af0eadf74ac4b8a";
    var spoonApiUrl = "https://api.spoonacular.com/food/search?query=" + foodTx + "&apiKey=" + spoonacularKey;

    fetchFromWeb(sourceUrl, spoonApiUrl);

    var sourceUrl = "edamam";
    var edamamApId = "5a358cfa";
    var edamamKey = "0dd5eb6b500039468f7950a5fb8851fb";
    var edamApiUrl = "https://api.edamam.com/search?q=" + foodTx + "&app_id=" + edamamApId + "&app_key=" + edamamKey ;

    fetchFromWeb(sourceUrl, edamApiUrl);

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
        
        var spoonData = data.results;
        var edamData = data.hints;
        var results;

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
                divOpenFood.append(pEl);
            }
            
        }        
        
        
      })
      .catch(function (error) {
        console.error('There has been a problem with your fetch operation:', error);
      });

}

btnEnter.click("click", getFood);