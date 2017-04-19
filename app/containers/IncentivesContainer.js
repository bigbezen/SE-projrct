/**
 * Created by lihiverchik on 17/12/2016.
 */

var React = require('react');
var NotificationSystem = require('react-notification-system');
var TrashIcon = require('react-icons/lib/fa/trash-o');

var styles = require('../styles/managerStyles/styles');
var encs = require('../utils/encouragmentsMock');
var paths = require('../utils/Paths');
var managementServices = require('../communication/managementServices');
var constantsStrings = require('../utils/ConstantStrings');
var userServices = require('../communication/userServices');




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
        this.setSessionId();
        this.setUserType();
        return{
            incentives: []
        }
    },
    setUserType: function() {
        var userType = localStorage.getItem('userType');
        if (!userType) {
            userType = 0;
        }
        localStorage.setItem('userType', userType);
        userServices.setUserType(userType);
    },
    setSessionId: function() {
        var sessId = localStorage.getItem('sessionId');
        if (!sessId) {
            sessId = 0;
        }
        localStorage.setItem('sessionId', sessId);
        userServices.setSessionId(sessId);
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
        }).catch(function (errMess) {
            notificationSystem.addNotification({
                message: errMess,
                level: 'error',
                autoDismiss: 5,
                position: 'tc'
            });
        })
    },
    onClickEdit: function(incentive){
        this.context.router.push({
            pathname: paths.manager_incentiveDetails_path,
            query: JSON.stringify(incentive)
        })
    },

    onClickDelete: function(incentive, index){
        var self = this;
        var notificationSystem = this.refs.notificationSystem;
        managementServices.deleteIncentive(incentive)
            .then(function(result){
                var newIncentives = self.state.incentives;
                newIncentives.splice(index, 1);
                self.setState({
                    incentives: newIncentives
                });
                notificationSystem.addNotification({
                    message: constantsStrings.deleteMessage_string,
                    level: 'success',
                    autoDismiss: 1,
                    position: 'tc'
                });
            })
            .catch(function(err){
                alert(err);
                notificationSystem.addNotification({
                    message: err,
                    level: 'error',
                    autoDismiss: 2,
                    position: 'tc'
                });
            })
    },

    renderProductRow: function(product, i) {
        return (
            <p>&nbsp;&nbsp;&nbsp;&nbsp;{product.name}</p>
        )

    },
    renderCard: function(incentive, i){
        return (
            <div className="w3-card-4 col-xs-3" style={styles.incentiveCard} key={i}>
                <header className="w3-container w3-theme-d3">
                    <h3 className="w3-right">
                        {incentive.name}
                    </h3>
                    <h4 className="w3-left">
                        <a onClick={() => this.onClickDelete(incentive, i)}>
                            <TrashIcon/>
                        </a>
                    </h4>
                </header>

                <div className="w3-container" style={styles.incentiveCardDivider}>
                    <p><b>{constantsStrings.incentiveProducts_string}</b></p>
                    {incentive.products.map(this.renderProductRow)}
                    <p><b>{constantsStrings.incentiveNumOfProducts_string}</b>: {incentive.numOfProducts}</p>
                    <p><b>{constantsStrings.incentiveRate_string}</b>: {incentive.rate}</p>
                </div>

                <button className="w3-button w3-block w3-theme-l1" onClick={() => this.onClickEdit(incentive)}>
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