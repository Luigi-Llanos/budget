

//---------------------------------- BUDGET CONTROLLER  -------------------------
var budgetController = (function(){
 
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type){

        var sum = 0;
        data.allItems[type].forEach(function(cur){
          sum += cur.value;
        });

        data.totals[type] = sum;

    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function(type, des, val){
          var newItem, ID;
          //[1 2 3 4 5], next ID = 6
          //[1 2 4 6 8], next ID = 9
          // ID = last ID + 1

          //Create new ID
          if (data.allItems[type].length > 0){
            ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
          } else {
              ID = 0;
          }
          

          // Create a new item based on 'inc' or 'exp' type
          if (type === 'exp') {
              newItem = new Expense(ID, des, val);
          } else if (type === 'inc'){
              newItem = new Income(ID, des, val);
          } 
          
          //Push it into pur data structure
          data.allItems[type].push(newItem);

          // return the new item
          return newItem;
          
        },


        deleteItem: function(type, id){
            var ids, index;

           // id = 6
           // data.allItems[type][id];
           // ids = [1 2 4 6 8]
           // index = 3

           ids = data.allItems[type].map(function(current){
               return current.id;
           });

           index = ids.indexOf(id);

           if (index !== -1){
               data.allItems[type].splice(index, 1);
           } 
           

        },
        
        
        calculateBudget: function(){

           //calculate total income and expenses
           calculateTotal('exp');
           calculateTotal('inc');

           //calculate the budget: income - expenses
           data.budget = data.totals.inc - data.totals.exp;

           //calculate the percentage of the income that we spent
           if (data.totals.inc){
            data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
           } else {
               data.percentage= -1;
           }
           

           //expense = 100 and income 200, spent 50% = 100/200 = 0.5 * 100

        },

        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };

        },


        testing: function(){
            console.log(data);
            
        }
    };

})();


// ----------------------------  UI CONTROLLER ------------------------------
var UIController = (function(){

   var DOMstrings = {
       inputType: '.add__type',
       inputDescription: '.add__description',
       inputValue: '.add__value',
       inputBtn: '.add__btn',
       incomeContainer: '.income__list',
       expensesContainer: '.expenses__list',
       budgetLabel: '.budget__value',
       incomeLabel: '.budget__income--value',
       expensesLabel: '.budget__expenses--value',
       percentageLabel: '.budget__expenses--percentage',
       container: '.container'
   }

  return {
       getInput: function(){
           return{
         type: document.querySelector(DOMstrings.inputType).value,// will be either inc or exp
         description: document.querySelector(DOMstrings.inputDescription).value,
         value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
           };   
       },

       addListItem: function(obj, type){
           
          var html, newHtml, element;
           // create html string with placeholder text
          if (type === 'inc') {
            element = DOMstrings.incomeContainer;

            html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
          } else if (type === 'exp') {
            
            element = DOMstrings.expensesContainer;

            html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
          }

         // Replace the placeholder text with some actual data

         newHtml = html.replace('%id%', obj.id);
         newHtml = newHtml.replace('%description%', obj.description);
         newHtml = newHtml.replace('%value%', obj.value);

         // insert html into the dom
          document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

       },
          clearFields: function(){
              var fields, fieldsArr;

              fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

              fieldsArr = Array.prototype.slice.call(fields);

              fieldsArr.forEach(function(current, index, array) {
                  current.value= "";
              });

              fieldsArr[0].focus();

          },

        displayBudget: function(obj){
           
           document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
           document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
           document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
           

           if (obj.percentage > 0){
             document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
           } else {
            document.querySelector(DOMstrings.percentageLabel).textContent = '---'; 
           }

        },

       getDOMstrings: function(){
           return DOMstrings;
       }
  };

})();



//---------------------------------- GLOBAL APP CONTROLLER  ----------------------
var controller = (function(budgetCtrl, UICtrl){
    
   //put all event lsteners in one function
   var setupEventListeners = function(){
     
    var DOM = UICtrl.getDOMstrings();

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', function(event){
       // when ENTER is pressed:
        if (event.keyCode === 13 || event.which === 13){
            ctrlAddItem();       
        }
    });

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);


};

     
   var updateBudget = function (){

    //1. Calcualte budget
         budgetCtrl.calculateBudget();

    //2. Return the budget
        var budget = budgetCtrl.getBudget();


    //3. Display the budget on the UI
        UICtrl.displayBudget(budget);
   };




    // -----------------------  ADD ITEM FUNCTION  -----------------
    var ctrlAddItem = function(){

       var input, newItem;

        //1. Get field input data
        input = UICtrl.getInput();

        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
           //2. Add the item to the budget controller
           newItem = budgetCtrl.addItem(input.type, input.description, input.value);

           //3. Add the item to UI
           UICtrl.addListItem(newItem, input.type);

           //4. Clear the fields
           UICtrl.clearFields();

           //5. Calculate and Update Budget
           updateBudget();

        }

    };


    var ctrlDeleteItem = function(event){
        var itemID, splitID, type, ID;

         itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
         if (itemID){

             //inc-1
             splitID = itemID.split('-');
             type = splitID[0];
             ID = parseInt(splitID[1]);

             //1. delete the item from data structure
              budgetCtrl.deleteItem(type, ID);

             //2. Delete the item from the UI

             //3. Update and show the new budget

         }

    };

    
     return {
         init: function(){
             console.log('Application has started');
             UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
             setupEventListeners();
         }
     };

})(budgetController, UIController);

//GLOBAL APP CONTROLLER  ---------------------- END

controller.init();








