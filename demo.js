$(document).ready(function() {
    $('.myTable, .myOtherTable').fixedHeaderTable({ tableHeight: '350', hasFooter: true, autoShow: false });
    $('.myOtherTable').fixedHeaderTable('show');
    setTimeout(showMyTable, 5000);
    
    setTimeout(hideMyTable, 8000);
});

showMyTable = function() {
    $('.myTable').fixedHeaderTable('show');
}

hideMyTable = function() {
    $('.myTable').fixedHeaderTable('destroy');
}