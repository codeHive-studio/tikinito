$("#submit").click(function () {
  var email = $("#email").val();
  var password = $("#password").val();
  if (email === "" || password === "") {
    return swal("Opps", "Please Fill All Field !!!!", "error");
  }
  $("#loader").show();
  $.ajax({
    type: "POST",
    url: "/login",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify({ email: email, password: password }),
    success: function (data) {
      if (data.redirect) {
        // data.redirect contains the string URL to redirect to
        $("#loader").show();
        return (window.location.href = data.redirect);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      if ((jqXHR.status = 500)) {
        swal({
          icon: "error",
          text: "Internal Server Error",
        });
      } else if ((jqXHR.status = 404)) {
        swal({
          icon: "error",
          text: "Invalid email/password.",
        });
      } else {
        swal({
          icon: "error",
          text: "Something Went Wrong.",
        });
      }
    },
  });
});
