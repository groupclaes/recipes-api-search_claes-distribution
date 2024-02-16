# Claes Distribution Recipes Detail API Controller

## Endpoints
`GET /api/{version}/recipes/search`  
retrieve list of recipes which match the filters given in the querystring, results are limited by ?count
Query parameters {type} name [default value]:
- {number?} page [0]
- {number?} count [20]
- {string?} culture ['nl']
- {string?} query
- {number?} collection
- {number[]?} types
- {number[]?} tags

`GET /{version}/distribution/recipes/search/product/:product_id`
Parameters {type} name [default value]:
- {number} product_id
Query parameters {type} name [default value]:
- {string?} culture ['nl']