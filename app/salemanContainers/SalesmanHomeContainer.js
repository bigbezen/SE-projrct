var React = require('react');
var constantsStrings = require('../utils/ConstantStrings');
var paths = require('../utils/Paths');
var salesmanService = require('../communication/salesmanServices');
var styles = require('../styles/salesmanStyles/homeStyles');
var userServices = require('../communication/userServices');
var NotificationSystem      = require('react-notification-system');

var shift = {
    storeId: '1',
    startTime: {},
    endTime: {},
    status: 'started',
    type: 'sale',
    salesmanId: '111',
    constraints: [],
    salesReport: [
        {
            productId: 1,
            productName: 'אבסולוט',
            stockStartShift: 0,
            stockEndShift: 0,
            sold: 0,
            opened: 0
        },
        {
            productId: 2,
            productName: 'סמירנוף',
            stockStartShift: 0,
            stockEndShift: 0,
            sold: 0,
            opened: 0
        },
        {
            productId: 3,
            productName: 'בלאק',
            stockStartShift: 0,
            stockEndShift: 0,
            sold: 0,
            opened: 0
        },
        {
            productId: 4,
            productName: 'בלו',
            stockStartShift: 0,
            stockEndShift: 0,
            sold: 0,
            opened: 0
        }
    ],
    sales: []
};

var SalesmanHomeContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    setSessionId: function() {
        var sessId = localStorage.getItem('sessionId');
        if (!sessId) {
            sessId = 0;
        }
        localStorage.setItem('sessionId', sessId);
        userServices.setSessionId(sessId);
    },
    setUserType: function() {
        var userType = localStorage.getItem('userType');
        if (!userType) {
            userType = 0;
        }
        localStorage.setItem('userType', userType);
        userServices.setUserType(userType);
    },
    getInitialState(){
        this.setSessionId();
        this.setUserType();
        return({
            shift: null,
            nextScreen: null,
            buttonTitle: null
        })
    },
    componentDidMount() {
        this.updateShifts();
    },
    updateShifts() { 
        var self = this;
        var notificationSystem = this.refs.notificationSystem;
        salesmanService.getCurrentShift().then(function (n) { 
            if (n) { 
                var currShift = n
                if (currShift.status == "STARTED") {
                    self.setState({
                        shift: currShift,
                        nextScreen: paths.salesman_sale_path,
                        buttonTitle: constantsStrings.continueShift_string
                    });
                } else {
                    self.setState({
                        shift: currShift,
                        nextScreen: paths.salesman_startShift_path,
                        buttonTitle: constantsStrings.startShift_string
                    });
                }
            } 
            else{ 
                alert("Error while retrieving shift from the server"); 
            } 
        }).catch(function (errMess) {
            if(errMess != "user does not have a shift today"){
                notificationSystem.addNotification({
                    message: errMess,
                    level: 'error',
                    autoDismiss: 5,
                    position: 'tc'
                });
            }
        })
     },
    handleStartShift: function () {
        this.context.router.push({
            pathname: this.state.nextScreen,
            state: {newShift: this.state.shift}
        })
    },
    renderShift: function () {
        //TODO: present to user details about the shift or some other message if he has no shift
        return (
            <div className='main-container'>
                <div style={styles.centerAlign}>
                    <span style={styles.title}>IBBLS</span>
                </div>
                <div style={styles.buttonsStyle}>
                    <button className="w3-btn w3-round-xlarge w3-card-4 w3-theme-d3 w3-xxxlarge" onClick={this.handleStartShift}>{this.state.buttonTitle}</button>
                </div>
                <NotificationSystem style={styles.notificationStyle} ref="notificationSystem"/>
            </div>

        )
    },
    renderLoading:function () {
        return(
            <div>
                <div className="text-center">
                    <h1>אין לך משמרות היום, סע לים!!! (:</h1>
                </div>
                <NotificationSystem style={styles.notificationStyle} ref="notificationSystem"/>
            </div>
        )
    },
    render: function () {
        if(this.state.shift != null)
        {
            return this.renderShift();
        }
        else
        {
            return this.renderLoading();
        }
    }
});

module.exports = SalesmanHomeContainer;