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
            storesNum: 0
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
        managementServices.getAllProducts().then(function (n) {
            if (n) {
                var result = n;
                if (result.success) {
                    self.setState({
                        productsNum: result.info.length
                    });
                } else {
                    notificationSystem.addNotification({
                        message: constantStrings.errorMessage_string,
                        level: 'error',
                        autoDismiss: 5,
                        position: 'tc'
                    });
                }
            } else {
                console.log("error in home: " + n);
            }
        }).catch(function (errMess) {
        })
        managementServices.getAllUsers().then(function (n) {
            if (n) {
                var result = n;
                if (result.success) {
                    self.setState({
                        salesmenNum: result.info.length
                    });
                } else {
                    notificationSystem.addNotification({
                        message: constantStrings.errorMessage_string,
                        level: 'error',
                        autoDismiss: 5,
                        position: 'tc'
                    });
                }
            } else {
                console.log("error in home: " + n);
            }
        }).catch(function (errMess) {
        })
        managementServices.getAllStores().then(function (n) {
            if (n) {
                var result = n;
                if (result.success) {
                    self.setState({
                        storesNum: result.info.length
                    });
                } else {
                    notificationSystem.addNotification({
                        message: constantStrings.errorMessage_string,
                        level: 'error',
                        autoDismiss: 5,
                        position: 'tc'
                    });
                }
            } else {
                console.log("error in home: " + n);
            }
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
    render: function () {
        return (
            <div className="w3-theme-l5" style={styles.cardsRow}>
                <div className="w3-card-2 w3-theme-l4 col-xs-3 col-xs-offset-1 w3-margin">
                    <h5> {constantStrings.numberOfUUsers}</h5>
                    <h1>{this.state.salesmenNum}</h1>
                </div>
                <div className="w3-card-2 w3-theme-l4 col-xs-3 w3-margin">
                    <h5> {constantStrings.numberOfProducts}</h5>
                    <h1>{this.state.productsNum}</h1>
                </div>
                <div className="w3-card-2 w3-theme-l4 col-xs-3 w3-margin">
                    <h5> {constantStrings.numberOfStores}</h5>
                    <h1>{this.state.storesNum}</h1>
                </div>
                <NotificationSystem style={styles.notificationStyle} ref="notificationSystem"/>
            </div>

        )
    }
});

module.exports = HomeContainer;