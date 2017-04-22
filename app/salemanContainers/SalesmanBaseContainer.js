/**
 * Created by lihiverchik on 22/04/2017.
 */

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

var SalesmanBaseContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    render: function () {
        return (
            <div className='main-container'>
                <div className="header navbar-fixed-top w3-theme-d4" style={styles.space}></div>
                <div style={styles.space} className="w3-theme-l5" />
                {this.props.children}
                <div className="footer navbar-fixed-bottom w3-theme-d4" style={styles.FooterSpace}></div>
            </div>

        )
    }
});

module.exports = SalesmanBaseContainer;