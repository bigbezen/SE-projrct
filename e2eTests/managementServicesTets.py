import unittest
from selenium import webdriver

import helper
import containers.login
import containers.managerHome
from time import sleep

class ManagementServices(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.get(helper.url)
        driver = self.driver
        driver.find_element_by_xpath(containers.login.username).send_keys(helper.adminUsername)
        driver.find_element_by_xpath(containers.login.password).send_keys(helper.adminPass)
        driver.find_element_by_xpath(containers.login.loginBtn).click()
        driver.implicitly_wait(200)
        self.assertEqual(driver.current_url, helper.manager_home)

    def test_addUser_Ok(self):
        self.assertEqual('true', 'false')

    def test_addUser_badUsername(self):
        self.assertEqual('true', 'false')

    def test_addUser_badId(self):
        self.assertEqual('true', 'false')

    def test_addUser_badEmail(self):
        self.assertEqual('true', 'false')

    def test_editUser_Ok(self):
        self.assertEqual('true', 'false')

    def test_editUser_badUsername(self):
        self.assertEqual('true', 'false')

    def test_editUser_badId(self):
        self.assertEqual('true', 'false')

    def test_editUser_badEmail(self):
        self.assertEqual('true', 'false')

    def test_deleteUser_ok(self):
        self.assertEqual('true', 'false')

    def test_addStore_Ok(self):
        self.assertEqual('true', 'false')

    def test_addStore_badName(self):
        self.assertEqual('true', 'false')

    def test_editStore_Ok(self):
        self.assertEqual('true', 'false')

    def test_editStore_badName(self):
        self.assertEqual('true', 'false')

    def test_deleteStore_Ok(self):
        self.assertEqual('true', 'false')

    def test_addProduct_ok(self):
        self.assertEqual('true', 'false')

    def test_addProduct_badName(self):
        self.assertEqual('true', 'false')

    def test_editProduct_ok(self):
        self.assertEqual('true', 'false')

    def test_editProduct_badName(self):
        self.assertEqual('true', 'false')

    def test_deleteProduct_ok(self):
        self.assertEqual('true', 'false')

    def test_addShift_ok(self):
        self.assertEqual('true', 'false')

    def test_editShift_ok(self):
        self.assertEqual('true', 'false')

    def test_deleteShift_ok(self):
        self.assertEqual('true', 'false')

    def tearDown(self):
        self.driver.close()