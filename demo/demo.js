$(document).ready(function() {
    $('#myTable01').fixedHeaderTable({ footer: true, cloneHeadToFoot: true, altClass: 'odd', autoShow: false });
    
    $('#myTable01').fixedHeaderTable('show', 1000);
    
    $('#myTable02').fixedHeaderTable({ footer: true, altClass: 'odd' });
    
    $('#myTable05').fixedHeaderTable({ altClass: 'odd', footer: true, fixedColumns: 1 });
    
    $('#myTable03').fixedHeaderTable({ altClass: 'odd', footer: true, fixedColumns: 1 });
    
    $('#myTable04').fixedHeaderTable({ altClass: 'odd', footer: true, cloneHeadToFoot: true, fixedColumns: 3 });
});
