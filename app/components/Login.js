/**
 * Created by lihiverchik on 13/12/2016.
 */
var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link
var PropTypes = React.PropTypes;
var constantsStrings = require('../components/ConstantStrings');

function Login(props) {
        return (
            <div className="jumbotron col-sm-offset-3 col-sm-6 text-center" >
                <h1>{constantsStrings.welcome_string}</h1>
                <h2>blaaa</h2>
                <form onSubmit={props.onSubmitUser}>

                    <div className="form-group ">
                        <label class="control-label">{constantsStrings.username_string}</label>
                        <input type="text"
                               class="form-control"
                               onChange={props.onUpdateUsername}
                               value={props.username} />
                    </div>

                    <div class="form-group">
                        <label class="control-label">{constantsStrings.password_string}</label>
                        <input type="password"
                               class="form-control"
                               onChange={props.onUpdatePassword}
                               value={props.password}/>
                    </div>

                    <div className="form-group col-sm-4 col-sm-offset-4">
                        <button
                            className="btn btn-block btn-success"
                            type="submit">
                            {constantsStrings.login_string}
                        </button>
                    </div>
                </form>

            </div>
        )
    }

Login.propTypes = {
    onSubmitUser: PropTypes.func.isRequired,
    onUpdateUsername: PropTypes.func.isRequired,
    onUpdatePassword: PropTypes.func.isRequired,
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired

}
module.exports = Login;
