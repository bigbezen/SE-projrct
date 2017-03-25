/**
 * Created by lihiverchik on 13/12/2016.
 */
var React = require('react');
var userServices = require('../communication/userServices');
var constantsStrings = require('../utils/ConstantStrings');
var paths = require('../utils/Paths');
var styles = require('../styles/managerStyles/styles');
var NotificationSystem = require('react-notification-system');

var ChangePassContainer = React.createClass({

    contextTypes: {
        router: React.PropTypes.object.isRequired,
    },
    getInitialState: function () {
        return {
            prevPass: '',
            newPass1: '',
            newPass2: '',

        }
    },
    componentDidMount() {
        this.retPath = this.props.location.query;
    },
    handleSubmitUser: function (e) {
        e.preventDefault();
        var prevPass = this.refs.prevPasswordTextBox.value;
        var newPass1 = this.refs.newPasswordTextBox1.value;
        var newPass2 = this.refs.newPasswordTextBox2.value;
        var notificationSystem = this.refs.notificationSystem;
        if (newPass1 != newPass2) {
            notificationSystem.addNotification({
                message: constantsStrings.changePassNotEqualFailedMessage_string,
                level: 'error',
                autoDismiss: 0,
                position: 'tc'
            });
            return;
        }
        this.setState({
            prevPass: '',
            newPass1: '',
            newPass2: '',
        });
        var context = this.context;
        var self = this;
        userServices.changePassword(prevPass, newPass1).then(function (n) {
            if(n){
                var answer = n;
                if (answer.success) {
                    notificationSystem.addNotification({
                        message: constantsStrings.changePassSuccessMessage_string,
                        level: 'success',
                        autoDismiss: 2,
                        position: 'tc',
                        onRemove: function (notification) {
                            context.router.push({
                                pathname: self.retPath
                            })
                        }
                    });
                }else {
                    notificationSystem.addNotification({
                        message: constantsStrings.changePassServerFailedMessage_string,
                        level: 'error',
                        autoDismiss: 0,
                        position: 'tc'
                    });
                }
            }
            else{
                console.log("error in retrieving password: " + n);
            }
        })
    },
    onReturn: function() {
        context.router.push({
            pathname: this.retPath
        })
    },
    render: function () {
        return (
            <div className="container">
                <div className="container">
                    <div className="row" style={styles.topBuffer}>
                    </div>
                </div>
                <div className="w3-theme-l5 col-sm-offset-2 col-sm-8 text-center img-rounded" >
                    <h1 className="h1 w3-jumbo">{constantsStrings.changePassTitle_string}</h1>
                    <form onSubmit={this.handleSubmitUser} className="form-horizontal">
                        <div className="form-group">
                            <input type="password"
                                   className="col-xs-12 col-lg-6 col-lg-offset-3 w3-xxlarge"
                                   ref="prevPasswordTextBox"
                                   placeholder="סיסמא נוכחית"
                                   value={this.password}/>
                        </div>
                        <div className="form-group">
                            <input type="password"
                                   className="col-xs-12 col-lg-6 col-lg-offset-3 w3-xxlarge"
                                   ref="newPasswordTextBox1"
                                   placeholder="הזן סיסמא חדשה"
                                   value={this.password}/>
                        </div>
                        <div className="form-group">
                            <input type="password"
                                   className="col-xs-12 col-lg-6 col-lg-offset-3 w3-xxlarge"
                                   ref="newPasswordTextBox2"
                                   placeholder="הזן סיסמא חדשה שנית"
                                   value={this.password}/>
                        </div>
                        <div className="form-group">
                            <button
                                className="w3-btn btn w3-theme-d5 col-sm-4 col-sm-offset-4"
                                type="submit">
                                {constantsStrings.changePassButton_string}
                            </button>
                        </div>
                    </form>
                </div>
                <NotificationSystem style={styles.notificationStyle} ref="notificationSystem"/>
            </div>
        )
    }
});

module.exports = ChangePassContainer;