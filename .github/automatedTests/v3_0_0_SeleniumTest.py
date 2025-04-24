from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

chrome_options = Options()
chrome_options.add_argument("--headless")
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

try:
    driver.get("http://localhost:3000/simple.html")
    assert "4250 Honors Project" in driver.title

    s1Button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.ID, "s1"))
    )
    s1Button.click()

    stateChange1 = driver.find_element(By.TAG_NAME, "body").value_of_css_property("background-color")
    print(f"Background color after clicking #s1: {stateChange1}")
    assert stateChange1 == "rgba(144, 238, 144, 1)" 

    s2Button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.ID, "s2"))
    )
    s2Button.click()

    stateChange2 = driver.find_element(By.TAG_NAME, "body").value_of_css_property("color")
    print(f"Font color after clicking #s2: {stateChange2}")
    assert stateChange2 == "rgba(255, 0, 0, 1)"

finally:
    driver.quit()