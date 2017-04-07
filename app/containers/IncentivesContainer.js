/**
 * Created by lihiverchik on 17/12/2016.
 */

var React = require('react');
var NotificationSystem = require('react-notification-system');

var styles = require('../styles/managerStyles/styles');
var encs = require('../utils/encouragmentsMock');
var paths = require('../utils/Paths');
var managementServices = require('../communication/managementServices');
var constantsStrings = require('../utils/ConstantStrings');



var IncentivesContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    onClickAddButton: function(){
        this.context.router.push({
            pathname: paths.manager_incentiveDetails_path
        })
    },
    getInitialState() {
        return{
            incentives: []
        }
    },
    componentWillMount() {
        this.updateIncentives();
    },
    updateIncentives() {
        var self = this;
        var notificationSystem = this.refs.notificationSystem;
        console.log('fetching incentives');
        managementServices.getAllIncentives().then(function (n) {
            if (n) {
                var result = n;
                if (result.success) {
                    result.info.sort(function(a, b){
                        return a.products.length - b.products.length;
                    });
                    self.setState({
                        incentives: result.info
                    });
                } else {
                    console.log("error in getAllIncentives: " + result.info);
                    notificationSystem.addNotification({
                        message: constantStrings.errorMessage_string,
                        level: 'error',
                        autoDismiss: 5,
                        position: 'tc'
                    });
                }
            } else {
                console.log("error in storesContainers: " + n);
            }
        })
    },
    onClickEdit: function(encouragement){
        this.context.router.push({
            pathname: paths.manager_incentiveDetails_path,
            query: JSON.stringify(encouragement)
        })
    },
    renderProductRow: function(product, i) {
        return (
            <p>&nbsp;&nbsp;&nbsp;&nbsp;{product.name}</p>
        )

    },
    renderCard: function(encouragement, i){
        return (
            <div className="w3-card-4 col-xs-3" style={styles.incentiveCard} key={i}>
                <header className="w3-container w3-theme-d3">
                    <h3>{encouragement.name}</h3>
                </header>

                <div className="w3-container" style={styles.incentiveCardDivider}>
                    <p><b>{constantsStrings.incentiveProducts_string}</b></p>
                    {encouragement.products.map(this.renderProductRow)}
                    <p><b>{constantsStrings.incentiveNumOfProducts_string}</b>: {encouragement.numOfProducts}</p>
                    <p><b>{constantsStrings.incentiveRate_string}</b>: {encouragement.rate}</p>
                </div>

                <button className="w3-button w3-block w3-theme-l1" onClick={() => this.onClickEdit(encouragement)}>
                    + Edit
                </button>
            </div>
        )
    },

    render: function () {
        return (
            <div className="col-xs-12">
                <button className="w3-card-2 w3-button w3-theme-d5 w3-margin-top w3-circle" onClick={this.onClickAddButton}>+</button>
                <div className="row" style={styles.incentiveRow}>
                    {this.state.incentives.map(this.renderCard)}
                </div>
                <NotificationSystem style={styles.notificationStyle} ref="notificationSystem"/>
            </div>
        )
    }
});

module.exports = IncentivesContainer;