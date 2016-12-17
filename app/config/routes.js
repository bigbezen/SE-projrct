/**
 * Created by lihiverchik on 29/11/2016.
 */
var React = require('react');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var hashHistory = ReactRouter.hashHistory;
var Home = require("../components/Home");
var LoginContainer = require('../containers/LoginContainer');


var routes = (
    <Router history={hashHistory}>
        <Route path='/' component={LoginContainer}/>
        <Route path='Home' component={Home} />
    </Router>
);

module.exports = routes;