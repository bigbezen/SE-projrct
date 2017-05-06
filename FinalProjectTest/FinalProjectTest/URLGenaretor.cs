using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FinalProjectTest
{
    public static class URLGenaretor
    {
        public const string _loginUrl = "/user/login";
        public const string _addUserUrl = "/management/addUser";
        public const string _getAllUsersUrl = "/management/getAllUsers";
        public const string _getAllStoresUrl = "/management/getAllStores";
        public const string _addStoreUrl = "/management/addStore";
        public const string _addShiftsUrl = "/management/addShifts";
        public const string _startShiftUrl = "/salesman/startShift";
        public const string _getCurrentShiftUrl = "/salesman/getCurrentShift";
        public const string _publishShiftsUrl = "/management/publishShifts";
        public const string _addProductUrl = "/management/addProduct";
        public const string _getAllProductsUrl = "/management/getAllProducts";
        public const string _reportSaleUrl = "/salesman/reportSale";
        public const string _reportOpenedUrl = "/salesman/reportOpened";
        public const string _finishShiftUrl = "/salesman/finishShift";
    }
}
