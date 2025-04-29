from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
import time

chrome_options = Options()
chrome_options.add_argument("--headless")
chrome_options.add_argument("--window-size=1920,1080")
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")
chrome_options.add_argument("--disable-gpu")
chrome_options.add_argument("--force-device-scale-factor=1")
chrome_options.add_argument('--ignore-certificate-errors-spki-list')
chrome_options.add_argument('--ignore-ssl-errors')

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)


try:
    # 1) Navigates to the localhosted server
    print("1) Opening Website")
    driver.get("http://localhost:8000/index.html")
    
    # 2) This tests the toggle screens size & "Start" button on index.html
    print("2) Tests the Start button on index.html")

    button = WebDriverWait(driver, 20).until(
        EC.element_to_be_clickable((By.ID, "shift-view-button"))
    )
    button.click()

    game_zone = driver.find_element(By.ID, "GameZone")
    width = game_zone.value_of_css_property("width")

    time.sleep(1)

    assert width == "800px", f"Expected GameZone to be 800px, but got {width}"
    print(f"Width shifted to 800px")

    button.click()

    game_zone = driver.find_element(By.ID, "GameZone")
    width = game_zone.value_of_css_property("width")

    time.sleep(1)

    assert width == "400px", f"Expected GameZone to be 400px, but got {width}"
    print(f"Width shifted to 400px")

    button.click()

    button = WebDriverWait(driver, 20).until(
        EC.element_to_be_clickable((By.CLASS_NAME, "index-button"))
    )
    button.click()
    game_view = WebDriverWait(driver, 20).until(
        EC.presence_of_element_located((By.ID, "selectionWarn"))
    )
    page_title = driver.title
    print(f"Current Page: {page_title}")
    assert page_title == "Pepper's Pop Quiz - Categories", f"Expected title to be 'Pepper's Pop Quiz - Categories', but got {page_title}"

    # 3) This tests Category selection & "Continue" button on categories.html
    print("3) This tests Category selection & Continue button on categories.html")
    
    WebDriverWait(driver, 10).until(
    lambda d: len(Select(d.find_element(By.ID, "selectCategory")).options) > 1
    )
    
    dropdown = Select(driver.find_element(By.ID, "selectCategory"))
    dropdown.select_by_index(3)
    
    button = WebDriverWait(driver, 20).until(
        EC.element_to_be_clickable((By.ID, "category-continue-button"))
    )
    button.click()

    page_title = driver.title
    print(f"Current Page: {page_title}")
    assert page_title == "Pepper's Pop Quiz - Game", f"Expected title to be 'Pepper's Pop Quiz - Game', but got {page_title}"

    # 4) This tests game.html pressing the incorrect answer, check decrease lives
    print("4) This tests game.html pressing the incorrect answer, check decrease lives")

    time.sleep(1)
    question = driver.find_element(By.ID, "questionText").text
    print(f"Current Question: {question}")

    answers = driver.find_elements(By.CLASS_NAME, "answer-button")

    print("Possible Answers:")
    for answer in answers:
        print(f"- {answer.text}")

    correct_answer = driver.execute_script("return localStorage.getItem('correctAnswerCheck');")

    print(f"Correct Answer: {correct_answer}")

    for answer in answers:
        if answer.text != correct_answer:
            answer.click()
            break

    time.sleep(1)
    lives = driver.execute_script("return localStorage.getItem('lives');")

    page_title = driver.title
    print(f"Current Page: {page_title}")
    assert page_title == "Pepper's Pop Quiz - Results", f"Expected title to be 'Pepper's Pop Quiz - Results', but got {page_title}"

    print(f"Lives remaining: {lives}")
    assert lives == "2", f"Expected title to be '2', but got {lives}"

    # 5) This tests "Continue" button on results.html
    print("5) This tests Continue button on results.html")

    button = WebDriverWait(driver, 20).until(
        EC.element_to_be_clickable((By.ID, "results-continue-button"))
    )
    button.click()
   
    page_title = driver.title
    print(f"Current Page: {page_title}")
    assert page_title == "Pepper's Pop Quiz - Game", f"Expected title to be 'Pepper's Pop Quiz - Game', but got {page_title}"

    # 6) This tests game.html pressing the correct answer until win.html, check increase lives
    print("6) This tests game.html pressing the correct answer until win.html, check increase lives")

    while True:
        time.sleep(1)
        question = driver.find_element(By.ID, "questionText").text
        print(f"Current Question: {question}")

        answers = driver.find_elements(By.CLASS_NAME, "answer-button")

        print("Possible Answers:")
        for answer in answers:
            print(f"- {answer.text}")

        correct_answer = driver.execute_script("return localStorage.getItem('correctAnswerCheck');")

        print(f"Correct Answer: {correct_answer}")

        for answer in answers:
            if answer.text == correct_answer:
                answer.click()
                break

        time.sleep(1)

        lives = driver.execute_script("return localStorage.getItem('lives');")
        print(f"Lives remaining: {lives}")

        page_title = driver.title
        print(f"Current Page: {page_title}")

        if page_title == "Pepper's Pop Quiz - Results":
            shift_button = WebDriverWait(driver, 20).until(
                EC.element_to_be_clickable((By.ID, "results-continue-button"))
            )
            shift_button.click()
            page_title = driver.title
            print(f"Current Page: {page_title}")
        else:
            assert page_title == "Pepper's Pop Quiz - You Win", f"Expected title to be 'Pepper's Pop Quiz - You Win', but got {page_title}"
            assert int(lives) > 2, f"Expected lives to be greater than 2, but got {lives}"
            break

    # 7) This tests the "Play Again" button on win.html
    print("7) This tests the Play Again button on win.html")

    shift_button = WebDriverWait(driver, 20).until(
        EC.element_to_be_clickable((By.ID, "win-play-again-button"))
    )
    shift_button.click()

    page_title = driver.title
    print(f"Current Page: {page_title}")
    assert page_title == "Pepper's Pop Quiz - Categories", f"Expected title to be 'Pepper's Pop Quiz - Categories', but got {page_title}"

    # 8) This tests game.html pressing the incorrect answer until gameOver.html, ensure local storage is wipped
    print("8) This tests game.html pressing the incorrect answer until gameOver.html, ensure local storage is wipped")

    WebDriverWait(driver, 10).until(
    lambda d: len(Select(d.find_element(By.ID, "selectCategory")).options) > 1
    )
    
    dropdown = Select(driver.find_element(By.ID, "selectCategory"))
    dropdown.select_by_index(3)
    
    button = WebDriverWait(driver, 20).until(
        EC.element_to_be_clickable((By.ID, "category-continue-button"))
    )
    button.click()

    page_title = driver.title
    print(f"Current Page: {page_title}")
    assert page_title == "Pepper's Pop Quiz - Game", f"Expected title to be 'Pepper's Pop Quiz - Game', but got {page_title}"
    
    while True:
        time.sleep(1)
        question = driver.find_element(By.ID, "questionText").text
        print(f"Current Question: {question}")

        answers = driver.find_elements(By.CLASS_NAME, "answer-button")

        print("Possible Answers:")
        for answer in answers:
            print(f"- {answer.text}")

        correct_answer = driver.execute_script("return localStorage.getItem('correctAnswerCheck');")

        print(f"Correct Answer: {correct_answer}")

        for answer in answers:
            if answer.text != correct_answer:
                answer.click()
                break

        time.sleep(2)

        lives = driver.execute_script("return localStorage.getItem('lives');")
        print(f"Lives remaining: {lives}")

        page_title = driver.title
        print(f"Current Page: {page_title}")

        if page_title == "Pepper's Pop Quiz - Results":
            shift_button = WebDriverWait(driver, 20).until(
                EC.element_to_be_clickable((By.ID, "results-continue-button"))
            )
            shift_button.click()
            page_title = driver.title
            #print(f"Current Page: {page_title}")
        else:
            assert page_title == "Pepper's Pop Quiz - Game Over", f"Expected title to be 'Pepper's Pop Quiz - Game Over', but got {page_title}"
            break

    # 9) This tests the "Play Again" button on gameOver.html
    print("9) This tests the Play Again button on gameOver.html")

    button = WebDriverWait(driver, 20).until(
        EC.element_to_be_clickable((By.ID, "game-over-play-again-button"))
    )
    button.click()

    time.sleep(2)

    page_title = driver.title
    print(f"Current Page: {page_title}")
    assert page_title == "Pepper's Pop Quiz - Categories", f"Expected title to be 'Pepper's Pop Quiz - Categories', but got {page_title}"

    # 10) Repeat 6 but test the "Quit" button on win.html, ensure local storage is wipped
    print("10) Repeat 6 but test the button on win.html")

    WebDriverWait(driver, 10).until(
    lambda d: len(Select(d.find_element(By.ID, "selectCategory")).options) > 1
    )
    
    dropdown = Select(driver.find_element(By.ID, "selectCategory"))
    dropdown.select_by_index(3)
    
    button = WebDriverWait(driver, 20).until(
        EC.element_to_be_clickable((By.ID, "category-continue-button"))
    )
    button.click()

    page_title = driver.title
    print(f"Current Page: {page_title}")
    assert page_title == "Pepper's Pop Quiz - Game", f"Expected title to be 'Pepper's Pop Quiz - Game', but got {page_title}"

    while True:
        time.sleep(1)
        question = driver.find_element(By.ID, "questionText").text
        print(f"Current Question: {question}")

        answers = driver.find_elements(By.CLASS_NAME, "answer-button")

        print("Possible Answers:")
        for answer in answers:
            print(f"- {answer.text}")

        correct_answer = driver.execute_script("return localStorage.getItem('correctAnswerCheck');")

        print(f"Correct Answer: {correct_answer}")

        for answer in answers:
            if answer.text == correct_answer:
                answer.click()
                break

        time.sleep(1)

        lives = driver.execute_script("return localStorage.getItem('lives');")
        print(f"Lives remaining: {lives}")

        page_title = driver.title
        print(f"Current Page: {page_title}")

        if page_title == "Pepper's Pop Quiz - Results":
            shift_button = WebDriverWait(driver, 20).until(
                EC.element_to_be_clickable((By.ID, "results-continue-button"))
            )
            shift_button.click()
            page_title = driver.title
            print(f"Current Page: {page_title}")
        else:
            assert page_title == "Pepper's Pop Quiz - You Win", f"Expected title to be 'Pepper's Pop Quiz - You Win', but got {page_title}"
            assert int(lives) > 2, f"Expected lives to be greater than 2, but got {lives}"
            break

    button = WebDriverWait(driver, 20).until(
        EC.element_to_be_clickable((By.ID, "win-quit-button"))
    )
    button.click()

    page_title = driver.title
    print(f"Current Page: {page_title}")
    assert page_title == "Pepper's Pop Quiz", f"Expected title to be 'Pepper's Pop Quiz', but got {page_title}"
    
    # 11) Navigates from index.html to game.html, repeats 8 but tests the "Quit" button on gameOver.html
    print("11) Navigates from index.html to game.html, repeats 8 but tests the Quit button on gameOver.html")
    
    button = WebDriverWait(driver, 20).until(
        EC.element_to_be_clickable((By.CLASS_NAME, "index-button"))
    )
    button.click()
    game_view = WebDriverWait(driver, 20).until(
        EC.presence_of_element_located((By.ID, "selectionWarn"))
    )
    page_title = driver.title
    print(f"Current Page: {page_title}")
    assert page_title == "Pepper's Pop Quiz - Categories", f"Expected title to be 'Pepper's Pop Quiz - Categories', but got {page_title}"

    
    WebDriverWait(driver, 10).until(
    lambda d: len(Select(d.find_element(By.ID, "selectCategory")).options) > 1
    )
    
    dropdown = Select(driver.find_element(By.ID, "selectCategory"))
    dropdown.select_by_index(3)
    
    button = WebDriverWait(driver, 20).until(
        EC.element_to_be_clickable((By.ID, "category-continue-button"))
    )
    button.click()

    page_title = driver.title
    print(f"Current Page: {page_title}")
    assert page_title == "Pepper's Pop Quiz - Game", f"Expected title to be 'Pepper's Pop Quiz - Game', but got {page_title}"

    while True:
        time.sleep(1)
        question = driver.find_element(By.ID, "questionText").text
        print(f"Current Question: {question}")

        answers = driver.find_elements(By.CLASS_NAME, "answer-button")

        print("Possible Answers:")
        for answer in answers:
            print(f"- {answer.text}")

        correct_answer = driver.execute_script("return localStorage.getItem('correctAnswerCheck');")

        print(f"Correct Answer: {correct_answer}")

        for answer in answers:
            if answer.text != correct_answer:
                answer.click()
                break

        time.sleep(1)

        lives = driver.execute_script("return localStorage.getItem('lives');")
        print(f"Lives remaining: {lives}")

        page_title = driver.title
        print(f"Current Page: {page_title}")

        if page_title == "Pepper's Pop Quiz - Results":
            shift_button = WebDriverWait(driver, 20).until(
                EC.element_to_be_clickable((By.ID, "results-continue-button"))
            )
            shift_button.click()
            page_title = driver.title
            print(f"Current Page: {page_title}")
        else:
            assert page_title == "Pepper's Pop Quiz - Game Over", f"Expected title to be 'Pepper's Pop Quiz - Game Over', but got {page_title}"
            break

    button = WebDriverWait(driver, 20).until(
        EC.element_to_be_clickable((By.ID, "game-over-quit-button"))
    )
    button.click()

    page_title = driver.title
    print(f"Current Page: {page_title}")
    assert page_title == "Pepper's Pop Quiz", f"Expected title to be 'Pepper's Pop Quiz', but got {page_title}"
    
    # 12) Navigates from index.html to game.html, repeats 4 but tests the "Quit" button on results.html
    print("12) Navigates from index.html to game.html, repeats 4 but tests the Quit button on results.html")

    button = WebDriverWait(driver, 20).until(
        EC.element_to_be_clickable((By.CLASS_NAME, "index-button"))
    )
    button.click()
    game_view = WebDriverWait(driver, 20).until(
        EC.presence_of_element_located((By.ID, "selectionWarn"))
    )
    page_title = driver.title
    print(f"Current Page: {page_title}")
    assert page_title == "Pepper's Pop Quiz - Categories", f"Expected title to be 'Pepper's Pop Quiz - Categories', but got {page_title}"

    WebDriverWait(driver, 10).until(
    lambda d: len(Select(d.find_element(By.ID, "selectCategory")).options) > 1
    )
    
    dropdown = Select(driver.find_element(By.ID, "selectCategory"))
    dropdown.select_by_index(3)
    
    button = WebDriverWait(driver, 20).until(
        EC.element_to_be_clickable((By.ID, "category-continue-button"))
    )
    button.click()

    page_title = driver.title
    print(f"Current Page: {page_title}")
    assert page_title == "Pepper's Pop Quiz - Game", f"Expected title to be 'Pepper's Pop Quiz - Game', but got {page_title}"

    time.sleep(1)
    question = driver.find_element(By.ID, "questionText").text
    print(f"Current Question: {question}")

    answers = driver.find_elements(By.CLASS_NAME, "answer-button")

    print("Possible Answers:")
    for answer in answers:
        print(f"- {answer.text}")

    correct_answer = driver.execute_script("return localStorage.getItem('correctAnswerCheck');")

    print(f"Correct Answer: {correct_answer}")

    for answer in answers:
        if answer.text != correct_answer:
            answer.click()
            break

    time.sleep(1)
    lives = driver.execute_script("return localStorage.getItem('lives');")

    page_title = driver.title
    print(f"Current Page: {page_title}")
    assert page_title == "Pepper's Pop Quiz - Results", f"Expected title to be 'Pepper's Pop Quiz - Results', but got {page_title}"

    print(f"Lives remaining: {lives}")
    assert lives == "2", f"Expected title to be '2', but got {lives}"

    button = WebDriverWait(driver, 20).until(
        EC.element_to_be_clickable((By.ID, "results-quit-button"))
    )
    button.click()

    page_title = driver.title
    print(f"Current Page: {page_title}")
    assert page_title == "Pepper's Pop Quiz", f"Expected title to be 'Pepper's Pop Quiz', but got {page_title}"
    
    # 13) Repeat 2 but test not putting in a category in the category page
    print("13) Repeat 2 but test not putting in a category in the category page")

    button = WebDriverWait(driver, 20).until(
        EC.element_to_be_clickable((By.CLASS_NAME, "index-button"))
    )
    button.click()
    game_view = WebDriverWait(driver, 20).until(
        EC.presence_of_element_located((By.ID, "selectionWarn"))
    )
    page_title = driver.title
    print(f"Current Page: {page_title}")
    assert page_title == "Pepper's Pop Quiz - Categories", f"Expected title to be 'Pepper's Pop Quiz - Categories', but got {page_title}"

    WebDriverWait(driver, 10).until(
    lambda d: len(Select(d.find_element(By.ID, "selectCategory")).options) > 1
    )
    
    button = WebDriverWait(driver, 20).until(
        EC.element_to_be_clickable((By.ID, "category-continue-button"))
    )
    button.click()

    selection_warn = WebDriverWait(driver, 10).until(
    EC.visibility_of_element_located((By.ID, "selectionWarn"))
)
    assert selection_warn.is_displayed(), "Expected warning message to be displayed when no category is selected."
    print("Warning message successfully displayed when no category is selected")

    # 14) Test the "Quit" button on categories.html 
    print("14) Test the Quit button on categories.html")

    button = WebDriverWait(driver, 20).until(
        EC.element_to_be_clickable((By.ID, "categories-quit-button"))
    )
    button.click()

    page_title = driver.title
    print(f"Current Page: {page_title}")
    assert page_title == "Pepper's Pop Quiz", f"Expected title to be 'Pepper's Pop Quiz', but got {page_title}"
    
    # 15) Navigates from index.html to game.html, tests the timer by waiting it out
    print("15) Navigates from index.html to game.html, tests the timer by waiting it out")

    button = WebDriverWait(driver, 20).until(
        EC.element_to_be_clickable((By.CLASS_NAME, "index-button"))
    )
    button.click()
    game_view = WebDriverWait(driver, 20).until(
        EC.presence_of_element_located((By.ID, "selectionWarn"))
    )
    page_title = driver.title
    print(f"Current Page: {page_title}")
    assert page_title == "Pepper's Pop Quiz - Categories", f"Expected title to be 'Pepper's Pop Quiz - Categories', but got {page_title}"
    
    WebDriverWait(driver, 10).until(
    lambda d: len(Select(d.find_element(By.ID, "selectCategory")).options) > 1
    )
    
    dropdown = Select(driver.find_element(By.ID, "selectCategory"))
    dropdown.select_by_index(3)
    
    button = WebDriverWait(driver, 20).until(
        EC.element_to_be_clickable((By.ID, "category-continue-button"))
    )
    button.click()

    page_title = driver.title
    print(f"Current Page: {page_title}")
    assert page_title == "Pepper's Pop Quiz - Game", f"Expected title to be 'Pepper's Pop Quiz - Game', but got {page_title}"

    time.sleep(35)

    page_title = driver.title
    print(f"Current Page: {page_title}")
    assert page_title == "Pepper's Pop Quiz - Results", f"Expected title to be 'Pepper's Pop Quiz - Results', but got {page_title}"

    # 16) This tests the Pause Menu entirely
    print("16) This tests the Pause Menu entirely")

    shift_button = WebDriverWait(driver, 20).until(
        EC.element_to_be_clickable((By.ID, "results-continue-button"))
    )
    shift_button.click()
    page_title = driver.title
    print(f"Current Page: {page_title}")
    assert page_title == "Pepper's Pop Quiz - Game", f"Expected title to be 'Pepper's Pop Quiz - Game', but got {page_title}"

    shift_button = WebDriverWait(driver, 20).until(
        EC.element_to_be_clickable((By.ID, "pauseBtn"))
    )
    shift_button.click()

    timer_before = driver.find_element(By.ID, "timer").text
    print(f"Timer before pausing: {timer_before}")

    pause_menu = WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.ID, "pauseMenu"))
    )

    assert pause_menu.is_displayed(), "Expected pause menu to be visible."
    print("Pause menu dispayed")
    time.sleep(1)

    timer_after = driver.find_element(By.ID, "timer").text
    print(f"Timer after pausing: {timer_after}")

    assert timer_before == timer_after, "Expected timer to freeze when pause menu is shown."

    game_zone = driver.find_element(By.ID, "GameZone")
    width = game_zone.value_of_css_property("width")

    assert width == "800px", f"Expected GameZone to be 800px, but got {width}"
    print(f"Width still 800px")

finally:
    driver.quit()
