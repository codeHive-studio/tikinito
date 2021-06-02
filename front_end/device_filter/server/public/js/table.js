// let minInput = document.getElementById("min");
// let maxInput = document.getElementById("max");
// let search = document.getElementById("search");
// let min = minInput.value;
// let max = maxInput.value;
// let nodeCopy;

// // slider min value
// minInput.addEventListener("change", function (e) {
//   min = this.value;
// });

// //slider max value
// maxInput.addEventListener("change", function (e) {
//   max = this.value;
// });

//allow drop in select div
function allowDrop(ev) {
  ev.preventDefault();
}

//drag selected button
function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

$("#loader").prepend($("<img>", { id: "load", src: "../images/loader.gif" }));

$(window).on("load", function () {
  $("#loader").fadeOut();
  $("#mainc").hide();
  $("#loader").show();
  $.ajax({
    url: `/initial`,
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
        const arr = data[0];
        // console.log(arr.min,arr.max);
        $(".js-range-slider").ionRangeSlider();
        let my_range = $(".js-range-slider").data("ionRangeSlider");

        my_range.update({
          min: arr.min,
          max: arr.max,
          from: arr.min,
          to: arr.max,
        });

        $("#mainc").show();
        $("#loader").hide();
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      swal({
        icon: "error",
        title: "Something Went Wrong",
      });
      ``;
    },
  });
});

var maxValue = 1;
const dragOverDiv = document.querySelectorAll(".afterdrop");
//drop select button
function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  let countDrop = dragOverDiv.length;
  const length = document.getElementById("drop-container").children.length;

  $(document).on("dragstart", `#` + ev.target.id, function (e) {
    e.originalEvent.dataTransfer.setData("data", $(this).attr("data-text"));
  });

  $(document).on("dragenter", `#` + ev.target.id, function (ev) {
    $(`#` + ev.target.id).css("transform", "scale(1.1)");
  });

  $(document).on("dragleave", `#` + ev.target.id, function (ev) {
    $(`#` + ev.target.id).css("transform", "scale(1.0)");
  });
  if (ev.target.innerHTML) return;
  for (i = 0; i < length; i++) {
    const v = document.getElementById("drop-container").children[i].id;
    if (countDrop <= 5 && ev.target.id === v) {
      nodeCopy = document.getElementById(data);
      nodeCopy.classList.remove("m-4");
      nodeCopy.style.width = "280px";
      ev.target.classList.remove("jumpcard");

      nodeCopy.style.transform = "rotate(0deg)";
      ev.target.style.border = "unset";

      ev.target.appendChild(nodeCopy);
    }
  }
}

//console.log(v)
//console.log("hii")
let dropContainer = document.getElementById("drop-container");

let arr;
let features;
dropContainer.addEventListener("mouseenter", function () {
  for (let i = 0; i < dropContainer.children.length; i++) {
    childDivId = dropContainer.innerText;
    arr = childDivId.split("\n");
    //console.log(arr);
    features = arr;
    if (arr.length == 5) {
    }
  }
});

//console.log(features);
var minSliderValue = $("#ex11").data("slider-min");
var maxSliderValue = $("#ex11").data("slider-max");

$("#input-value").on("keyup", function () {
  var val = Math.abs(parseInt(this.value, 10) || minSliderValue);
  this.value = val > maxSliderValue ? maxSliderValue : val;
  $("#ex11").slider("setValue", val);
});

$("#ex11").slider();
$("#ex11").on("slide", function (slideEvt) {
  $("#ex11SliderVal").text(slideEvt.value);
});

$("#filter-data").hide();

//----------- click button function ---------//
$("#search").click(async function () {
  $("#table-body  tr").remove();
  var size = [];
  sizeValue = $("#input-left").val();
  sizeXL = $("#input-right").val();
  var S = parseInt(sizeValue);
  var XL = parseInt(sizeXL);

  var s1 = [0, 33, 66, 100];
  let i = 0,
    j = 3;
  while (i < 4) {
    if (s1[i] >= S) break;
    i++;
  }
  while (j > 0) {
    if (s1[j] <= XL) break;
    j--;
  }
  if (i > j) size = [];
  else {
    for (x1 = i; x1 <= j; x1++) size.push(x1 + 1);
  }

  // if (features.length == 5) {
  var a = document.getElementsByClassName("afterdrop");
  //console.log(a)
  var value = [];
  const f ={};
  for (i = 0; i < a.length; i++) {
    value.push(a[i].textContent.replace(/[\n\r]+|[\s]{2,}/g, " ").trim());
    // console.log(value[i]);
    f ['value' + i] = value[i];
 
  }
  if (value.includes("")) {
    return swal({
      icon: "error",
      title: "Please Drag And Drop All Features",
    });
  }
  if (size.length == 0) {
    return swal({
      icon: "error",
      title: "Please Select Valid Size",
    });
  }
  min = $(".irs-from").text().replace(/ /g, "");
  max = $(".irs-to").text();
  // console.log(min.replace(/ /g,''))
  const features = {
    min: min.replace(" ", ""),
    max: max.replace(" ", ""),
    size: size,
    ...f
  };

  localStorage.setItem("features_key", JSON.stringify(features));
  window.location.href = "/data";
  //  window.location.href = "/data/?min=" + min + "&max=" + max + "&size=" + size + "&name=" + value[0] + "&name=" + value[1] + "&name=" + value[2] + "&name=" + value[3] + "&name=" + value[4] ;
});
//-------search button click---//

var inputLeft = document.getElementById("input-left");
var inputRight = document.getElementById("input-right");

var thumbs = document.querySelector(".slider > .thumb.left");
var thumbRight = document.querySelector(".slider > .thumb.right");

var range = document.querySelector(".slider > .range");

function setLeftValue() {
  var _this = inputLeft,
    min = parseInt(_this.min),
    max = parseInt(_this.max);

  _this.value = Math.min(parseInt(_this.value), parseInt(inputRight.value) - 1);

  var percent = ((_this.value - min) / (max - min)) * 100;

  thumbs.style.left = percent + "%";
  range.style.left = percent + "%";
}
setLeftValue();

function setRightValue() {
  var _this = inputRight,
    min = parseInt(_this.min),
    max = parseInt(_this.max);

  _this.value = Math.max(parseInt(_this.value), parseInt(inputLeft.value) + 1);

  var percent = ((_this.value - min) / (max - min)) * 100;

  thumbRight.style.right = 100 - percent + "%";
  range.style.right = 100 - percent + "%";
}
setRightValue();

// module.exports = {

// }

inputLeft.addEventListener("input", setLeftValue);
inputRight.addEventListener("input", setRightValue);

inputLeft.addEventListener("mouseover", function () {
  thumbs.classList.add("hover");
});
inputLeft.addEventListener("mouseout", function () {
  thumbs.classList.remove("hover");
});
inputLeft.addEventListener("mousedown", function () {
  thumbs.classList.add("active");
});
inputLeft.addEventListener("mouseup", function () {
  thumbs.classList.remove("active");
});

inputRight.addEventListener("mouseover", function () {
  thumbRight.classList.add("hover");
});
inputRight.addEventListener("mouseout", function () {
  thumbRight.classList.remove("hover");
});
inputRight.addEventListener("mousedown", function () {
  thumbRight.classList.add("active");
});
inputRight.addEventListener("mouseup", function () {
  thumbRight.classList.remove("active");
});

$(document).ready(function () {
  $.ajax({
    type: "GET",
    url: "/allCategory",
    dataType: "json",
    contentType: "application/json",
    success: function (data) {
      data.data.map((db, i) => {
        var color = Math.floor(Math.random() * 16777215).toString(16);

        if (color.length < 6) {
          color = "d10dea";
        }

        $("#AllFeature").append(`
              <div class="col-md-4 col-sm-4  col-4">
              <button type="button" class="btn  btn-lg  btn3d m-4" draggable="true" id=${i} ondragstart="drag(event)" 
              style="background-color:#${color};
               box-shadow: 0 0 0 1px #${color} inset, 0 0 0 2px rgba(255, 255, 255, 0.15) inset, 0 8px 0 0 #${color}, 0 8px 8px 1px rgba(0, 0, 0, 0.5);
              transform: rotate(${Math.random() * 20}deg);
              ">
               <span class="glyphicon glyphicon-cloud"></span>${db.cname}
                 </button>
          </div>
        `);
        $("#box-dotted").before(`
       <div
        class="card jumpcard afterdrop a mx-auto"
        id="drag${i}"
        ondrop="drop(event)"
        ondragover="allowDrop(event)"
      ></div>
        `);
      });
    },
    error: function (xhr, status, err) {
      swal({
        icon: "error",
        text: err,
      });
    },
  });
});
