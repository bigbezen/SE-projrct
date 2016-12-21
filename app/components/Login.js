/**
 * Created by lihiverchik on 13/12/2016.
 */
var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link
var PropTypes = React.PropTypes;
'use strict';

function Login(props) {
        return (
            <div className="jumbotron col-sm-offset-3 col-sm-6 text-center" >
                <h1>Welcome</h1>
                <h2>התחבר</h2>

                <form onSubmit={props.onSubmitUser}>
                <div className="form-group">
                        <input
                            className='form-control'
                            type='text'/>
                    </div>

                    <div className="form-group">
                        <input
                            className='form-control'
                            type='password'/>
                    </div>

                    <div className="form-group col-sm-4 col-sm-offset-4">
                        <button
                            className="btn btn-block btn-success"
                            type="submit">
                            Login
                        </button>
                    </div>

                </form>

            </div>
        )
    }

Login.propTypes = {
    onSubmitUser: PropTypes.func.isRequired,
}
module.exports = Login;
