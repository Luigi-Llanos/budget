

//BUDGET CONTROLLER  -------------------------
var budgetController = (function(){
 
    //some code
    
    })();
    
    
    //UI CONTROLLER ------------------------------
    var UIController = (function(){
    
    // some code later
    
    })();
    
    
    
    //GLOBAL APP CONTROLLER  ----------------------
    var controller = (function(budgetCtrl, UICtrl){
      
        var ctrlAddItem = function(){
            //1. Get field input data
              
            //2. Add the item to the budget controller
    
            //3. Add the item to UI
    
            //4. Calcualte budget
    
            //5. Display the bidget on the UI
    
        } 
    
        //set event listener
        document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);
    
        document.addEventListener('keypress', function(event){
           // when ENTER is pressed:
            if (event.keyCode === 13 || event.which === 13){
                ctrlAddItem();       
            }
           
           
    
        });
     
    
    })(budgetController, UIController);
    
    
    
    
    
    
    
    
    
    
    