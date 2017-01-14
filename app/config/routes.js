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
        <Route path='/LoggedIn/' component={Base}>
            <Route path='Home' component={Home} />
            <Route path='Users' component={Users} />
            <Route path='Stores' component={Stores} />
            <Route path='Products' component={Products} />
            <Route path='Product' component={Product} />
            <Route path='Store' component={Store} />
            <Route path='User' component={User} />
        </Route>
        <Route path='/salesman/' component={SalesmanBase}>
            <Route path='Home' component={SalesmanHome}/>
            <Route path='StartShift' component={StartShift}/>
            <Route path='Shift' component={Shift}/>
            <Route path='EndShift' component={EndShift}/>
        </Route>
    </Router>
);

module.exports = routes;