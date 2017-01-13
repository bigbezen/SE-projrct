/**
 * Created by lihiverchik on 17/12/2016.
 */

var React = require('react');
var Home = require('../components/Home');

var HomeContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    handleSelectUsers: function () {
        this.context.router.push({
           pathname: '/LoggedIn/Users'
        })
    },

    handleSelectStores: function () {
        this.context.router.push({
            pathname: '/LoggedIn/Stores'
        })
    },

    handleSelectProducts: function () {
        this.context.router.push({
            pathname: '/LoggedIn/Products'
        })
    },

    render: function () {
        console.log("home container render");
        return ( <Home onSelectUsers={this.handleSelectUsers}
                       onSelectProducts={this.handleSelectProducts}
                       onSelectStores={this.handleSelectStores}/>
        )
    }
});

module.exports = HomeContainer;