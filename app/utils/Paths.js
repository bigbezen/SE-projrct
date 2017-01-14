/**
 * Created by lihiverchik on 14/01/2017.
 */

var React = require('react');

class Paths extends React.Component {
    static manager_home = '/manager/home';
    static manager_users = '/manager/users';
    static manager_stores = '/manager/stores';
    static manager_products = '/manager/products';
    static manager_productDetails= '/manager/product';
    static manager_storeDetails = '/manager/store';
    static manager_userDetails = '/manager/user';
    static salesman_home = '/salesman/home';
    static salesman_startShift = '/salesman/startShift';
    static salesman_shift = '/salesman/shift';
    static salesman_endShift = '/salesman/endShift';
}

module.exports = Paths;