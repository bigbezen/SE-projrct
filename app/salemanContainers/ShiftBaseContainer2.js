/**
 * Created by lihiverchik on 11/01/2017.
 */

var React = require('react');
var userServices = require('../communication/userServices');
var constantsStrings = require('../utils/ConstantStrings');
var paths = require('../utils/Paths');
var styles = require('../styles/salesmanStyles/baseStyles');
var Sale = require('react-icons/lib/ti/shopping-cart');
var EditSales = require('react-icons/lib/ti/edit');
var AddComment = require('react-icons/lib/ti/document-add');

var ShiftBaseContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    handleSale(){
        this.context.router.push({
            pathname: paths.salesman_sale_path
        })
    },
    handleEditSale(){
        this.context.router.push({
            pathname: paths.salesman_sale_path
        })
    },
    handleAddComment(){
        this.context.router.push({
            pathname: paths.salesman_shift_comments_path
        })
    },
    render: function () {
        return (
            <div className='main-container'>
                <div className="header navbar-fixed-top w3-theme-d4" style={styles.space}></div>
                <div style={styles.space} className="w3-theme-l5" />
                {this.props.children}
                <div className="footer navbar-fixed-bottom w3-theme-d4" style={styles.FooterSpace}>
                    <button className="w3-theme-d5" style={styles.footerButtons} onClick={this.handleSale}><Sale/><br/>{constantsStrings.addSale_string}</button>
                    <button className="w3-theme-d5" style={styles.footerButtons} onClick={this.handleEditSale}><EditSales/><br/>{constantsStrings.editSales_string}</button>
                    <button className="w3-theme-d5" style={styles.footerButtons} onClick={this.handleAddComment}><AddComment/><br/>{constantsStrings.addComment_string}</button>
                </div>
            </div>

        )
    }
});

module.exports = ShiftBaseContainer;