// const params = new URLSearchParams(window.location.search)
// const min = params.get("min")
// const max = params.get("max")
// const size = params.get("size")
// const value = params.getAll("name")

const fdata = JSON.parse(localStorage.getItem("features_key"));
// console.log(fdata);
const objKey = Object.keys(fdata);
const objValue = Object.values(fdata);
// console.log(objValue);
const feature = new Array();
var a = "";
feature.push(fdata)
// console.log(feature);
for (let i = 0; i < objKey.length; i++) {
  a += `&` + objKey[i] + `=` + objValue[i];

}



$("#filter-data").hide();
// console.log(value)
$("#loader").prepend($("<img>", { id: "load", src: "../images/loader.gif" }));
$(window).on("load", function () {

  $("#datatable").hide();
  $("#loader").show();
  $.ajax({
    url: `/multiple-filter/?${a.slice(1)}`,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Content-Type": "application/json",
      "Access-Control-Allow-Credentials": true,
    },
    success: async function (data) {
      
      if (data.length === 0) {
        swal({
          icon: "error",
          title: "No Record Found",
        }).then(() => {
          location.href = "/";
        });
      } else {
        const h = data[0];
        // console.log(h);
      const HeaderKey = Object.keys(h);
      // console.log(HeaderKey);
      HeaderKey.shift();
      HeaderKey.push("View_Details");
      //  HeaderKey.reverse();
      const Column = [];
      data.map((i) => {
    
        i.file_name = ` <td><img src="${i.file_name == null
              ? "https://shahidafridifoundation.org/wp-content/uploads/2020/06/no-preview.jpg"
              : `https://devicefilteradmin.microlent.com/uploads/${i.file_name}`
            }" height="50" class="myimg" onclick="viewImg(this)"/></td>`;
            i.view_Details =`<td><button class="btn btn-success"onclick="viewDetail(${i.model_id})"><i class="fa fa-eye" aria-hidden="true"></i></td>`;
        Column.push(Object.values(i));
      });
          // console.log(Column);
          var table = $("<table />");
          table[0].border = "1";
          table[0].id="datatable";
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
          // $("#v2").html(`${fdata.value1}`);
          // $("#v3").html(`${fdata.value2}`);
          // $("#v4").html(`${fdata.value3}`);
          // $("#v5").html(`${fdata.value4}`);
          // function getKeyByValue(object, value) {
          //   value = value.toLowerCase();
          //   //console.log(value);
          //   for (var prop in object) {
          //     //console.log(prop);
          //     if (prop == value) {
          //       return object[prop];
          //     }
          //   }
          // }
          // ans = getKeyByValue(item, fdata.value0);
          // //console.log(ans);
          // $("#table-body").append(`
          //         <tr id="table-data">
          //          <td><img src="${item.file_name == null
          //     ? "https://shahidafridifoundation.org/wp-content/uploads/2020/06/no-preview.jpg"
          //     : `https://devicefilteradmin.microlent.com/uploads/${item.file_name}`
          //   }" height="50" class="myimg" onclick="viewImg(this)"/></td>
          //           <td>${item.model_name}</td>
          //           <td>${item.price}</td>
          //           <td> ${getKeyByValue(item, fdata.value0)}</td>
          //           <td>${getKeyByValue(item, fdata.value1)}</td>
          //           <td>${getKeyByValue(item, fdata.value2)}</td>
          //           <td>${getKeyByValue(item, fdata.value3)}</td>
          //           <td>${getKeyByValue(item, fdata.value4)}</td>
          //           <td><button class="btn btn-success"onclick="viewDetail(${item.model_id
          //   })"><i class="fa fa-eye" aria-hidden="true"></i></td>
          //         </tr>
          //       `);
        // };
      
          $("#datatable").DataTable({
            paging: true,
            ordering: false,
          });
        $("#filter-data").show();
        $("#datatable").show();
        $("#loader").hide();
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#datatable").show();
      $("#loader").hide();
      swal({
        icon: "error",
        title: "Something Went Wrong",
      }).then(() => window.history.back());
    },
  });
});

function viewDetail(id) {
  location.href = `/Singleproduct/?id=${id}`;
  // $.ajax({
  //   type: "GET",
  //   url: `/SingleProduct/${id}`,
  //   dataType: "json",
  //   contentType: "application/json",
  //   success: function (data) {
  //     console.log(data);
  //     $("#img").attr(
  //       "src",
  //       "https://images.samsung.com/is/image/samsung/in-galaxy-m51-m515fz-6gb-sm-m515fzbdins-sm-m---fzbeins-304622862?$684_547_PNG$"
  //     );
  //     $("#title").text(data[0].model_name);
  //     $("#price").text(data[0].price);
  //     $("#myModal").modal("show");
  //   },
  //   error: function (xhr, status, err) {
  //     swal({
  //       icon: "error",
  //       text: xhr.responseText,
  //     }).then(() => {
  //       location.href = "/data";
  //     });
  //   },
  // });
}

function viewImg(e) {
  $("#myModal").modal("toggle");
  $("#img").attr("src", e.src);
}
