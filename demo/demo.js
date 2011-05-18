$(document).ready(function() {
    $('.myTable01').fixedHeaderTable({ height: '250', footer: true, cloneHeadToFoot: true, altClass: 'odd', themeClass: 'fancyTable', autoShow: false });
    
    $('.myTable01').fixedHeaderTable('show', 1000);
    
    $('.myTable02').fixedHeaderTable({ height: '250', footer: true, altClass: 'odd', themeClass: 'fancyTable' });
    
    $('.myTable03').fixedHeaderTable({ height: '400', altClass: 'odd', footer: true, fixedColumn: true, themeClass: 'fancyTable' });
    
    $('.myTable04').fixedHeaderTable({ height: '400', altClass: 'odd', footer: true, cloneHeadToFoot: true, fixedColumn: true, themeClass: 'fancyTable' });
});