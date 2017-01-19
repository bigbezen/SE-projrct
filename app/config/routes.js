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
var SalesmanShift = require('../salemanContainers/ShiftContainer');
var SalesmanEndShift = require('../salemanContainers/EndShiftContainer');

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
        </Route>
        <Route path='/salesman/' component={SalesmanBase}>
            <Route path='home' component={SalesmanHome}/>
            <Route path='startShift' component={SalesmanStartShift}/>
            <Route path='shift' component={SalesmanShift}/>
            <Route path='endShift' component={SalesmanEndShift}/>
        </Route>
    </Router>
);

module.exports = routes;