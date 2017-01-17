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
var SalesmanBase = require('../salemanContainers/SalesmanBaseContainer');
var SalesmanHome = require('../salemanContainers/SalesmanHomeContainer');
var StartShift = require('../salemanContainers/StartShiftContainer');
var Shift = require('../salemanContainers/ShiftContainer');
var EndShift = require('../salemanContainers/EndShiftContainer');

var routes = (
    <Router history={hashHistory}>
        <Route path='/' component={Login}/>
        <Route path='/manager/' component={Base}>
            <Route path='home' component={Home} />
            <Route path='users' component={Users} />
            <Route path='stores' component={Stores} />
            <Route path='products' component={Products} />
            <Route path='product' component={Product} />
            <Route path='store' component={Store} />
            <Route path='user' component={User} />
        </Route>
        <Route path='/salesman/' component={SalesmanBase}>
            <Route path='home' component={SalesmanHome}/>
            <Route path='startShift' component={StartShift}/>
            <Route path='shift' component={Shift}/>
            <Route path='endShift' component={EndShift}/>
        </Route>
    </Router>
);

module.exports = routes;