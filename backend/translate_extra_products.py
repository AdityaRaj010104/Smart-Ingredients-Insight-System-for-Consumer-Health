# from deep_translator import GoogleTranslator
# import sqlite3

# # connect DB
# conn = sqlite3.connect("database/nutritionDB.db")
# cursor = conn.cursor()

# # get all products
# cursor.execute("SELECT rowid, PRODUCT_NAME FROM extra_products")
# products = cursor.fetchall()

# translator = GoogleTranslator(source='en', target='hi')

# for product in products:
#     rowid, name = product

#     try:
#         translated = translator.translate(name)

#         cursor.execute(
#             "UPDATE extra_products SET PRODUCT_NAME_HI = ? WHERE rowid = ?",
#             (translated, rowid)
#         )

#         print(f"{name} → {translated}")

#     except Exception as e:
#         print(f"Error for {name}: {e}")

# conn.commit()
# conn.close()

from deep_translator import GoogleTranslator
import sqlite3
import time

conn = sqlite3.connect("database/nutritionDB.db")
cursor = conn.cursor()

translator = GoogleTranslator(source='en', target='hi')

cursor.execute("""
SELECT rowid, WWEIA_CATEGORY_DESCRIPTION 
FROM extra_products
WHERE WWEIA_CATEGORY_DESCRIPTION_HI IS NULL
""")

rows = cursor.fetchall()

for row in rows:
    id = row[0]
    desc = row[1]

    if not desc:
        continue

    try:
        translated = translator.translate(desc)

        cursor.execute("""
            UPDATE extra_products
            SET WWEIA_CATEGORY_DESCRIPTION_HI = ?
            WHERE rowid = ?
        """, (translated, id))

        print(desc, "→", translated)

        time.sleep(0.5)

    except Exception as e:
        print("Error:", desc)

conn.commit()
conn.close()