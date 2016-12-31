var assert = require('chai').assert;

describe('messages unit test', function () {

    beforeEach(async function () {
        var user = new userModel();
        user.username = 'shahaf';
        user.password = cypher.encrypt("123456");
        user.startDate = "09-16-2016";
        user.endDate = null;
        user.personal = {
            "id": "0987654321",
            "firstName": "israel",
            "lastName": "israeli",
            "sex": "male",
            "birthday": "01-01-1999"
        };
        user.contact = {
            "address": {
                "street": "st",
                "number": "100",
                "city": "some city",
                "zip": "11111"
            },
            "phone": "054-9999999",
            "email": "shahafstein@gmail.com"
        };
        user.jobDetails = {
            "userType": "manager",
            "area": "south",
            "channel": "spirit",
            "encouragements": []
        };

        var managerUser = new userModel();
        managerUser.username = 'manager';
        managerUser.password = cypher.encrypt("123456");
        managerUser.sessionId = "sessionId";
        managerUser.jobDetails.userType = "manager";
        managerUser.personal.id = "12345";
        managerUser.contact = "";
        managerUser.startDate = "";
        managerUser.endDate = "";

        dal.addUser(user);
        dal.addUser(managerUser);

    });

    afterEach(async function () {
        var res = await dal.cleanDb();
    });

    describe('send broadcast message', function () {
        it('pass test', function () {
            //implementation of the test came here
            assert.equal(2, 2, 'not pass');
        });
    });

    describe('get inbox', function () {
        it('pass test', function () {
            //implementation of the test came here
            assert.equal(2, 2, 'not pass');
        });
    });

    describe('mark as read', function () {
        it('pass test', function () {
            //implementation of the test came here
            assert.equal(2, 2, 'not pass');
        });
    });

});