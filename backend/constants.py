# Updated 2026 Pakistan Construction Market Rates
MATERIAL_PRICES = {
    "cement": 1540,   # PKR per 50kg bag (Maple Leaf / Bestway average)
    "steel": 280,     # PKR per kg (Grade 60 Deformed Sarya)
    "bricks": 21,     # PKR per piece (Awwal Class Machine Made)
    "sand": 85,       # PKR per cubic foot (Ravi / Chenab mix)
    "gravel": 200,    # PKR per cubic foot (Margalla / Sargodha crush)
    "tiles": 350      # PKR per square foot (Standard ceramic/porcelain)
}

MATERIAL_RATES = {
    "residential_single": {"cement": 0.45, "steel": 3.5, "bricks": 550, "sand": 0.6, "gravel": 0.4, "tiles": 0.9},
    "residential_double": {"cement": 0.55, "steel": 4.2, "bricks": 650, "sand": 0.75, "gravel": 0.5, "tiles": 1.1},
    "commercial_single": {"cement": 0.6, "steel": 5.0, "bricks": 700, "sand": 0.8, "gravel": 0.55, "tiles": 0.7},
    "commercial_double": {"cement": 0.75, "steel": 6.5, "bricks": 800, "sand": 1.0, "gravel": 0.7, "tiles": 0.8},
}

LABOR_RATES = {
    "residential_single": {"mason": 2200, "carpenter": 2500, "electrician": 2800, "plumber": 2600, "helper": 1500},
    "residential_double": {"mason": 2400, "carpenter": 2700, "electrician": 3000, "plumber": 2800, "helper": 1600},
    "commercial_single": {"mason": 2600, "carpenter": 3000, "electrician": 3500, "plumber": 3200, "helper": 1800},
    "commercial_double": {"mason": 3000, "carpenter": 3400, "electrician": 4000, "plumber": 3800, "helper": 2000},
}