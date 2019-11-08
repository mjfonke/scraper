// scrape new articles
$("#scrape-btn").on("click", function (event) {
    event.preventDefault();

    $.ajax({
        method: "GET",
        url:"/scrape"
    }).then(function(data) {
        console.log(data)
        window.location.reload(true);
    });
});
// save articles
$(document).on("click", "#save-btn", function(event) {
    event.preventDefault();
    const thisId = $(this).attr("data-id");
    console.log("ID: " + thisId);
    $.ajax({
        method: "PUT",
        url:"/saved/" + thisId
    }).then(function(data) {
        console.log(data);

        window.location = "/"
    })
});
// clear all articles
$("#clear-btn").on("click", function(event) {
    event.preventDefault();
    $.ajax({
        type: "DELETE",
        url: "/delete"
    }).then(function() {
       window.location.reload(true);
    })
});

// unsave one saved article
$(document).on("click", "#delete-btn", function() {
    const thisId = $(this).attr("data-id");
    $.ajax({
        method: "PUT",
        url: "/unsaved/" + thisId,
      }).then(function(data) {
          console.log(data);

          window.location = "/saved"
        });
});


// save note
$(document).on("click", "#save-note", function() {
    const thisId = $(this).attr("data-id");
    const text = $("#note-text").val();
    console.log("note: " + text);
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            text: text
        }
      }).then(function(data) {
          console.log(data);
          window.location = "/saved"
        })
});

// delete notes
$("#delete-note").on("click",function(event) {
    event.preventDefault();
    const thisId = $(this).attr("data-id");
    console.log(thisId)
    $.ajax({
        method: "DELETE",
        url: "/notes/" + thisId,
    }).then(function() {
        window.location = "/saved"
    })
})
