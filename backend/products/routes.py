from flask import Blueprint, jsonify, request
from database.connection import get_db_connection

products_bp = Blueprint('products', __name__)

# Hardcoded image URLs
image_map = {
    "Milk": "https://www.usdairy.com/getmedia/8a6aa790-98df-4a2d-af83-c7117392fc2f/100316whatismilk_400.jpg.jpg.aspx",
    "Pudding": "https://tse4.mm.bing.net/th/id/OIP.XqQqJfH-fFYS3wvns8QiiAHaE8?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3",
    "Cheese": "https://static.vecteezy.com/system/resources/previews/028/643/036/non_2x/wooden-board-with-different-kinds-of-delicious-cheese-on-table-photo.jpg",
    "Frankfurter or hot dog": "https://th.bing.com/th/id/OIP.6ATPnpPoTT-Ut92UWaSqbgHaE8?o=7&cb=ucfimg2rm=3&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3",
    "Yogurt": "https://th.bing.com/th/id/OIP._WAKwwiLwNRBUC_uDXxSDQHaHa?o=7&cb=ucfimg2rm=3&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3",
    "Ice cream": "https://thebigmansworld.com/wp-content/uploads/2024/05/strawberry-ice-cream-recipe2.jpg",
    "Cream": "https://th.bing.com/th/id/R.120c2586741830ca8a249b6097c288dc?rik=v5L%2bdL1r%2bDgcWA&riu=http%3a%2f%2fihmnotessite.com%2fwp-content%2fuploads%2f2020%2f05%2fCREAM-1.jpg&ehk=36%2brWBsWVljZjHitExRJ%2fFSn5bg%2fQpMS6fii6QUVbD4%3d&risl=&pid=ImgRaw&r=0"
}
def get_image(name):
    for key, url in image_map.items():
        if key.lower() in name.lower():
            return url
    return "https://example.com/default.jpg"


# Function to get selected products
def get_selected_products(ids, table_name="nutri_data"):
    conn = get_db_connection()
    placeholders = ', '.join('?' for _ in ids)
    query = f"""
        SELECT id,
               { 'MAIN_FOOD_DESCRIPTION' if table_name == 'nutri_data' else 'PRODUCT_NAME' } AS name,
               WWEIA_CATEGORY_DESCRIPTION,
               ENERGY_KCAL, NOVA_GROUP, PROTEIN_G, FIBER_TOTAL_DIETARY_G
        FROM {table_name}
        WHERE id IN ({placeholders})
    """
    rows = conn.execute(query, ids).fetchall()
    conn.close()

    products = []
    for row in rows:
        name = row["name"].split(',')[0].strip() if row["name"] else "Unknown"
        products.append({
            "id": row["id"],
            "name": name,
            
            "category": row["WWEIA_CATEGORY_DESCRIPTION"],
            "nova_group": row["NOVA_GROUP"],
            "calories": row["ENERGY_KCAL"],
            "protein": row["PROTEIN_G"],
            "fiber": row["FIBER_TOTAL_DIETARY_G"],
            "image": get_image(name)
        })
    return products

   


# Route: Get Popular Products

@products_bp.route("/products/popular", methods=["GET"])
def get_popular_products():
    conn = get_db_connection()

    lang = request.args.get("lang", "en")  # 👈 NEW

    query = """
        SELECT PRODUCT_NAME, PRODUCT_NAME_HI, WWEIA_CATEGORY_DESCRIPTION,
               ENERGY_KCAL, PROTEIN_G, FIBER_TOTAL_DIETARY_G, NOVA_GROUP
        FROM extra_products
    """

    rows = conn.execute(query).fetchall()
    conn.close()

    excluded_items = ["Maggi", "Pepsi 1"]

    products = []
    for row in rows:
        name_en = row["PRODUCT_NAME"].split(',')[0].strip()
        name_hi = row["PRODUCT_NAME_HI"]

        # 👇 choose language
        if lang == "hi" and name_hi:
            name = name_hi
        else:
            name = name_en

        # Skip excluded names (use EN for check)
        if any(ex.lower() in name_en.lower() for ex in excluded_items):
            continue

        products.append({
            "name": name,  # 👈 translated name
            "name_en": name_en,
            "category": row["WWEIA_CATEGORY_DESCRIPTION"],  # (we'll translate later)
            "nova_group": row["NOVA_GROUP"],
            "calories": row["ENERGY_KCAL"],
            "protein": row["PROTEIN_G"],
            "fiber": row["FIBER_TOTAL_DIETARY_G"],
            "image": get_image(name_en)  # 👈 keep EN for images
        })

    return jsonify(products)

@products_bp.route("/products/extra/<string:product_name>", methods=["GET"])
def get_extra_product_detail(product_name):
    conn = get_db_connection()
    query = """
       SELECT PRODUCT_NAME,
       PRODUCT_NAME_HI,   -- ✅ ADD THIS
       WWEIA_CATEGORY_DESCRIPTION,
       WWEIA_CATEGORY_DESCRIPTION_HI,
       ENERGY_KCAL,
       CARBOHYDRATE_G,
       SUGARS_TOTALG,
       TOTAL_FAT_G,
       PROTEIN_G,
       FIBER_TOTAL_DIETARY_G,
       NOVA_GROUP,
       SALT_MG,
       ZINC_MG,
       TOTAL_VITAMIN_A_MCG,
       VITAMIN_C_MG,
       VITAMIN_D_MCG,
       THIAMIN_MG,
       RIBOFLAVIN_MG,
       VITAMIN_B6_MG,
       VITAMIN_B12_MCG,
       CHOLESTEROL_100G
FROM extra_products
        WHERE PRODUCT_NAME = ?
    """
    row = conn.execute(query, (product_name,)).fetchone()
    conn.close()

    if row is None:
        return jsonify({"error": "Product not found"}), 404
    lang = request.args.get("lang", "en")
    name_en = row["PRODUCT_NAME"].split(',')[0].strip()
    name_hi = row["PRODUCT_NAME_HI"]

    if lang == "hi" and name_hi:
        name = name_hi
    else:
        name = name_en
    lang = request.args.get("lang", "en")

    desc_en = row["WWEIA_CATEGORY_DESCRIPTION"]
    desc_hi = row["WWEIA_CATEGORY_DESCRIPTION_HI"]

    if lang == "hi" and desc_hi:
        desc = desc_hi
    else:
        desc = desc_en
    

    product = {
    "name": name,          # ✅ Hindi or English
    "name_en": name_en,
    "desc": desc,          # ✅ for safety
    "category": row["WWEIA_CATEGORY_DESCRIPTION"],
    "nova_group": row["NOVA_GROUP"],
    "calories": row["ENERGY_KCAL"],
    "carbs": row["CARBOHYDRATE_G"],
    "sugar": row["SUGARS_TOTALG"],
    "fat": row["TOTAL_FAT_G"],
    "protein": row["PROTEIN_G"],
    "fiber": row["FIBER_TOTAL_DIETARY_G"],
    "salt": row["SALT_MG"],
    "vitamin_a": row["TOTAL_VITAMIN_A_MCG"],
    "vitamin_c": row["VITAMIN_C_MG"],
    "vitamin_d": row["VITAMIN_D_MCG"],
    "vitamin_b6": row["VITAMIN_B6_MG"],
    "vitamin_b12": row["VITAMIN_B12_MCG"],
    "zinc": row["ZINC_MG"],
    "cholesterol": row["CHOLESTEROL_100G"],
    "image": get_image(name_en)
}

    return jsonify(product)

   

@products_bp.route("/products/<int:id>", methods=["GET"])
def get_product_detail(id):
    conn = get_db_connection()
    query = """
        SELECT id,
       FOOD_CODE,
       MAIN_FOOD_DESCRIPTION,
       MAIN_FOOD_DESCRIPTION_HI,   -- ✅ ADD THIS
       MAIN_FOOD_DESC_FULL_HI,
       WWEIA_CATEGORY_DESCRIPTION,
       CATEGORY_HI,               -- ✅ ADD THIS
       NOVA_GROUP,
       ENERGY_KCAL,
       PROTEIN_G,
       CARBOHYDRATE_G,
       SUGARS_TOTALG,
       FIBER_TOTAL_DIETARY_G,
       TOTAL_FAT_G,
       WATERG,
       FPRO
FROM nutri_data
        WHERE id = ?
    """
    row = conn.execute(query, (id,)).fetchone()
    conn.close()

    if row is None:
        return jsonify({"error": "Product not found"}), 404

    lang = request.args.get("lang", "en")

    name_en = row["MAIN_FOOD_DESCRIPTION"]
    name_hi = row["MAIN_FOOD_DESCRIPTION_HI"]

    clean_name_en = name_en.split(",")[0].strip() if name_en else "Unknown"

    if lang == "hi" and name_hi:
        name = name_hi
    else:
        name = clean_name_en
    if lang == "hi" and row["CATEGORY_HI"]:
        category = row["CATEGORY_HI"]
    else:
        category = row["WWEIA_CATEGORY_DESCRIPTION"]
    desc_en = row["MAIN_FOOD_DESCRIPTION"]
    desc_hi = row["MAIN_FOOD_DESC_FULL_HI"]

    if lang == "hi" and desc_hi:
        description = desc_hi
    else:
        description = desc_en

    product = {
        "id": row["id"],
        "food_code": row["FOOD_CODE"],
        "name": name,
        "category": category,
        "desc": description,
        "nova_group": row["NOVA_GROUP"],
        "calories": row["ENERGY_KCAL"],
        "protein": row["PROTEIN_G"],
        "carbs": row["CARBOHYDRATE_G"],
        "sugar": row["SUGARS_TOTALG"],
        "fiber": row["FIBER_TOTAL_DIETARY_G"],
        "fat": row["TOTAL_FAT_G"],
        "water": row["WATERG"],
        "fpro": row["FPRO"],
        "image": get_image(name_en)
    }

    return jsonify(product)

@products_bp.route("/products/categories", methods=["GET"])
def get_categories():
    lang = request.args.get("lang", "en")

    conn = get_db_connection()
    rows = conn.execute("""
        SELECT DISTINCT WWEIA_CATEGORY_DESCRIPTION, CATEGORY_HI
        FROM nutri_data
    """).fetchall()
    conn.close()

    categories = []
    seen = set()

    for row in rows:
        full_cat = row["WWEIA_CATEGORY_DESCRIPTION"]
        cat_hi = row["CATEGORY_HI"]

        if not full_cat:
            continue

        main_cat = full_cat.split(",")[0].strip()

        if main_cat in seen:
            continue

        seen.add(main_cat)

        # 👇 language logic
        if lang == "hi" and cat_hi:
            category = cat_hi
        else:
            category = main_cat

        categories.append({
            "name": category,
            "name_en": main_cat   # 👈 VERY IMPORTANT
        })

    return jsonify(categories)

@products_bp.route("/products/category/<path:category_name>", methods=["GET"])
def get_products_by_category(category_name):
    conn = get_db_connection()

    # Match all rows whose WWEIA_CATEGORY_DESCRIPTION starts with the category name
    query = """
        SELECT id, MAIN_FOOD_DESCRIPTION,MAIN_FOOD_DESCRIPTION_HI,MAIN_FOOD_DESC_FULL_HI, WWEIA_CATEGORY_DESCRIPTION,CATEGORY_HI, NOVA_GROUP,
               ENERGY_KCAL, PROTEIN_G, CARBOHYDRATE_G, SUGARS_TOTALG,
               FIBER_TOTAL_DIETARY_G, TOTAL_FAT_G, WATERG
        FROM nutri_data
        WHERE WWEIA_CATEGORY_DESCRIPTION LIKE ? COLLATE NOCASE
    """
    rows = conn.execute(query, (f"{category_name}%",)).fetchall()
    conn.close()
    lang = request.args.get("lang", "en")
    products = []
    for row in rows:
        name_en = row["MAIN_FOOD_DESCRIPTION"]
        name_hi = row["MAIN_FOOD_DESCRIPTION_HI"]

        clean_name_en = name_en.split(",")[0] if name_en else "Unknown"

        if lang == "hi" and name_hi:
            clean_name = name_hi
        else:
            clean_name = clean_name_en
        if lang == "hi" and row["CATEGORY_HI"]:
            category = row["CATEGORY_HI"]
        else:
            category = row["WWEIA_CATEGORY_DESCRIPTION"]
        desc_en = row["MAIN_FOOD_DESCRIPTION"]
        desc_hi = row["MAIN_FOOD_DESC_FULL_HI"]

        if lang == "hi" and desc_hi:
            description = desc_hi
        else:
            description = desc_en
        products.append({
            "id": row["id"],
            "name": clean_name,
            "category": category,
            "desc": description,
            "nova_group": row["NOVA_GROUP"],
            "calories": row["ENERGY_KCAL"],
            "protein": row["PROTEIN_G"],
            # "carbs": row["CARBOHYDRATE_G"],
            # "sugar": row["SUGARS_TOTALG"],
            "fiber": row["FIBER_TOTAL_DIETARY_G"],
            # "fat": row["TOTAL_FAT_G"],
            # "water": row["WATERG"],
            # "image": image_map.get(clean_name, "https://example.com/default.jpg")
        })

    return jsonify(products)
from deep_translator import GoogleTranslator

@products_bp.route("/products/search", methods=["GET"])
def search_products():
    query = request.args.get("q", "").strip()
    lang = request.args.get("lang", "en")   # 👈 ADD THIS

    if not query:
        return jsonify([])

    # 🔥 translate query to English for search
    try:
        translated_query = GoogleTranslator(source='auto', target='en').translate(query)
    except:
        translated_query = query

    conn = get_db_connection()

    sql = """
        SELECT id, MAIN_FOOD_DESCRIPTION, MAIN_FOOD_DESCRIPTION_HI,
               WWEIA_CATEGORY_DESCRIPTION, CATEGORY_HI, MAIN_FOOD_DESC_FULL_HI,
               ENERGY_KCAL, PROTEIN_G, NOVA_GROUP
        FROM nutri_data
        WHERE MAIN_FOOD_DESCRIPTION LIKE ?
           OR MAIN_FOOD_DESCRIPTION_HI LIKE ?
           OR WWEIA_CATEGORY_DESCRIPTION LIKE ?
        LIMIT 20
    """

    rows = conn.execute(
        sql,
        (f"%{translated_query}%", f"%{query}%", f"%{translated_query}%")
    ).fetchall()

    conn.close()

    results = []

    for row in rows:
        name_en = row["MAIN_FOOD_DESCRIPTION"]
        name_hi = row["MAIN_FOOD_DESCRIPTION_HI"]

        clean_en = name_en.split(",")[0].strip() if name_en else "Unknown"

        # ✅ RETURN BASED ON LANGUAGE
        if lang == "hi" and name_hi:
            name = name_hi
        else:
            name = clean_en

        results.append({
            "id": row["id"],
            "name": name,  # 👈 Hindi or English
            "category": row["CATEGORY_HI"] if lang == "hi" else row["WWEIA_CATEGORY_DESCRIPTION"],
            "nova_group": row["NOVA_GROUP"],
            "calories": row["ENERGY_KCAL"],
            "protein": row["PROTEIN_G"],
        })

    return jsonify(results)