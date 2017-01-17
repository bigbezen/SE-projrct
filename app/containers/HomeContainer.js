/**
 * Created by lihiverchik on 17/12/2016.
 */

var React = require('react');
var Home = require('../components/Home');
var paths = require('../utils/Paths');

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
        console.log("home container render");
        return ( <Home onSelectUsers={this.handleSelectUsers}
                       onSelectProducts={this.handleSelectProducts}
                       onSelectStores={this.handleSelectStores}
                       onSelectShifts={this.handleSelectShifts}/>
        )
    }
});

module.exports = HomeContainer;