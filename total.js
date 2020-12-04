var price = {
    small: 10.00,
    medium: 20.00,
    large: 30.00,
    pepperoni: 5.00,
    ham: 10.00,
    chicken: 15.00,
    beef: 20.00,
    veggie: 10.00,
   
  };

  var Size = ["small", "medium", "large"];
  var Toppings = ["pepperoni", "ham", "chicken", "beef", "veggie"];
 
  var cats = { Size, Toppings};
  
  /* indicies for items added to category divs
   * e.g. if muffin is added after pancake, muffin will have an index of 1
   */
  var SizeIdx = 0;
  var ToppingsIdx = 0;


  
 function setAttributes() {
   var unassigned = document.getElementsByTagName("button");
   for (i = 0; i < unassigned.length; i++) {
     unassigned[i].onclick = function () { addItem(this); };
   }
 } setAttributes();
 
 function getPrice(obj) {
   var id = obj.id;
   for (i in price) {
     if (i == id) {
       return price[i];
     }
   }
 };
 
 function getCategory(obj) {
   var id = obj.id;
   for (i in cats) {
     for (j = 0; j < cats[i].length; j++) {
       if (id == cats[i][j]) {
         return i;
       }
     }
   }
 };
 
 function calculatePrice() {
   var total = 0;
   for (i in cats) {
     var div = document.getElementById(i);
     var nodes = div.childNodes;
     for (j = 0; j < nodes.length; j++) {
       total += parseFloat(nodes[j].getAttribute("price"));
     }
   }
   var parseTotal = total.toFixed(2);
   var totalDiv = document.getElementById("total");
   totalDiv.innerHTML = "Total: $" + parseTotal;
 }
 
 function clearTotal() {
   var div = document.getElementById("total");
   if (div.innerHTML != "") {
     div.innerHTML = "&nbsp";
   }
 }
 
 // clears each category div, and resets each category index to 0
 function clearList() {
   for (i in cats) {
     var div = document.getElementById(i)
     while (div.hasChildNodes()) {
       var nodes = div.childNodes;
       div.removeChild(nodes[0]);
     }
   }
   SizeIdx = 0;
   ToppingsIdx = 0;
  
   clearTotal();
 }
 
 // clears a categories column, resets that index to 0, and clears the total price (if present)
 function clearColumn(obj) {
   var cat = obj.nextElementSibling.id;
   var div = document.getElementById(cat);
   while (div.hasChildNodes()) {
     div.removeChild(div.childNodes[0]);
   }
   switch (cat) {
     case "Size":
       if (SizeIdx > 0) {
         clearTotal();
       }
       SizeIdx = 0;
       break;
     case "Toppings":
       if (ToppingsIdx > 0) {
         clearTotal();
       }
       ToppingsIdx = 0;
       break;
    
   }
 }
 
 /* clears the contents of a single cell.
  * because the clear button is overlayed on top of the item's image
  * clicking the button results in two calls
  * 1) clearCell(...) which removes the "stack" of images (really it reduces the price attribute)
  * 2) deleteItem(...) which removes the actual image from the column
  */
 function clearCell(obj, category, price) {
   var idx = obj.tabIndex;
   var div = document.getElementById(category);
   var nodes = div.childNodes;
   var itemP = nodes[idx].getAttribute("price");
   var n = itemP / price;
   for (i = 0; i < n - 1; i++) {
     deleteItem(obj, category, price);
   }
 }
 
 // adds an item's image into a category div based on the image's id
 function addItem(obj) {
   var idx; //used to idicate what position an item is in a column
   var category = getCategory(obj);
   var div = document.getElementById(category);
 
   switch (category) {
     case "Size":
       idx = SizeIdx;
       break;
     case "Toppings":
       idx = ToppingsIdx;
       break;
  
   }
 
   // determines whether next image input is a copy of a previous image
   var stack = false;
   if (idx > 0) {
     var srcImg = 'url("' + obj.src + '")';
     var nodes = document.getElementById(category).childNodes;
     for (i = 0; i < nodes.length; i++) {
      if (nodes[i].style.backgroundImage == srcImg) {
         stack = true;
       }
     }
   }
 
   /* if there are no stacks
    * the image is added to a new div as its background image
    * using backgroun image allows for text overlay
    * new div attributes are set, as well as overlay information
    *
    * if the image is a stack
    * first the images index is retrieved
    * then the overlay information is updated
    */
   if (!stack) {
     var newDiv = document.createElement("div");
     newDiv.setAttribute("class", "fix");
     newDiv.style.backgroundImage = "url(" + obj.src + ")";
     newDiv.style.backgroundSize = "150px 150px";
     newDiv.style.backgroundRepeat = "no-repeat";
     newDiv.setAttribute("price", getPrice(obj));
     newDiv.tabIndex = idx;
     newDiv.onclick = function () { deleteItem(this, category, getPrice(obj)); };
 
     var text = document.createElement("div");
     text.innerHTML = ("x1");
     text.setAttribute("class", "fixed")
 
     var dollar = document.createElement("div");
     dollar.innerHTML = "$" + getPrice(obj).toFixed(2);
     dollar.setAttribute("class", "fixed")
 
     var inputDiv = document.createElement("div");
     var input = document.createElement("input");
     
     input.onclick = function () { clearCell(newDiv, category, getPrice(obj)); };
     inputDiv.setAttribute("class", "fixer")
   
     newDiv.appendChild(text);
     newDiv.appendChild(dollar);
     newDiv.appendChild(inputDiv);
     div.appendChild(newDiv);
 
     switch (category) {
       case "Size":
         SizeIdx++;
         break;
       case "Toppings":
         ToppingsIdx++;
         break;
     
     }
   } else {
     var index;
     for (i = 0; i < div.childNodes.length; i++) {
       if (div.childNodes[i].style.backgroundImage == srcImg) {
         index = i;
       }
     }
     var node = div.childNodes[index];
     var itemP = parseFloat(node.getAttribute("price"));
     var count = node.firstElementChild;
     var num = parseInt(count.innerHTML.substr(1, count.innerHTML.length)) + 1;
 
     var dollar = count.nextElementSibling;
     var amount = parseFloat(dollar.innerHTML.substr(1, dollar.innerHTML.length));
     amount += getPrice(obj);
 
     count.innerHTML = "x" + num;
     dollar.innerHTML = "$" + amount.toFixed(2);
     node.setAttribute("price", itemP + getPrice(obj));
   }
   clearTotal();
 };
 
 
 /* detets an item from the column
  * if the item is stacked (i.e. its price attribute is greater than the item price)
  * then the function decrements the price by the item price until the base price remains
  * 
  * if the image is not stacked
  * the function removes the image, decrements the category index,
  * and updates the tabIndex for each image
  */
 function deleteItem(obj, category, price) {
   var idx = obj.tabIndex;
   var div = document.getElementById(category);
   var nodes = div.childNodes;
   var itemP = parseFloat(nodes[idx].getAttribute("price")).toFixed(2);
 
   if (itemP > price) {
     nodes[idx].setAttribute("price", itemP - price);
     var count = nodes[idx].firstElementChild;
     var dollar = count.nextElementSibling;
 
     var num = parseInt(count.innerHTML.substr(1, count.innerHTML.length)) - 1;
     var amount = parseFloat(dollar.innerHTML.substr(1, dollar.innerHTML.length));
     amount -= price;
 
     count.innerHTML = "x" + num;
     dollar.innerHTML = "$" + amount.toFixed(2);
   } else {
     div.removeChild(nodes[idx])
     for (i = idx; i < nodes.length; i++) {
       nodes[i].tabIndex = i;
     }
 
     switch (category) {
       case "Size":
         SizeIdx--;
         break;
       case "Toppings":
         ToppingsIdx--;
         break;
    
     }
   }
   clearTotal();
 };
