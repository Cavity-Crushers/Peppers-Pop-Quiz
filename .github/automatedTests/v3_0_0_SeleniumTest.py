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
    driver.get("http://localhost:2357/simple.html")
    assert "4250 Honors Project" in driver.title

    shiftViewButton = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.ID, "shift-view-button"))
    )
    shiftViewButton.click()

    shiftViewToggle = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "GameZone"))
    )
    size = shiftViewToggle
    width = size['width']
    print(f"Rendered GameSize: width={width}px")
    assert shiftViewToggle == "800px"

finally:
    driver.quit()