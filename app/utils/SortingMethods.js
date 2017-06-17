module.exports = {

    salesmenSortingMethod: function (salesman1, salesman2){
        if(salesman1.personal.firstName + salesman1.personal.lastName < salesman2.personal.firstName + salesman2.personal.lastName)
            return -1;
        else if (salesman1.personal.firstName + salesman1.personal.lastName > salesman2.personal.firstName + salesman2.personal.lastName)
            return 1;
        else return 0;
    },

    productSortingMethod: function(prod1, prod2){
        if(prod1.category + prod1.subCategory + prod1.name < prod2.category + prod2.subCategory + prod2.name)
            return -1;
        else if (prod1.category + prod1.subCategory + prod1.name > prod2.category + prod2.subCategory + prod2.name)
            return 1;
        else
            return 0;
    },

    shiftSortingByAgent: function(shift1, shift2){
        if(shift1.storeId.managerName < shift2.storeId.managerName)
            return -1;
        else if(shift1.storeId.managerName > shift2.storeId.managerName)
            return 1;
        else
            return ((new Date(shift1.startTime)).getTime() - (new Date(shift2.startTime)).getTime());

    },

    storeSortingMethod: function(store1, store2) {
        if(store1.area + store1.city + store1.name < store2.area + store2.city + store2.name)
            return -1;
        else if(store1.area + store1.city + store1.name > store2.area + store2.city + store2.name)
            return 1;
        else
            return 0;
    },

    constraintsSortingMethod: function(cons1, cons2) {
        if(cons1.isAvailable && !cons2.isAvailable)
            return -1;
        else if(!cons1.isAvailable && cons2.isAvailable)
            return 1;
        else {
            if (cons1.salesman.personal.firstName + cons1.salesman.personal.lastName < cons2.salesman.personal.firstName + cons2.salesman.personal.lastName)
                return -1;
            else if(cons1.salesman.personal.firstName + cons1.salesman.personal.lastName > cons2.salesman.personal.firstName + cons2.salesman.personal.lastName)
                return 1;
            else
                return 0;
        }
    }

};