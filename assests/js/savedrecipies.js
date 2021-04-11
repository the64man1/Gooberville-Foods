$("#get-receipe").on("click", function () {
  var receipeName = $("#receipe-name").val()
  console.log(receipeName)
  
  getLocalStorage(receipeName)
 
})
//
//var receipeName="fish"
var savedRecipe=[2, 4]
function getLocalStorage(receipeName){
  var search = JSON.parse(localStorage.getItem("savedRecipe")) || []
  search.push(receipeName)
  localStorage.setItem("savedRecipe", JSON.stringify(search))
 console.log("Local",savedRecipe)
 console.log("Local",search)
 
 var htmlCode = ""
 for(let i =0;i<search.length;i++){
     htmlCode += `<li> ${search[i]} </li>`
     if (i  == 20)  {
      localStorage.clear();
   }

 }
 $("#previous").html(htmlCode)
 
}



 

//  window.addEventListener('load', function () {
//     //   // Grab the existing history from local storage IF it exists
//        var existingHistory;
//        if (!JSON.parse(localStorage.getItem('history'))) {
//          existingHistory = [];
//        } else {
//         existingHistory = JSON.parse(localStorage.getItem('history'));
//        }
    
//       var historyItems = [];

      // const handleHistory = (term) => {
      //   if (existingHistory && existingHistory.length > 0) {
      //     var existingEntries = JSON.parse(localStorage.getItem('history'));
      //     var newHistory = [...existingEntries, term];
      //     localStorage.setItem('history', JSON.stringify(newHistory));
      //     // If there is no history, create one with the searchValue and save it localStorage
      //   } else {
      //     historyItems.push(term);
      //     localStorage.setItem('history', JSON.stringify(historyItems));
      //   }
      // };

 
  

//  // Invoke our history method
//  if (!existingHistory.includes(searchValue)) {
//     handleHistory(searchValue);
//  } 
// }      

// $("#save").on("click", function () {
//     var ReceipeName = $("#Name").val()
//     console.log(ReceipeName)
//     // getLocalStorage(receipeName)
   
// })
