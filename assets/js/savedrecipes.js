var jsonKeyName = "savedRecipe";
var dishesList = JSON.parse(window.localStorage.getItem("savedRecipe")) || [];
var commentsList = JSON.parse(window.localStorage.getItem("savedComment")) || [];
var savedRecipeCounter = -1;
console.log(dishesList);

var htmlCode =""
  for(let i=0;i<dishesList.length;i++){
    savedRecipeCounter++;
    var comment = "";
    for (let j = 0; j < commentsList.length; j++) {
      if (dishesList[i].link === commentsList[j].link) {
        comment = commentsList[j].comments;
      }
    }
    htmlCode += `<div class="card-panel">
    <h4>${dishesList[i].name}</h4>
    <li>
      <div class="row">
        <div class="col">
          <img id="saved-img" src="${dishesList[i].image}" />
        </div>
        <div class="col">
          <aside class="food-content">${dishesList[i].content}</aside>
        </div>
      </div>
    </li>
    <li></li>
    <hr>
    <li>Saved comments:</li>
    <br>
    <li>${comment}</li>
    <hr>
    <li><a class="btn-floating brown" class="align-left" href="${dishesList[i].link}" target="_blank"><i class= 'material-icons' >link</i>"</a></li>
    <br>
    <li><button class="align-right" type="submit" id="${dishesList[i].link}" "btn waves-effect waves-teal"><i class='material-icons'>delete_forever</i></button></li>
    </div>`
  }

  $("#previous").html(htmlCode)

  //event handler for button to delete a single saved recipe from local storage and reload page
  $("button").on("click", function () {
    var link = this.id;
    dishesList = $.grep(dishesList, function(value) {
      return value.link != link;
    });
    commentsList = $.grep(commentsList, function(value) {
      return value.link != link;
    });
    localStorage.setItem("savedRecipe", JSON.stringify(dishesList));
    localStorage.setItem("savedComment", JSON.stringify(commentsList))
    location.reload();
  });
