/**
 * Created by lihiverchik on 11/01/2017.
 */

var React = require('react');
var userServices = require('../communication/userServices');
var constantsStrings = require('../utils/ConstantStrings');
var paths = require('../utils/Paths');
var styles = require('../styles/salesmanStyles/baseStyles');
var Calendar = require('react-icons/lib/fa/calendar');
var Profile = require('react-icons/lib/fa/user');
var Expenses = require('react-icons/lib/md/drive-eta');
var Current = require('react-icons/lib/md/today');
var NotificationSystem      = require('react-notification-system');

var SalesmanHomeBaseContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    handleCurrentShift(){
        this.context.router.push({
            pathname: paths.salesman_home_path
        })
    },
    handleProfile(){
        this.context.router.push({
            pathname: paths.salesman_profile_path
        })
    },
    handleShiftSchedule(){
        this.context.router.push({
            pathname: paths.salesman_shiftSchedule_path
        })
    },
    handleExpenses(){
        this.context.router.push({
            pathname: paths.salesman_shiftExpenses_path
        })
    },
    handleLogoutUser: function () {
        console.log('SalesmanBaseContainer- Logout function');
        var context = this.context;
        var notificationSystem = this.refs.notificationSystem;
        userServices.logout().then(function(n) {
            localStorage.setItem('sessionId', 0);
            localStorage.setItem('userType', 0);
            context.router.push({
                pathname: paths.login_path
            })
        }).catch(function (errMess) {
            notificationSystem.addNotification({
                message: errMess,
                level: 'error',
                autoDismiss: 5,
                position: 'tc'
            });
        })
    },
    handleChangePassword: function () {
        console.log('BaseContainer- changePass function');
        this.context.router.push({
            pathname: paths.salesman_changePass_path
        })
    },
    render: function () {
        return (
            <div className='main-container'>
                <div className="header navbar-fixed-top w3-theme-d4" style={styles.space}>
                    <ul>
                        <li>
                            <button style={{color:'white'}} className="btn-link w3-xlarge col-xs-2 col-xs-offset-10" onClick={this.handleLogoutUser}>
                                {constantsStrings.logout_string}
                            </button>
                        </li>
                        <li>
                            <button style={{color:'white'}} className="btn-link w3-large col-xs-2 col-xs-offset-10" onClick={this.handleChangePassword}>
                                {constantsStrings.changePass_string}
                            </button>
                        </li>
                    </ul>
                </div>
                <div style={styles.space} className="w3-theme-l5" />
                {this.props.children}
                <div className="footer navbar-fixed-bottom w3-theme-d4" style={styles.FooterSpace}>
                    <button className="w3-theme-d5" style={styles.footerButtons} onClick={this.handleProfile}><Profile/><br/>{constantsStrings.profile_string}</button>
                    <button className="w3-theme-d5" style={styles.footerButtons} onClick={this.handleCurrentShift}><Current/><br/>{constantsStrings.currentShift_string}</button>
                    <button className="w3-theme-d5" style={styles.footerButtons} onClick={this.handleShiftSchedule}><Calendar/><br/>{constantsStrings.shiftSchedule_string}</button>
                    <button className="w3-theme-d5" style={styles.footerButtons} onClick={this.handleExpenses}><Expenses/><br/>{constantsStrings.expenses_string}</button>
                </div>
                <NotificationSystem style={styles.notificationStyle} ref="notificationSystem"/>
            </div>

        )
    }
});

module.exports = SalesmanHomeBaseContainer;