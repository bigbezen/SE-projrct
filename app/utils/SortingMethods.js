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

};