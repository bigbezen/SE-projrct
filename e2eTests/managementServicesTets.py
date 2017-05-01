import dbConnector
import unittest
from selenium import webdriver
import helper
import containers.login
import containers.managerHome
from time import sleep


class ManagementServices(unittest.TestCase):
    def setUp(self):
        dbConnector.deleteDb()
        dbConnector.initDb()
        self.driver = webdriver.Chrome()
        self.driver.get(helper.url)
        driver = self.driver
        driver.find_element_by_xpath(containers.login.username).send_keys(helper.adminUsername)
        driver.find_element_by_xpath(containers.login.password).send_keys(helper.adminPass)
        driver.find_element_by_xpath(containers.login.loginBtn).click()
        driver.implicitly_wait(200)
        self.assertEqual(driver.current_url, helper.manager_home)

    def test_addUser_Ok(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.managerHome.usersTab).click()
        driver.implicitly_wait(200)
        self.assertEqual(driver.current_url, helper.usersContainer)

    def test_addUser_badUsername(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.managerHome.usersTab).click()
        driver.implicitly_wait(200)
        self.assertEqual(driver.current_url, helper.usersContainer)

    def test_addUser_badId(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.managerHome.usersTab).click()
        driver.implicitly_wait(200)
        self.assertEqual(driver.current_url, helper.usersContainer)

    def test_addUser_badEmail(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.managerHome.usersTab).click()
        driver.implicitly_wait(200)
        self.assertEqual(driver.current_url, helper.usersContainer)

    def test_editUser_Ok(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.managerHome.usersTab).click()
        driver.implicitly_wait(200)
        self.assertEqual(driver.current_url, helper.usersContainer)

    def test_editUser_badUsername(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.managerHome.usersTab).click()
        driver.implicitly_wait(200)
        self.assertEqual(driver.current_url, helper.usersContainer)


    def test_editUser_badId(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.managerHome.usersTab).click()
        driver.implicitly_wait(200)
        self.assertEqual(driver.current_url, helper.usersContainer)

    def test_editUser_badEmail(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.managerHome.usersTab).click()
        driver.implicitly_wait(200)
        self.assertEqual(driver.current_url, helper.usersContainer)

    def test_deleteUser_ok(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.managerHome.usersTab).click()
        driver.implicitly_wait(200)
        self.assertEqual(driver.current_url, helper.usersContainer)

    def test_addStore_Ok(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.managerHome.storesTab).click()
        driver.implicitly_wait(200)
        self.assertEqual(driver.current_url, helper.storesContainer)

    def test_addStore_badName(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.managerHome.storesTab).click()
        driver.implicitly_wait(200)
        self.assertEqual(driver.current_url, helper.storesContainer)

    def test_editStore_Ok(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.managerHome.storesTab).click()
        driver.implicitly_wait(200)
        self.assertEqual(driver.current_url, helper.storesContainer)

    def test_editStore_badName(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.managerHome.storesTab).click()
        driver.implicitly_wait(200)
        self.assertEqual(driver.current_url, helper.storesContainer)

    def test_deleteStore_Ok(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.managerHome.storesTab).click()
        driver.implicitly_wait(200)
        self.assertEqual(driver.current_url, helper.storesContainer)

    def test_addProduct_ok(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.managerHome.productsTab).click()
        driver.implicitly_wait(200)
        self.assertEqual(driver.current_url, helper.productsContainer)

    def test_addProduct_badName(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.managerHome.productsTab).click()
        driver.implicitly_wait(200)
        self.assertEqual(driver.current_url, helper.productsContainer)

    def test_editProduct_ok(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.managerHome.productsTab).click()
        driver.implicitly_wait(200)
        self.assertEqual(driver.current_url, helper.productsContainer)

    def test_editProduct_badName(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.managerHome.productsTab).click()
        driver.implicitly_wait(200)
        self.assertEqual(driver.current_url, helper.productsContainer)

    def test_deleteProduct_ok(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.managerHome.productsTab).click()
        driver.implicitly_wait(200)
        self.assertEqual(driver.current_url, helper.productsContainer)

    def test_addShift_ok(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.managerHome.ShiftsTab).click()
        driver.implicitly_wait(200)
        self.assertEqual(driver.current_url, helper.shiftsContainer)

    def test_editShift_ok(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.managerHome.ShiftsTab).click()
        driver.implicitly_wait(200)
        self.assertEqual(driver.current_url, helper.shiftsContainer)

    def test_deleteShift_ok(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.managerHome.ShiftsTab).click()
        driver.implicitly_wait(200)
        self.assertEqual(driver.current_url, helper.shiftsContainer)

    def test_addIncentives_ok(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.managerHome.incentivesTab).click()
        driver.implicitly_wait(200)
        self.assertEqual(driver.current_url, helper.incentivesContainer)

    def test_editIncentives_ok(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.managerHome.incentivesTab).click()
        driver.implicitly_wait(200)
        self.assertEqual(driver.current_url, helper.incentivesContainer)

    def test_deleteIncentives_ok(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.managerHome.incentivesTab).click()
        driver.implicitly_wait(200)
        self.assertEqual(driver.current_url, helper.incentivesContainer)

    def tearDown(self):
        self.driver.close()