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
    </Router>
);

module.exports = routes;