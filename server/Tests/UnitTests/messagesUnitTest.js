var chai            = require('chai');
chai.use(require('chai-datetime'));
var expect          = chai.expect;

var userModel       = require('../../src/Models/user');
var cypher          = require('../../src/Utils/Cypher/index');
var dal             = require('../../src/DAL/dal');
var messageService  = require('../../src/Services/messages/index');
var messageModel    = require('../../src/Models/message');

describe('messages unit test', function () {

    beforeEach(async function () {
        var user1 = new userModel();
        user1.username = 'user1';
        user1.sessionId = 'user1Session';
        user1.password = cypher.encrypt("123456");
        user1.jobDetails = {
            "userType": "salesman",
        };
        var user2 = new userModel();
        user2.username = 'user2';
        user2.sessionId = 'user2Session';
        user2.password = cypher.encrypt("123456");
        user2.jobDetails = {
            "userType": "salesman",
        };

        var managerUser = new userModel();
        managerUser.username = 'manager';
        managerUser.password = cypher.encrypt("123456");
        managerUser.sessionId = "managerSession";
        managerUser.jobDetails.userType = "manager";
        managerUser.personal.id = "12345";
        managerUser.contact = "";
        managerUser.startDate = "";
        managerUser.endDate = "";

        dal.addUser(user1);
        dal.addUser(user2);
        dal.addUser(managerUser);

    });

    afterEach(async function () {
        var res = await dal.cleanDb();
    });

    describe('send broadcast message', function () {
        it('send broadcast message valid', async function () {
            var manager = await dal.getUserByUsername('manager');
            var user1 = await dal.getUserByUsername('user1');
            var user2 = await dal.getUserByUsername('user2');

            expect(user1.inbox).to.have.lengthOf(0);
            expect(user2.inbox).to.have.lengthOf(0);

            var date = new Date(Date.now());
            var result = await messageService.sendBroadcast('managerSession', 'test message', date);
            expect(result).to.have.property('code', 200);

            user1 = await dal.getUserByUsername('user1');
            user2 = await dal.getUserByUsername('user2');

            expect(manager.inbox.length).to.be.equal(0);
            expect(user1.inbox.length).to.be.equal(1);
            expect(user1.inbox[0]).to.be.an('object');
            expect(user1.inbox[0]).to.not.have.property('content');

            var messages1 = await dal.getMessages([user1.inbox[0]]);
            expect(messages1.length).to.be.equal(1);
            expect(messages1).to.have.deep.property('[0].content', 'test message');
            expect(messages1).to.have.deep.property('[0].sender', 'manager');
            expect(messages1[0].date).to.equalDate(date);

            var messages2 = await dal.getMessages([user2.inbox[0]]);
            expect(messages2.length).to.be.equal(1);
            expect(messages2).to.have.deep.property('[0].content', 'test message');
            expect(messages2).to.have.deep.property('[0].sender', 'manager');
            expect(messages2[0].date).to.equalDate(new Date(date));
        });

        it('send broadcast message not by manager', async function() {
            var date = new Date(Date.now());
            var result = await messageService.sendBroadcast('userSession', 'test message', date);
            expect(result).to.have.property('code', 401);
        })
    });

    describe('get inbox', function () {
        it('get inbox valid', async function () {
            // test receiving of an empty inbox
            var result1 = await messageService.getInbox('user1Session');
            var result2 = await messageService.getInbox('user2Session');
            expect(result1).to.have.property('code', 200);
            expect(result1).to.have.property('inbox');
            expect(result1.inbox).to.have.lengthOf(0);

            expect(result2).to.have.property('code', 200);
            expect(result2).to.have.property('inbox');
            expect(result2.inbox).to.have.lengthOf(0);

            //send some messages
            var result = await messageService.sendBroadcast('managerSession', 'test message', new Date(Date.now()));
            result = await messageService.sendBroadcast('managerSession', 'test message2', new Date(Date.now()));
            result = await messageService.sendBroadcast('managerSession', 'test message3', new Date(Date.now()));

            result1 = await messageService.getInbox('user1Session');
            result2 = await messageService.getInbox('user2Session');

            //test receiving of non-empty inbox
            expect(result1).to.have.property('code', 200);
            expect(result1).to.have.property('inbox');
            expect(result1.inbox.length).to.be.equal(3);

            expect(result2).to.have.property('code', 200);
            expect(result2).to.have.property('inbox');
            expect(result2.inbox.length).to.be.equal(3);

            //check the content of the messages
            for(message of result1.inbox){
                expect(message).to.include.keys('sender', 'content', 'date', 'type');
                expect(message.sender).to.be.equal('manager');
                expect(message.type).to.be.equal('broadcast');
            }
            for(message of result2.inbox){
                expect(message).to.include.keys('sender', 'content', 'date', 'type');
                expect(message.sender).to.be.equal('manager');
                expect(message.type).to.be.equal('broadcast');
            }
        });

        it('get inbox by non-valid user', async function(){
            var result = await messageService.getInbox('non existing session id');
            expect(result).to.have.property('code', 401);
        });
    });

    describe('mark as read', function () {
        it('mark as read valid', async function () {
            var result = await messageService.sendBroadcast('managerSession', 'test message', new Date(Date.now()));

            var user1 = await dal.getUserByUsername('user1');
            var messages = await messageModel.find({});
            expect(user1.inbox).to.have.lengthOf(1);
            expect(messages).to.have.lengthOf(1);

            result = await messageService.markAsRead('user1Session');
            expect(result).to.have.property('code', 200);

            user1 = await dal.getUserByUsername('user1');
            messages = await messageModel.find({});
            expect(user1.inbox).to.have.lengthOf(0);
            expect(messages).to.have.lengthOf(1);

            var user2 = await dal.getUserByUsername('user2');
            expect(user2.inbox).to.have.lengthOf(1);

            result = await messageService.sendBroadcast('managerSession', 'test message2', new Date(Date.now()));
            result = await messageService.sendBroadcast('managerSession', 'test message3', new Date(Date.now()));

            user1 = await dal.getUserByUsername('user1');
            user2 = await dal.getUserByUsername('user2');

            expect(user1.inbox).to.have.lengthOf(2);
            expect(user2.inbox).to.have.lengthOf(3);

            result = await messageService.markAsRead('user2Session');
            expect(result).to.have.property('code', 200);

            user1 = await dal.getUserByUsername('user1');
            user2 = await dal.getUserByUsername('user2');

            expect(user1.inbox).to.have.lengthOf(2);
            expect(user2.inbox).to.have.lengthOf(0);
        });

        it('mark as read non existing session id', async function() {
            var result = await messageService.markAsRead('non existing session id');
            expect(result).to.have.property('code', 401);

            result = await messageService.sendBroadcast('managerSession', 'test message', new Date(Date.now()));

            result = await messageService.markAsRead('non existing session id');
            expect(result).to.have.property('code', 401);
        });
    });

});