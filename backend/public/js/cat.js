$("#submit").submit(function (e) {
  e.preventDefault();
  var CatName = $("#category-txt").val();
  // console.log(CatName);

  $.ajax({
    type: "POST",
    url: "/admin/dashboard/category/addCategory",
    data: JSON.stringify({ cname: CatName }),
    dataType: "json",
    contentType: "application/json",
    success: function (data) {
      swal({
        icon: "success",
        text: "Record added successfully",
      }).then(() => location.reload());
    },
    error: function (xhr, status, err) {
      swal({
        icon: "error",
        text: xhr.responseJSON.Message,
      });
    },
  });
});

$(window).on("load", function () {
  $.ajax({
    type: "GET",
    url: "/admin/dashboard/Category/showCategory",
    dataType: "json",
    contentType: "application/json",
    success: function (res) {
      res.data.map((cat) => {
        $("#myCategory").append(`
                  <tr>
                  <td>${cat.cname}</td>
                  <td><button type="button" id="btn" class="update btn btn-warning btn-sm"onClick="editCat(${cat.id},'${cat.cname}')">
              <span class="fa fa-pencil-square-o" aria-hidden="true"
              ></span></button></td>
               <td><button type="button"  class="delete btn btn-danger btn-sm"
               >
               <span class="fa fa fa-trash" aria-hidden="true"onClick="deleteCat(${cat.id})">
               </span></button></td>
                  </tr>
         `);
      });
      $("#categoryTb").show();
      $("#loader").hide();
    },
    error: function (xhr, status, err) {
      swal({
        icon: "error",
        text: err,
      });
    },
  });
});

function deleteCat(id) {
  swal({
    title: "Are you sure?",
    text: "Once deleted, you will not be able to recover this Category!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      return $.ajax({
        async: true,
        type: "GET",
        url: `/admin/dashboard/Category/deletebyID/${id}`,
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
          swal("Done! Your Selected Product has been deleted!", {
            icon: "success",
          }).then(() => {
            location.reload();
          });
        },
        error: function (jqXHR, textStatus, errorThrown) {
          swal("Something Went Wrong", errorThrown, "error");
        },
      });
    } else {
      swal("Your Category is safe!");
    }
  });
}

function editCat(id, name) {
  $("#category-txt").val(name);
  $("#category-txt").attr("name", id);

  $("#AddCategory").trigger("click");
  $("#save").hide();
  $("#cUpdate").show();
}

$("#cUpdate").on("click", function () {
  const id = $("#category-txt").attr("name");
  const name = $("#category-txt").val();
  if (name === "") {
    return swal({
      icon: "Warning",
      text: "Please fill category name.",
    });
  }
  $.ajax({
    type: "POST",
    url: "/admin/dashboard/category/update",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify({ cname: name, id: id }),
    success: function (data) {
      swal({
        icon: "success",
        text: "Updated Successfully",
      }).then(() => location.reload());
    },
    error: function (xhr, status, err) {
      swal({
        icon: "error",
        text: xhr.responseJSON.Message,
      });
    },
  });
});

$("#model-close").click(function () {
  // location.reload();
  $("#cUpdate").hide();
  $("#save").show();

  $("#submit")[0].reset();
});
