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

# login
adminUsername = "testAdmin"
adminPass = "11111111"
adminEmail = "testAdmin@bla.bla"
wrongUsername = "wrong"
wrongPass = "wrong"
wrongEmail = "wrong@wrong.com"

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
incentiveQuantity = "13"
incentiveBonus = "100"

# shifts
shiftStore = "טיב טעם"
shiftUser = "newUser"
shiftType = "טעימה"
shiftDate = getCurrDate()
shiftStartTime = getNextTime(1)
shiftEndTime = getNextTime(2)