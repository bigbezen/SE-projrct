/**
 * Created by lihiverchik on 17/12/2016.
 */

var React = require('react');
var paths = require('../utils/Paths');
var managementServices = require('../communication/managementServices');
var userServices = require('../communication/userServices');
var constantStrings = require('../utils/ConstantStrings');
var styles = require('../styles/managerStyles/homeStyles');
var NotificationSystem = require('react-notification-system');

import { PieChart, Pie } from 'recharts';

var HomeContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState() {
        this.setSessionId();
        this.setUserType();
        return{
            salesmenNum: 0,
            productsNum: 0,
            storesNum: 0,
            stores: undefined
        }
    },
    setUserType: function() {
        var userType = localStorage.getItem('userType');
        if (!userType) {
            userType = 0;
        }
        localStorage.setItem('userType', userType);
        userServices.setUserType(userType);
    },
    setSessionId: function() {
        var sessId = localStorage.getItem('sessionId');
        if (!sessId) {
            sessId = 0;
        }
        localStorage.setItem('sessionId', sessId);
        userServices.setSessionId(sessId);
    },
    componentWillMount() {
        this.updateStatistics();
    },
    updateStatistics() {
        var self = this;
        var notificationSystem = this.refs.notificationSystem;
        managementServices.getAllProducts().then(function (result) {
            self.setState({
                productsNum: result.length
            });
        }).catch(function (errMess) {
        })
        managementServices.getAllUsers().then(function (n) {
            var result = n;
            self.setState({
                salesmenNum: result.length
            });
        }).catch(function (errMess) {
        })
        managementServices.getAllStores().then(function (n) {
            var result = n;
            self.setState({
                storesNum: result.length,
                stores: result
            });
        }).catch(function (errMess) {
        })
    },
    handleSelectUsers: function () {
        this.context.router.push({
           pathname: paths.manager_users_path
        })
    },

    handleSelectStores: function () {
        this.context.router.push({
            pathname: paths.manager_stores_path
        })
    },

    handleSelectProducts: function () {
        this.context.router.push({
            pathname: paths.manager_products_path
        })
    },

    handleSelectShifts: function () {
        this.context.router.push({
            pathname: paths.manager_shifts_path
        })
    },

    renderProducts(){
        // var data = [];
        // if(this.state.stores != undefined){
        //     var storesPerArea = this.state.stores.map(function(store){
        //         return {name: store.area, value: 1};
        //     }).reduce((a, b) => )
        // }
        return (
            <div className="w3-card-2 w3-theme-l4 col-xs-3 w3-margin">
                <h5> {constantStrings.numberOfStores}</h5>
                <h1>{this.state.storesNum}</h1>
                <PieChart width={730} height={250}>
                    <Pie data={data} cx="100%" cy="100%" innerRadius={60} outerRadius={80} fill="#82ca9d" label />
                </PieChart>
            </div>
        )
    },

    render: function () {

        return (
            <div className="w3-theme-l5" style={styles.cardsRow}>
                <div className="w3-card-2 w3-theme-l4 col-xs-3 col-xs-offset-1 w3-margin">
                    <h5> {constantStrings.numberOfUsers}</h5>
                    <h1>{this.state.salesmenNum}</h1>
                </div>
                <div className="w3-card-2 w3-theme-l4 col-xs-3 w3-margin">
                    <h5> {constantStrings.numberOfProducts}</h5>
                    <h1>{this.state.productsNum}</h1>
                </div>
                {this.renderProducts()}

                <NotificationSystem style={styles.notificationStyle} ref="notificationSystem"/>
            </div>

        )
    }
});

module.exports = HomeContainer;