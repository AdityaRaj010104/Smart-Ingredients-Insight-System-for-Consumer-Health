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
    query = """
        SELECT PRODUCT_NAME, WWEIA_CATEGORY_DESCRIPTION, ENERGY_KCAL,
               PROTEIN_G, FIBER_TOTAL_DIETARY_G, NOVA_GROUP
        FROM extra_products
    """
    rows = conn.execute(query).fetchall()
    conn.close()

    excluded_items = ["Maggi", "Pepsi 1",]

    products = []
    for row in rows:
        name = row["PRODUCT_NAME"].split(',')[0].strip()

        # Skip excluded names
        if any(ex.lower() in name.lower() for ex in excluded_items):
            continue

        products.append({
            "name": name,
            "category": row["WWEIA_CATEGORY_DESCRIPTION"],
            "nova_group": row["NOVA_GROUP"],
            "calories": row["ENERGY_KCAL"],
            "protein": row["PROTEIN_G"],
            "fiber": row["FIBER_TOTAL_DIETARY_G"],
            "image": get_image(name)
        })

    return jsonify(products)


@products_bp.route("/products/extra/<string:product_name>", methods=["GET"])
def get_extra_product_detail(product_name):
    conn = get_db_connection()
    query = """
        SELECT PRODUCT_NAME, WWEIA_CATEGORY_DESCRIPTION, ENERGY_KCAL, CARBOHYDRATE_G,
               SUGARS_TOTALG, TOTAL_FAT_G, PROTEIN_G, FIBER_TOTAL_DIETARY_G,
               NOVA_GROUP, SALT_MG, ZINC_MG, TOTAL_VITAMIN_A_MCG, VITAMIN_C_MG,
               VITAMIN_D_MCG, THIAMIN_MG, RIBOFLAVIN_MG, VITAMIN_B6_MG,
               VITAMIN_B12_MCG, CHOLESTEROL_100G
        FROM extra_products
        WHERE PRODUCT_NAME = ?
    """
    row = conn.execute(query, (product_name,)).fetchone()
    conn.close()

    if row is None:
        return jsonify({"error": "Product not found"}), 404

    name = row["PRODUCT_NAME"].split(',')[0].strip()

    product = {
        "name": name,
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
        "image": get_image(name)
    }

    return jsonify(product)

   

@products_bp.route("/products/<int:id>", methods=["GET"])
def get_product_detail(id):
    conn = get_db_connection()
    query = """
        SELECT id, FOOD_CODE, MAIN_FOOD_DESCRIPTION, WWEIA_CATEGORY_DESCRIPTION,
               NOVA_GROUP, ENERGY_KCAL, PROTEIN_G, CARBOHYDRATE_G, SUGARS_TOTALG,
               FIBER_TOTAL_DIETARY_G, TOTAL_FAT_G, WATERG, FPRO
        FROM nutri_data
        WHERE id = ?
    """
    row = conn.execute(query, (id,)).fetchone()
    conn.close()

    if row is None:
        return jsonify({"error": "Product not found"}), 404

    name = row["MAIN_FOOD_DESCRIPTION"].split(',')[0].strip()

    product = {
        "id": row["id"],
        "food_code": row["FOOD_CODE"],
        "name": name,
        "category": row["WWEIA_CATEGORY_DESCRIPTION"],
        "nova_group": row["NOVA_GROUP"],
        "calories": row["ENERGY_KCAL"],
        "protein": row["PROTEIN_G"],
        "carbs": row["CARBOHYDRATE_G"],
        "sugar": row["SUGARS_TOTALG"],
        "fiber": row["FIBER_TOTAL_DIETARY_G"],
        "fat": row["TOTAL_FAT_G"],
        "water": row["WATERG"],
        "fpro": row["FPRO"],
        "image": get_image(name)
    }

    return jsonify(product)

@products_bp.route("/products/categories", methods=["GET"])
def get_categories():
    conn = get_db_connection()
    rows = conn.execute("SELECT DISTINCT WWEIA_CATEGORY_DESCRIPTION FROM nutri_data").fetchall()
    conn.close()

    # Convert to list of cleaned category names (before the first comma)
    categories = []
    for row in rows:
        cat = row["WWEIA_CATEGORY_DESCRIPTION"]
        if cat:
            # take only the part before the comma
            main_cat = cat.split(",")[0].strip()
            if main_cat not in categories:
                categories.append(main_cat)

    return jsonify(categories)

@products_bp.route("/products/category/<string:category_name>", methods=["GET"])
def get_products_by_category(category_name):
    conn = get_db_connection()

    # Match all rows whose WWEIA_CATEGORY_DESCRIPTION starts with the category name
    query = """
        SELECT id, MAIN_FOOD_DESCRIPTION, WWEIA_CATEGORY_DESCRIPTION, NOVA_GROUP,
               ENERGY_KCAL, PROTEIN_G, CARBOHYDRATE_G, SUGARS_TOTALG,
               FIBER_TOTAL_DIETARY_G, TOTAL_FAT_G, WATERG
        FROM nutri_data
        WHERE WWEIA_CATEGORY_DESCRIPTION LIKE ? COLLATE NOCASE
    """
    rows = conn.execute(query, (f"{category_name}%",)).fetchall()
    conn.close()

    products = []
    for row in rows:
        name = row["MAIN_FOOD_DESCRIPTION"]
        clean_name = name.split(",")[0] if name else "Unknown"
        products.append({
            "id": row["id"],
            "name": clean_name,
            "category": row["WWEIA_CATEGORY_DESCRIPTION"],
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

@products_bp.route("/products/search", methods=["GET"])
def search_products():
    query = request.args.get("q", "").strip()

    if not query:
        return jsonify([])

    conn = get_db_connection()
    sql = """
        SELECT id, FOOD_CODE, MAIN_FOOD_DESCRIPTION, WWEIA_CATEGORY_DESCRIPTION,
               ENERGY_KCAL, PROTEIN_G, CARBOHYDRATE_G, NOVA_GROUP, TOTAL_FAT_G
        FROM nutri_data
        WHERE MAIN_FOOD_DESCRIPTION LIKE ?
           OR WWEIA_CATEGORY_DESCRIPTION LIKE ?
        LIMIT 20
    """
    rows = conn.execute(sql, (f"%{query}%", f"%{query}%")).fetchall()
    conn.close()

    results = [
        {
            "id": row["id"],
            "name": row["MAIN_FOOD_DESCRIPTION"].split(",")[0].strip(),
            "category": row["WWEIA_CATEGORY_DESCRIPTION"],
            "calories": row["ENERGY_KCAL"],
            "protein": row["PROTEIN_G"],
            "carbs": row["CARBOHYDRATE_G"],
            "fat": row["TOTAL_FAT_G"],
            "nova_group": row["NOVA_GROUP"],
        }
        for row in rows
    ]

    return jsonify(results)

