from deep_translator import GoogleTranslator
import sqlite3
import time

conn = sqlite3.connect("database/nutritionDB.db")
cursor = conn.cursor()

BATCH_SIZE = 50

# ✅ cache to avoid repeated API calls
cache = {}

translator = GoogleTranslator(source='en', target='hi')

while True:
    # ✅ ONLY fetch untranslated rows (IMPORTANT)
    cursor.execute(f"""
        SELECT id, MAIN_FOOD_DESCRIPTION 
        FROM nutri_data
        WHERE MAIN_FOOD_DESC_FULL_HI IS NULL
        AND MAIN_FOOD_DESCRIPTION IS NOT NULL
        LIMIT {BATCH_SIZE}
    """)

    rows = cursor.fetchall()

    if not rows:
        print("✅ All data translated!")
        break

    for row in rows:
        id, full_name = row

        if not full_name:
            continue

        # 🔥 split by comma for better translation
        parts = full_name.split(",")

        translated_parts = []

        for part in parts:
            part = part.strip()

            # ✅ use cache
            if part in cache:
                translated_parts.append(cache[part])
                continue

            # 🔁 retry logic
            for attempt in range(3):
                try:
                    translated_part = translator.translate(part)
                    cache[part] = translated_part
                    translated_parts.append(translated_part)

                    print(part, "→", translated_part)

                    time.sleep(0.5)  # faster but safe
                    break

                except Exception as e:
                    print(f"❌ Retry {attempt+1} failed:", part, "|", e)
                    time.sleep(2)

            else:
                # fallback
                cache[part] = part
                translated_parts.append(part)

        # ✅ join translated parts
        translated_full = ", ".join(translated_parts)

        # ✅ update ONLY this row
        cursor.execute("""
            UPDATE nutri_data
            SET MAIN_FOOD_DESC_FULL_HI = ?
            WHERE id = ?
        """, (translated_full, id))

        print(full_name, "→", translated_full)

    conn.commit()  # ✅ save batch
    print("✅ Batch completed\n")

conn.close()