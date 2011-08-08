/**
 * Copyright (c) 2011 Dennis Hall <https://github.com/dennishall>.
 * All rights reserved.  Use of this source code is governed by the MIT license.
**/

// Utility function
function xpathForEach(xpath, fn){
  var nodelist = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  var item;
  for (var i=0, l=nodelist.snapshotLength; i<l; i++) {
    item = nodelist.snapshotItem(i);
    fn.apply(item, [i, item]);
  }
}



// "ondomready"
document.addEventListener('DOMContentLoaded', function(){
  
  // click a row = go to that ticket.
  xpathForEach('//table[@id="grdReport" or contains(@id, "ReportContainer")]', function(i, item){
    item.addEventListener('click', function(e){
      e = e || window.event;
      var target = e.target;
      var tr;
      var depth = 0;
      var maxDepth = 5;
      var url;
      if(!target || target.nodeName == 'INPUT'){
        return;
      }
      while(target && depth++ < maxDepth){
        if(target.nodeName == "TR" && target.parentNode.nodeName != "THEAD"){
          tr = target;
        }
        target = target.parentNode;
      }
      if(tr && !/commonHeader/.test(tr.className)){
        url = tr.getElementsByTagName('a')[0].getAttribute('href');
        if(e.which == 2){
          // "middle" click (open in new tab please :)
          open(url);
        } else {
          // "left" click
          location.href = url;
        }
      }
    }, false);
  });
  
  // Display total for "Est. Effort (hrs)"
  xpathForEach('//table[@id="grdReport"]//tr[contains(@class, "commonHeader")]//td', function(i, headerCell){
    if(/Est. Effort \(hrs\)/.test(headerCell.innerHTML)){
      
      var column = i;
      var total = 0;
      var numColumns = headerCell.parentNode.getElementsByTagName('td').length;
      
      xpathForEach('//table[@id="grdReport"]//td[position()='+(column+1)+']', function(i, item){
        if(i){
          total += parseInt( item.innerHTML ) || 0;
        }
      });
      
      //alert(total);
      
      var tr = document.createElement('tr');
      var tds = [document.createElement('td'), document.createElement('td'), document.createElement('td')];
      tds[0].setAttribute('colspan', column);
      tds[0].setAttribute('align', 'right');
      tds[0].innerHTML = 'total: ';
      tds[1].innerHTML = total;
      tds[2].setAttribute('colspan', numColumns-column);
      
      document.getElementById('grdReport').getElementsByTagName('tbody')[0].appendChild(tr);
      
      tr.appendChild(tds[0]);
      tr.appendChild(tds[1]);
      tr.appendChild(tds[2]);
    }
  });

}); // end "domready"
