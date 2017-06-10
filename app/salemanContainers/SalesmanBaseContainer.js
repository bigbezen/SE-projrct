/**
 * Created by lihiverchik on 22/04/2017.
 */

var React = require('react');
var styles = require('../styles/salesmanStyles/baseStyles');

var SalesmanBaseContainer = React.createClass({

    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    render: function () {
        return (
            <div className='main-container'>
                <div className="header navbar-fixed-top" style={styles.navbarStyle}></div>
                <div style={styles.space} />
                {this.props.children}
                <div className="footer navbar-fixed-bottom" style={styles.footerStyle}></div>
            </div>

        )
    }
});

module.exports = SalesmanBaseContainer;