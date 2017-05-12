using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace FinalProjectTest
{
    [TestClass]
    public class TestMain
    {
        private const string _serverUrl = "http://localhost:3000";
        private static JObject[] _salesmanArr;
        private static JObject[] _storesArr;
        private static JObject[] _productsArr;
        private static JObject[] _encourangementArr;
        private static Action<string,string,string,int>[] _shiftActions;
        private static JArray _shiftsArr;
        private static JObject _admin;
        private static Thread[] _salesmanThreads = new Thread[100];
        private static int _numOfSalesman = 100;

        [TestInitialize]
        public void init()
        {
            _shiftActions = new Action<string,string,string,int>[3];
            _shiftActions[0] = RepoertSale;
            _shiftActions[1] = ReportOpened;
            _shiftActions[2] = ReportComment;
        }

        [TestMethod]
        public void RundomTests()
        {
            //adding 100 salesman
            AddNewSalesman(salesmanCount: 100);
            TestSalesmanAdded(salesmanCount: 100);

            //adding 20 stores
            AddStores(storesCount: 20);
            TestStoresAdded(storesCount: 20);

            //adding 20 products
            AddProducts(productsCount: 20);
            TestProductesAdded(productsCount: 20);

            //adding 5 encourangemnet
            addEncouragement(encouragementCount: 5);
            TestEncouragemenAdded(encouragementCount: 5);

            //adding shift foreach salesman
            CreateAndpublishShiftsForTheSalesman();

            //create thread for each salesman and run the senario
            Parallel.For(0, _salesmanArr.Length, RandomSenario);
        }

        [TestMethod]
        private void TestSalesmanAdded(int salesmanCount)
        {
            //admin should be loggedin 
            Assert.IsNotNull(_admin);
            string sessionId = _admin.GetValue("sessionId").ToString();

            string jsonBody = JSessionId(sessionId);
            JArray req = JArray.Parse(GetRequest(URLGenaretor._getAllUsersUrl, sessionId));
            Assert.IsNotNull(req);
            Assert.AreEqual(salesmanCount + 1, req.Count, "the number of users soult be the number of salesman + 1 manager");
        }

        [TestMethod]
        private void TestStoresAdded(int storesCount)
        {
            //admin should be loggedin 
            Assert.IsNotNull(_admin);
            string sessionId = _admin.GetValue("sessionId").ToString();

            string jsonBody = JSessionId(sessionId);
            JArray req = JArray.Parse(GetRequest(URLGenaretor._getAllStoresUrl, sessionId));
            Assert.IsNotNull(req);
            Assert.AreEqual(storesCount, req.Count, "the number of users shoult be the number of stores");
        }

        [TestMethod]
        private void TestProductesAdded(int productsCount)
        {
            //admin should be loggedin 
            Assert.IsNotNull(_admin);
            string sessionId = _admin.GetValue("sessionId").ToString();

            string jsonBody = JSessionId(sessionId);
            JArray req = JArray.Parse(GetRequest(URLGenaretor._getAllProductsUrl, sessionId));
            Assert.IsNotNull(req);
            Assert.AreEqual(productsCount, req.Count);
        }

        [TestMethod]
        private void TestEncouragemenAdded(int encouragementCount)
        {
            //admin should be loggedin 
            Assert.IsNotNull(_admin);
            string sessionId = _admin.GetValue("sessionId").ToString();

            string jsonBody = JSessionId(sessionId);
            JArray req = JArray.Parse(GetRequest(URLGenaretor._getAllEncouragementUrl, sessionId));
            Assert.IsNotNull(req);
            Assert.AreEqual(encouragementCount, req.Count);
        }

        private static void AddNewSalesman(int salesmanCount)
        {
            //login as an admin and get sessionId
            _salesmanArr = new JObject[salesmanCount];
            _admin = JObject.Parse(PostRequest(URLGenaretor._loginUrl, JLogin("admin", "admin")));
            Assert.IsNotNull(_admin.GetValue("sessionId"));

            string sessionId = _admin.GetValue("sessionId").ToString();
            _numOfSalesman = salesmanCount;
            for (int i = 0; i < _numOfSalesman; i++)
            {
                dynamic jobDetails = new JObject();
                jobDetails.salary = 25;
                jobDetails.userType = "salesman";

                dynamic personal = new JObject();
                personal.firstName = "name" + i;
                personal.lastName = "lastName" + i;
                personal.id = "123456" + i;
                personal.sex = "male";
                personal.birthday = DateTime.Now;

                dynamic address = new JObject();
                address.street = "street" + i;
                address.number = i + "";
                address.city = "city" + i;
                address.zip = i + "";

                dynamic contact = new JObject();
                contact.email = i + "@gmail.com";
                contact.phone = i + "123030";
                contact.address = address;

                dynamic salesman = new JObject();
                salesman.username = "user" + i;
                salesman.jobDetails = jobDetails;
                salesman.personal = personal;
                salesman.contact = contact;
                salesman.startDate = DateTime.Now;

                dynamic addreq = new JObject();
                addreq.userDetails = salesman;
                addreq.sessionId = sessionId;

                string jsonBody = addreq.ToString();
                JObject  req = JObject.Parse(PostRequest(URLGenaretor._addUserUrl, jsonBody));
                _salesmanArr[i] = new JObject(req);
            }
        }

        private static void AddStores(int storesCount)
        {
            //admin should be loggedin 
            Assert.IsNotNull(_admin);
            string sessionId = _admin.GetValue("sessionId").ToString();
            _storesArr = new JObject[storesCount];

            for(int i = 0; i < storesCount; i++)
            {
                dynamic store = new JObject();
                store.name = "store " + i;
                store.managerName = "manager";
                store.phone = "03555555";
                store.address = "rager";
                store.city = "bash";
                store.area = "store";
                store.channel = "תדמית יום";

                dynamic addreq = new JObject();
                addreq.storeDetails = store;
                addreq.sessionId = sessionId;

                string jsonBody = addreq.ToString();
                JObject req = JObject.Parse(PostRequest(URLGenaretor._addStoreUrl, jsonBody));
                _storesArr[i] = new JObject(req);
            }
        }

        private static void AddProducts(int productsCount)
        {
            //admin should be loggedin 
            Assert.IsNotNull(_admin);
            string sessionId = _admin.GetValue("sessionId").ToString();
            _productsArr = new JObject[productsCount];

            for (int i = 0; i < productsCount; i++)
            {
                dynamic product = new JObject();
                product.name = "product " + i;
                product.retailPrice = i;
                product.salePrice = i + 10;
                product.category = "wieskey";
                product.subCategory = "spirit";
                product.minRequiredAmount = 100;
                product.notifyManager = false;

                dynamic addreq = new JObject();
                addreq.productDetails = product;
                addreq.sessionId = sessionId;

                string jsonBody = addreq.ToString();
                JObject req = JObject.Parse(PostRequest(URLGenaretor._addProductUrl, jsonBody));
                _productsArr[i] = new JObject(req);
            }
        }

        private static void addEncouragement(int encouragementCount)
        {
            //admin should be loggedin 
            Assert.IsNotNull(_admin);
            //products should be added
            Assert.IsTrue(_productsArr.Length > 0);

            string sessionId = _admin.GetValue("sessionId").ToString();
            _encourangementArr = new JObject[encouragementCount];

            for (int i = 0; i < encouragementCount; i++)
            {
                dynamic encouragement = new JObject();
                encouragement.active = true;
                encouragement.numOfProducts = 20;
                encouragement.rate = 100;
                encouragement.products = new JArray();
                for(int j = i * 4; j < (i * 4 + 4); j++)
                {
                    encouragement.products.Add(_productsArr[j].GetValue("_id"));
                }

                dynamic addreq = new JObject();
                addreq.encouragementDetails = encouragement;
                addreq.sessionId = sessionId;

                string jsonBody = addreq.ToString();
                JObject req = JObject.Parse(PostRequest(URLGenaretor._addEncouragementUrl, jsonBody));
                _encourangementArr[i] = new JObject(req);
            }
        }

        private static void CreateAndpublishShiftsForTheSalesman()
        {
            //admin should be loggedin 
            Assert.IsNotNull(_admin);
            //stores should be initilized
            Assert.IsTrue(_storesArr.Length > 0);

            string sessionId = _admin.GetValue("sessionId").ToString();
            dynamic addreq = new JObject();
            addreq.shiftArr = new JArray();
            addreq.sessionId = sessionId;

            for (int i = 0; i < _numOfSalesman; i++)
            {
                dynamic shift = new JObject();
                shift.storeId = _storesArr[i % _storesArr.Length].GetValue("_id");
                shift.salesmanId = _salesmanArr[i].GetValue("_id");
                shift.startTime = DateTime.Now.AddHours(1);
                shift.endTime = DateTime.Now.AddHours(2);
                shift.type = "טעימות";

                addreq.shiftArr.Add(shift);
            }

            string jsonBody = addreq.ToString();
            JArray req = JArray.Parse(PostRequest(URLGenaretor._addShiftsUrl, jsonBody));
            _shiftsArr = new JArray(req);

            //publish all the shifts
            dynamic publishReq = new JObject();

            publishReq.sessionId = sessionId;
            publishReq.shiftArr = new JArray();
            foreach(JObject shift in _shiftsArr)
            {
                dynamic currentShift = new JObject();
                currentShift._id = shift.GetValue("_id");
                currentShift.salesmanId = shift.GetValue("salesmanId");
                publishReq.shiftArr.Add(currentShift);
            }
            jsonBody = publishReq.ToString();
            PostRequest(URLGenaretor._publishShiftsUrl, jsonBody);
        }

        private static JObject GetUserShift(string salesmanId)
        {
            foreach (JObject shift in _shiftsArr)
            {
                if (salesmanId.Equals((string)shift["salesmanId"]))
                {
                    return shift;
                }
            }

            return null;
        }

        //main senario
        public static void RandomSenario(int numOfSalesman)
        {
            JObject user = _salesmanArr[numOfSalesman];
            Dictionary<string, int>[] actionResult = new Dictionary<string, int>[2];
            LinkedList<string> comments = new LinkedList<string>();
            actionResult[0] = new Dictionary<string, int>();
            actionResult[1] = new Dictionary<string, int>();

            Random rnd = new Random();

            //login into the the system
            dynamic salesman = user;
            dynamic shift = GetUserShift((string)user.GetValue("_id"));
            salesman.sessionId = JObject.Parse(PostRequest(URLGenaretor._loginUrl, JLogin((string)salesman["username"], (string)salesman["personal"]["id"]))).GetValue("sessionId").ToString();
            //ensure that the salesman logedin
            Assert.IsNotNull(salesman["sessionId"]);

            //start salesman shift
            PostRequest(URLGenaretor._startShiftUrl, JStartOrEndShift((string)user["sessionId"], (string)user["_id"]));
            //ensure that the shift started
            shift = JObject.Parse(GetRequest(URLGenaretor._getCurrentShiftUrl, (string)user["sessionId"]));
            Assert.AreEqual((string)shift.GetValue("status"),"STARTED", "the shift shoud be statrted status");

            //run shift actions
            string sessionId = (string)user.GetValue("sessionId");
            string shiftId = (string)shift.GetValue("_id");

            for (int i = 0; i < 100; i++)
            {
                int product = rnd.Next(0, 19);
                int action = rnd.Next(0, 3);
                int amount = rnd.Next(1, 10);
                int timeToSleep = rnd.Next(500, 5000);
                string productName = (string)_productsArr[product].GetValue("name");
                _shiftActions[action](sessionId, shiftId, (string)_productsArr[product].GetValue("_id"), amount);

                //update the action
                if(action < 2 && actionResult[action].ContainsKey(productName))
                {
                    actionResult[action][productName] += amount;
                }
                else if(action < 2)
                {
                    actionResult[action].Add(productName, amount);
                }
                else
                {
                    comments.AddLast((string)_productsArr[product].GetValue("_id"));
                }

                //finish and going to sleep
                Thread.Sleep(timeToSleep);
            }

            shift = JObject.Parse(GetRequest(URLGenaretor._getCurrentShiftUrl, (string)user["sessionId"]));
            JArray saleReport = shift.GetValue("salesReport");
            foreach(JObject sale in saleReport)
            {
                string productName = (string)sale.GetValue("name");
                if (actionResult[0].ContainsKey(productName))
                {
                    int salesCount = actionResult[0][productName];
                    Assert.AreEqual(salesCount, (int)(sale.GetValue("sold")));
                }

                if (actionResult[1].ContainsKey(productName))
                {
                    int openedCount = actionResult[1][productName];
                    Assert.AreEqual(openedCount, (int)(sale.GetValue("opened")));
                }
            }

            JArray shiftComments = shift.GetValue("shiftComments");
            for(int i = 0; i < comments.Count; i++)
            {
                Assert.AreEqual(comments.ElementAt(i), shiftComments.ElementAt(i).ToString());
            }

            //finish salesman shift
            PostRequest(URLGenaretor._finishShiftUrl, JStartOrEndShift((string)user["sessionId"], (string)user["_id"], shift));
        }

        //shift actions
        public static void RepoertSale(string sessionId, string shiftId, string productId, int quantity)
        {
            dynamic sale = new JObject();
            sale.productId = productId;
            sale.quantity = quantity;

            dynamic report = new JObject();
            report.sessionId = sessionId;
            report.shiftId = shiftId;
            report.sales = new JArray();
            report.sales.Add(sale);

            string req = report.ToString();
            PostRequest(URLGenaretor._reportSaleUrl, req);
        }

        public static void ReportOpened(string sessionId, string shiftId, string productId, int quantity)
        {
            dynamic opens = new JObject();
            opens.productId = productId;
            opens.quantity = quantity;

            dynamic report = new JObject();
            report.sessionId = sessionId;
            report.shiftId = shiftId;
            report.opens = new JArray();
            report.opens.Add(opens);

            string req = report.ToString();
            PostRequest(URLGenaretor._reportOpenedUrl, req);
        }

        public static void ReportComment(string sessionId, string shiftId, string comment, int quantity = 0)
        {
            dynamic report = new JObject();
            report.sessionId = sessionId;
            report.shiftId = shiftId;
            report.content = comment;

            string req = report.ToString();
            PostRequest(URLGenaretor._addShiftComment, req);
        }

        //jsons
        private static string JStartOrEndShift(string sessionId,string salesmanId, JObject userShift = null)
        {
            dynamic startShiftReq = new JObject();
            if (userShift == null)
            {
                foreach (JObject shift in _shiftsArr)
                {
                    if (salesmanId.Equals((string)shift["salesmanId"]))
                    {
                        startShiftReq.shift = shift;
                        startShiftReq.sessionId = sessionId;
                        return startShiftReq.ToString();
                    }
                }

                return null;
            }
            else
            {
                startShiftReq.shift = userShift;
                startShiftReq.sessionId = sessionId;
                return startShiftReq.ToString();
            }

        }

        private static string JLogin(string userNamre, string password)
        {
            dynamic login = new JObject();
            login.username = userNamre;
            login.password = password;
            return login.ToString();
        }

        private static string JSessionId(string sessionId)
        {
            dynamic session = new JObject();
            session.sessionId = sessionId;
            return sessionId.ToString();
        }

        //communication handler
        private static string GetRequest(string url, string sessionId)
        {
            if (string.IsNullOrEmpty(_serverUrl + url))
            {
                var msg = $"Url is either null or empty: '{_serverUrl + url}'. Cannot send GetRequest";
                Trace.TraceError(msg);
                throw new ArgumentException(msg);
            }

            Trace.TraceInformation($"GET req to {_serverUrl + url}");
            HttpWebRequest req = (HttpWebRequest)WebRequest.Create(_serverUrl + url);

            req.UserAgent = "API Client";
            req.Accept = "application/json";
            req.Method = WebRequestMethods.Http.Get;
            req.Headers.Add("sessionid", sessionId);

            string result = null;
            using (HttpWebResponse resp = (HttpWebResponse)req.GetResponse())
            {
                StreamReader reader = new StreamReader(resp.GetResponseStream());
                result = reader.ReadToEnd();
            }

            Trace.TraceInformation($"GET request was successful");
            return result;
        }

        private static string PostRequest(string url, string body)
        {
            if (string.IsNullOrEmpty(url))
            {
                var msg = $"Url is either null or empty: '{_serverUrl + url}'. Cannot send PostRequest";
                Trace.TraceError(msg);
                throw new ArgumentException(msg);
            }

            Trace.TraceInformation($"POST req to {_serverUrl + url}");
            HttpWebRequest req = (HttpWebRequest)WebRequest.Create(_serverUrl + url);

            req.UserAgent = "API Client";
            req.Accept = "application/json";
            req.ContentType = "application/json";
            req.Method = WebRequestMethods.Http.Post;

            byte[] buf = Encoding.UTF8.GetBytes(body);
            req.GetRequestStream().Write(buf, 0, buf.Length);

            string responseText;
            using (HttpWebResponse resp = (HttpWebResponse)req.GetResponse())
            {
                WebHeaderCollection header = resp.Headers;

                var encoding = ASCIIEncoding.ASCII;
                using (var reader = new StreamReader(resp.GetResponseStream(), encoding))
                {
                    responseText = reader.ReadToEnd();
                }
            }

            Trace.TraceInformation($"Post request was successful");
            return responseText;
        }
    }
}
