/**
 * Created by lihiverchik on 29/11/2016.
 */
var React = require('react');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var hashHistory = ReactRouter.hashHistory;
var Main = require('../components/Main');
var Home = require("../components/Home");
var First = require('../components/First');

var routes = (
    <Router history={hashHistory}>
        <Route path='/' component={Main}/>
        <Route path='Home' component={Home} />
        <Route path='First' component={First} />
    </Router>
);

module.exports = routes;