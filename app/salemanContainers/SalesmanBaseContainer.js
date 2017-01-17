/**
 * Created by lihiverchik on 11/01/2017.
 */

var React = require('react');
var userServices = require('../communication/userServices');
var constantsStrings = require('../utils/ConstantStrings');
var paths = require('../utils/Paths');

var SalesmanBaseContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    handleLogoutUser: function () {
        console.log('SalesmanBaseContainer- Logout function');
        var context = this.context;
        userServices.logout().then(function (n) {
            if(n){
                context.router.push({
                    pathname: paths.login_path
                })
            }
            else{
                console.log("error");
            }
        })
    },
    render: function () {
        return (
            <div className='main-container'>
                <button className="w3-btn w3-theme-d5 col-sm-2 col-sm-offset-10" onClick={this.handleLogoutUser}>
                    {constantsStrings.logout_string}
                </button>
                    {this.props.children}
            </div>

        )
    }
});

module.exports = SalesmanBaseContainer;