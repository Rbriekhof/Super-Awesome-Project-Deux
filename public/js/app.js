$(document).ready(function() {
  getlistings()
    // Container for Displaying Listings
  var listingsContainer = $(".showcase");
  // Variable to hold our listings
  var listings;
// This function grabs listings from the database and updates the view
  function getlistings() {
      $.get("/listings" , function(data) {
      console.log("listings", data);
      listings = data;
      if (!listings || !listings.length) {
        displayEmpty();
      }
      else {
        initializeRows();
      }
    });
  }

  // InitializeRows handles appending all of our constructed post HTML inside listingsContainer
  function initializeRows() {
    listingsContainer.empty();
    var listingsToAdd = [];
    for (var i = 0; i < listings.length; i++) {
      listingsToAdd.push(createNewRow(listings[i]));
    }
    listingsContainer.append(listingsToAdd);
  }

  // This function constructs a post's HTML
  function createNewRow(listings) {
    // var formattedDate = new Date(listings.createdAt);
    // formattedDate = moment(formattedDate).format("MMMM Do YYYY, h:mm:ss a");
    var newlistingsCard = $("<div>");
    newlistingsCard.addClass("card");
    var newlistingsCardHeading = $("<div>");
    newlistingsCardHeading.addClass("card-header");
    var deleteBtn = $("<button>");
    deleteBtn.text("x");
    deleteBtn.addClass("delete btn btn-danger");
    var editBtn = $("<button>");
    editBtn.text("EDIT");
    editBtn.addClass("edit btn btn-info");
    var newlistingsTitle = $("<h2>");
    // var newlistingsDate = $("<small>");
    var newlistingsAuthor = $("<h5>");
    // edit
    newlistingsAuthor.text("Written by: " + listings.sellerName);
    // edit
    newlistingsAuthor.css({
      float: "right",
      color: "blue",
      "margin-top":
      "-10px"
    });
    var newlistingsCardBody = $("<div>");
    newlistingsCardBody.addClass("card-body");
    var newlistingsBody = $("<p>");
    // edit
    newlistingsTitle.text(listings.email + " ");
    newlistingsBody.text(listings.sellingPrice);
    // edit
    // newlistingsDate.text(formattedDate);
    // newlistingsTitle.append(newlistingsDate);
    newlistingsCardHeading.append(deleteBtn);
    newlistingsCardHeading.append(editBtn);
    newlistingsCardHeading.append(newlistingsTitle);
    newlistingsCardHeading.append(newlistingsAuthor);
    newlistingsCardBody.append(newlistingsBody);
    newlistingsCard.append(newlistingsCardHeading);
    newlistingsCard.append(newlistingsCardBody);
    newlistingsCard.data("listings", listings);
    return newlistingsCard;
  }
function displayEmpty(){
  console.log("nothing!")
}



})







// Buyer Page //
// Search and Filter Functions//

$("#searchButton").on("click", function(event){
  event.preventDefault();

  if($('input[name="filter"]:checked').val()){
    var switchVal=$('input[name="filter"]:checked').val();
      switch (switchVal){
        case "one":
          var min = $("#minPrice").val();
          var max = $("#maxPrice").val();
          var minParse = parseInt(min)
          var maxParse = parseInt(max)

          if(minParse >= 0 && maxParse >=1){
            priceMatch(minParse,maxParse)
            break;
          }
          else{
            return false;
          }

        case "two":
          var zipCodeArray=[64116, 64106, 64124, 64105, 64123, 64115, 64117, 64120, 64121, 64127, 64101, 64108, 64102, 66101]
          var zipcode = $("#areaSelect").val().trim();
          var zipParse= parseInt(zipcode)
          var radius = $("#zipRadius").val();

          for(i=0; i<zipCodeArray.length; i++){
            var zip=zipCodeArray[i];
            if(radius!="" && zipcode.length===5 && zipParse===zip){
              alert("yes")
              areaCode(zipParse, radius)
              break; 
            }
            return false;
           }
            
        case "three":
          var bed = $("#bedNum").val();
          var bedParse=parseInt(bed)
          if(bedParse >= 1){
            bedrooms(bedParse)
            $("#bedNum").val("")
            break; 
          }
          return false;
      }      
}

function priceMatch(minParse,maxParse){
  console.log(minParse)
  console.log(maxParse)
}

function bedrooms(bedParse){
  console.log(bedParse)
}

function areaCode(zipcodeParse, radius){
  console.log(zipcodeParse)
  var queryURL="https://api.zip-codes.com/ZipCodesAPI.svc/1.0/FindZipCodesInRadius?zipcode=" + zipcodeParse + "&minimumradius=0&maximumradius=" + radius + "&key=OTXG2RB5WPBTU3O8BZEA";
    $.ajax({
    url: queryURL,
    method: "GET"
    }).then(function(response) {
      for(i=0; i<response.DataList.length; i++){
        console.log(response.DataList[i].Code)
    }});  
}}); 


// Seller page//
// Create Listing Form 


$("#sellButton").on("click", function(event){
  event.preventDefault();

  var newListing = {
    sellerName: $("#name").val(),
    email: $("#email").val(),
    sellingPrice: $("#price").val(),
    sqFootage: $("#sqFoot").val(),
    bedrooms: $("#bedrooms").val(),
    areaZip: $("#areaZip").val(),
    image: $("#image").val(),
    hotAndCold:$("#hotAndCold").val()
  };
 
  $.post("/listings", newListing)
    .then(function(data) {
    console.log(data);
    });

  $("#name").val("");
  $("#email").val("");
  $("#price").val("");
  $("#sqFoot").val("");
  $("#bedrooms").val("");
  $("#areaZip").val("");
  $("#image").val("");
  // CheckBox value may not work
  $("#hotAndCold").val("")
});
