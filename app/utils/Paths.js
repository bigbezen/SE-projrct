

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
    static manager_createMultipleShifts_path = '/manager/createMultipleShifts';
    static salesman_home_path = '/salesman/home/home';
    static salesman_startShift_path = '/salesman/startShift';
    static salesman_shiftExpenses_path = '/salesman/home/shiftsExpenses';
    static salesman_sale_path = '/salesman/shift/sale';
    static salesman_shift_comments_path = '/salesman/shift/comments';
    static salesman_shift_path = '/salesman/shift';
    static salesman_endShift_path = '/salesman/endShift';
    static member_retrievePass_path = '/member/retrievePassword';
    static manager_changePass_path = '/manager/changePassword';
    static salesman_changePass_path = '/salesman/home/changePassword';
    static salesman_editShift_path = '/salesman/shift/editSale';
    static salesman_shift_encouragements_path = '/salesman/shift/encouragements';
    static manager_incentives_path = '/manager/incentives';
    static manager_incentiveDetails_path = 'manager/incentive';
    static manager_reports_path = 'manager/reports';
    static salesman_profile_path = '/salesman/home/profile';
    static salesman_shiftSchedule_path = '/salesman/home/shiftSchedule';
    static manager_incentiveDetails_path = '/manager/incentive';
    static manager_salesReport_path = '/manager/salesReport';
    static manager_monthlyAnalysisReport_path = '/manager/monthlyAnalysisReport';
    static manager_monthlyHoursReport_path = '/manager/monthlyHoursReport';
    static manager_humanResourcesReport_path = '/manager/humanResourcesReport'

}

module.exports = Paths;