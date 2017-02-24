/**
 * Created by USER on 17/12/2016.
 */

var React = require('react');
var userServices = require('../communication/userServices');
var constantsStrings = require('../utils/ConstantStrings');
var paths = require('../utils/Paths');
var Users = require('react-icons/lib/fa/user');
var Products = require('react-icons/lib/fa/glass');
var Stores = require('react-icons/lib/md/store');
var Shifts = require('react-icons/lib/fa/calendar');
var styles = require('../styles/baseStyles');

var BaseContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    handleLogoutUser: function () {
        console.log('BaseContainer- Logout function');
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

    handleMenuBar: function () {
        console.log('BaseContainer- click on menu bar');
        var x = this.refs.demo;
        console.log("BaseContainer- x " + x.className);
        if (x.className.indexOf("w3-show") == -1) {
            x.className += " w3-show";
        } else {
            x.className = x.className.replace(" w3-show", "");
        }
    },
    render: function () {
        return (
            <div className='main-container'>
                <ul className="w3-navbar w3-large w3-theme-d4 w3-left-align">
                    <li className="w3-hide-medium w3-hide-large w3-theme-d4 w3-opennav w3-right">
                        <a href="javascript:void(0);" onClick={this.handleMenuBar}>☰</a>
                    </li>
                    <li className="w3-right" style={styles.navbarButtons}> <a href={'/#'+paths.manager_home_path}>ראשי</a></li>
                    <li className="w3-hide-small w3-right" style={styles.navbarButtons}><a href={'/#'+paths.manager_products_path}><Products/>{constantsStrings.products_string}</a></li>
                    <li className="w3-hide-small w3-right" style={styles.navbarButtons}><a href={'/#'+paths.manager_stores_path}><Stores/>{constantsStrings.stores_string}</a></li>
                    <li className="w3-hide-small w3-right" style={styles.navbarButtons}><a href={'/#'+paths.manager_users_path}><Users/>{constantsStrings.users_string}</a></li>
                    <li className="w3-hide-small w3-right" ><a href={'/#'+paths.manager_shifts_path}><Shifts/>{constantsStrings.shifts_string}</a></li>
                    <li className="w3-hide-small w3-left"><a href="javascript:void(0);" onClick={this.handleLogoutUser}>{constantsStrings.logout_string}</a></li>
                </ul>

                <div ref="demo" value={this.props.children} className="w3-hide w3-hide-large w3-hide-medium">
                    <ul className="w3-navbar w3-left-align w3-large w3-theme-d4">
                        <li><a href={'/#'+paths.manager_products_path}><Products/>{constantsStrings.products_string}</a></li>
                        <li><a href={'/#'+paths.manager_stores_path}><Stores/>{constantsStrings.stores_string}</a></li>
                        <li><a href={'/#'+paths.manager_users_path}><Users/>{constantsStrings.users_string}</a></li>
                        <li><a href={'/#'+paths.manager_shifts_path}><Shifts/>{constantsStrings.shifts_string}</a></li>
                        <li><a href="javascript:void(0);" onClick={this.handleLogoutUser}>התנתק</a></li>
                    </ul>
                </div>
                {this.props.children}

            </div>
        )
    }
 //   render: function () {
 //       this.showView();
      //  if (userServices.managerIsLoggedin()) {

    //    } else {
     //       alert('you must be logged in as Manager');
    //    }
 //   }
});

module.exports = BaseContainer;