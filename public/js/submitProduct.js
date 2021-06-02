`use strict`;
// load window and show dataTable
$(window).on("load", function () {
  //
  $("#loader").show();
  $("#productTb").hide();
  $.ajax({
    async: true,
    type: "GET",
    url: "/dashboard/showAll",
    contentType: "application/json",
    success: function (res) {
      const h = res.data[0];
      const HeaderKey = Object.keys(h);
      HeaderKey.shift();
      //  HeaderKey.reverse();
      HeaderKey.map((i) => {
        $("#add").before(appendInput(i));
      });
      HeaderKey.push("Edit");
      HeaderKey.push("Delete");

      // console.log(HeaderKey);
      // $("#myProductList").empty();
      const Column = [];
      res.data.reverse().map((i) => {
        i.edit = `<button type="button" id="btn" class="update btn btn-warning btn-sm mt-3"onclick="updateProduct(${i.model_id})">
                  <span class="fa fa-pencil-square-o"
                  ></span></button>`;
        i.delete = `<button type="button"  class="delete btn btn-danger btn-sm mt-3"
                 >
                 <span class="fa fa fa-trash " onclick="deleteProduct(${i.model_id})">
                 </span></button>`;
        i.File_name = ` <img src="${
          i.File_name == null ? "./img/noimage.jpg" : "/uploads/" + i.File_name
        }" alt="mobile.jpg" width=60 height=60  onclick="viewImg(this)"/>`;

        Column.push(Object.values(i));
      });
      var table = $("<table />");
      table[0].border = "1";
      table[0].id = "mytable";
      table.addClass("table table-hover table-responsive border");

      //Get the count of columns.
      // console.log(Column);
      var columnCount = Column[0].length;
      var row = $(table[0].insertRow(-1));
      for (var i = 0; i < columnCount; i++) {
        var headerCell = $("<th />");
        headerCell.addClass("bg-dark text-white");
        headerCell.html(HeaderKey[i]);
        row.append(headerCell);
      }
      // console.log(Column.length);
      for (var i = 0; i < Column.length; i++) {
        row = $(table[0].insertRow(-1));
        for (var j = 1; j < columnCount; j++) {
          var cell = $("<td />");
          cell.html(Column[i][j]);
          row.append(cell);
        }
      }
      var dvTable = $("#dvTable");
      dvTable.html("");
      dvTable.append(table);

      $("#productTb").show();
      $("#loader").hide();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      swal({
        icon: "error",
        text: errorThrown,
      });
    },
  });
});

//append input
function appendInput(i) {
  if (i === "Size") {
    return `<div class="col-md-6">
    <label for="Size" class="pl">${i}</label>

    <select class="selectbox w-100" id=${i}>
      <option selected>SELECT SIZE</option>
      <option value="1">S</option>
      <option value="2">M</option>
      <option value="3">L</option>
      <option value="4">XL</option>
    </select>
  </div>`;
  } else {
    return `
    <div class="col-md-6"style="${
      i == "model_id" ? "display:none" : "display:block"
    }">
                      <label for="model" class="pl">${i}</label>
                      <input
                        type="${i == "File_name" ? "file" : "text"}"
                        name="${i}"
                        placeholder="Enter ${i}"
                        id="${i}"
                        value=""
                        required
                        
                      />
                    </div>`;
  }
}

// add product
$("#form").submit(function (e) {
  e.preventDefault();

  var inputArray = new Array();
  const formValueS = $("#form input, #form select").each(function (index) {
    var input = $(this);
    if ($("#File_name") === input) {
      if (input.files.length === 0) {
        inputArray.push("");
      } else {
        inputArray.push(input[0].files);
      }
      // input.remove("File_name");
    } else {
      const inputValue = input.val();
      inputArray.push(inputValue);
    }
  });

  if (inputArray.includes("")) {
    return swal({
      icon: "error",
      text: "Please fill all value !!!",
    });
  }
  const data = new FormData();

  var file = $("#File_name")[0].files[0];
  data.append("file", file);
  if (
    file.type !== "image/jpeg" &&
    file.type !== "image/jpg" &&
    file.type !== "image/png"
  ) {
    return swal({ icon: "warning", text: "Invalid image format !!!" });
  }
  var Record = {};
  $("#form input, #form select").each(function (index) {
    var input = $(this);
    const name = input.attr("id");
    const value = input.val();
    if (input.attr("type") == "file") {
      Record[name] = value;
    } else {
      Record[name] = value;
    }
  });

  data.append("obj", JSON.stringify(Record));
  $("#add").hide();
  $("#spinner").show();
  $.ajax({
    async: true,
    type: "POST",
    url: "/admin/dashboard/AddProduct",
    // dataType: "json",
    // contentType: "application/json",
    contentType: false,
    processData: false,
    data: data,
    success: function (data) {
      swal({
        icon: "success",
        text: data.Message,
      }).then(() => {
        location.reload();
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      swal({
        icon: "error",
        text: "Something Went Wrong.",
      });
    },
  });
  $("#form input, #form select").each(function (index) {
    var input = $(this);
    input.val("");
  });
});

// update edit records

function updateRecord(id) {
  var inputArray = new Array();
  const formValueS = $("#form input, #form select").each(function (index) {
    var input = $(this);
    const s = input[0].nodeName;
    if (input[0].files !== null && input[0].nodeName !== s) {
      if (input.files.length === 0) {
        inputArray.push("");
      } else {
        inputArray.push(input[0].files);
      }
      // input.remove("File_name");
    } else {
      const inputValue = input.val();
      inputArray.push(inputValue);
    }
  });
  console.log(inputArray);
  if (inputArray.includes("")) {
    return swal({
      icon: "error",
      text: "Please fill all value !!!",
    });
  }
  const data = new FormData();

  var file = $("#File_name")[0].files[0];
  data.append("file", file);
  if (
    file.type !== "image/jpeg" &&
    file.type !== "image/jpg" &&
    file.type !== "image/png"
  ) {
    return swal({ icon: "warning", text: "Invalid image format !!!" });
  }
  var Record = {};
  $("#form input, #form select").each(function (index) {
    var input = $(this);
    const name = input.attr("id");
    const value = input.val();
    if (input.attr("type") == "file") {
      Record[name] = value;
    } else {
      Record[name] = value;
    }
  });
  // console.log(Record);

  data.append("obj", JSON.stringify(Record));
  $("#btnbupload").hide();
  $("#spinner").show();
  $.ajax({
    async: true,
    type: "POST",
    url: `/admin/dashboard/UpdateProduct/${id}`,
    // dataType: "json",
    // contentType: "application/json",
    contentType: false,
    processData: false,
    data: data,
    success: function (data) {
      swal({
        icon: "success",
        text: data.Message,
      }).then(() => {
        location.reload();
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      swal({
        icon: "err",
        text: errorThrown,
      });
    },
  });
}

// click edit show in input box
function updateProduct(id) {
  $("#loadModal").modal("toggle");
  $.ajax({
    async: true,
    type: "GET",
    url: `/admin/dashboard/ProductById/${id}`,
    dataType: "json",
    contentType: "application/json",
    success: function (data) {
      const Product = data[0];
      const ProductVal = Object.values(Product);
      ProductVal.shift();
      // console.log(ProductVal);
      $("#form input, #form select").each(function (index) {
        var input = $(this);
        $(`#${input.attr("id")}`).val(
          input.attr("type") == "file" ? "" : ProductVal[index]
        );
      });
      $("#add").hide();
      $("#rows").append(
        `<button type="button"id="btnbupload" class="btn login m-auto w-50"onclick="updateRecord(${id})">Update</button>`
      );
      $("#AddProductClick").trigger("click");
      $("#loadModal").modal("toggle");
    },
    error: function (jqXHR, textStatus, errorThrown) {
      swal("Ooops", "Something Went Wrong", "error");
    },
  });
  //   var tableData = $(e).parent("td").parent("tr").text();
  //   const arr = $.trim(tableData);
}

// Delete Product by modelId
function deleteProduct(id) {
  swal({
    title: "Are you sure?",
    text: "Once deleted, you will not be able to recover this Record!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      $.ajax({
        async: true,
        type: "GET",
        url: `/admin/dashboard/DeleteProduct/${id}`,
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
      swal("Your Product is safe!");
    }
  });
}

//append input function end

//model close button click
$("#model-close").click(function () {
  // location.reload();
  $("#btnbupload").remove();
  $("#add").show();

  $("#form")[0].reset();
});

//update range value
$("#updateRange").submit(function (e) {
  e.preventDefault();
  const min = $("#min").val();
  const max = $("#max").val();
  if (max == "" || min == "") {
    return swal({
      icon: "error",
      text: "Please fill minimum and maximum fields",
    });
  }
  $.ajax({
    async: true,
    type: "POST",
    url: "/admin/dashboard/setSliderRange",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify({ min: min, max: max }),
    success: function (data) {
      swal({
        icon: "success",
        text: "Updated Successfully.",
      }).then((res) => {
        $("#model-close").trigger("click");
        location.reload();
      });
    },
    error: function (XHR, textStatus, error) {
      swal({
        icon: "error",
        text: error,
      });
    },
  });
});

$("#uploadFile").submit(function (e) {
  e.preventDefault();
  $("#csv").click();
});

$("#csv").change(function () {
  const data = new FormData();
  const file = $("#csv")[0].files[0];
  if (file === null || file === undefined) {
    return swal({
      icon: "warning",
      text: "Please Upload File.",
    });
  }
  data.append("file", file);
  // const d = data.get("file");
  //console.log(d);
  $.ajax({
    type: "POST",
    url: "/admin/uploadcsv",
    processData: false,
    contentType: false,
    data: data,
    success: function (data) {
      console.log(data);
      swal({
        icon: "success",
        text: "Records Added Successfully.",
      }).then(() => location.reload());
    },
    error: function (xhr, status, err) {
      if (xhr.status === 400) {
        return swal({
          icon: "error",
          text: "Invalid csv/text file.",
        }).then(() => location.reload());
      } else {
        swal({
          icon: "error",
          text: "Internal Server Error.",
        }).then(() => location.reload());
      }
    },
  });
});

function viewImg(e) {
  $("#myModal").modal("toggle");
  $("#img").attr("src", e.src);
}
