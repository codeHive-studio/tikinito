$("#searchData").keyup(function () {
  filterTable($(this).val());
});

function filterTable(val) {
  $("#productTb tbody tr").each(function () {
    var found = false;
    $(this).each(function () {
      if ($(this).text().toLowerCase().indexOf(val.toLowerCase()) >= 0) {
        found = true;
      }
    });
    if (found == "true") {
      $(this).show();
    } else {
      $(this).hide();
    }
  });
}
