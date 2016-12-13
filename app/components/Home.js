/**
 * Created by lihiverchik on 29/11/2016.
 */
var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link


var Home = React.createClass({
    render: function () {
        return (
            <div className="jumbotron col-sm-12 text-center" >
                <h1>Hello From Home page</h1>
                <Link to='/First'>
                    <button type='button' className='btn btn-lg btn-success'>Get Started</button>
                </Link>

            </div>
        )
    }
});

module.exports = Home;
