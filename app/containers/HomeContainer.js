/**
 * Created by lihiverchik on 17/12/2016.
 */

var React = require('react');
var paths = require('../utils/Paths');
var constantStrings = require('../utils/ConstantStrings');

var HomeContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
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
            <div className="container w3-theme-l5">
                <div className="w3-card-2 w3-theme-l4 col-sm-4">
                    <h1> {constantStrings.numberOfSalesmen}</h1>
                </div>
                <div className="w3-card-2 w3-theme-l4 col-sm-4">
                    <h1> {constantStrings.numberOfProducts}</h1>
                </div>
                <div className="w3-card-2 w3-theme-l4 col-sm-4">
                    <h1> {constantStrings.numberOfStores}</h1>
                </div>
            </div>

        )
    }
});

module.exports = HomeContainer;