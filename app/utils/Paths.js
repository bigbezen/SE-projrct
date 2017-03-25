/**
 * Created by lihiverchik on 14/01/2017.
 */

var React = require('react');

class Paths extends React.Component {
    static login_path = '/';
    static manager_home_path = '/manager/home';
    static manager_users_path = '/manager/users';
    static manager_stores_path = '/manager/stores';
    static manager_products_path = '/manager/products';
    static manager_shifts_path = '/manager/shifts';
    static manager_productDetails_path = '/manager/product';
    static manager_storeDetails_path = '/manager/store';
    static manager_userDetails_path = '/manager/user';
    static manager_shiftDetails_path = '/manager/shift';
    static manager_createShifts_path = '/manager/createShifts';
    static salesman_home_path = '/salesman/home';
    static salesman_startShift_path = '/salesman/startShift';
    static salesman_sale_path = '/salesman/sale';
    static salesman_shift_path = '/salesman/shift';
    static salesman_endShift_path = '/salesman/endShift';
    static member_retrievePass_path = '/member/retrievePassword';
    static member_changePass_path = '/member/changePassword';
}

module.exports = Paths;