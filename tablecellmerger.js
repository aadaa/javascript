/********************************************************************************
 * Class:  TableCellMerger
 * Description: Merges similar cells in given row or column in supplied table.
 * Usage:   Supply id of the table you want to merge.
 *          xmerge() - Merges similar cells lining in a row (affects all rows).
 *          ymerge() - Merges similar cells lining in a column (affects all columns).
 *
 *          You may provide options if you want to merge cells in specific rows(columns).
 *          There are two types of options: include and exclude.
 *
 *          xmerge('include: 1, 2, 3') => Merges similar cells lining in 1,2,3rd rows.
 *          xmerge('exclude: 1, 2, 3') => Merges similar cells lining in all rows except cells in 1,2,3rd rows.
 *
 *          ymerge('include: 5, 6') => Merges similar cells lining in 1,2,3rd columns.
 *          ymerge('exclude: 8, 9') => Merges similar cells lining in all rows except cells in 1,2,3rd columns.
 *
 *          merge() => Calls ymerge() then calls xmerge().
 *
 *      
 * Example: new TableCellMerger('id_of_table_to_be_merged').merge();
 *          new TableCellMerger('id_of_table_to_be_merged').ymerge();
 *          new TableCellMerger('id_of_table_to_be_merged').xmerge();
 *
 *          new TableCellMerger('id_of_table_to_be_merged').xmerge('include: 1, 2');
 *          new TableCellMerger('id_of_table_to_be_merged').ymerge('exclude: 3, 4');
 *
 *          new TableCellMerger('id_of_table_to_be_merged').xmerge('include: 1, 2').ymerge('exclude: 3, 4');
 *          OR
 *          new TableCellMerger('id_of_table_to_be_merged').ymerge('exclude: 3, 4').xmerge('include: 1, 2');
 *
 ********************************************************************************
 *
 *  Copyright (c) 2009 Battur Sanchin
 *
 *            { 
 *              :homepage => 'http://battur.blogspot.com', 
 *              :email    => 'batturjapan@gmail.com', 
 *              :flickr   => 'http://flickr.com/photos/battur' 
 *            }
 *
 * ------------------------------------------------------------------------------                   
 *
 * License: MIT License
 *
 ********************************************************************************
 */
function TableCellMerger(tableId){

  this.incArr = new Array();
  this.excArr = new Array();
  this.tr = document.getElementById(tableId)
    .getElementsByTagName("tbody")[0]
    .getElementsByTagName("tr");


  this.loadOption=function(option){
    if(option != null && option.match(/^(inc|exc)lude:( ?\d+,)* ?\d+$/)){
      var optionVal = option.slice(8);
      if(option.match(/^include/))
        // add -1 front, otherwise it will create n elements of 
        // empty array if you put single 'n' option
        eval("this.incArr = new Array(-1," + optionVal + ");")
      else
        eval("this.excArr = new Array(-1," + optionVal + ");")
    } else if(option != null)
      throw("Option is invalid: '" + option + "'");
  }

  this.ymerge = function(option){

    // load supplied option here.
    this.loadOption(option);

    var tr = this.tr;
    var numCols = tr[tr.length - 1].cells.length;

    for(var j = 0; j < numCols; j++){
      var spanningCell = null;
      var comparingCell = null;

      if((this.incArr.length > 0 && this.incArr.indexOf(j + 1) == -1)
          || (this.excArr.length > 0 && this.excArr.indexOf(j + 1) != -1))
        continue;

      for(i = 0; i < tr.length - 1; i++){
        td = tr[i].getElementsByTagName("td");

        spanningCell = (spanningCell == null ? td[j] : spanningCell);
        comparingCell = tr[i+1].getElementsByTagName("td")[j];

        if(spanningCell != null 
            && spanningCell.innerHTML == comparingCell.innerHTML 
            && spanningCell.colSpan == comparingCell.colSpan){
          comparingCell.style.display = "none";
          spanningCell.rowSpan += 1;
        } else
          spanningCell = comparingCell;
      }
    }
    return this;
  }

  this.xmerge = function(option){
    
    // load supplied option here.
    this.loadOption(option);

    var tr = this.tr;
    var numCols = tr[tr.length - 1].cells.length;

    for(i = 0; i < tr.length; i++){
      var spanningCell = null;
      var comparingCell = null;

      if((this.incArr.length > 0 && this.incArr.indexOf(i + 1) == -1)
          || (this.excArr.length > 0 && this.excArr.indexOf(i + 1) != -1))
        continue;

      for(var j = 0; j < numCols - 1; j++){
        td = tr[i].getElementsByTagName("td");

        spanningCell = (spanningCell == null ? td[j] : spanningCell);
        comparingCell = tr[i].getElementsByTagName("td")[j+1];

        if(spanningCell != null 
            && spanningCell.innerHTML == comparingCell.innerHTML 
            && spanningCell.rowSpan == comparingCell.rowSpan){
          comparingCell.style.display = "none";
          spanningCell.colSpan += 1;
        } else
          spanningCell = comparingCell;
      }
    }
    return this;
  }

  this.merge = function(){
    this.ymerge(null);
    this.xmerge(null);
    return this;
  }

  return this;

}


