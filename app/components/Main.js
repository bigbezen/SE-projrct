/**
 * Created by lihiverchik on 29/11/2016.
 */
var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link


var Main = React.createClass({
    render: function () {
        return (
            <div className="jumbotron col-sm-12 text-center" >
                <h1>Welcome</h1>
                <Link to='/Home'>
                    <button type='button' className='btn btn-lg btn-success'>Get Started</button>
                </Link>

            </div>
        )
    }
});

module.exports = Main;


