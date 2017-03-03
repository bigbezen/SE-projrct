/**
 * Created by lihiverchik on 11/01/2017.
 */

var React = require('react');
var userServices = require('../communication/userServices');
var constantsStrings = require('../utils/ConstantStrings');
var paths = require('../utils/Paths');
var styles = require('../styles/salesmanStyles/baseStyles');

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
                <div className="footer navbar-fixed-bottom w3-theme-d4" style={styles.space}></div>
            </div>

        )
    }
});

module.exports = SalesmanBaseContainer;