
//#region Variables
  // Global variables to get element IDs/class(es)
  var greetingMsgEl = $(".time-of-day");
  var inputFoodEl = $("#input-text");
  var foodSearchEl = $("#food-search");
  var spoonResultsEl = $("#spoon-results");
  var edamResultsEl = $("#edam-results");

  // Global variables assigned/unassigned
  var spoonName = "spoonacular";
  var edamName = "edamam"; 
  var savedDishKey = "savedRecipe";
  var savedCommentKey = "savedComment";
  var modalCounter;
//#endregion


// Function call, when the load is called
function onLoad() {
  
  //#region Message to display in developer tools
      console.log("Started onLoad");
  //#endregion

  // Local variables
  var dTimMs = new Date();
  var dTim = dTimMs.getHours();

  // Appends the string "Good" to the element
  greetingMsgEl.append("Good ");

  // Checks the user current time, in a 24 hour format
  // to greet them with a Good morning, afternoon or evening
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

// Function which starts the search for
// meals of both Spoonacular and Edamam
function getFood() {

  // Resetting modal counter
  modalCounter = 0;

  // Hides the search results elements
  foodSearchEl.addClass("hide");

  // Clear out search results elements, before entering new data
  spoonResultsEl.empty();
  edamResultsEl.empty();

  // Local variables
  var foodTx = inputFoodEl.val();

  var spoonAppKeyRef = "&apiKey=";
  var spoonacularKey = "27864d4f1b024cfb9af0eadf74ac4b8a";
  var spoonacularAuth = spoonAppKeyRef + spoonacularKey;
  var spoonacularCall = "https://api.spoonacular.com/food/search?query=" + foodTx + spoonacularAuth;

  var edamamAppIdRef = "&app_id=";
  var edamamAppIdVal = "5a358cfa";
  var edamamAppKeyRef = "&app_key=";
  var edamamKey = "0dd5eb6b500039468f7950a5fb8851fb";
  var edamamAuth = edamamAppIdRef + edamamAppIdVal + edamamAppKeyRef + edamamKey;
  var edamamCall = "https://api.edamam.com/search?q=" + foodTx + edamamAuth;

  // Calls the function to do a fetch
  fetchFromWeb(spoonName, spoonacularCall);
  fetchFromWeb(edamName, edamamCall);

   // Displays the results in the website
   foodSearchEl.removeClass("hide");

  // Clears out the input element value
  // once the searches finishes
  inputFoodEl.val("");
}

// Function which fetches from
// both Spoonacular and Edamam data
function fetchFromWeb(webName, website) {

    fetch(website)
      .then(function (response) {
        if ((response.ok) || (response.status == 200)) {
          return response.json();
        }
        else {
          throw new Error("Response get failed");
        }
      })
      .then(function (data) {
        
        // Local variables
        var spoonData = data.searchResults;
        var edamData = data.hits;
        var food;

        // Checks which source it is and saves
        // the data into a common variable
        if (webName == "spoonacular") {
          food = spoonData;
        }
        else {
          food = edamData;
        }

        // For loop for the common variable, [food]
        for (var i = 0; i < food.length; i++) {

          // First check if condition - checks the webname matches "spoonacular"
          // AND THEN
          // Second check if condition - checks if the food name matches "Recipes"
          if ((webName == spoonName) && (food[i].name == "Recipes")) {

            // For loop set for spoonacular API data structure
            for (var j = 0; j < food[i].results.length; j++) {
              
              // Second for loop - local variables, specific to spoonacular data set
              var foodName  = food[i].results[j].name;
              var foodInfo  = food[i].results[j].content;
              var foodImg   = food[i].results[j].image;
              var foodLink  = food[i].results[j].link;

              // Local variable which calls a function with parameters
              var foodData  = pullResults(webName, foodName, foodInfo, foodImg, foodLink);

              // Appends the spoonacular results of the call
              // variable into the spoonacular results element
              spoonResultsEl.append(foodData);
            }
          }

          // First check if condition - checks the webname matches "edamam"
          // AND THEN
          // Second check if condition - checks if the food has key name "recipe"
          if ((webName == edamName) && (food[i].hasOwnProperty("recipe"))) {

            // Local variables
            var foodName  = food[i].recipe.label;

            // Local variable inline function, with return set
            var foodInfo = (function() {
              
              // Inline local variable
              var fullString = "";
              
              // For loop, to loop thru the recipe health labels
              for (var j = 0; j < food[i].recipe.healthLabels.length; j++) {

                // IF - checks if the counter "J" value
                // does not equal the healthlabel minus 1
                if (j != (food[i].recipe.healthLabels.length - 1)) {
                  
                  // TRUE - adds text with comma at the end
                  fullString += food[i].recipe.healthLabels[j] + ", ";
                }
                else {

                  // ELSE - Add text with no comma at the end
                  fullString += food[i].recipe.healthLabels[j];
                }
              }

              // Return to the calling variable, text truncated
              return fullString;

            })();

            // Local variables
            var foodImg   = food[i].recipe.image;
            var foodLink  = food[i].recipe.shareAs;

            // Local variable which calls a function with parameters
            var foodData  = pullResults(webName, foodName, foodInfo, foodImg, foodLink);

            // Appends the spoonacular results of the call
            // variable into the spoonacular results element
            edamResultsEl.append(foodData);
          }
        }
      })
      .catch(function (error) {
        console.error("There has been a problem with your fetch operation:", error);
      });
}

// General function to pull the results from both
// Spoonacular and Edamam and adds the elements and data
function pullResults(webName, foodName, foodInfo, foodImg, foodLink) {
  
  // Local variables
  var liEl = $("<li>");
  var divRowsEl = $("<div>");
  var col1DivEl = $("<div>");
  var col1HeaderEl = $("<header>");
  var col1FoodNameEl = $("<h5>");
  var col1FoodInfoEl = $("<p>");
  var col1FoodDivRowBtnEl = $("<div>");
  var col1FoodDivColAel = $("<div>");
  var col1FoodDivColBel = $("<div>");
  var col1FoodBtnLinkEl = $("<button>");
  var col1FoodBtnCommEl = $("<button>");
  var col2DivEl = $("<div>");
  var col2FoodImg = $("<img>");
  var col3DivEl = $("<div>");
  var col3SaveEl = $("<i>");
  var col3SavedCheck = loadSaveDishes(webName, foodLink); // Returns TRUE or FALSE
  
  // Local modal variables
  var modalMainDivEl = $("<div>");
  var modalContentDivEl = $("<div>");
  var modalHeadingEl = $("<h4>");
  var modalTextEl = $("<input>");
  var modalTextCheck = loadSaveComments(foodLink); // Returns the saved comments
  var modalFooterEl = $("<div>");
  var modalSaveEl =$("<a>");

  // Adding classes to the li element
  liEl.addClass("local-coll-item collection-item");
  
  // Adding classes to the the div element
  divRowsEl.addClass("local-row row");

  // Column 1 - information - adding classes only
  col1DivEl.addClass("local-col local-col-first col s6");
  col1FoodInfoEl.addClass("local-food-info");

  // Column 1 - button - adding classes only
  col1FoodDivRowBtnEl.addClass("local-row-buttons row");
  col1FoodDivColAel.addClass("local-col local-col-buttons col s6");
  col1FoodDivColBel.addClass("local-col local-col-buttons col s6");
  col1FoodBtnLinkEl.addClass("btn-floating brown");
  col1FoodBtnLinkEl.attr("onclick", "window.open('" + foodLink + "', '_blank')");
  col1FoodBtnCommEl.attr("data-target", "modal-main-container-" + modalCounter);
  col1FoodBtnCommEl.attr("modal-text-target", "modal-text-" + modalCounter);
  col1FoodBtnCommEl.addClass("waves-effect waves-light btn modal-trigger blue-grey");
  col1FoodBtnCommEl.attr("link", foodLink);

  // Modal content element - adding attributes and classes
  modalMainDivEl.attr("id", "modal-main-container-" + modalCounter);
  modalMainDivEl.addClass("modal");
  modalContentDivEl.addClass("modal-content");
  modalTextEl.attr("id", "modal-text-" + modalCounter);
  modalTextEl.attr("value", modalTextCheck);
  
  // Modal footer element - adding attributes and classes
  modalFooterEl.addClass("modal-footer");
  modalSaveEl.attr("ref", "modal-text-" + modalCounter);
  modalSaveEl.attr("link", foodLink);
  modalSaveEl.addClass("modal-close waves-effect btn-flat");  

  // Column 2 - image - adding classes and attributes to the element
  col2DivEl.addClass("local-col local-col-second center col s4");
  col2FoodImg.attr({"src": foodImg, "style": "width:100%;height:100%;border-radius:50%"});

  
  // Column 3 - save icon - adding classes and attributes to the element
  col3DivEl.addClass("local-col local-col-third center col s2");
  col3SaveEl.attr("data-name", foodName);
  col3SaveEl.attr("data-content", foodInfo);
  col3SaveEl.attr("data-image", foodImg);
  col3SaveEl.attr("data-link", foodLink);
  col3SaveEl.addClass("local-btn-star fas fa-star");

  // Checks from the variable output [col3SavedCheck], 
  // if the return data is TRUE or FALSE
  if (col3SavedCheck == true) {

    // TRUE - adds the class of ...save
    col3SaveEl.addClass("local-btn-star-save");
  }
  else {

    // FALSE - adds the class of ...unsave
    col3SaveEl.addClass("local-btn-star-unsave");
  }

  // Appending elements
  liEl.append(divRowsEl);
  divRowsEl.append(col1DivEl);
  
  col1DivEl.append(col1HeaderEl);
  col1HeaderEl.append(col1FoodNameEl)
  col1FoodNameEl.append(foodName);
  
  col1DivEl.append(col1FoodInfoEl);
  col1FoodInfoEl.append(foodInfo);
  
  col1DivEl.append(col1FoodDivRowBtnEl);
  col1FoodDivRowBtnEl.append(col1FoodBtnLinkEl)
  col1FoodBtnLinkEl.append("<i class= 'material-icons' >link</i>");
  
  col1DivEl.append(col1FoodDivRowBtnEl);
  col1FoodDivRowBtnEl.append(col1FoodBtnCommEl)
  col1FoodBtnCommEl.append("<i class ='material-icons'>comment</i>")
  
  col1DivEl.append(col1FoodDivRowBtnEl);
  col1FoodDivRowBtnEl.append(modalMainDivEl);
  modalMainDivEl.append(modalContentDivEl);
  modalContentDivEl.append(modalHeadingEl);
  modalHeadingEl.append(foodName);
  
  col1DivEl.append(col1FoodDivRowBtnEl);
  col1FoodDivRowBtnEl.append(modalMainDivEl);
  modalMainDivEl.append(modalContentDivEl);
  modalContentDivEl.append(modalTextEl);
  modalTextEl.append(modalTextCheck);
  
  col1DivEl.append(col1FoodDivRowBtnEl);
  col1FoodDivRowBtnEl.append(modalMainDivEl);
  modalMainDivEl.append(modalFooterEl);
  modalFooterEl.append(modalSaveEl);
  modalSaveEl.append("Save / Close");
           
  divRowsEl.append(col2DivEl);
  col2DivEl.append(col2FoodImg);

  divRowsEl.append(col3DivEl);
  col3DivEl.append(col3SaveEl);

  // Increase modal counter by 1
  modalCounter++;

  // Event listerner for the comment button
  col1FoodBtnCommEl.click(function() {
    displayModal(this);
  });
  
  // Event listerner for the save icon (star)
  col3SaveEl.click(function() {
    saveDish(this);
  });

  // Event listerner for the save button in
  // modal window pop up
  modalSaveEl.click(function() {
    saveComment(this);
  });

  // Return the element container
  return liEl;
}

// Function allows the modal window to display on screen
function displayModal(event) {
  
  // Materialize CSS Framework
  // Local variables require for modal
  var elems = document.querySelectorAll('.modal');
  var instances = M.Modal.init(elems);

  // Local variables
  var modalNextTextTarget = event.getAttribute("modal-text-target");
  var modalTargetId = $("#" + modalNextTextTarget);

  // Out of focus event listerner
  // Trim out leading/ending whitespace
  modalTargetId.focusout(function() {
    var modalEditEl = $(modalTargetId);
    var modalTextTrim = modalEditEl.val().trim();
    modalEditEl.val(modalTextTrim);
  });
}

// Function saves comments into local storage
function saveComment(event) {
 
  // Local general variables
  var myReview = JSON.parse(window.localStorage.getItem(savedCommentKey)) || [];
  var functionCheck = (typeof event.hasAttribute === "function") ? true : false;
  var sourceUrl = (functionCheck) ? event.getAttribute("link") : ((event.target.parentElement.parentElement.children[1].children[0].getAttribute("link")) != null) ? event.target.parentElement.parentElement.children[1].children[0].getAttribute("link") : event.target.children[1].children[0].getAttribute("link");
  var feedbackRefAttr = (functionCheck) ? event.getAttribute("ref") : ((event.target.parentElement.parentElement.children[1].children[0].getAttribute("ref")) != null ? event.target.parentElement.parentElement.children[1].children[0].getAttribute("ref") : event.target.children[1].children[0].getAttribute("ref"));
  var feedbackRefId = $("#" + feedbackRefAttr);
  var feedbackRefVal = feedbackRefId.val();
  var comment = {link: sourceUrl, comments: feedbackRefVal};
  var duplicate = false;

  // Checks if the JSON has at least 1 entry
  if (myReview.length > 0) {
    
    for (var i = 0; i < myReview.length; i++) {
      
      // First check if condition - the duplicate counter is false, then continue
      // AND THEN
      // Second check if condition - if the selected entry source URLs matches existing links
      if ((duplicate == false) && (sourceUrl == myReview[i].link)) {
        duplicate = true;
      }
    }
  }

  // First check if condition - checks if the local storage length equals 0
  // OR
  // no duplicates was found
  if ((myReview.length == 0) || (duplicate == false)) {

    // Prepares the new entry to go into local storage
    myReview.push(comment);

    // Checks if the user entered a comment in the input field
    // by checking the length to be greater than 0
    if (feedbackRefVal.length > 0) {
      
      // Save data (new/updates) into local storage
      localStorage.setItem(savedCommentKey, JSON.stringify(myReview));
    }
  }
  else {
      
    // For loop - goes thru the whole myReview local storage
    // to update the clicked on comment link
    for (var i = 0; i < myReview.length; i++) {
      
      // Checking if the source Url matches local storage link (url)
      if (sourceUrl == myReview[i].link) {

        // Checks if the field is empty
        if (feedbackRefVal.length < 1) {

          // Removes the object, if there are no comments
          // OR the comment was deleted/removed
          myReview.splice(i, 1);
        }
        else {
          // Updates the existing url link comment
          myReview[i].comments = feedbackRefVal;
        }
      }
    }
    
    // Save data (new/updates) into local storage
    localStorage.setItem(savedCommentKey, JSON.stringify(myReview));
  }  
}

// Function to save the bookmark dishes into the local storage
function saveDish(event) {
  
  // Local variables
  var sourceName = event.getAttribute("data-name");
  var sourceCont = event.getAttribute("data-content");
  var sourceImgUrl = event.getAttribute("data-image");
  var sourceUrl = event.getAttribute("data-link");
  var dishes = JSON.parse(window.localStorage.getItem(savedDishKey)) || [];
  var meals = {name: sourceName, content: sourceCont, image: sourceImgUrl, link: sourceUrl};
  var duplicate = false;
  var revDupStatus = false;

  // Checks if the JSON has at least 1 entry
  if (dishes.length > 0) {

    // Checks all the JSON data
    for (var i = 0; i < dishes.length; i++) {

      // First check if condition - the duplicate counter is false, then continue
      // AND THEN
      // Second check if condition - if the selected entry source URLs matches existing links
      if ((duplicate == false) && (sourceUrl == dishes[i].link)) {
     
        // Changes the variable from false to true, determines if the clicked item is already exists in the JSON
        duplicate = true;
      }
    }
  }

  // First check condition - if the dishes length equals 0
  // OR
  // Second check condition - Checks if the duplicate counter is less than 1
  if ((dishes.length == 0) || (duplicate == false)) {

    // Updates the event target
    event.classList.add("local-btn-star-save");
    event.classList.remove("local-btn-star-unsave");

    // Duplicate counter was less than 1
    // Adds the entry to the local storage
    dishes.push(meals);

     // Add to the local storage
     localStorage.setItem(savedDishKey, JSON.stringify(dishes));
  }
  else {
    
    // For loop - goes thru the whole dishes local storage
    // to remove the clicked on dish from local storage by index
    for (var i = 0; i < dishes.length; i++) {

      // First if check - checks if the revDupStatus (revised duplicate status), if is false
      // AND
      // sourceUrl matches the local storage link key
      if ((revDupStatus == false) && (sourceUrl == dishes[i].link)) {
        dishes.splice(i, 1);
        revDupStatus = true;
      }
    }

    // Updates the clicked on item classes, to switch the save style
    event.classList.add("local-btn-star-unsave");
    event.classList.remove("local-btn-star-save");

    // Update/re-update the local storage
    localStorage.setItem(savedDishKey, JSON.stringify(dishes));
  }
}

// Function runs, when the user performs new search, which
// returns TRUE or FALSE to the calling function
function loadSaveDishes(webName, foodLink) {
  
  // Local variables
  var dishes = JSON.parse(window.localStorage.getItem(savedDishKey));
  
  // Checks if the local storage key exists
  if(dishes != null) {
    
    // Checks all the JSON data
    for (var i = 0; i < dishes.length; i++) {

      // First check if condition - checks the source name
        // AND THEN
        // Second check if condition - checks the source url
      if (foodLink == dishes[i].link) {
        return true;
      }
    }
  }
  else {
    return false;
  }
}

// Function runs, when the user does a new API search, 
// which loops thru all the existing local storage data and,
// returns the existing comment back the calling function
function loadSaveComments(foodLink) {

  // Local variable
  var myReview = JSON.parse(window.localStorage.getItem(savedCommentKey));

  // If checks if the local storage exists
  if (myReview != null) {

    // Iterates thru the local storage
    // to find existing entries and link them
    // to the created elements when doing fetch
    for (var i = 0; i < myReview.length; i++) {
      if (foodLink == myReview[i].link) {
        return myReview[i].comments;
      }
    }
  }
}

//#region Application start, and default event listerners

  // When user runs the website, and the browser finishes loading
  // the HTML, CSS, and JS, to run immediately the onLoad function
  window.onload = onLoad;

  // Click event for when the user clicks the submit button
  // around the form element in the landing page
  $("#btn-submit").click("click", function() {

    // Verifies the input text box is not blank
    if (inputFoodEl.val() != "") {

      // Calls the function
      getFood();
    }
  });

  // Prevents form to refresh when user presses enter due to the form element
  // around the form element in the landing page
  $("form").submit(function(e) {
    e.preventDefault();
  });

  // When the user press enter from the keyboard,
  // with event enable
  document.addEventListener("keyup", function(e) {

    // Local variables
    var modalOpenIdBool = e.target.id.includes("modal-main-container-");
    var modalTextInputIdBool = e.target.id.includes("modal-text-");
    var modalTextInputId = (modalTextInputIdBool == true) ? $("#" + e.target.id) : false;;
    var modalMainOpenInstance = (modalOpenIdBool == true) ? M.Modal.getInstance($("#" + e.target.id)) : false;
    var modalTextOpenInstance = (modalTextInputId != false) ? M.Modal.getInstance($("#" + e.target.parentElement.parentElement.id)) : false;
    var modalMainOpen = (modalMainOpenInstance != false) ? modalMainOpenInstance.isOpen : false;
    var modalTextOpen = (modalTextOpenInstance != false) ? modalTextOpenInstance.isOpen : false;

    // Checks if the user is on the main page, or do they have the modal page open
    if ((inputFoodEl.val() != "") && ((e.code === "Enter") || (e.code === "NumpadEnter")) && (modalMainOpen == false)) {

      // The user is on the main page, no modal open
      getFood();
    }
    else if (((modalMainOpen == true) || (modalTextOpen == true)) && ((e.code === "Enter") || (e.code === "NumpadEnter")) ) {

      // The user has the modal page open
      saveComment(e);
      (modalMainOpenInstance != false) ? modalMainOpenInstance.close() : false;
      (modalTextOpenInstance != false) ? modalTextOpenInstance.close() : false;
    }
  });

//#endregion