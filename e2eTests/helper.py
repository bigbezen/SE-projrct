import datetime


def getCurrDate():
    return datetime.datetime.now().date().strftime("%d/%m/%Y")


def getNextTime(n):
    currTime = datetime.datetime.now() + datetime.timedelta(hours=n)
    nextTime = currTime.time().replace(microsecond=0).strftime("%X")[:-3]
    return nextTime


url = 'http://localhost:3000/#/'
manager_home = 'http://localhost:3000/#/manager/home'
change_page = 'http://localhost:3000/#/manager/changePassword'
retrieve_page = 'http://localhost:3000/#/member/retrievePassword'

productsContainer = 'http://localhost:3000/#/manager/products'
storesContainer = 'http://localhost:3000/#/manager/stores'
usersContainer = 'http://localhost:3000/#/manager/users'
shiftsContainer = 'http://localhost:3000/#/manager/shifts'
reportsContainer = 'http://localhost:3000/#/manager/reports'
incentivesContainer = 'http://localhost:3000/#/manager/incentives'

logoutManagerXpath = "//*[@id=\"app\"]/div/ul/li[9]/a"

# salesman
salesman_home = "http://localhost:3000/#/salesman/home/home"
salesman_startShift = "http://localhost:3000/#/salesman/startShift"
salesman_shift = "http://localhost:3000/#/salesman/shift"
salesman_encouragements = "http://localhost:3000/#/salesman/shift/encouragements"
salesman_comments = "http://localhost:3000/#/salesman/shift/comments"
salesman_editSale = "http://localhost:3000/#/salesman/shift/editSale"
salesman_sale = "http://localhost:3000/#/salesman/shift/sale"
salesman_endShift = "http://localhost:3000/#/salesman/endShift"
salesman_profile = "http://localhost:3000/#/salesman/home/profile"
salesman_shiftSchedule = "http://localhost:3000/#/salesman/home/shiftSchedule"
salesman_expenses = "http://localhost:3000/#/salesman/home/shiftsExpenses"

# login
adminUsername = "testAdmin"
adminPass = "11111111"
adminEmail = "testAdmin@bla.bla"
wrongUsername = "wrong"
wrongPass = "wrong"
wrongEmail = "wrong@wrong.com"
salesmanUsername = "newUser"
salesmanPass = "12121212"

# product
productName = "מוצר חדש"
existsProductName = "קמפארי"
price = "100"
category = "ספיריט"
subCategory = "וודקה"

# store
storeName = "חנות חדשה"
storeManagerName = "מנהל"
storePhone = "0523908209"
storeCity = "באר שבע"
storeAddress = "דרך חברון"
storeArea = "דרום"
storeChannel = "תדמית יום"

# users
username = "משתמשחדש"
userRole = "דייל"
userStartDate = "19/04/2017"
userId = "xxxxxxx"
userEmail = "bla@bla.bla"
userGender = "זכר"
existsUsername = "shahaf"
existsId = "9876976"
existsEmail = "sds@dsfds.com"

# incentives
incentiveName = "תמריץ1"
incentiveProduct = "קמפארי"
incentiveSubCategory = "סינגל מאלט סקוטי"
incentiveQuantity = "13"
incentiveBonus = "100"

# shifts
shiftStore = "טיב טעם"
shiftUser = "newUser"
shiftType = "טעימה"
shiftDate = getCurrDate()
shiftStartTime = getNextTime(1)
shiftEndTime = getNextTime(2)