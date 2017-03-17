/**
 * Created by lihiverchik on 17/12/2016.
 */

var React = require('react');
var paths = require('../utils/Paths');
var managementServices = require('../communication/managementServices');
var constantStrings = require('../utils/ConstantStrings');
var styles = require('../styles/managerStyles/homeStyles');

var HomeContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState() {
        return{
            salesmenNum: 0,
            productsNum: 0,
            storesNum: 0,

        }
    },
    componentWillMount() {
        this.updateStatistics();
    },
    updateStatistics() {
        var self = this;
        managementServices.getAllProducts().then(function (n) {
            if (n) {
                var result = n;
                if (result.success) {
                    self.setState({
                        productsNum: result.info.length
                    });
                } else {
                    alert("Error while retrieving all products from the server: "+ result.info);
                }
            } else {
                console.log("error in home: " + n);
            }
        })
        managementServices.getAllUsers().then(function (n) {
            if (n) {
                var result = n;
                if (result.success) {
                    self.setState({
                        salesmenNum: result.info.length
                    });
                } else {
                    alert("Error while retrieving all products from the server: "+ result.info);
                }
            } else {
                console.log("error in home: " + n);
            }
        })
        managementServices.getAllStores().then(function (n) {
            if (n) {
                var result = n;
                if (result.success) {
                    self.setState({
                        storesNum: result.info.length
                    });
                } else {
                    alert("Error while retrieving all products from the server: "+ result.info);
                }
            } else {
                console.log("error in home: " + n);
            }
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
                <div className="w3-card-2 w3-theme-l4 col-sm-3 col-sm-offset-1 w3-margin">
                    <h5> {constantStrings.numberOfUUsers}</h5>
                    <h1>{this.state.salesmenNum}</h1>
                </div>
                <div className="w3-card-2 w3-theme-l4 col-sm-3 w3-margin">
                    <h5> {constantStrings.numberOfProducts}</h5>
                    <h1>{this.state.productsNum}</h1>
                </div>
                <div className="w3-card-2 w3-theme-l4 col-sm-3 w3-margin">
                    <h5> {constantStrings.numberOfStores}</h5>
                    <h1>{this.state.storesNum}</h1>
                </div>
            </div>

        )
    }
});

module.exports = HomeContainer;