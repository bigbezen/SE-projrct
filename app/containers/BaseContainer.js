/**
 * Created by USER on 17/12/2016.
 */

var React               = require('react');
var userServices        = require('../communication/userServices');
var constantsStrings    = require('../utils/ConstantStrings');
var paths               = require('../utils/Paths');
var Users               = require('react-icons/lib/fa/user');
var Products            = require('react-icons/lib/fa/glass');
var Incentives          = require('react-icons/lib/md/attach-money');
var Stores              = require('react-icons/lib/md/store');
var Shifts              = require('react-icons/lib/fa/calendar');
var Reports             = require('react-icons/lib/go/graph');
var styles              = require('../styles/managerStyles/baseStyles');
var NotificationSystem  = require('react-notification-system');

var BaseContainer = React.createClass({

    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    handleLogoutUser: function () {
        console.log('BaseContainer- Logout function');
        var context = this.context;
        var notificationSystem = this.refs.notificationSystem;
        userServices.logout().then(function (n) {
                localStorage.setItem('sessionId', 0);
                localStorage.setItem('userType', 0);
                context.router.push({
                    pathname: paths.login_path
                })
        }).catch(function (errMess) {
            notificationSystem.clearNotifications();
            notificationSystem.addNotification({
                message: errMess,
                level: 'error',
                autoDismiss: 0,
                position: 'tc'
            });
        })
    },

    handleChangePassword: function () {
        this.context.router.push({
            pathname: paths.manager_changePass_path
        })
    },

    handleMenuBar: function () {
        var x = this.refs.demo;
        if (x.className.indexOf("w3-show") == -1) {
            x.className += " w3-show";
        } else {
            x.className = x.className.replace(" w3-show", "");
        }
    },

    render: function () {
        return (
            <div className='main-container'>
                <ul className="w3-navbar w3-top w3-large w3-theme-d4 w3-left-align w3-card-4">
                    <li className="w3-hide-medium w3-hide-large w3-theme-d4 w3-opennav w3-right">
                        <a href="javascript:void(0);" onClick={this.handleMenuBar}>☰</a>
                    </li>
                    <li className="w3-right" style={styles.navbarButtons}> <a className="w3-hover-none" href={'/#'+paths.manager_home_path}>ראשי</a></li>
                    <li className="w3-hide-small w3-right" style={styles.navbarButtons}><a className="w3-hover-none" href={'/#'+paths.manager_products_path}><Products/>{constantsStrings.products_string}</a></li>
                    <li className="w3-hide-small w3-right" style={styles.navbarButtons}><a className="w3-hover-none" href={'/#'+paths.manager_stores_path}><Stores/>{constantsStrings.stores_string}</a></li>
                    <li className="w3-hide-small w3-right" style={styles.navbarButtons}><a className="w3-hover-none" href={'/#'+paths.manager_users_path}><Users/>{constantsStrings.users_string}</a></li>
                    <li className="w3-hide-small w3-right" style={styles.navbarButtons}><a className="w3-hover-none" href={'/#'+paths.manager_incentives_path}><Incentives/>{constantsStrings.encouragements_string}</a></li>
                    <li className="w3-hide-small w3-right" style={styles.navbarButtons}><a className="w3-hover-none" href={'/#'+paths.manager_shifts_path}><Shifts/>{constantsStrings.shifts_string}</a></li>
                    <li className="w3-hide-small w3-right"><a className="w3-hover-none" href={'/#'+paths.manager_reports_path}><Reports/>{constantsStrings.reports_string}</a></li>
                    <li className="w3-hide-small w3-left"><a className="w3-hover-none" href="javascript:void(0);" onClick={this.handleLogoutUser}>{constantsStrings.logout_string}</a></li>
                    <li className="w3-hide-small w3-left"><a className="w3-hover-none" href="javascript:void(0);" onClick={this.handleChangePassword}>{constantsStrings.changePass_string}</a></li>
                </ul>

                <div ref="demo" value={this.props.children} className="w3-hide w3-hide-large w3-hide-medium">
                    <ul className="w3-navbar w3-top w3-left-align w3-large w3-theme-d4">
                        <li><a className="w3-hover-none" href={'/#'+paths.manager_products_path}><Products/>{constantsStrings.products_string}</a></li>
                        <li><a className="w3-hover-none" href={'/#'+paths.manager_stores_path}><Stores/>{constantsStrings.stores_string}</a></li>
                        <li><a className="w3-hover-none" href={'/#'+paths.manager_users_path}><Users/>{constantsStrings.users_string}</a></li>
                        <li><a className="w3-hover-none" href={'/#'+paths.manager_shifts_path}><Shifts/>{constantsStrings.shifts_string}</a></li>
                        <li><a className="w3-hover-none" href={'/#'+paths.manager_incentives_path}><Incentives/>{constantsStrings.encouragements_string}</a></li>
                        <li><a className="w3-hover-none" href="javascript:void(0);" onClick={this.handleLogoutUser}>{constantsStrings.logout_string}</a></li>
                        <li className="w3-hide-small w3-left"><a className="w3-hover-none" href="javascript:void(0);" onClick={this.handleChangePassword}>{constantsStrings.changePass_string}</a></li>
                    </ul>
                </div>
                <div style={styles.space} className="w3-theme-l5" />
                {this.props.children}
                <NotificationSystem style={styles.notificationStyle} ref="notificationSystem"/>
            </div>
        )
    }
});

module.exports = BaseContainer;