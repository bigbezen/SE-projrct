/**
 * Created by lihiverchik on 29/11/2016.
 */
var React = require('react');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var hashHistory = ReactRouter.hashHistory;
var Base = require("../containers/BaseContainer");
var Login = require('../containers/LoginContainer');
var Home = require('../containers/HomeContainer');
var Users = require('../containers/UsersContainer');
var Stores = require('../containers/StoresContainer');
var Products = require('../containers/ProductsContainer');
var Product = require('../containers/ProductDetails');
var Store = require('../containers/StoreDetails');
var User = require('../containers/UserDetails');
var Shifts = require('../containers/ShiftsContainer');
var Shift = require('../containers/ShiftDetails');
var CreateShifts = require('../containers/ShiftsGenerator');
var SalesmanBase = require('../salemanContainers/SalesmanBaseContainer');
var SalesmanHome = require('../salemanContainers/SalesmanHomeContainer');
var SalesmanStartShift = require('../salemanContainers/StartShiftContainer');
var SalesmanEndShift = require('../salemanContainers/EndShiftContainer');
var SalesmanAddSale= require('../salemanContainers/AddSaleContainer');
var RetrievePass = require('../containers/RetrievePassword');
var ChangePass = require('../containers/ChangePassword');
var SalesmanEditSale= require('../salemanContainers/EditSaleContainer');
var ShiftBaseContainer = require('../salemanContainers/ShiftBaseContainer');
var shiftComments = require('../salemanContainers/ShiftCommentsContainer');
var ShiftEncouragements = require('../salemanContainers/ShiftEncouragementsContainer');
var IncentivesContainer = require('../containers/IncentivesContainer');
var Incentive = require('../containers/IncentiveDetails');
var Reports = require('../containers/ReportsContainer');


var routes = (
    <Router history={hashHistory}>
        <Route path='/' component={Login}/>
        <Route path='/manager/' component={Base}>
            <Route path='home' component={Home} />
            <Route path='users' component={Users} />
            <Route path='stores' component={Stores} />
            <Route path='products' component={Products} />
            <Route path='shifts' component={Shifts} />
            <Route path='product' component={Product} />
            <Route path='store' component={Store} />
            <Route path='user' component={User} />
            <Route path='shift' component={Shift}/>
            <Route path='createShifts' component={CreateShifts}/>
            <Route path='incentives' component={IncentivesContainer}/>
            <Route path='incentive' component={Incentive} />
            <Route path='changePassword' component={ChangePass}/>
        </Route>
        <Route path='/member/'>
            <Route path='retrievePassword' component={RetrievePass}/>
            <Route path='reports' component={Reports} />
        </Route>
        <Route path='/salesman/' component={SalesmanBase}>
            <Route path='changePassword' component={ChangePass}/>
            <Route path='home' component={SalesmanHome}/>
            <Route path='startShift' component={SalesmanStartShift}/>
            <Route path='endShift' component={SalesmanEndShift}/>
        </Route>

        <Route path='/salesman/shift/' component={ShiftBaseContainer}>
            <Route path='sale' component={SalesmanAddSale}/>
            <Route path='comments' component={shiftComments}/>
            <Route path='editSale' component={SalesmanEditSale}/>
            <Route path='encouragements' component={ShiftEncouragements}/>
        </Route>
    </Router>
);

module.exports = routes;