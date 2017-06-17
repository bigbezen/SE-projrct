import dbConnector
import unittest
from selenium import webdriver
import helper
import containers.login
import containers.managerHome
import containers.products
import containers.stores
import containers.users
import containers.Incentives
import containers.shifts
import pytest
from time import sleep


class ManagementServices(unittest.TestCase):
    MAX_RUNNING_TIME = 90

    def setUp(self):
        dbConnector.deleteDb()
        dbConnector.initDb()
        options = webdriver.ChromeOptions()
        options.add_argument('--lang=heb')
        self.driver = webdriver.Chrome(chrome_options=options)
        self.driver.get(helper.url)
        driver = self.driver
        driver.find_element_by_xpath(containers.login.username).send_keys(helper.adminUsername)
        driver.find_element_by_xpath(containers.login.password).send_keys(helper.adminPass)
        driver.find_element_by_xpath(containers.login.loginBtn).click()
        driver.implicitly_wait(300)
        sleep(3)
        self.assertEqual(driver.current_url, helper.manager_home)

    # test-11
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_addUser_Ok(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.managerHome.usersTab).click()
        driver.implicitly_wait(300)
        self.assertEqual(driver.current_url, helper.usersContainer)

        driver.find_element_by_xpath(containers.users.add).click()
        driver.implicitly_wait(300)

        driver.find_element_by_xpath(containers.users.username).send_keys(helper.username)
        driver.find_element_by_xpath(containers.users.role).send_keys(helper.userRole)
        driver.find_element_by_xpath(containers.users.startDate).send_keys(helper.userStartDate)
        driver.find_element_by_xpath(containers.users.idNum).send_keys(helper.userId)
        driver.find_element_by_xpath(containers.users.sex).send_keys(helper.userGender)
        driver.find_element_by_xpath(containers.users.email).send_keys(helper.userEmail)
        driver.find_element_by_xpath(containers.users.addBtn).click()
        driver.implicitly_wait(300)
        sleep(3)
        self.assertEqual(driver.current_url, helper.usersContainer)

    # test-12
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_addUser_badUsername(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.managerHome.usersTab).click()
        driver.implicitly_wait(300)
        self.assertEqual(driver.current_url, helper.usersContainer)

        driver.find_element_by_xpath(containers.users.add).click()
        driver.implicitly_wait(300)

        driver.find_element_by_xpath(containers.users.username).send_keys(helper.existsUsername)
        driver.find_element_by_xpath(containers.users.role).send_keys(helper.userRole)
        driver.find_element_by_xpath(containers.users.startDate).send_keys(helper.userStartDate)
        driver.find_element_by_xpath(containers.users.idNum).send_keys(helper.userId)
        driver.find_element_by_xpath(containers.users.sex).send_keys(helper.userGender)
        driver.find_element_by_xpath(containers.users.email).send_keys(helper.userEmail)
        driver.find_element_by_xpath(containers.users.addBtn).click()
        driver.implicitly_wait(300)
        sleep(3)
        self.assertNotEqual(driver.current_url, helper.usersContainer)

    # test-13
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_addUser_badId(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.managerHome.usersTab).click()
        driver.implicitly_wait(300)
        self.assertEqual(driver.current_url, helper.usersContainer)

        driver.find_element_by_xpath(containers.users.add).click()
        driver.implicitly_wait(300)

        driver.find_element_by_xpath(containers.users.username).send_keys(helper.username)
        driver.find_element_by_xpath(containers.users.role).send_keys(helper.userRole)
        driver.find_element_by_xpath(containers.users.startDate).send_keys(helper.userStartDate)
        driver.find_element_by_xpath(containers.users.idNum).send_keys(helper.existsId)
        driver.find_element_by_xpath(containers.users.sex).send_keys(helper.userGender)
        driver.find_element_by_xpath(containers.users.email).send_keys(helper.userEmail)
        driver.find_element_by_xpath(containers.users.addBtn).click()
        driver.implicitly_wait(300)
        sleep(3)
        self.assertNotEqual(driver.current_url, helper.usersContainer)

    # test-14
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_addUser_badEmail(self):
        # todo: check if it is ok
        driver = self.driver
        driver.find_element_by_xpath(containers.managerHome.usersTab).click()
        driver.implicitly_wait(300)
        self.assertEqual(driver.current_url, helper.usersContainer)

        driver.find_element_by_xpath(containers.users.add).click()
        driver.implicitly_wait(300)

        driver.find_element_by_xpath(containers.users.username).send_keys(helper.username)
        driver.find_element_by_xpath(containers.users.role).send_keys(helper.userRole)
        driver.find_element_by_xpath(containers.users.startDate).send_keys(helper.userStartDate)
        driver.find_element_by_xpath(containers.users.idNum).send_keys(helper.userId)
        driver.find_element_by_xpath(containers.users.sex).send_keys(helper.userGender)
        driver.find_element_by_xpath(containers.users.email).send_keys(helper.existsEmail)
        driver.find_element_by_xpath(containers.users.addBtn).click()
        driver.implicitly_wait(300)
        sleep(3)
        # self.assertNotEqual(driver.current_url, helper.usersContainer)

    # test-15
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_editUser_Ok(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.managerHome.usersTab).click()
        driver.implicitly_wait(300)
        self.assertEqual(driver.current_url, helper.usersContainer)

        driver.find_element_by_xpath(containers.users.edit).click()
        driver.implicitly_wait(300)

        driver.find_element_by_xpath(containers.users.username).send_keys(helper.username)
        driver.find_element_by_xpath(containers.users.addBtn).click()
        driver.implicitly_wait(300)
        sleep(3)
        self.assertEqual(driver.current_url, helper.usersContainer)

    # test-16
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_editUser_badUsername(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.managerHome.usersTab).click()
        driver.implicitly_wait(300)
        self.assertEqual(driver.current_url, helper.usersContainer)

        driver.find_element_by_xpath(containers.users.edit).click()
        driver.implicitly_wait(300)

        driver.find_element_by_xpath(containers.users.username).clear()
        driver.find_element_by_xpath(containers.users.username).send_keys(helper.existsUsername)
        driver.find_element_by_xpath(containers.users.addBtn).click()
        driver.implicitly_wait(300)
        sleep(3)
        self.assertNotEqual(driver.current_url, helper.usersContainer)

    # test-17
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_editUser_badId(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.managerHome.usersTab).click()
        driver.implicitly_wait(300)
        self.assertEqual(driver.current_url, helper.usersContainer)

        driver.find_element_by_xpath(containers.users.edit).click()
        driver.implicitly_wait(300)

        driver.find_element_by_xpath(containers.users.idNum).clear()
        driver.find_element_by_xpath(containers.users.idNum).send_keys(helper.existsId)
        driver.find_element_by_xpath(containers.users.addBtn).click()
        driver.implicitly_wait(300)
        sleep(3)
        self.assertNotEqual(driver.current_url, helper.usersContainer)

    # test-18
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_editUser_badEmail(self):
        # todo: check if it is ok
        driver = self.driver
        driver.find_element_by_xpath(containers.managerHome.usersTab).click()
        driver.implicitly_wait(300)
        self.assertEqual(driver.current_url, helper.usersContainer)

        driver.find_element_by_xpath(containers.users.edit).click()
        driver.implicitly_wait(300)

        driver.find_element_by_xpath(containers.users.email).clear()
        driver.find_element_by_xpath(containers.users.email).send_keys(helper.existsEmail)
        driver.find_element_by_xpath(containers.users.addBtn).click()
        driver.implicitly_wait(300)
        sleep(3)
        # self.assertNotEqual(driver.current_url, helper.usersContainer)

    # test-19
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_deleteUser_ok(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.managerHome.usersTab).click()
        driver.implicitly_wait(300)
        self.assertEqual(driver.current_url, helper.usersContainer)
        table = driver.find_element_by_xpath("//*[@id=\"app\"]/div/div[4]/div[1]/div/div[2]/div[2]/table/tbody")
        tableSizeBefore = len(table.text.split("\n"))

        driver.find_element_by_xpath(containers.users.delete).click()
        driver.implicitly_wait(300)
        sleep(1)
        driver.find_element_by_xpath("//*[@id=\"app\"]/div/div[4]/div[2]/div/div/div[2]/button").click()
        sleep(1)

        table = driver.find_element_by_xpath("//*[@id=\"app\"]/div/div[4]/div[1]/div/div[2]/div[2]/table/tbody")
        tableSizeAfter = len(table.text.split("\n"))
        self.assertTrue(tableSizeBefore > tableSizeAfter)
        self.assertEqual(driver.current_url, helper.usersContainer)

    # test-20
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_addStore_Ok(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.managerHome.storesTab).click()
        driver.implicitly_wait(300)
        self.assertEqual(driver.current_url, helper.storesContainer)

        driver.find_element_by_xpath(containers.stores.add).click()
        driver.implicitly_wait(300)

        driver.find_element_by_xpath(containers.stores.name).send_keys(helper.storeName)
        driver.find_element_by_xpath(containers.stores.manager).send_keys(helper.storeManagerName)
        driver.find_element_by_xpath(containers.stores.phone).send_keys(helper.storePhone)
        driver.find_element_by_xpath(containers.stores.city).send_keys(helper.storeCity)
        driver.find_element_by_xpath(containers.stores.address).send_keys(helper.storeAddress)
        driver.find_element_by_xpath(containers.stores.area).send_keys(helper.storeArea)
        driver.find_element_by_xpath(containers.stores.channel).send_keys(helper.storeChannel)
        driver.find_element_by_xpath(containers.stores.addBtn).click()
        driver.implicitly_wait(300)
        sleep(3)
        self.assertEqual(driver.current_url, helper.storesContainer)

    # test-21
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_addStore_badName(self):
        # todo: check if relevant
        return

    # test-22
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_editStore_Ok(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.managerHome.storesTab).click()
        driver.implicitly_wait(300)
        self.assertEqual(driver.current_url, helper.storesContainer)

        driver.find_element_by_xpath(containers.stores.edit).click()
        driver.implicitly_wait(300)

        driver.find_element_by_xpath(containers.stores.name).clear()
        driver.find_element_by_xpath(containers.stores.name).send_keys(helper.storeName)
        driver.find_element_by_xpath(containers.stores.addBtn).click()
        driver.implicitly_wait(300)
        sleep(3)
        self.assertEqual(driver.current_url, helper.storesContainer)

    # test-23
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_editStore_badName(self):
        # todo: check if relevant
        return

    # test-24
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_deleteStore_Ok(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.managerHome.storesTab).click()
        driver.implicitly_wait(300)
        self.assertEqual(driver.current_url, helper.storesContainer)

        table = driver.find_element_by_xpath("//*[@id=\"app\"]/div/div[4]/div[1]/div/div[2]/div[2]/table/tbody")
        tableSizeBefore = len(table.text.split("\n"))

        driver.find_element_by_xpath(containers.stores.delete).click()
        driver.implicitly_wait(300)
        sleep(1)
        driver.find_element_by_xpath("//*[@id=\"app\"]/div/div[4]/div[2]/div/div/div[2]/button").click()
        sleep(1)

        table = driver.find_element_by_xpath("//*[@id=\"app\"]/div/div[4]/div[1]/div/div[2]/div[2]/table/tbody")
        tableSizeAfter = len(table.text.split("\n"))
        self.assertTrue(tableSizeBefore > tableSizeAfter)
        self.assertEqual(driver.current_url, helper.storesContainer)

    # test-25
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_addProduct_ok(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.managerHome.productsTab).click()
        driver.implicitly_wait(300)
        self.assertEqual(driver.current_url, helper.productsContainer)

        driver.find_element_by_xpath(containers.products.add).click()
        driver.implicitly_wait(300)

        driver.find_element_by_xpath(containers.products.name).send_keys(helper.productName)
        driver.find_element_by_xpath(containers.products.price).send_keys(helper.price)
        driver.find_element_by_xpath(containers.products.category).send_keys(helper.category)
        driver.find_element_by_xpath(containers.products.subCategory).send_keys(helper.subCategory)

        driver.find_element_by_xpath(containers.products.addBtn).click()
        driver.implicitly_wait(300)
        sleep(3)
        self.assertEqual(driver.current_url, helper.productsContainer)

    # test-26
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_addProduct_badName(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.managerHome.productsTab).click()
        driver.implicitly_wait(300)
        self.assertEqual(driver.current_url, helper.productsContainer)

        driver.find_element_by_xpath(containers.products.add).click()
        driver.implicitly_wait(300)

        driver.find_element_by_xpath(containers.products.name).send_keys(helper.existsProductName)
        driver.find_element_by_xpath(containers.products.price).send_keys(helper.price)
        driver.find_element_by_xpath(containers.products.category).send_keys(helper.category)
        driver.find_element_by_xpath(containers.products.subCategory).send_keys(helper.subCategory)

        driver.find_element_by_xpath(containers.products.addBtn).click()
        driver.implicitly_wait(300)
        sleep(3)
        self.assertNotEqual(driver.current_url, helper.productsContainer)

    # test-27
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_editProduct_ok(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.managerHome.productsTab).click()
        driver.implicitly_wait(300)
        self.assertEqual(driver.current_url, helper.productsContainer)

        driver.find_element_by_xpath(containers.products.edit).click()
        driver.implicitly_wait(300)

        driver.find_element_by_xpath(containers.products.price).send_keys(helper.price)

        driver.find_element_by_xpath(containers.products.addBtn).click()
        driver.implicitly_wait(300)
        sleep(3)
        self.assertEqual(driver.current_url, helper.productsContainer)

    # test-28
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_editProduct_badName(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.managerHome.productsTab).click()
        driver.implicitly_wait(300)
        self.assertEqual(driver.current_url, helper.productsContainer)

        driver.find_element_by_xpath(containers.products.edit).click()
        driver.implicitly_wait(300)

        driver.find_element_by_xpath(containers.products.name).clear()
        driver.find_element_by_xpath(containers.products.name).send_keys(helper.existsProductName)

        driver.find_element_by_xpath(containers.products.addBtn).click()
        driver.implicitly_wait(300)
        sleep(3)
        self.assertNotEqual(driver.current_url, helper.productsContainer)

    # test-29
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_deleteProduct_ok(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.managerHome.productsTab).click()
        driver.implicitly_wait(300)
        self.assertEqual(driver.current_url, helper.productsContainer)

        table = driver.find_element_by_xpath("//*[@id=\"app\"]/div/div[4]/div[1]/div/div[2]/div[2]/table/tbody")
        tableSizeBefore = len(table.text.split("\n"))

        driver.find_element_by_xpath(containers.products.delete).click()
        driver.implicitly_wait(300)
        sleep(1)
        driver.find_element_by_xpath("//*[@id=\"app\"]/div/div[4]/div[2]/div/div/div[2]/button").click()
        sleep(1)

        table = driver.find_element_by_xpath("//*[@id=\"app\"]/div/div[4]/div[1]/div/div[2]/div[2]/table/tbody")
        tableSizeAfter = len(table.text.split("\n"))
        self.assertTrue(tableSizeBefore > tableSizeAfter)
        self.assertEqual(driver.current_url, helper.productsContainer)

    # test-30
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_addShift_ok(self):
        self.createShift()
      #  self.publishShift()

    # test-31
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_editShift_ok(self):
        driver = self.driver
        self.createShift()
        driver.find_element_by_xpath(containers.shifts.edit).click()
        driver.implicitly_wait(300)
        sleep(3)
        driver.find_element_by_xpath(containers.shifts.username).send_keys("avadir")

        driver.find_element_by_xpath(containers.shifts.addBtn).click()
        driver.implicitly_wait(300)
        sleep(3)
        self.assertEqual(driver.current_url, helper.createShiftContainer)

    # test-32
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_deleteShift_ok(self):
        driver = self.driver
        self.createShift()

        #table = driver.find_element_by_xpath("//*[@id=\"app\"]/div/div[4]/div[2]/div[2]/div[2]/table/tbody")
        #tableSizeBefore = len(table.text.split("\n"))

        driver.find_element_by_xpath(containers.shifts.delete).click()
        driver.implicitly_wait(300)
        sleep(1)
        driver.find_element_by_xpath("//*[@id=\"app\"]/div/div[4]/div[3]/div/div/div[2]/button").click()
        sleep(2)
        self.assertEqual(driver.current_url, helper.createShiftContainer)

        # table = driver.find_element_by_xpath("//*[@id=\"app\"]/div/div[4]/div[2]/div[2]/div[2]/table/tbody")
        # tableSizeAfter = len(table.text.split("\n"))
        # self.assertTrue(tableSizeBefore > tableSizeAfter)
        # self.assertEqual(driver.current_url, helper.shiftsContainer)

    # test-33
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_addIncentives_ok(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.managerHome.incentivesTab).click()
        driver.implicitly_wait(300)
        self.assertEqual(driver.current_url, helper.incentivesContainer)

        driver.find_element_by_xpath(containers.Incentives.add).click()
        driver.implicitly_wait(300)

        driver.find_element_by_xpath(containers.Incentives.name).send_keys(helper.incentiveName)
        driver.find_element_by_xpath(containers.Incentives.product).send_keys(helper.incentiveProduct)
        driver.find_element_by_xpath(containers.Incentives.quantity).send_keys(helper.incentiveQuantity)
        driver.find_element_by_xpath(containers.Incentives.bonus).send_keys(helper.incentiveBonus)

        driver.find_element_by_xpath(containers.Incentives.addBtn).click()
        driver.implicitly_wait(300)
        sleep(3)
        self.assertEqual(driver.current_url, helper.incentivesContainer)

    # test-34
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_addIncentives_subCategory_ok(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.managerHome.incentivesTab).click()
        driver.implicitly_wait(300)
        self.assertEqual(driver.current_url, helper.incentivesContainer)

        driver.find_element_by_xpath(containers.Incentives.add).click()
        driver.implicitly_wait(300)

        driver.find_element_by_xpath(containers.Incentives.name).send_keys(helper.incentiveName)
        driver.find_element_by_xpath(containers.Incentives.subCategory).send_keys(helper.incentiveSubCategory)
        driver.find_element_by_xpath(containers.Incentives.quantity).send_keys(helper.incentiveQuantity)
        driver.find_element_by_xpath(containers.Incentives.bonus).send_keys(helper.incentiveBonus)

        driver.find_element_by_xpath(containers.Incentives.addBtn).click()
        driver.implicitly_wait(300)
        sleep(3)
        self.assertEqual(driver.current_url, helper.incentivesContainer)

    # test-35
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_addIncentives_noQuantity(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.managerHome.incentivesTab).click()
        driver.implicitly_wait(300)
        self.assertEqual(driver.current_url, helper.incentivesContainer)

        driver.find_element_by_xpath(containers.Incentives.add).click()
        driver.implicitly_wait(300)

        driver.find_element_by_xpath(containers.Incentives.name).send_keys(helper.incentiveName)
        driver.find_element_by_xpath(containers.Incentives.subCategory).send_keys(helper.incentiveSubCategory)
        driver.find_element_by_xpath(containers.Incentives.bonus).send_keys(helper.incentiveBonus)

        driver.find_element_by_xpath(containers.Incentives.addBtn).click()
        driver.implicitly_wait(300)
        sleep(3)
        self.assertNotEqual(driver.current_url, helper.incentivesContainer)

    # test-36
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_addIncentives_noBonus(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.managerHome.incentivesTab).click()
        driver.implicitly_wait(300)
        self.assertEqual(driver.current_url, helper.incentivesContainer)

        driver.find_element_by_xpath(containers.Incentives.add).click()
        driver.implicitly_wait(300)

        driver.find_element_by_xpath(containers.Incentives.name).send_keys(helper.incentiveName)
        driver.find_element_by_xpath(containers.Incentives.subCategory).send_keys(helper.incentiveSubCategory)
        driver.find_element_by_xpath(containers.Incentives.quantity).send_keys(helper.incentiveQuantity)

        driver.find_element_by_xpath(containers.Incentives.addBtn).click()
        driver.implicitly_wait(300)
        sleep(3)
        self.assertNotEqual(driver.current_url, helper.incentivesContainer)

    # test-37
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_editIncentives_ok(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.managerHome.incentivesTab).click()
        driver.implicitly_wait(300)
        self.assertEqual(driver.current_url, helper.incentivesContainer)

        driver.find_element_by_xpath(containers.Incentives.edit).click()
        driver.implicitly_wait(300)
        sleep(3)

        driver.find_element_by_xpath(containers.Incentives.quantity).clear()
        driver.find_element_by_xpath(containers.Incentives.quantity).send_keys(helper.incentiveQuantity)

        driver.find_element_by_xpath(containers.Incentives.addBtn).click()
        driver.implicitly_wait(300)
        sleep(3)
        self.assertEqual(driver.current_url, helper.incentivesContainer)

    # test-38
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_deleteIncentives_ok(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.managerHome.incentivesTab).click()
        driver.implicitly_wait(300)
        self.assertEqual(driver.current_url, helper.incentivesContainer)

        # driver.find_element_by_xpath(containers.Incentives.delete).click()
        #  driver.implicitly_wait(300)
        #  sleep(1)
        #  driver.find_element_by_xpath("//*[@id=\"app\"]/div/div[4]/div[2]/div/div/div[2]/button").click()
        #  sleep(1)

        self.assertEqual(driver.current_url, helper.incentivesContainer)

    #test-39
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_setup_ok(self):
        self.assertTrue(True)

    def tearDown(self):
        self.driver.close()

    def addCurrShift(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.shifts.add).click()
        driver.implicitly_wait(300)

        driver.find_element_by_xpath(containers.shifts.store).send_keys(helper.shiftStore)
        driver.find_element_by_xpath(containers.shifts.username).send_keys(helper.shiftUser)
        driver.find_element_by_xpath(containers.shifts.type).send_keys(helper.shiftType)
        driver.find_element_by_xpath(containers.shifts.startTime).send_keys(helper.shiftStartTime)
        driver.find_element_by_xpath(containers.shifts.endTime).send_keys(helper.shiftEndTime)

        driver.find_element_by_xpath(containers.shifts.addBtn).click()
        driver.implicitly_wait(300)
        sleep(3)
        return

    def createShift(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.managerHome.ShiftsTab).click()
        driver.implicitly_wait(300)

        driver.find_element_by_xpath(containers.managerHome.CreateShiftTab).click()
        driver.implicitly_wait(300)
        self.assertEqual(driver.current_url, helper.createShiftContainer)
        driver.find_element_by_xpath(containers.shifts.add).click()
        driver.implicitly_wait(300)

        driver.find_element_by_xpath(containers.shifts.store).send_keys(helper.shiftStore)
        driver.find_element_by_xpath(containers.shifts.username).send_keys(helper.shiftUser)
        driver.find_element_by_xpath(containers.shifts.type).send_keys(helper.shiftType)
        driver.find_element_by_xpath(containers.shifts.startTime).send_keys(helper.shiftStartTime)
        driver.find_element_by_xpath(containers.shifts.endTime).send_keys(helper.shiftEndTime)

        driver.find_element_by_xpath(containers.shifts.addBtn).click()
        driver.implicitly_wait(300)
        sleep(3)
        self.assertEqual(driver.current_url, helper.createShiftContainer)
        return

    def publishShift(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.shifts.publish).click()
        sleep(3)
        self.assertEqual(driver.current_url, helper.createMultipleShifts)
        driver.find_element_by_xpath(containers.shifts.publishBtn).click()
        sleep(3)
        self.assertEqual(driver.current_url, helper.createShiftContainer)
        return
