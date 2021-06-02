$(window).on("load", function () {
  $("#Single").hide();
  const param = window.location.search;
  const id = param.slice(4);
  $.ajax({
    type: "GET",
    url: `/SingleProduct/${id}`,
    dataType: "json",
    contentType: "application/json",
    success: function (data) {
      // console.log(data);
      if (data.length === 0) {
        return swal({
          icon: "warning",
          text: "Record Not Found.",
        }).then(() => (location.href = "/data"));
      }
      // console.log(data);
      if (data[0].file_name === null) {
        data[0].file_name =
          "https://shahidafridifoundation.org/wp-content/uploads/2020/06/no-preview.jpg";
      } else {
        data[0].file_name = `https://devicefilteradmin.microlent.com/uploads/${data[0].file_name}`;
      }
      convertSize(data);
      $(".brandName").text(data[0].model_name + " " + data[0].Storage + "GB");
      $("#modal").text(data[0].model_name);
      $("#price").text("$" + data[0].price);
      $("#Storage").text(data[0].Storage + " " + "GB");
      $("#camera").text(data[0].Camera + "/ 10");
      $("#display").text(data[0].Display + "/10");
      $("#battery").text(data[0].Battery + "/10");
      $("#Size").text(data[0].Size);
      $("#proImg").attr("src", data[0].file_name);
      $("#proImg").attr("alt", `${data[0].file_name}`);
      $("#loader").hide();
      $("#Single").show();
    },
    error: function (xhr, status, err) {
      swal({
        icon: "error",
        text: xhr.responseText,
      }).then(() => {
        location.href = "/data";
      });
    },
  });
});

$("#back").click(function () {
  window.history.back();
});

function convertSize(data) {
  if (data[0].Size === 1) {
    return (data[0].Size = "Small");
  } else if (data[0].Size === 2) {
    return (data[0].Size = "Medium");
  } else if (data[0].Size === 3) {
    return (data[0].Size = "Large");
  } else if (data[0].Size === 4) {
    return (data[0].Size = "Extra Large");
  } else {
    return (data[0].size = "--");
  }
}
