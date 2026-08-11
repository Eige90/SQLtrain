import type { SqlLesson } from "@/types/lesson";

export const SQL_LESSONS: SqlLesson[] = [
  {
    "id": "select-all-customers",
    "number": 1,
    "title": "Your First SELECT",
    "topic": "SELECT",
    "difficulty": "Beginner",
    "description": "Use SELECT to retrieve data from a table.",
    "task": "Return every column and every row from Customers.",
    "starterSql": "",
    "solutionSql": "SELECT *\nFROM Customers;",
    "hints": [
      "SELECT chooses the data.",
      "The asterisk selects every column.",
      "Use FROM Customers."
    ],
    "resultOrderMatters": false
  },
  {
    "id": "select-specific-columns",
    "number": 2,
    "title": "Choose Specific Columns",
    "topic": "SELECT",
    "difficulty": "Beginner",
    "description": "Return only the columns required for an analysis.",
    "task": "Return CustomerID, CustomerName, and Country from Customers.",
    "starterSql": "",
    "solutionSql": "SELECT\n  CustomerID,\n  CustomerName,\n  Country\nFROM Customers;",
    "hints": [
      "Separate columns with commas.",
      "Use the CustomerName column.",
      "Keep the requested column order."
    ],
    "resultOrderMatters": false
  },
  {
    "id": "filter-german-customers",
    "number": 3,
    "title": "Filter Rows with WHERE",
    "topic": "WHERE",
    "difficulty": "Beginner",
    "description": "WHERE restricts the rows returned by a query.",
    "task": "Return CustomerID, CustomerName, City, and Country for customers in Germany.",
    "starterSql": "",
    "solutionSql": "SELECT\n  CustomerID,\n  CustomerName,\n  City,\n  Country\nFROM Customers\nWHERE Country = 'Germany';",
    "hints": [
      "Use the Country column.",
      "Text values require single quotes.",
      "Compare Country with Germany."
    ],
    "resultOrderMatters": false
  },
  {
    "id": "sort-products-by-price",
    "number": 4,
    "title": "Sort Results",
    "topic": "ORDER BY",
    "difficulty": "Beginner",
    "description": "ORDER BY controls the order of the result.",
    "task": "Return ProductName and Price. Show the most expensive product first.",
    "starterSql": "",
    "solutionSql": "SELECT\n  ProductName,\n  Price\nFROM Products\nORDER BY Price DESC;",
    "hints": [
      "The price column is named Price.",
      "Descending order uses DESC.",
      "Sort by Price."
    ],
    "resultOrderMatters": true
  },
  {
    "id": "top-five-products",
    "number": 5,
    "title": "Limit the Result",
    "topic": "LIMIT",
    "difficulty": "Beginner",
    "description": "LIMIT restricts the number of returned rows.",
    "task": "Return the names and prices of the five most expensive products.",
    "starterSql": "",
    "solutionSql": "SELECT\n  ProductName,\n  Price\nFROM Products\nORDER BY Price DESC\nLIMIT 5;",
    "hints": [
      "Sort before limiting.",
      "Use Price DESC.",
      "LIMIT belongs at the end."
    ],
    "resultOrderMatters": true
  },
  {
    "id": "distinct-countries",
    "number": 6,
    "title": "Remove Duplicate Values",
    "topic": "DISTINCT",
    "difficulty": "Beginner",
    "description": "DISTINCT returns each value only once.",
    "task": "Return every customer country once, sorted alphabetically.",
    "starterSql": "",
    "solutionSql": "SELECT DISTINCT\n  Country\nFROM Customers\nORDER BY Country;",
    "hints": [
      "Use DISTINCT after SELECT.",
      "Select only Country.",
      "Sort alphabetically."
    ],
    "resultOrderMatters": true
  },
  {
    "id": "customer-name-pattern",
    "number": 7,
    "title": "Search with LIKE",
    "topic": "LIKE",
    "difficulty": "Beginner",
    "description": "LIKE searches text using patterns.",
    "task": "Return CustomerName and Country for customers whose names begin with B.",
    "starterSql": "",
    "solutionSql": "SELECT\n  CustomerName,\n  Country\nFROM Customers\nWHERE CustomerName LIKE 'B%'\nORDER BY CustomerName;",
    "hints": [
      "The percent sign matches any following characters.",
      "Use the pattern B%.",
      "Sort by CustomerName."
    ],
    "resultOrderMatters": true
  },
  {
    "id": "customers-in-two-countries",
    "number": 8,
    "title": "Filter with IN",
    "topic": "IN",
    "difficulty": "Beginner",
    "description": "IN compares a value against several alternatives.",
    "task": "Return CustomerID, CustomerName, and Country for customers in Germany or France.",
    "starterSql": "",
    "solutionSql": "SELECT\n  CustomerID,\n  CustomerName,\n  Country\nFROM Customers\nWHERE Country IN ('Germany', 'France')\nORDER BY Country, CustomerName;",
    "hints": [
      "Use IN instead of two equality comparisons.",
      "Put both countries inside parentheses.",
      "Sort by Country and CustomerName."
    ],
    "resultOrderMatters": true
  },
  {
    "id": "products-between-prices",
    "number": 9,
    "title": "Filter a Range",
    "topic": "BETWEEN",
    "difficulty": "Beginner",
    "description": "BETWEEN checks whether a value is inside a range.",
    "task": "Return products priced from 20 through 30, highest price first.",
    "starterSql": "",
    "solutionSql": "SELECT\n  ProductName,\n  Price\nFROM Products\nWHERE Price BETWEEN 20 AND 30\nORDER BY Price DESC, ProductName;",
    "hints": [
      "BETWEEN includes both boundary values.",
      "Use the Price column.",
      "Sort highest price first."
    ],
    "resultOrderMatters": true
  },
  {
    "id": "column-aliases",
    "number": 10,
    "title": "Rename Result Columns",
    "topic": "AS",
    "difficulty": "Beginner",
    "description": "Aliases give result columns more readable names.",
    "task": "Return the first ten customers ordered by CustomerID. Rename CustomerName to Customer and City to CustomerCity.",
    "starterSql": "",
    "solutionSql": "SELECT\n  CustomerName AS Customer,\n  City AS CustomerCity\nFROM Customers\nORDER BY CustomerID\nLIMIT 10;",
    "hints": [
      "Use AS after the original column name.",
      "Order before applying LIMIT.",
      "Return exactly two columns."
    ],
    "resultOrderMatters": true
  },
  {
    "id": "count-customers",
    "number": 11,
    "title": "Count Rows",
    "topic": "COUNT",
    "difficulty": "Beginner",
    "description": "COUNT calculates how many rows match a query.",
    "task": "Return the total number of customers as CustomerCount.",
    "starterSql": "",
    "solutionSql": "SELECT\n  COUNT(*) AS CustomerCount\nFROM Customers;",
    "hints": [
      "COUNT(*) counts rows.",
      "Use an alias named CustomerCount."
    ],
    "resultOrderMatters": false
  },
  {
    "id": "average-product-price",
    "number": 12,
    "title": "Calculate an Average",
    "topic": "AVG",
    "difficulty": "Beginner",
    "description": "AVG calculates the arithmetic mean of numeric values.",
    "task": "Return the average product price rounded to two decimal places as AveragePrice.",
    "starterSql": "",
    "solutionSql": "SELECT\n  ROUND(AVG(Price), 2) AS AveragePrice\nFROM Products;",
    "hints": [
      "Use AVG with Price.",
      "ROUND accepts the value and decimal count.",
      "Use the alias AveragePrice."
    ],
    "resultOrderMatters": false
  },
  {
    "id": "minimum-maximum-price",
    "number": 13,
    "title": "Find Minimum and Maximum",
    "topic": "MIN and MAX",
    "difficulty": "Beginner",
    "description": "MIN and MAX return the lowest and highest values.",
    "task": "Return the cheapest price as CheapestPrice and the highest price as HighestPrice.",
    "starterSql": "",
    "solutionSql": "SELECT\n  MIN(Price) AS CheapestPrice,\n  MAX(Price) AS HighestPrice\nFROM Products;",
    "hints": [
      "Use MIN for the lowest value.",
      "Use MAX for the highest value.",
      "Both values come from Price."
    ],
    "resultOrderMatters": false
  },
  {
    "id": "customers-per-country",
    "number": 14,
    "title": "Group Rows",
    "topic": "GROUP BY",
    "difficulty": "Intermediate",
    "description": "GROUP BY combines rows that share a value.",
    "task": "Count customers per country. Sort the largest groups first and countries alphabetically when counts are equal.",
    "starterSql": "",
    "solutionSql": "SELECT\n  Country,\n  COUNT(*) AS CustomerCount\nFROM Customers\nGROUP BY Country\nORDER BY CustomerCount DESC, Country;",
    "hints": [
      "Group by Country.",
      "Count the rows in each group.",
      "Sort by the alias CustomerCount."
    ],
    "resultOrderMatters": true
  },
  {
    "id": "countries-with-five-customers",
    "number": 15,
    "title": "Filter Groups",
    "topic": "HAVING",
    "difficulty": "Intermediate",
    "description": "HAVING filters grouped results after aggregation.",
    "task": "Return only countries with at least five customers.",
    "starterSql": "",
    "solutionSql": "SELECT\n  Country,\n  COUNT(*) AS CustomerCount\nFROM Customers\nGROUP BY Country\nHAVING COUNT(*) >= 5\nORDER BY CustomerCount DESC, Country;",
    "hints": [
      "WHERE does not filter aggregate groups.",
      "Use HAVING after GROUP BY.",
      "At least five means greater than or equal to five."
    ],
    "resultOrderMatters": true
  },
  {
    "id": "products-with-categories",
    "number": 16,
    "title": "Join Two Tables",
    "topic": "INNER JOIN",
    "difficulty": "Intermediate",
    "description": "INNER JOIN combines matching records from two tables.",
    "task": "Return every ProductName together with its CategoryName.",
    "starterSql": "",
    "solutionSql": "SELECT\n  p.ProductName,\n  c.CategoryName\nFROM Products AS p\nINNER JOIN Categories AS c\n  ON c.CategoryID = p.CategoryID\nORDER BY p.ProductName;",
    "hints": [
      "Products contains CategoryID.",
      "Match both CategoryID columns.",
      "Use table aliases to keep the query readable."
    ],
    "resultOrderMatters": true
  },
  {
    "id": "orders-with-customers",
    "number": 17,
    "title": "Join Orders and Customers",
    "topic": "JOIN",
    "difficulty": "Intermediate",
    "description": "A foreign-key column connects related tables.",
    "task": "Return the first 20 OrderID values with CustomerName and OrderDate.",
    "starterSql": "",
    "solutionSql": "SELECT\n  o.OrderID,\n  c.CustomerName,\n  o.OrderDate\nFROM Orders AS o\nJOIN Customers AS c\n  ON c.CustomerID = o.CustomerID\nORDER BY o.OrderID\nLIMIT 20;",
    "hints": [
      "Orders contains CustomerID.",
      "Join it to Customers.CustomerID.",
      "Order by OrderID before limiting."
    ],
    "resultOrderMatters": true
  },
  {
    "id": "customer-order-counts",
    "number": 18,
    "title": "Keep Unmatched Rows",
    "topic": "LEFT JOIN",
    "difficulty": "Intermediate",
    "description": "LEFT JOIN keeps all rows from the table on the left.",
    "task": "Return every customer with the number of orders. Show the highest counts first.",
    "starterSql": "",
    "solutionSql": "SELECT\n  c.CustomerID,\n  c.CustomerName,\n  COUNT(o.OrderID) AS OrderCount\nFROM Customers AS c\nLEFT JOIN Orders AS o\n  ON o.CustomerID = c.CustomerID\nGROUP BY\n  c.CustomerID,\n  c.CustomerName\nORDER BY OrderCount DESC, c.CustomerName;",
    "hints": [
      "Customers must be the left table.",
      "Count OrderID rather than all rows.",
      "Group by both selected customer columns."
    ],
    "resultOrderMatters": true
  },
  {
    "id": "products-above-average",
    "number": 19,
    "title": "Use a Subquery",
    "topic": "Subquery",
    "difficulty": "Intermediate",
    "description": "A subquery can calculate a value used by the outer query.",
    "task": "Return products whose Price is above the average product price.",
    "starterSql": "",
    "solutionSql": "SELECT\n  ProductName,\n  Price\nFROM Products\nWHERE Price > (\n  SELECT AVG(Price)\n  FROM Products\n)\nORDER BY Price DESC, ProductName;",
    "hints": [
      "Calculate the average inside parentheses.",
      "Compare each Price with that result.",
      "Sort the highest prices first."
    ],
    "resultOrderMatters": true
  },
  {
    "id": "product-price-bands",
    "number": 20,
    "title": "Create Categories with CASE",
    "topic": "CASE",
    "difficulty": "Intermediate",
    "description": "CASE creates conditional values in a query result.",
    "task": "Classify products as Budget below 20, Standard from 20 through 50, and Premium above 50.",
    "starterSql": "",
    "solutionSql": "SELECT\n  ProductName,\n  Price,\n  CASE\n    WHEN Price < 20 THEN 'Budget'\n    WHEN Price <= 50 THEN 'Standard'\n    ELSE 'Premium'\n  END AS PriceBand\nFROM Products\nORDER BY ProductID;",
    "hints": [
      "CASE checks conditions from top to bottom.",
      "The second condition only needs Price <= 50.",
      "Use END AS PriceBand."
    ],
    "resultOrderMatters": true
  },
  {
    "id": "customers-with-orders",
    "number": 21,
    "title": "Check for Related Rows",
    "topic": "EXISTS",
    "difficulty": "Intermediate",
    "description": "EXISTS checks whether a subquery returns at least one row.",
    "task": "Return customers that have at least one order.",
    "starterSql": "",
    "solutionSql": "SELECT\n  c.CustomerID,\n  c.CustomerName\nFROM Customers AS c\nWHERE EXISTS (\n  SELECT 1\n  FROM Orders AS o\n  WHERE o.CustomerID = c.CustomerID\n)\nORDER BY c.CustomerName;",
    "hints": [
      "The inner query refers to the outer customer.",
      "Use matching CustomerID values.",
      "SELECT 1 is sufficient inside EXISTS."
    ],
    "resultOrderMatters": true
  },
  {
    "id": "customers-without-orders",
    "number": 22,
    "title": "Find Missing Relationships",
    "topic": "NOT EXISTS",
    "difficulty": "Intermediate",
    "description": "NOT EXISTS finds rows without a corresponding related row.",
    "task": "Return customers that do not have any orders.",
    "starterSql": "",
    "solutionSql": "SELECT\n  c.CustomerID,\n  c.CustomerName\nFROM Customers AS c\nWHERE NOT EXISTS (\n  SELECT 1\n  FROM Orders AS o\n  WHERE o.CustomerID = c.CustomerID\n)\nORDER BY c.CustomerName;",
    "hints": [
      "Use NOT EXISTS.",
      "Correlate the subquery through CustomerID.",
      "Sort by CustomerName."
    ],
    "resultOrderMatters": true
  },
  {
    "id": "most-expensive-products",
    "number": 23,
    "title": "Compare with a Scalar Subquery",
    "topic": "Subquery",
    "difficulty": "Intermediate",
    "description": "A scalar subquery returns one value.",
    "task": "Return every product tied for the highest Price.",
    "starterSql": "",
    "solutionSql": "SELECT\n  ProductName,\n  Price\nFROM Products\nWHERE Price = (\n  SELECT MAX(Price)\n  FROM Products\n);",
    "hints": [
      "Use MAX inside the subquery.",
      "Do not assume there is only one matching product.",
      "Compare Price using equality."
    ],
    "resultOrderMatters": false
  },
  {
    "id": "german-customers-cte",
    "number": 24,
    "title": "Create a Common Table Expression",
    "topic": "CTE",
    "difficulty": "Intermediate",
    "description": "A common table expression names a temporary query result.",
    "task": "Use a CTE named GermanCustomers and return CustomerName and City for customers in Germany.",
    "starterSql": "",
    "solutionSql": "WITH GermanCustomers AS (\n  SELECT\n    CustomerName,\n    City\n  FROM Customers\n  WHERE Country = 'Germany'\n)\nSELECT\n  CustomerName,\n  City\nFROM GermanCustomers\nORDER BY CustomerName;",
    "hints": [
      "A CTE begins with WITH.",
      "Define GermanCustomers inside parentheses.",
      "Query the CTE afterward."
    ],
    "resultOrderMatters": true
  },
  {
    "id": "order-count-cte",
    "number": 25,
    "title": "Aggregate in a CTE",
    "topic": "CTE and JOIN",
    "difficulty": "Intermediate",
    "description": "CTEs can separate an aggregation from a later join.",
    "task": "Create a CTE named OrderCounts and return customer names with their order counts.",
    "starterSql": "",
    "solutionSql": "WITH OrderCounts AS (\n  SELECT\n    CustomerID,\n    COUNT(*) AS OrderCount\n  FROM Orders\n  GROUP BY CustomerID\n)\nSELECT\n  c.CustomerName,\n  oc.OrderCount\nFROM OrderCounts AS oc\nJOIN Customers AS c\n  ON c.CustomerID = oc.CustomerID\nORDER BY oc.OrderCount DESC, c.CustomerName;",
    "hints": [
      "Aggregate Orders inside the CTE.",
      "Keep CustomerID so the CTE can be joined.",
      "Join the CTE to Customers."
    ],
    "resultOrderMatters": true
  },
  {
    "id": "combined-cities",
    "number": 26,
    "title": "Combine Results",
    "topic": "UNION",
    "difficulty": "Intermediate",
    "description": "UNION combines compatible results and removes duplicates.",
    "task": "Return one alphabetical list containing cities from Customers and Suppliers.",
    "starterSql": "",
    "solutionSql": "SELECT City\nFROM Customers\nUNION\nSELECT City\nFROM Suppliers\nORDER BY City;",
    "hints": [
      "Both SELECT statements must return the same number of columns.",
      "Use UNION rather than UNION ALL.",
      "ORDER BY applies to the combined result."
    ],
    "resultOrderMatters": true
  },
  {
    "id": "shared-countries",
    "number": 27,
    "title": "Find Shared Values",
    "topic": "INTERSECT",
    "difficulty": "Intermediate",
    "description": "INTERSECT returns values present in both query results.",
    "task": "Return countries that appear in both Customers and Suppliers.",
    "starterSql": "",
    "solutionSql": "SELECT Country\nFROM Customers\nINTERSECT\nSELECT Country\nFROM Suppliers\nORDER BY Country;",
    "hints": [
      "Both queries should select Country.",
      "INTERSECT keeps only shared values.",
      "Sort the final result."
    ],
    "resultOrderMatters": true
  },
  {
    "id": "customer-only-countries",
    "number": 28,
    "title": "Subtract Result Sets",
    "topic": "EXCEPT",
    "difficulty": "Intermediate",
    "description": "EXCEPT returns rows from the first query that are absent from the second.",
    "task": "Return countries used by Customers but not by Suppliers.",
    "starterSql": "",
    "solutionSql": "SELECT Country\nFROM Customers\nEXCEPT\nSELECT Country\nFROM Suppliers\nORDER BY Country;",
    "hints": [
      "Customers must be the first query.",
      "Suppliers must be the second query.",
      "EXCEPT removes matching values."
    ],
    "resultOrderMatters": true
  },
  {
    "id": "product-row-numbers",
    "number": 29,
    "title": "Number Result Rows",
    "topic": "ROW_NUMBER",
    "difficulty": "Advanced",
    "description": "ROW_NUMBER assigns a unique sequence number to each result row.",
    "task": "Number products from most expensive to least expensive. Name the number PricePosition.",
    "starterSql": "",
    "solutionSql": "SELECT\n  ProductName,\n  Price,\n  ROW_NUMBER() OVER (\n    ORDER BY Price DESC, ProductID\n  ) AS PricePosition\nFROM Products\nORDER BY PricePosition;",
    "hints": [
      "ROW_NUMBER is a window function.",
      "Its ORDER BY belongs inside OVER.",
      "Use ProductID to break price ties."
    ],
    "resultOrderMatters": true
  },
  {
    "id": "product-price-rank",
    "number": 30,
    "title": "Rank Values",
    "topic": "RANK",
    "difficulty": "Advanced",
    "description": "RANK gives equal values the same ranking and leaves gaps after ties.",
    "task": "Rank products by descending Price. Name the result PriceRank.",
    "starterSql": "",
    "solutionSql": "SELECT\n  ProductName,\n  Price,\n  RANK() OVER (\n    ORDER BY Price DESC\n  ) AS PriceRank\nFROM Products\nORDER BY PriceRank, ProductName;",
    "hints": [
      "Use RANK as a window function.",
      "Sort prices descending inside OVER.",
      "Sort equal ranks by ProductName."
    ],
    "resultOrderMatters": true
  },

  {
    "id": "uppercase-customer-names",
    "number": 31,
    "title": "Convert Text to Uppercase",
    "topic": "UPPER",
    "difficulty": "Beginner",
    "description": "UPPER converts text to uppercase characters.",
    "task": "Return the first ten customer names together with an uppercase version named UppercaseName.",
    "starterSql": "",
    "solutionSql": "SELECT\n  CustomerName,\n  UPPER(CustomerName) AS UppercaseName\nFROM Customers\nORDER BY CustomerID\nLIMIT 10;",
    "hints": [
      "Pass CustomerName to UPPER.",
      "Use the alias UppercaseName.",
      "Order before applying LIMIT."
    ],
    "resultOrderMatters": true
  },
  {
    "id": "lowercase-countries",
    "number": 32,
    "title": "Convert Text to Lowercase",
    "topic": "LOWER",
    "difficulty": "Beginner",
    "description": "LOWER converts text to lowercase characters.",
    "task": "Return every customer country once in lowercase. Name the result CountryLowercase and sort it alphabetically.",
    "starterSql": "",
    "solutionSql": "SELECT DISTINCT\n  LOWER(Country) AS CountryLowercase\nFROM Customers\nORDER BY CountryLowercase;",
    "hints": [
      "Use LOWER with Country.",
      "DISTINCT removes duplicate countries.",
      "Sort using the alias."
    ],
    "resultOrderMatters": true
  },
  {
    "id": "longest-product-names",
    "number": 33,
    "title": "Measure Text Length",
    "topic": "LENGTH",
    "difficulty": "Beginner",
    "description": "LENGTH returns the number of characters in a text value.",
    "task": "Return the ten longest product names with their character count named NameLength.",
    "starterSql": "",
    "solutionSql": "SELECT\n  ProductName,\n  LENGTH(ProductName) AS NameLength\nFROM Products\nORDER BY NameLength DESC, ProductName\nLIMIT 10;",
    "hints": [
      "Pass ProductName to LENGTH.",
      "Sort the longest values first.",
      "Use ProductName to resolve equal lengths."
    ],
    "resultOrderMatters": true
  },
  {
    "id": "short-customer-name",
    "number": 34,
    "title": "Extract Part of a String",
    "topic": "SUBSTR",
    "difficulty": "Beginner",
    "description": "SUBSTR extracts characters from a text value.",
    "task": "Return the first ten customer names and the first three characters of each name as ShortName.",
    "starterSql": "",
    "solutionSql": "SELECT\n  CustomerName,\n  SUBSTR(CustomerName, 1, 3) AS ShortName\nFROM Customers\nORDER BY CustomerID\nLIMIT 10;",
    "hints": [
      "SQLite string positions begin with 1.",
      "The third argument is the number of characters.",
      "Use the alias ShortName."
    ],
    "resultOrderMatters": true
  },
  {
    "id": "replace-spaces",
    "number": 35,
    "title": "Replace Text",
    "topic": "REPLACE",
    "difficulty": "Beginner",
    "description": "REPLACE substitutes part of a string with another value.",
    "task": "Return the first ten customer names and replace spaces with hyphens. Name the result SlugName.",
    "starterSql": "",
    "solutionSql": "SELECT\n  CustomerName,\n  REPLACE(CustomerName, ' ', '-') AS SlugName\nFROM Customers\nORDER BY CustomerID\nLIMIT 10;",
    "hints": [
      "The second argument is the text to replace.",
      "The third argument is the replacement.",
      "A space must appear between the first pair of quotes."
    ],
    "resultOrderMatters": true
  },
  {
    "id": "employee-full-name",
    "number": 36,
    "title": "Combine Text Values",
    "topic": "Concatenation",
    "difficulty": "Beginner",
    "description": "SQLite uses two vertical bars to concatenate text.",
    "task": "Combine FirstName and LastName into one FullName column for every employee.",
    "starterSql": "",
    "solutionSql": "SELECT\n  FirstName || ' ' || LastName AS FullName\nFROM Employees\nORDER BY EmployeeID;",
    "hints": [
      "Use || to combine text.",
      "Add a space between the names.",
      "Name the result FullName."
    ],
    "resultOrderMatters": true
  },
  {
    "id": "supplier-phone-fallback",
    "number": 37,
    "title": "Replace NULL Values",
    "topic": "COALESCE",
    "difficulty": "Beginner",
    "description": "COALESCE returns the first value that is not NULL.",
    "task": "Return SupplierName and Phone. Display No phone when Phone is NULL and name the result PhoneDisplay.",
    "starterSql": "",
    "solutionSql": "SELECT\n  SupplierName,\n  COALESCE(Phone, 'No phone') AS PhoneDisplay\nFROM Suppliers\nORDER BY SupplierID;",
    "hints": [
      "Pass Phone as the first argument.",
      "The fallback value is the second argument.",
      "COALESCE does not modify the stored data."
    ],
    "resultOrderMatters": true
  },
  {
    "id": "nullif-germany",
    "number": 38,
    "title": "Turn Matching Values into NULL",
    "topic": "NULLIF",
    "difficulty": "Intermediate",
    "description": "NULLIF returns NULL when its two arguments are equal.",
    "task": "Return the first ten customer names and countries. Replace Germany with NULL in a result column named CountryExceptGermany.",
    "starterSql": "",
    "solutionSql": "SELECT\n  CustomerName,\n  NULLIF(Country, 'Germany') AS CountryExceptGermany\nFROM Customers\nORDER BY CustomerID\nLIMIT 10;",
    "hints": [
      "Compare Country with Germany.",
      "Other country values remain unchanged.",
      "Use the requested alias."
    ],
    "resultOrderMatters": true
  },
  {
    "id": "cast-product-price",
    "number": 39,
    "title": "Convert a Data Type",
    "topic": "CAST",
    "difficulty": "Intermediate",
    "description": "CAST converts a value to another SQL data type.",
    "task": "Return the first ten products with Price converted to INTEGER as WholePrice.",
    "starterSql": "",
    "solutionSql": "SELECT\n  ProductName,\n  Price,\n  CAST(Price AS INTEGER) AS WholePrice\nFROM Products\nORDER BY ProductID\nLIMIT 10;",
    "hints": [
      "CAST uses the form CAST(value AS type).",
      "Convert Price to INTEGER.",
      "Keep the original Price in the result."
    ],
    "resultOrderMatters": true
  },
  {
    "id": "gross-product-price",
    "number": 40,
    "title": "Calculate and Round Values",
    "topic": "ROUND",
    "difficulty": "Intermediate",
    "description": "SQL expressions can calculate new values without modifying stored data.",
    "task": "Calculate a gross price using Price multiplied by 1.19. Round it to two decimal places and name it GrossPrice.",
    "starterSql": "",
    "solutionSql": "SELECT\n  ProductName,\n  Price,\n  ROUND(Price * 1.19, 2) AS GrossPrice\nFROM Products\nORDER BY ProductID\nLIMIT 10;",
    "hints": [
      "Multiply Price by 1.19.",
      "ROUND accepts the expression and decimal count.",
      "Return only the first ten products."
    ],
    "resultOrderMatters": true
  },
  {
    "id": "extract-order-year",
    "number": 41,
    "title": "Extract a Year from a Date",
    "topic": "STRFTIME",
    "difficulty": "Intermediate",
    "description": "SQLite uses STRFTIME to extract and format date components.",
    "task": "Return the first ten orders with OrderID, OrderDate, and the year named OrderYear.",
    "starterSql": "",
    "solutionSql": "SELECT\n  OrderID,\n  OrderDate,\n  STRFTIME('%Y', OrderDate) AS OrderYear\nFROM Orders\nORDER BY OrderID\nLIMIT 10;",
    "hints": [
      "%Y represents a four-digit year.",
      "Pass OrderDate as the second argument.",
      "Use the alias OrderYear."
    ],
    "resultOrderMatters": true
  },
  {
    "id": "orders-per-month",
    "number": 42,
    "title": "Group Dates by Month",
    "topic": "Date aggregation",
    "difficulty": "Intermediate",
    "description": "Formatted date components can be used for grouping.",
    "task": "Count orders per calendar month. Format each month as YYYY-MM and name it OrderMonth.",
    "starterSql": "",
    "solutionSql": "SELECT\n  STRFTIME('%Y-%m', OrderDate) AS OrderMonth,\n  COUNT(*) AS OrderCount\nFROM Orders\nGROUP BY OrderMonth\nORDER BY OrderMonth;",
    "hints": [
      "%Y-%m returns a year and month.",
      "Group using OrderMonth.",
      "Sort the months chronologically."
    ],
    "resultOrderMatters": true
  },
  {
    "id": "days-until-2000",
    "number": 43,
    "title": "Calculate a Date Difference",
    "topic": "JULIANDAY",
    "difficulty": "Intermediate",
    "description": "JULIANDAY converts dates to numeric day values that can be subtracted.",
    "task": "For the first ten orders, calculate the whole number of days between OrderDate and 2000-01-01. Name it DaysUntil2000.",
    "starterSql": "",
    "solutionSql": "SELECT\n  OrderID,\n  CAST(\n    JULIANDAY('2000-01-01') - JULIANDAY(OrderDate)\n    AS INTEGER\n  ) AS DaysUntil2000\nFROM Orders\nORDER BY OrderID\nLIMIT 10;",
    "hints": [
      "Subtract the earlier date from the later date.",
      "JULIANDAY returns a numeric value.",
      "CAST the difference to INTEGER."
    ],
    "resultOrderMatters": true
  },
  {
    "id": "conditional-customer-count",
    "number": 44,
    "title": "Use Conditional Aggregation",
    "topic": "SUM and CASE",
    "difficulty": "Intermediate",
    "description": "CASE inside an aggregate can count rows matching a condition.",
    "task": "Return the total customer count and the number of German customers as GermanCustomers.",
    "starterSql": "",
    "solutionSql": "SELECT\n  COUNT(*) AS TotalCustomers,\n  SUM(\n    CASE\n      WHEN Country = 'Germany' THEN 1\n      ELSE 0\n    END\n  ) AS GermanCustomers\nFROM Customers;",
    "hints": [
      "COUNT(*) returns the total.",
      "Return 1 for German rows and 0 otherwise.",
      "SUM adds the conditional values."
    ],
    "resultOrderMatters": false
  },
  {
    "id": "aggregate-filter",
    "number": 45,
    "title": "Filter Individual Aggregates",
    "topic": "FILTER",
    "difficulty": "Intermediate",
    "description": "FILTER applies a condition to one aggregate function.",
    "task": "Return GermanCustomers and FrenchCustomers using two filtered COUNT expressions.",
    "starterSql": "",
    "solutionSql": "SELECT\n  COUNT(*) FILTER (\n    WHERE Country = 'Germany'\n  ) AS GermanCustomers,\n  COUNT(*) FILTER (\n    WHERE Country = 'France'\n  ) AS FrenchCustomers\nFROM Customers;",
    "hints": [
      "Place FILTER after COUNT(*).",
      "Each aggregate has its own WHERE condition.",
      "The query still reads Customers only once."
    ],
    "resultOrderMatters": false
  },
  {
    "id": "dense-product-rank",
    "number": 46,
    "title": "Rank Values without Gaps",
    "topic": "DENSE_RANK",
    "difficulty": "Advanced",
    "description": "DENSE_RANK gives equal values the same rank without leaving gaps.",
    "task": "Rank all products by descending Price. Name the rank PriceRank.",
    "starterSql": "",
    "solutionSql": "SELECT\n  ProductName,\n  Price,\n  DENSE_RANK() OVER (\n    ORDER BY Price DESC\n  ) AS PriceRank\nFROM Products\nORDER BY PriceRank, ProductName;",
    "hints": [
      "DENSE_RANK is followed by OVER.",
      "The ranking order belongs inside OVER.",
      "Sort tied products alphabetically."
    ],
    "resultOrderMatters": true
  },
  {
    "id": "previous-order-date",
    "number": 47,
    "title": "Read the Previous Row",
    "topic": "LAG",
    "difficulty": "Advanced",
    "description": "LAG reads a value from a previous result row.",
    "task": "Return the first ten orders and show the preceding OrderDate as PreviousOrderDate.",
    "starterSql": "",
    "solutionSql": "SELECT\n  OrderID,\n  OrderDate,\n  LAG(OrderDate) OVER (\n    ORDER BY OrderID\n  ) AS PreviousOrderDate\nFROM Orders\nORDER BY OrderID\nLIMIT 10;",
    "hints": [
      "Pass OrderDate to LAG.",
      "Define the sequence using OrderID.",
      "The first row has no previous value."
    ],
    "resultOrderMatters": true
  },
  {
    "id": "running-price-total",
    "number": 48,
    "title": "Calculate a Running Total",
    "topic": "Window SUM",
    "difficulty": "Advanced",
    "description": "A window aggregate can calculate a cumulative value without grouping rows.",
    "task": "Return the first ten products and calculate a cumulative Price total ordered by ProductID. Name it RunningPriceTotal.",
    "starterSql": "",
    "solutionSql": "SELECT\n  ProductID,\n  ProductName,\n  Price,\n  ROUND(\n    SUM(Price) OVER (\n      ORDER BY ProductID\n      ROWS BETWEEN UNBOUNDED PRECEDING\n        AND CURRENT ROW\n    ),\n    2\n  ) AS RunningPriceTotal\nFROM Products\nORDER BY ProductID\nLIMIT 10;",
    "hints": [
      "Use SUM as a window function.",
      "The frame begins at UNBOUNDED PRECEDING.",
      "It ends at CURRENT ROW."
    ],
    "resultOrderMatters": true
  },
  {
    "id": "inspect-primary-key",
    "number": 49,
    "title": "Inspect a Primary Key",
    "topic": "PRIMARY KEY",
    "difficulty": "Intermediate",
    "description": "A primary key uniquely identifies every row in a table.",
    "task": "Inspect Customers and return its primary-key column as ColumnName, its declared type as DeclaredType, and its key position as PrimaryKeyOrder.",
    "starterSql": "",
    "solutionSql": "SELECT\n  name AS ColumnName,\n  type AS DeclaredType,\n  pk AS PrimaryKeyOrder\nFROM pragma_table_info('Customers')\nWHERE pk > 0\nORDER BY pk;",
    "hints": [
      "pragma_table_info returns table metadata.",
      "A pk value greater than zero marks a primary-key column.",
      "Composite keys can contain several ordered columns."
    ],
    "resultOrderMatters": true
  },
  {
    "id": "inspect-foreign-keys",
    "number": 50,
    "title": "Inspect Foreign Keys",
    "topic": "FOREIGN KEY",
    "difficulty": "Intermediate",
    "description": "A foreign key connects a child-table column to a key in another table.",
    "task": "Inspect the foreign keys of Products. Return ChildColumn, ParentTable, ParentColumn, OnUpdate, and OnDelete.",
    "starterSql": "",
    "solutionSql": "SELECT\n  \"from\" AS ChildColumn,\n  \"table\" AS ParentTable,\n  \"to\" AS ParentColumn,\n  on_update AS OnUpdate,\n  on_delete AS OnDelete\nFROM pragma_foreign_key_list('Products')\nORDER BY id, seq;",
    "hints": [
      "pragma_foreign_key_list returns relationship metadata.",
      "from, table, and to require double quotes.",
      "A table may contain more than one foreign key."
    ],
    "resultOrderMatters": true
  }
,

  {
    "id": "create-basic-table",
    "number": 51,
    "title": "Create Your First Table",
    "topic": "CREATE TABLE",
    "difficulty": "Beginner",
    "description": "CREATE TABLE defines a new table and its columns.",
    "task": "Create a table named Students with StudentID INTEGER and Name TEXT.",
    "starterSql": "",
    "solutionSql": "CREATE TABLE Students (\n  StudentID INTEGER,\n  Name TEXT\n);",
    "hints": [
      "Begin with CREATE TABLE Students.",
      "Place the column definitions inside parentheses.",
      "Separate columns with a comma."
    ],
    "resultOrderMatters": true,
    "executionMode": "sandbox",
    "setupSql": "SELECT 1;",
    "verificationSql": "SELECT\n  name AS ColumnName,\n  type AS DeclaredType\nFROM pragma_table_info('Students')\nORDER BY cid;"
  },
  {
    "id": "create-not-null-column",
    "number": 52,
    "title": "Require a Value",
    "topic": "NOT NULL",
    "difficulty": "Beginner",
    "description": "NOT NULL prevents a column from storing NULL.",
    "task": "Create a table named Contacts with ContactID INTEGER and Email TEXT NOT NULL.",
    "starterSql": "",
    "solutionSql": "CREATE TABLE Contacts (\n  ContactID INTEGER,\n  Email TEXT NOT NULL\n);",
    "hints": [
      "Add NOT NULL after the Email data type.",
      "ContactID does not need a constraint.",
      "The table must be named Contacts."
    ],
    "resultOrderMatters": true,
    "executionMode": "sandbox",
    "setupSql": "SELECT 1;",
    "verificationSql": "SELECT\n  name AS ColumnName,\n  type AS DeclaredType,\n  \"notnull\" AS IsNotNull\nFROM pragma_table_info('Contacts')\nORDER BY cid;"
  },
  {
    "id": "create-default-value",
    "number": 53,
    "title": "Define a Default Value",
    "topic": "DEFAULT",
    "difficulty": "Intermediate",
    "description": "DEFAULT supplies a value when INSERT omits a column.",
    "task": "Create Tasks with TaskID INTEGER and Status TEXT using the default value Open.",
    "starterSql": "",
    "solutionSql": "CREATE TABLE Tasks (\n  TaskID INTEGER,\n  Status TEXT DEFAULT 'Open'\n);",
    "hints": [
      "DEFAULT follows the column data type.",
      "Open is a text value.",
      "Use single quotes around Open."
    ],
    "resultOrderMatters": true,
    "executionMode": "sandbox",
    "setupSql": "SELECT 1;",
    "verificationSql": "SELECT\n  name AS ColumnName,\n  type AS DeclaredType,\n  dflt_value AS DefaultValue\nFROM pragma_table_info('Tasks')\nORDER BY cid;"
  },
  {
    "id": "create-unique-column",
    "number": 54,
    "title": "Prevent Duplicate Values",
    "topic": "UNIQUE",
    "difficulty": "Intermediate",
    "description": "UNIQUE prevents duplicate non-NULL values.",
    "task": "Create Users with UserID INTEGER and Email TEXT UNIQUE.",
    "starterSql": "",
    "solutionSql": "CREATE TABLE Users (\n  UserID INTEGER,\n  Email TEXT UNIQUE\n);",
    "hints": [
      "Add UNIQUE after Email TEXT.",
      "UNIQUE is different from PRIMARY KEY.",
      "The table must be named Users."
    ],
    "resultOrderMatters": false,
    "executionMode": "sandbox",
    "setupSql": "SELECT 1;",
    "verificationSql": "SELECT\n  COUNT(*) AS UniqueEmailConstraint\nFROM pragma_index_list('Users') AS indexes\nJOIN pragma_index_info(indexes.name) AS columns\nWHERE indexes.\"unique\" = 1\n  AND columns.name = 'Email';"
  },
  {
    "id": "create-check-constraint",
    "number": 55,
    "title": "Validate Values with CHECK",
    "topic": "CHECK",
    "difficulty": "Intermediate",
    "description": "CHECK rejects values that do not satisfy a condition.",
    "task": "Create ProductsTest with ProductID INTEGER and Price REAL. Price must be greater than or equal to zero.",
    "starterSql": "",
    "solutionSql": "CREATE TABLE ProductsTest (\n  ProductID INTEGER,\n  Price REAL CHECK (Price >= 0)\n);",
    "hints": [
      "CHECK contains a Boolean condition.",
      "Use Price >= 0.",
      "Place the constraint after Price REAL."
    ],
    "resultOrderMatters": false,
    "executionMode": "sandbox",
    "setupSql": "SELECT 1;",
    "verificationSql": "SELECT\n  CASE\n    WHEN UPPER(sql) LIKE '%CHECK%'\n      AND UPPER(sql) LIKE '%PRICE%'\n      AND sql LIKE '%>=%'\n    THEN 1\n    ELSE 0\n  END AS HasPriceCheck\nFROM sqlite_master\nWHERE type = 'table'\n  AND name = 'ProductsTest';"
  },
  {
    "id": "create-primary-key",
    "number": 56,
    "title": "Create a Primary Key",
    "topic": "PRIMARY KEY",
    "difficulty": "Intermediate",
    "description": "A primary key uniquely identifies every table row.",
    "task": "Create Departments with DepartmentID INTEGER PRIMARY KEY and DepartmentName TEXT NOT NULL.",
    "starterSql": "",
    "solutionSql": "CREATE TABLE Departments (\n  DepartmentID INTEGER PRIMARY KEY,\n  DepartmentName TEXT NOT NULL\n);",
    "hints": [
      "PRIMARY KEY belongs after INTEGER.",
      "DepartmentName must use NOT NULL.",
      "A primary key must be unique."
    ],
    "resultOrderMatters": true,
    "executionMode": "sandbox",
    "setupSql": "SELECT 1;",
    "verificationSql": "SELECT\n  name AS ColumnName,\n  type AS DeclaredType,\n  \"notnull\" AS IsNotNull,\n  pk AS PrimaryKeyOrder\nFROM pragma_table_info('Departments')\nORDER BY cid;"
  },
  {
    "id": "create-autoincrement-key",
    "number": 57,
    "title": "Generate IDs Automatically",
    "topic": "AUTOINCREMENT",
    "difficulty": "Intermediate",
    "description": "AUTOINCREMENT creates increasing integer primary-key values.",
    "task": "Create Tickets with TicketID INTEGER PRIMARY KEY AUTOINCREMENT and Title TEXT NOT NULL.",
    "starterSql": "",
    "solutionSql": "CREATE TABLE Tickets (\n  TicketID INTEGER PRIMARY KEY AUTOINCREMENT,\n  Title TEXT NOT NULL\n);",
    "hints": [
      "AUTOINCREMENT follows PRIMARY KEY.",
      "It requires an INTEGER PRIMARY KEY.",
      "Title must use NOT NULL."
    ],
    "resultOrderMatters": false,
    "executionMode": "sandbox",
    "setupSql": "SELECT 1;",
    "verificationSql": "SELECT\n  CASE\n    WHEN UPPER(sql) LIKE '%INTEGER PRIMARY KEY AUTOINCREMENT%'\n    THEN 1\n    ELSE 0\n  END AS HasAutoIncrement\nFROM sqlite_master\nWHERE type = 'table'\n  AND name = 'Tickets';"
  },
  {
    "id": "create-foreign-key",
    "number": 58,
    "title": "Create a Foreign Key",
    "topic": "FOREIGN KEY",
    "difficulty": "Advanced",
    "description": "A foreign key connects a child row to a parent row.",
    "task": "Create OrdersTest with OrderID INTEGER PRIMARY KEY and CustomerID INTEGER referencing CustomersTest.CustomerID.",
    "starterSql": "",
    "solutionSql": "CREATE TABLE OrdersTest (\n  OrderID INTEGER PRIMARY KEY,\n  CustomerID INTEGER,\n  FOREIGN KEY (CustomerID)\n    REFERENCES CustomersTest(CustomerID)\n);",
    "hints": [
      "The child column is CustomerID.",
      "Use REFERENCES CustomersTest(CustomerID).",
      "The parent table already exists in the sandbox."
    ],
    "resultOrderMatters": true,
    "executionMode": "sandbox",
    "setupSql": "CREATE TABLE CustomersTest (\n  CustomerID INTEGER PRIMARY KEY,\n  CustomerName TEXT\n);",
    "verificationSql": "SELECT\n  \"from\" AS ChildColumn,\n  \"table\" AS ParentTable,\n  \"to\" AS ParentColumn\nFROM pragma_foreign_key_list('OrdersTest')\nORDER BY id, seq;"
  },
  {
    "id": "insert-one-row",
    "number": 59,
    "title": "Insert a Row",
    "topic": "INSERT",
    "difficulty": "Beginner",
    "description": "INSERT adds new rows to a table.",
    "task": "Insert ProductID 1, ProductName Keyboard, and Price 49.99 into TrainingProducts.",
    "starterSql": "",
    "solutionSql": "INSERT INTO TrainingProducts (\n  ProductID,\n  ProductName,\n  Price\n)\nVALUES (\n  1,\n  'Keyboard',\n  49.99\n);",
    "hints": [
      "List the target columns after the table name.",
      "List matching values after VALUES.",
      "Keyboard is a text value."
    ],
    "resultOrderMatters": true,
    "executionMode": "sandbox",
    "setupSql": "CREATE TABLE TrainingProducts (\n  ProductID INTEGER PRIMARY KEY,\n  ProductName TEXT NOT NULL,\n  Price REAL NOT NULL\n);",
    "verificationSql": "SELECT\n  ProductID,\n  ProductName,\n  Price\nFROM TrainingProducts\nORDER BY ProductID;"
  },
  {
    "id": "update-one-row",
    "number": 60,
    "title": "Update Existing Data",
    "topic": "UPDATE",
    "difficulty": "Beginner",
    "description": "UPDATE changes values in existing rows.",
    "task": "Change the price of ProductID 2 to 34.95 in TrainingProducts.",
    "starterSql": "",
    "solutionSql": "UPDATE TrainingProducts\nSET Price = 34.95\nWHERE ProductID = 2;",
    "hints": [
      "Use SET to assign the new Price.",
      "Use WHERE to target ProductID 2.",
      "Without WHERE every product would be updated."
    ],
    "resultOrderMatters": true,
    "executionMode": "sandbox",
    "setupSql": "CREATE TABLE TrainingProducts (\n  ProductID INTEGER PRIMARY KEY,\n  ProductName TEXT NOT NULL,\n  Price REAL NOT NULL\n);\n\nINSERT INTO TrainingProducts (\n  ProductID,\n  ProductName,\n  Price\n)\nVALUES\n  (1, 'Keyboard', 49.99),\n  (2, 'Mouse', 24.95),\n  (3, 'Monitor', 199.00);",
    "verificationSql": "SELECT\n  ProductID,\n  ProductName,\n  Price\nFROM TrainingProducts\nORDER BY ProductID;"
  }
,

  {
    "id": "delete-matching-rows",
    "number": 61,
    "title": "Delete Matching Rows",
    "topic": "DELETE",
    "difficulty": "Beginner",
    "description": "DELETE removes rows that match a condition.",
    "task": "Delete every completed task from TrainingTasks. Keep the unfinished tasks.",
    "starterSql": "",
    "solutionSql": "DELETE FROM TrainingTasks\nWHERE Completed = 1;",
    "hints": [
      "Begin with DELETE FROM TrainingTasks.",
      "Completed tasks contain the value 1.",
      "Without WHERE every row would be deleted."
    ],
    "resultOrderMatters": true,
    "executionMode": "sandbox",
    "setupSql": "CREATE TABLE TrainingTasks (\n  TaskID INTEGER PRIMARY KEY,\n  Title TEXT NOT NULL,\n  Completed INTEGER NOT NULL\n);\n\nINSERT INTO TrainingTasks (\n  TaskID,\n  Title,\n  Completed\n)\nVALUES\n  (1, 'Learn SELECT', 1),\n  (2, 'Learn DELETE', 0),\n  (3, 'Practise JOIN', 1),\n  (4, 'Build a project', 0);",
    "verificationSql": "SELECT\n  TaskID,\n  Title,\n  Completed\nFROM TrainingTasks\nORDER BY TaskID;"
  },
  {
    "id": "insert-multiple-rows",
    "number": 62,
    "title": "Insert Multiple Rows",
    "topic": "INSERT",
    "difficulty": "Beginner",
    "description": "A single INSERT statement can add several rows.",
    "task": "Insert three stations into TrainStations: Berlin with position 1, Hamburg with position 2, and Munich with position 3.",
    "starterSql": "",
    "solutionSql": "INSERT INTO TrainStations (\n  StationID,\n  StationName,\n  Position\n)\nVALUES\n  (1, 'Berlin', 1),\n  (2, 'Hamburg', 2),\n  (3, 'Munich', 3);",
    "hints": [
      "Write one column list.",
      "Separate each row of values with a comma.",
      "Text values require single quotes."
    ],
    "resultOrderMatters": true,
    "executionMode": "sandbox",
    "setupSql": "CREATE TABLE TrainStations (\n  StationID INTEGER PRIMARY KEY,\n  StationName TEXT NOT NULL,\n  Position INTEGER NOT NULL\n);",
    "verificationSql": "SELECT\n  StationID,\n  StationName,\n  Position\nFROM TrainStations\nORDER BY StationID;"
  },
  {
    "id": "insert-from-select",
    "number": 63,
    "title": "Insert Data from a Query",
    "topic": "INSERT SELECT",
    "difficulty": "Intermediate",
    "description": "INSERT SELECT copies the result of a query into another table.",
    "task": "Copy every product priced at 50 or more from SourceProducts into PremiumProducts.",
    "starterSql": "",
    "solutionSql": "INSERT INTO PremiumProducts (\n  ProductID,\n  ProductName,\n  Price\n)\nSELECT\n  ProductID,\n  ProductName,\n  Price\nFROM SourceProducts\nWHERE Price >= 50;",
    "hints": [
      "Do not use VALUES.",
      "Place a SELECT statement after the target column list.",
      "Filter SourceProducts using Price >= 50."
    ],
    "resultOrderMatters": true,
    "executionMode": "sandbox",
    "setupSql": "CREATE TABLE SourceProducts (\n  ProductID INTEGER PRIMARY KEY,\n  ProductName TEXT NOT NULL,\n  Price REAL NOT NULL\n);\n\nCREATE TABLE PremiumProducts (\n  ProductID INTEGER PRIMARY KEY,\n  ProductName TEXT NOT NULL,\n  Price REAL NOT NULL\n);\n\nINSERT INTO SourceProducts (\n  ProductID,\n  ProductName,\n  Price\n)\nVALUES\n  (1, 'Keyboard', 49.99),\n  (2, 'Monitor', 199.00),\n  (3, 'Mouse', 24.95),\n  (4, 'Office Chair', 89.50);",
    "verificationSql": "SELECT\n  ProductID,\n  ProductName,\n  Price\nFROM PremiumProducts\nORDER BY ProductID;"
  },
  {
    "id": "update-several-rows",
    "number": 64,
    "title": "Update Several Rows",
    "topic": "UPDATE",
    "difficulty": "Intermediate",
    "description": "UPDATE can modify every row matching a WHERE condition.",
    "task": "Increase Stock by 5 for every Inventory item whose Stock is below 10.",
    "starterSql": "",
    "solutionSql": "UPDATE Inventory\nSET Stock = Stock + 5\nWHERE Stock < 10;",
    "hints": [
      "A column can be used in its own calculation.",
      "Use Stock = Stock + 5.",
      "Only rows below 10 should be changed."
    ],
    "resultOrderMatters": true,
    "executionMode": "sandbox",
    "setupSql": "CREATE TABLE Inventory (\n  ProductID INTEGER PRIMARY KEY,\n  ProductName TEXT NOT NULL,\n  Stock INTEGER NOT NULL\n);\n\nINSERT INTO Inventory (\n  ProductID,\n  ProductName,\n  Stock\n)\nVALUES\n  (1, 'Keyboard', 4),\n  (2, 'Mouse', 15),\n  (3, 'Monitor', 7),\n  (4, 'Headset', 21);",
    "verificationSql": "SELECT\n  ProductID,\n  ProductName,\n  Stock\nFROM Inventory\nORDER BY ProductID;"
  },
  {
    "id": "delete-all-rows",
    "number": 65,
    "title": "Empty a Table",
    "topic": "DELETE",
    "difficulty": "Beginner",
    "description": "DELETE without WHERE removes every row but keeps the table structure.",
    "task": "Remove every row from TemporaryNotes without deleting the table.",
    "starterSql": "",
    "solutionSql": "DELETE FROM TemporaryNotes;",
    "hints": [
      "Do not add a WHERE clause.",
      "Use DELETE rather than DROP TABLE.",
      "The table must continue to exist."
    ],
    "resultOrderMatters": false,
    "executionMode": "sandbox",
    "setupSql": "CREATE TABLE TemporaryNotes (\n  NoteID INTEGER PRIMARY KEY,\n  NoteText TEXT\n);\n\nINSERT INTO TemporaryNotes (\n  NoteID,\n  NoteText\n)\nVALUES\n  (1, 'First note'),\n  (2, 'Second note'),\n  (3, 'Third note');",
    "verificationSql": "SELECT\n  CASE\n    WHEN EXISTS (\n      SELECT 1\n      FROM sqlite_master\n      WHERE type = 'table'\n        AND name = 'TemporaryNotes'\n    )\n    THEN 1\n    ELSE 0\n  END AS TableStillExists,\n  COUNT(*) AS RemainingRows\nFROM TemporaryNotes;"
  },
  {
    "id": "upsert-setting",
    "number": 66,
    "title": "Insert or Update with UPSERT",
    "topic": "ON CONFLICT",
    "difficulty": "Advanced",
    "description": "UPSERT inserts a row or updates it when a key conflict occurs.",
    "task": "Insert UserID 1 with Theme Dark into UserSettings. If UserID 1 already exists, update its Theme to Dark.",
    "starterSql": "",
    "solutionSql": "INSERT INTO UserSettings (\n  UserID,\n  Theme\n)\nVALUES (\n  1,\n  'Dark'\n)\nON CONFLICT (UserID)\nDO UPDATE SET\n  Theme = excluded.Theme;",
    "hints": [
      "UserID is the conflicting primary key.",
      "Use ON CONFLICT (UserID).",
      "excluded.Theme contains the attempted new value."
    ],
    "resultOrderMatters": true,
    "executionMode": "sandbox",
    "setupSql": "CREATE TABLE UserSettings (\n  UserID INTEGER PRIMARY KEY,\n  Theme TEXT NOT NULL\n);\n\nINSERT INTO UserSettings (\n  UserID,\n  Theme\n)\nVALUES (\n  1,\n  'Light'\n);",
    "verificationSql": "SELECT\n  UserID,\n  Theme\nFROM UserSettings\nORDER BY UserID;"
  },
  {
    "id": "alter-add-column",
    "number": 67,
    "title": "Add a Column",
    "topic": "ALTER TABLE",
    "difficulty": "Intermediate",
    "description": "ALTER TABLE ADD COLUMN extends an existing table.",
    "task": "Add an Email column with the TEXT data type to Staff.",
    "starterSql": "",
    "solutionSql": "ALTER TABLE Staff\nADD COLUMN Email TEXT;",
    "hints": [
      "Begin with ALTER TABLE Staff.",
      "Use ADD COLUMN.",
      "The new column is named Email."
    ],
    "resultOrderMatters": true,
    "executionMode": "sandbox",
    "setupSql": "CREATE TABLE Staff (\n  StaffID INTEGER PRIMARY KEY,\n  Name TEXT NOT NULL\n);",
    "verificationSql": "SELECT\n  name AS ColumnName,\n  type AS DeclaredType\nFROM pragma_table_info('Staff')\nORDER BY cid;"
  },
  {
    "id": "alter-rename-column",
    "number": 68,
    "title": "Rename a Column",
    "topic": "ALTER TABLE",
    "difficulty": "Intermediate",
    "description": "ALTER TABLE RENAME COLUMN changes a column name.",
    "task": "Rename the Quantity column in InventoryTest to Stock.",
    "starterSql": "",
    "solutionSql": "ALTER TABLE InventoryTest\nRENAME COLUMN Quantity TO Stock;",
    "hints": [
      "Use RENAME COLUMN.",
      "The old name is Quantity.",
      "The new name is Stock."
    ],
    "resultOrderMatters": true,
    "executionMode": "sandbox",
    "setupSql": "CREATE TABLE InventoryTest (\n  ProductID INTEGER PRIMARY KEY,\n  Quantity INTEGER NOT NULL\n);",
    "verificationSql": "SELECT\n  name AS ColumnName,\n  type AS DeclaredType\nFROM pragma_table_info('InventoryTest')\nORDER BY cid;"
  },
  {
    "id": "alter-rename-table",
    "number": 69,
    "title": "Rename a Table",
    "topic": "ALTER TABLE",
    "difficulty": "Intermediate",
    "description": "ALTER TABLE RENAME TO changes the name of a table.",
    "task": "Rename DraftOrders to ArchivedOrders.",
    "starterSql": "",
    "solutionSql": "ALTER TABLE DraftOrders\nRENAME TO ArchivedOrders;",
    "hints": [
      "Begin with ALTER TABLE DraftOrders.",
      "Use RENAME TO.",
      "Do not create a second table."
    ],
    "resultOrderMatters": true,
    "executionMode": "sandbox",
    "setupSql": "CREATE TABLE DraftOrders (\n  OrderID INTEGER PRIMARY KEY,\n  OrderName TEXT\n);",
    "verificationSql": "SELECT\n  name AS TableName\nFROM sqlite_master\nWHERE type = 'table'\n  AND name IN (\n    'DraftOrders',\n    'ArchivedOrders'\n  )\nORDER BY name;"
  },
  {
    "id": "drop-table",
    "number": 70,
    "title": "Delete a Table Structure",
    "topic": "DROP TABLE",
    "difficulty": "Intermediate",
    "description": "DROP TABLE permanently removes a table and its rows.",
    "task": "Delete the table named ObsoleteData.",
    "starterSql": "",
    "solutionSql": "DROP TABLE ObsoleteData;",
    "hints": [
      "Use DROP TABLE.",
      "This differs from DELETE.",
      "The table should no longer exist."
    ],
    "resultOrderMatters": false,
    "executionMode": "sandbox",
    "setupSql": "CREATE TABLE ObsoleteData (\n  DataID INTEGER PRIMARY KEY,\n  Content TEXT\n);\n\nINSERT INTO ObsoleteData (\n  DataID,\n  Content\n)\nVALUES (\n  1,\n  'Old data'\n);",
    "verificationSql": "SELECT\n  COUNT(*) AS RemainingTables\nFROM sqlite_master\nWHERE type = 'table'\n  AND name = 'ObsoleteData';"
  },
  {
    "id": "create-index",
    "number": 71,
    "title": "Create an Index",
    "topic": "CREATE INDEX",
    "difficulty": "Intermediate",
    "description": "An index can speed up searches and joins on selected columns.",
    "task": "Create an index named idx_orders_customer on OrdersTest.CustomerID.",
    "starterSql": "",
    "solutionSql": "CREATE INDEX idx_orders_customer\nON OrdersTest (CustomerID);",
    "hints": [
      "Begin with CREATE INDEX.",
      "Specify the table after ON.",
      "Place CustomerID inside parentheses."
    ],
    "resultOrderMatters": true,
    "executionMode": "sandbox",
    "setupSql": "CREATE TABLE OrdersTest (\n  OrderID INTEGER PRIMARY KEY,\n  CustomerID INTEGER NOT NULL,\n  OrderDate TEXT\n);",
    "verificationSql": "SELECT\n  indexes.name AS IndexName,\n  indexes.\"unique\" AS IsUnique,\n  columns.name AS ColumnName\nFROM pragma_index_list('OrdersTest') AS indexes\nJOIN pragma_index_info(indexes.name) AS columns\nWHERE indexes.name = 'idx_orders_customer'\nORDER BY columns.seqno;"
  },
  {
    "id": "create-unique-index",
    "number": 72,
    "title": "Create a Unique Index",
    "topic": "CREATE UNIQUE INDEX",
    "difficulty": "Advanced",
    "description": "A unique index speeds up searches and prevents duplicate values.",
    "task": "Create a unique index named idx_users_email on UsersTest.Email.",
    "starterSql": "",
    "solutionSql": "CREATE UNIQUE INDEX idx_users_email\nON UsersTest (Email);",
    "hints": [
      "Use CREATE UNIQUE INDEX.",
      "The index name is idx_users_email.",
      "The indexed column is Email."
    ],
    "resultOrderMatters": true,
    "executionMode": "sandbox",
    "setupSql": "CREATE TABLE UsersTest (\n  UserID INTEGER PRIMARY KEY,\n  Email TEXT NOT NULL\n);\n\nINSERT INTO UsersTest (\n  UserID,\n  Email\n)\nVALUES\n  (1, 'anna@example.com'),\n  (2, 'ben@example.com');",
    "verificationSql": "SELECT\n  indexes.name AS IndexName,\n  indexes.\"unique\" AS IsUnique,\n  columns.name AS ColumnName\nFROM pragma_index_list('UsersTest') AS indexes\nJOIN pragma_index_info(indexes.name) AS columns\nWHERE indexes.name = 'idx_users_email'\nORDER BY columns.seqno;"
  },
  {
    "id": "create-view",
    "number": 73,
    "title": "Create a View",
    "topic": "CREATE VIEW",
    "difficulty": "Intermediate",
    "description": "A view stores a reusable SELECT statement.",
    "task": "Create a view named HighValueSales containing SaleID, CustomerName, and Amount for sales of at least 500.",
    "starterSql": "",
    "solutionSql": "CREATE VIEW HighValueSales AS\nSELECT\n  SaleID,\n  CustomerName,\n  Amount\nFROM Sales\nWHERE Amount >= 500;",
    "hints": [
      "Begin with CREATE VIEW HighValueSales AS.",
      "A view is based on a SELECT statement.",
      "Filter Amount using at least 500."
    ],
    "resultOrderMatters": true,
    "executionMode": "sandbox",
    "setupSql": "CREATE TABLE Sales (\n  SaleID INTEGER PRIMARY KEY,\n  CustomerName TEXT NOT NULL,\n  Amount REAL NOT NULL\n);\n\nINSERT INTO Sales (\n  SaleID,\n  CustomerName,\n  Amount\n)\nVALUES\n  (1, 'Alpha GmbH', 250),\n  (2, 'Beta AG', 900),\n  (3, 'Gamma GmbH', 500),\n  (4, 'Delta AG', 125);",
    "verificationSql": "SELECT\n  SaleID,\n  CustomerName,\n  Amount\nFROM HighValueSales\nORDER BY SaleID;"
  },
  {
    "id": "commit-transaction",
    "number": 74,
    "title": "Commit a Transaction",
    "topic": "BEGIN and COMMIT",
    "difficulty": "Advanced",
    "description": "A transaction groups several statements into one logical operation.",
    "task": "Transfer 100 from AccountID 1 to AccountID 2. Use BEGIN and COMMIT.",
    "starterSql": "",
    "solutionSql": "BEGIN;\n\nUPDATE Accounts\nSET Balance = Balance - 100\nWHERE AccountID = 1;\n\nUPDATE Accounts\nSET Balance = Balance + 100\nWHERE AccountID = 2;\n\nCOMMIT;",
    "hints": [
      "Begin the transaction before the updates.",
      "Subtract from account 1 and add to account 2.",
      "COMMIT makes both changes permanent."
    ],
    "resultOrderMatters": true,
    "executionMode": "sandbox",
    "setupSql": "CREATE TABLE Accounts (\n  AccountID INTEGER PRIMARY KEY,\n  AccountName TEXT NOT NULL,\n  Balance REAL NOT NULL\n);\n\nINSERT INTO Accounts (\n  AccountID,\n  AccountName,\n  Balance\n)\nVALUES\n  (1, 'Main Account', 1000),\n  (2, 'Savings Account', 500);",
    "verificationSql": "SELECT\n  AccountID,\n  AccountName,\n  Balance\nFROM Accounts\nORDER BY AccountID;"
  },
  {
    "id": "rollback-transaction",
    "number": 75,
    "title": "Roll Back a Transaction",
    "topic": "ROLLBACK",
    "difficulty": "Advanced",
    "description": "ROLLBACK cancels changes made inside the current transaction.",
    "task": "Begin a transaction, subtract 250 from AccountID 1, and then roll the transaction back.",
    "starterSql": "",
    "solutionSql": "BEGIN;\n\nUPDATE Accounts\nSET Balance = Balance - 250\nWHERE AccountID = 1;\n\nROLLBACK;",
    "hints": [
      "Start with BEGIN.",
      "Perform the UPDATE inside the transaction.",
      "ROLLBACK restores the original balance."
    ],
    "resultOrderMatters": true,
    "executionMode": "sandbox",
    "setupSql": "CREATE TABLE Accounts (\n  AccountID INTEGER PRIMARY KEY,\n  AccountName TEXT NOT NULL,\n  Balance REAL NOT NULL\n);\n\nINSERT INTO Accounts (\n  AccountID,\n  AccountName,\n  Balance\n)\nVALUES\n  (1, 'Main Account', 1000),\n  (2, 'Savings Account', 500);",
    "verificationSql": "SELECT\n  AccountID,\n  AccountName,\n  Balance\nFROM Accounts\nORDER BY AccountID;"
  }
,

  {
    "id": "composite-primary-key",
    "number": 76,
    "title": "Create a Composite Primary Key",
    "topic": "PRIMARY KEY",
    "difficulty": "Advanced",
    "description": "A composite primary key uniquely identifies a row using more than one column.",
    "task": "Create CourseEnrollments with StudentID INTEGER, CourseID INTEGER, and a composite primary key containing both columns.",
    "starterSql": "",
    "solutionSql": "CREATE TABLE CourseEnrollments (\n  StudentID INTEGER,\n  CourseID INTEGER,\n  PRIMARY KEY (\n    StudentID,\n    CourseID\n  )\n);",
    "hints": [
      "Define both columns first.",
      "Add PRIMARY KEY as a table constraint.",
      "The order is StudentID, CourseID."
    ],
    "resultOrderMatters": true,
    "executionMode": "sandbox",
    "setupSql": "SELECT 1;",
    "verificationSql": "SELECT\n  name AS ColumnName,\n  type AS DeclaredType,\n  pk AS PrimaryKeyOrder\nFROM pragma_table_info('CourseEnrollments')\nORDER BY cid;"
  },
  {
    "id": "composite-foreign-key",
    "number": 77,
    "title": "Create a Composite Foreign Key",
    "topic": "FOREIGN KEY",
    "difficulty": "Advanced",
    "description": "A composite foreign key references a parent key made from several columns.",
    "task": "Create RegistrationLines with StudentID, CourseID, and EditionYear. CourseID and EditionYear must reference the matching composite key in CourseEditions.",
    "starterSql": "",
    "solutionSql": "CREATE TABLE RegistrationLines (\n  StudentID INTEGER,\n  CourseID INTEGER,\n  EditionYear INTEGER,\n  FOREIGN KEY (\n    CourseID,\n    EditionYear\n  )\n  REFERENCES CourseEditions (\n    CourseID,\n    EditionYear\n  )\n);",
    "hints": [
      "The parent table already exists.",
      "Both foreign-key columns belong inside one constraint.",
      "Column order must match the parent key."
    ],
    "resultOrderMatters": true,
    "executionMode": "sandbox",
    "setupSql": "CREATE TABLE CourseEditions (\n  CourseID INTEGER,\n  EditionYear INTEGER,\n  CourseName TEXT,\n  PRIMARY KEY (\n    CourseID,\n    EditionYear\n  )\n);",
    "verificationSql": "SELECT\n  seq AS Sequence,\n  \"from\" AS ChildColumn,\n  \"table\" AS ParentTable,\n  \"to\" AS ParentColumn\nFROM pragma_foreign_key_list(\n  'RegistrationLines'\n)\nORDER BY id, seq;"
  },
  {
    "id": "on-delete-cascade",
    "number": 78,
    "title": "Delete Related Rows Automatically",
    "topic": "ON DELETE CASCADE",
    "difficulty": "Advanced",
    "description": "ON DELETE CASCADE removes child rows when their parent row is deleted.",
    "task": "Create TeamMembers with TeamID referencing Teams.TeamID using ON DELETE CASCADE. Add two members to Team 1, one member to Team 2, and then delete Team 1.",
    "starterSql": "",
    "solutionSql": "CREATE TABLE TeamMembers (\n  MemberID INTEGER PRIMARY KEY,\n  MemberName TEXT NOT NULL,\n  TeamID INTEGER NOT NULL,\n  FOREIGN KEY (TeamID)\n    REFERENCES Teams(TeamID)\n    ON DELETE CASCADE\n);\n\nINSERT INTO TeamMembers (\n  MemberID,\n  MemberName,\n  TeamID\n)\nVALUES\n  (1, 'Anna', 1),\n  (2, 'Ben', 1),\n  (3, 'Carla', 2);\n\nDELETE FROM Teams\nWHERE TeamID = 1;",
    "hints": [
      "Place ON DELETE CASCADE after REFERENCES.",
      "Insert the child rows before deleting the parent.",
      "Only the member of Team 2 should remain."
    ],
    "resultOrderMatters": true,
    "executionMode": "sandbox",
    "setupSql": "CREATE TABLE Teams (\n  TeamID INTEGER PRIMARY KEY,\n  TeamName TEXT NOT NULL\n);\n\nINSERT INTO Teams (\n  TeamID,\n  TeamName\n)\nVALUES\n  (1, 'Blue Team'),\n  (2, 'Green Team');",
    "verificationSql": "SELECT\n  members.MemberID,\n  members.MemberName,\n  members.TeamID,\n  (\n    SELECT COUNT(*)\n    FROM pragma_foreign_key_list(\n      'TeamMembers'\n    )\n    WHERE on_delete = 'CASCADE'\n  ) AS CascadeRule\nFROM TeamMembers AS members\nORDER BY members.MemberID;"
  },
  {
    "id": "on-update-cascade",
    "number": 79,
    "title": "Update Related Keys Automatically",
    "topic": "ON UPDATE CASCADE",
    "difficulty": "Advanced",
    "description": "ON UPDATE CASCADE propagates a changed parent key to child rows.",
    "task": "Create EmployeesRef whose DepartmentCode references DepartmentsRef.DepartmentCode using ON UPDATE CASCADE. Add one employee in IT and then change the department code from IT to TECH.",
    "starterSql": "",
    "solutionSql": "CREATE TABLE EmployeesRef (\n  EmployeeID INTEGER PRIMARY KEY,\n  EmployeeName TEXT NOT NULL,\n  DepartmentCode TEXT,\n  FOREIGN KEY (DepartmentCode)\n    REFERENCES DepartmentsRef(\n      DepartmentCode\n    )\n    ON UPDATE CASCADE\n);\n\nINSERT INTO EmployeesRef (\n  EmployeeID,\n  EmployeeName,\n  DepartmentCode\n)\nVALUES (\n  1,\n  'Daniel',\n  'IT'\n);\n\nUPDATE DepartmentsRef\nSET DepartmentCode = 'TECH'\nWHERE DepartmentCode = 'IT';",
    "hints": [
      "Use ON UPDATE CASCADE.",
      "Insert the child row before changing the parent key.",
      "The employee must end with DepartmentCode TECH."
    ],
    "resultOrderMatters": true,
    "executionMode": "sandbox",
    "setupSql": "CREATE TABLE DepartmentsRef (\n  DepartmentCode TEXT PRIMARY KEY,\n  DepartmentName TEXT NOT NULL\n);\n\nINSERT INTO DepartmentsRef (\n  DepartmentCode,\n  DepartmentName\n)\nVALUES (\n  'IT',\n  'Information Technology'\n);",
    "verificationSql": "SELECT\n  employees.EmployeeID,\n  employees.EmployeeName,\n  employees.DepartmentCode,\n  (\n    SELECT COUNT(*)\n    FROM pragma_foreign_key_list(\n      'EmployeesRef'\n    )\n    WHERE on_update = 'CASCADE'\n  ) AS CascadeRule\nFROM EmployeesRef AS employees\nORDER BY employees.EmployeeID;"
  },
  {
    "id": "on-delete-set-null",
    "number": 80,
    "title": "Keep Children with SET NULL",
    "topic": "ON DELETE SET NULL",
    "difficulty": "Advanced",
    "description": "ON DELETE SET NULL preserves child rows but clears their foreign-key value.",
    "task": "Create ProjectTasks with ProjectID referencing ProjectsRef.ProjectID using ON DELETE SET NULL. Add a task for Project 1 and then delete Project 1.",
    "starterSql": "",
    "solutionSql": "CREATE TABLE ProjectTasks (\n  TaskID INTEGER PRIMARY KEY,\n  TaskName TEXT NOT NULL,\n  ProjectID INTEGER,\n  FOREIGN KEY (ProjectID)\n    REFERENCES ProjectsRef(ProjectID)\n    ON DELETE SET NULL\n);\n\nINSERT INTO ProjectTasks (\n  TaskID,\n  TaskName,\n  ProjectID\n)\nVALUES (\n  1,\n  'Prepare report',\n  1\n);\n\nDELETE FROM ProjectsRef\nWHERE ProjectID = 1;",
    "hints": [
      "ProjectID in the child table must allow NULL.",
      "Use ON DELETE SET NULL.",
      "The task should remain after deleting the project."
    ],
    "resultOrderMatters": true,
    "executionMode": "sandbox",
    "setupSql": "CREATE TABLE ProjectsRef (\n  ProjectID INTEGER PRIMARY KEY,\n  ProjectName TEXT NOT NULL\n);\n\nINSERT INTO ProjectsRef (\n  ProjectID,\n  ProjectName\n)\nVALUES (\n  1,\n  'SQLTrain'\n);",
    "verificationSql": "SELECT\n  tasks.TaskID,\n  tasks.TaskName,\n  tasks.ProjectID,\n  (\n    SELECT COUNT(*)\n    FROM pragma_foreign_key_list(\n      'ProjectTasks'\n    )\n    WHERE on_delete = 'SET NULL'\n  ) AS SetNullRule\nFROM ProjectTasks AS tasks\nORDER BY tasks.TaskID;"
  },
  {
    "id": "drop-index",
    "number": 81,
    "title": "Remove an Index",
    "topic": "DROP INDEX",
    "difficulty": "Intermediate",
    "description": "DROP INDEX removes an index without deleting its table.",
    "task": "Remove the index named idx_logs_level.",
    "starterSql": "",
    "solutionSql": "DROP INDEX idx_logs_level;",
    "hints": [
      "Use DROP INDEX.",
      "Do not drop the Logs table.",
      "The index name is idx_logs_level."
    ],
    "resultOrderMatters": false,
    "executionMode": "sandbox",
    "setupSql": "CREATE TABLE Logs (\n  LogID INTEGER PRIMARY KEY,\n  LogLevel TEXT,\n  Message TEXT\n);\n\nCREATE INDEX idx_logs_level\nON Logs(LogLevel);",
    "verificationSql": "SELECT\n  COUNT(*) AS RemainingIndexes\nFROM sqlite_master\nWHERE type = 'index'\n  AND name = 'idx_logs_level';"
  },
  {
    "id": "drop-view",
    "number": 82,
    "title": "Remove a View",
    "topic": "DROP VIEW",
    "difficulty": "Intermediate",
    "description": "DROP VIEW removes a stored query without deleting its underlying table.",
    "task": "Remove the view named ActiveUsers.",
    "starterSql": "",
    "solutionSql": "DROP VIEW ActiveUsers;",
    "hints": [
      "Use DROP VIEW.",
      "Do not drop UsersViewSource.",
      "Only the stored view should disappear."
    ],
    "resultOrderMatters": false,
    "executionMode": "sandbox",
    "setupSql": "CREATE TABLE UsersViewSource (\n  UserID INTEGER PRIMARY KEY,\n  UserName TEXT,\n  IsActive INTEGER\n);\n\nCREATE VIEW ActiveUsers AS\nSELECT\n  UserID,\n  UserName\nFROM UsersViewSource\nWHERE IsActive = 1;",
    "verificationSql": "SELECT\n  COUNT(*) AS RemainingViews\nFROM sqlite_master\nWHERE type = 'view'\n  AND name = 'ActiveUsers';"
  },
  {
    "id": "after-insert-trigger",
    "number": 83,
    "title": "Audit Inserts with a Trigger",
    "topic": "CREATE TRIGGER",
    "difficulty": "Advanced",
    "description": "An AFTER INSERT trigger can automatically create an audit entry.",
    "task": "Create trg_orders_insert. After an insert into OrdersTrigger, add the new OrderID and the text Created to OrderAudit. Then insert OrderID 10 for Customer Alpha.",
    "starterSql": "",
    "solutionSql": "CREATE TRIGGER trg_orders_insert\nAFTER INSERT ON OrdersTrigger\nBEGIN\n  INSERT INTO OrderAudit (\n    OrderID,\n    ActionName\n  )\n  VALUES (\n    NEW.OrderID,\n    'Created'\n  );\nEND;\n\nINSERT INTO OrdersTrigger (\n  OrderID,\n  CustomerName\n)\nVALUES (\n  10,\n  'Alpha'\n);",
    "hints": [
      "Use NEW.OrderID inside the trigger.",
      "The trigger runs AFTER INSERT.",
      "Insert the test order after creating the trigger."
    ],
    "resultOrderMatters": true,
    "executionMode": "sandbox",
    "setupSql": "CREATE TABLE OrdersTrigger (\n  OrderID INTEGER PRIMARY KEY,\n  CustomerName TEXT NOT NULL\n);\n\nCREATE TABLE OrderAudit (\n  AuditID INTEGER PRIMARY KEY AUTOINCREMENT,\n  OrderID INTEGER,\n  ActionName TEXT\n);",
    "verificationSql": "SELECT\n  audit.OrderID,\n  audit.ActionName,\n  (\n    SELECT COUNT(*)\n    FROM sqlite_master\n    WHERE type = 'trigger'\n      AND name = 'trg_orders_insert'\n  ) AS TriggerExists\nFROM OrderAudit AS audit\nORDER BY audit.AuditID;"
  },
  {
    "id": "after-update-trigger",
    "number": 84,
    "title": "Audit Updates with OLD and NEW",
    "topic": "UPDATE TRIGGER",
    "difficulty": "Advanced",
    "description": "Triggers can access values before and after an update through OLD and NEW.",
    "task": "Create trg_product_price_update. After Price changes, add ProductID, old Price, and new Price to ProductPriceAudit. Then change ProductID 1 from 20 to 25.",
    "starterSql": "",
    "solutionSql": "CREATE TRIGGER trg_product_price_update\nAFTER UPDATE OF Price\nON ProductsTrigger\nBEGIN\n  INSERT INTO ProductPriceAudit (\n    ProductID,\n    OldPrice,\n    NewPrice\n  )\n  VALUES (\n    NEW.ProductID,\n    OLD.Price,\n    NEW.Price\n  );\nEND;\n\nUPDATE ProductsTrigger\nSET Price = 25\nWHERE ProductID = 1;",
    "hints": [
      "Use OLD.Price and NEW.Price.",
      "Limit the trigger to updates of Price.",
      "Run the UPDATE after creating the trigger."
    ],
    "resultOrderMatters": true,
    "executionMode": "sandbox",
    "setupSql": "CREATE TABLE ProductsTrigger (\n  ProductID INTEGER PRIMARY KEY,\n  ProductName TEXT,\n  Price REAL\n);\n\nCREATE TABLE ProductPriceAudit (\n  AuditID INTEGER PRIMARY KEY AUTOINCREMENT,\n  ProductID INTEGER,\n  OldPrice REAL,\n  NewPrice REAL\n);\n\nINSERT INTO ProductsTrigger (\n  ProductID,\n  ProductName,\n  Price\n)\nVALUES (\n  1,\n  'Cable',\n  20\n);",
    "verificationSql": "SELECT\n  audit.ProductID,\n  audit.OldPrice,\n  audit.NewPrice,\n  (\n    SELECT COUNT(*)\n    FROM sqlite_master\n    WHERE type = 'trigger'\n      AND name =\n        'trg_product_price_update'\n  ) AS TriggerExists\nFROM ProductPriceAudit AS audit\nORDER BY audit.AuditID;"
  },
  {
    "id": "drop-trigger",
    "number": 85,
    "title": "Remove a Trigger",
    "topic": "DROP TRIGGER",
    "difficulty": "Intermediate",
    "description": "DROP TRIGGER removes automatic trigger behavior.",
    "task": "Remove the trigger named trg_notes_insert.",
    "starterSql": "",
    "solutionSql": "DROP TRIGGER trg_notes_insert;",
    "hints": [
      "Use DROP TRIGGER.",
      "The NotesTrigger table must remain.",
      "Only the trigger should be removed."
    ],
    "resultOrderMatters": false,
    "executionMode": "sandbox",
    "setupSql": "CREATE TABLE NotesTrigger (\n  NoteID INTEGER PRIMARY KEY,\n  NoteText TEXT\n);\n\nCREATE TABLE NotesAudit (\n  AuditID INTEGER PRIMARY KEY\n);\n\nCREATE TRIGGER trg_notes_insert\nAFTER INSERT ON NotesTrigger\nBEGIN\n  INSERT INTO NotesAudit (\n    AuditID\n  )\n  VALUES (NULL);\nEND;",
    "verificationSql": "SELECT\n  COUNT(*) AS RemainingTriggers\nFROM sqlite_master\nWHERE type = 'trigger'\n  AND name = 'trg_notes_insert';"
  },
  {
    "id": "savepoint-release",
    "number": 86,
    "title": "Create and Release a Savepoint",
    "topic": "SAVEPOINT",
    "difficulty": "Advanced",
    "description": "A savepoint marks a position inside a transaction.",
    "task": "Begin a transaction, create a savepoint named bonus, add 100 to the wallet balance, release the savepoint, and commit.",
    "starterSql": "",
    "solutionSql": "BEGIN;\n\nSAVEPOINT bonus;\n\nUPDATE Wallet\nSET Balance = Balance + 100\nWHERE WalletID = 1;\n\nRELEASE SAVEPOINT bonus;\n\nCOMMIT;",
    "hints": [
      "Create the savepoint after BEGIN.",
      "Use RELEASE SAVEPOINT bonus.",
      "COMMIT finishes the transaction."
    ],
    "resultOrderMatters": true,
    "executionMode": "sandbox",
    "setupSql": "CREATE TABLE Wallet (\n  WalletID INTEGER PRIMARY KEY,\n  Balance REAL NOT NULL\n);\n\nINSERT INTO Wallet (\n  WalletID,\n  Balance\n)\nVALUES (\n  1,\n  1000\n);",
    "verificationSql": "SELECT\n  WalletID,\n  Balance\nFROM Wallet\nORDER BY WalletID;"
  },
  {
    "id": "rollback-to-savepoint",
    "number": 87,
    "title": "Roll Back Part of a Transaction",
    "topic": "ROLLBACK TO",
    "difficulty": "Advanced",
    "description": "ROLLBACK TO cancels only the work performed after a savepoint.",
    "task": "Begin a transaction, add 100 to Wallet 1, create savepoint risky, subtract 500, roll back to risky, release it, and commit.",
    "starterSql": "",
    "solutionSql": "BEGIN;\n\nUPDATE Wallet\nSET Balance = Balance + 100\nWHERE WalletID = 1;\n\nSAVEPOINT risky;\n\nUPDATE Wallet\nSET Balance = Balance - 500\nWHERE WalletID = 1;\n\nROLLBACK TO SAVEPOINT risky;\n\nRELEASE SAVEPOINT risky;\n\nCOMMIT;",
    "hints": [
      "The first update occurs before the savepoint.",
      "Only the second update should be cancelled.",
      "The final balance should be 1100."
    ],
    "resultOrderMatters": true,
    "executionMode": "sandbox",
    "setupSql": "CREATE TABLE Wallet (\n  WalletID INTEGER PRIMARY KEY,\n  Balance REAL NOT NULL\n);\n\nINSERT INTO Wallet (\n  WalletID,\n  Balance\n)\nVALUES (\n  1,\n  1000\n);",
    "verificationSql": "SELECT\n  WalletID,\n  Balance\nFROM Wallet\nORDER BY WalletID;"
  },
  {
    "id": "recursive-number-sequence",
    "number": 88,
    "title": "Build a Recursive Number Sequence",
    "topic": "RECURSIVE CTE",
    "difficulty": "Advanced",
    "description": "A recursive CTE repeatedly applies a query until its stopping condition is reached.",
    "task": "Use a recursive CTE named NumberSequence to return the numbers 1 through 10 in a column named Number.",
    "starterSql": "",
    "solutionSql": "WITH RECURSIVE NumberSequence (\n  Number\n) AS (\n  SELECT 1\n\n  UNION ALL\n\n  SELECT Number + 1\n  FROM NumberSequence\n  WHERE Number < 10\n)\nSELECT Number\nFROM NumberSequence\nORDER BY Number;",
    "hints": [
      "The first SELECT is the anchor row.",
      "The recursive SELECT adds one.",
      "Stop when Number reaches 10."
    ],
    "resultOrderMatters": true
  },
  {
    "id": "recursive-factorial",
    "number": 89,
    "title": "Calculate Factorials Recursively",
    "topic": "RECURSIVE CTE",
    "difficulty": "Advanced",
    "description": "Recursive CTEs can carry several calculated values between iterations.",
    "task": "Return the factorial values for the numbers 1 through 7. Name the result column Factorial.",
    "starterSql": "",
    "solutionSql": "WITH RECURSIVE Factorials (\n  Number,\n  Factorial\n) AS (\n  SELECT\n    1,\n    1\n\n  UNION ALL\n\n  SELECT\n    Number + 1,\n    Factorial * (Number + 1)\n  FROM Factorials\n  WHERE Number < 7\n)\nSELECT\n  Number,\n  Factorial\nFROM Factorials\nORDER BY Number;",
    "hints": [
      "Carry Number and Factorial through the CTE.",
      "Multiply by the next number.",
      "Stop at Number 7."
    ],
    "resultOrderMatters": true
  },
  {
    "id": "explain-query-plan",
    "number": 90,
    "title": "Inspect a Query Plan",
    "topic": "EXPLAIN QUERY PLAN",
    "difficulty": "Advanced",
    "description": "EXPLAIN QUERY PLAN shows how SQLite intends to access tables and indexes.",
    "task": "Explain the query plan for selecting all customers whose Country is Germany.",
    "starterSql": "",
    "solutionSql": "EXPLAIN QUERY PLAN\nSELECT *\nFROM Customers\nWHERE Country = 'Germany';",
    "hints": [
      "Place EXPLAIN QUERY PLAN before SELECT.",
      "Do not run the SELECT separately.",
      "Filter Country using Germany."
    ],
    "resultOrderMatters": true
  },
  {
    "id": "partial-index",
    "number": 91,
    "title": "Create a Partial Index",
    "topic": "PARTIAL INDEX",
    "difficulty": "Advanced",
    "description": "A partial index contains only rows matching a WHERE condition.",
    "task": "Create idx_open_orders_customer on OrdersPartial.CustomerID, but include only rows whose Status is Open.",
    "starterSql": "",
    "solutionSql": "CREATE INDEX idx_open_orders_customer\nON OrdersPartial(CustomerID)\nWHERE Status = 'Open';",
    "hints": [
      "Create the index normally first.",
      "Add a WHERE clause after the column list.",
      "The filter value is Open."
    ],
    "resultOrderMatters": true,
    "executionMode": "sandbox",
    "setupSql": "CREATE TABLE OrdersPartial (\n  OrderID INTEGER PRIMARY KEY,\n  CustomerID INTEGER,\n  Status TEXT\n);",
    "verificationSql": "SELECT\n  indexes.name AS IndexName,\n  indexes.partial AS IsPartial,\n  columns.name AS ColumnName,\n  CASE\n    WHEN UPPER(\n      REPLACE(\n        REPLACE(master.sql, ' ', ''),\n        CHAR(10),\n        ''\n      )\n    ) LIKE '%WHERESTATUS=''OPEN''%'\n    THEN 1\n    ELSE 0\n  END AS HasOpenFilter\nFROM pragma_index_list(\n  'OrdersPartial'\n) AS indexes\nJOIN pragma_index_info(\n  indexes.name\n) AS columns\nJOIN sqlite_master AS master\n  ON master.type = 'index'\n  AND master.name = indexes.name\nWHERE indexes.name =\n  'idx_open_orders_customer'\nORDER BY columns.seqno;"
  },
  {
    "id": "expression-index",
    "number": 92,
    "title": "Create an Expression Index",
    "topic": "EXPRESSION INDEX",
    "difficulty": "Advanced",
    "description": "An expression index stores the result of a calculated expression.",
    "task": "Create idx_customers_lower_email on LOWER(Email) in CustomersExpression.",
    "starterSql": "",
    "solutionSql": "CREATE INDEX idx_customers_lower_email\nON CustomersExpression(\n  LOWER(Email)\n);",
    "hints": [
      "Place LOWER(Email) inside the index column list.",
      "Use the exact requested index name.",
      "Expression indexes can support case-insensitive searches."
    ],
    "resultOrderMatters": false,
    "executionMode": "sandbox",
    "setupSql": "CREATE TABLE CustomersExpression (\n  CustomerID INTEGER PRIMARY KEY,\n  Email TEXT NOT NULL\n);",
    "verificationSql": "SELECT\n  name AS IndexName,\n  CASE\n    WHEN UPPER(\n      REPLACE(\n        REPLACE(sql, ' ', ''),\n        CHAR(10),\n        ''\n      )\n    ) LIKE '%LOWER(EMAIL)%'\n    THEN 1\n    ELSE 0\n  END AS HasLowerEmailExpression\nFROM sqlite_master\nWHERE type = 'index'\n  AND name =\n    'idx_customers_lower_email';"
  },
  {
    "id": "generated-column",
    "number": 93,
    "title": "Create a Generated Column",
    "topic": "GENERATED COLUMN",
    "difficulty": "Advanced",
    "description": "A generated column derives its value automatically from other columns.",
    "task": "Create InvoiceLines with NetPrice, TaxRate, and a stored generated column GrossPrice calculated as NetPrice multiplied by 1 plus TaxRate and rounded to two decimals. Insert one row with NetPrice 100 and TaxRate 0.19.",
    "starterSql": "",
    "solutionSql": "CREATE TABLE InvoiceLines (\n  LineID INTEGER PRIMARY KEY,\n  NetPrice REAL NOT NULL,\n  TaxRate REAL NOT NULL,\n  GrossPrice REAL\n    GENERATED ALWAYS AS (\n      ROUND(\n        NetPrice * (1 + TaxRate),\n        2\n      )\n    ) STORED\n);\n\nINSERT INTO InvoiceLines (\n  LineID,\n  NetPrice,\n  TaxRate\n)\nVALUES (\n  1,\n  100,\n  0.19\n);",
    "hints": [
      "Use GENERATED ALWAYS AS.",
      "The generated expression uses NetPrice and TaxRate.",
      "Do not insert GrossPrice manually."
    ],
    "resultOrderMatters": true,
    "executionMode": "sandbox",
    "setupSql": "SELECT 1;",
    "verificationSql": "SELECT\n  lines.LineID,\n  lines.NetPrice,\n  lines.TaxRate,\n  lines.GrossPrice,\n  (\n    SELECT hidden\n    FROM pragma_table_xinfo(\n      'InvoiceLines'\n    )\n    WHERE name = 'GrossPrice'\n  ) AS GeneratedKind\nFROM InvoiceLines AS lines\nORDER BY lines.LineID;"
  },
  {
    "id": "self-referencing-foreign-key",
    "number": 94,
    "title": "Create a Self-Referencing Relationship",
    "topic": "SELF REFERENCE",
    "difficulty": "Advanced",
    "description": "A self-referencing foreign key connects rows within the same table.",
    "task": "Create EmployeesTree with EmployeeID, EmployeeName, and ManagerID referencing EmployeesTree.EmployeeID. Insert Alice as manager and Bob reporting to Alice.",
    "starterSql": "",
    "solutionSql": "CREATE TABLE EmployeesTree (\n  EmployeeID INTEGER PRIMARY KEY,\n  EmployeeName TEXT NOT NULL,\n  ManagerID INTEGER,\n  FOREIGN KEY (ManagerID)\n    REFERENCES EmployeesTree(\n      EmployeeID\n    )\n);\n\nINSERT INTO EmployeesTree (\n  EmployeeID,\n  EmployeeName,\n  ManagerID\n)\nVALUES\n  (1, 'Alice', NULL),\n  (2, 'Bob', 1);",
    "hints": [
      "The parent and child table are the same.",
      "Alice has no manager.",
      "Bob stores Alice's EmployeeID in ManagerID."
    ],
    "resultOrderMatters": true,
    "executionMode": "sandbox",
    "setupSql": "SELECT 1;",
    "verificationSql": "SELECT\n  employees.EmployeeID,\n  employees.EmployeeName,\n  employees.ManagerID,\n  (\n    SELECT COUNT(*)\n    FROM pragma_foreign_key_list(\n      'EmployeesTree'\n    )\n    WHERE \"from\" = 'ManagerID'\n      AND \"table\" = 'EmployeesTree'\n      AND \"to\" = 'EmployeeID'\n  ) AS HasSelfReference\nFROM EmployeesTree AS employees\nORDER BY employees.EmployeeID;"
  },
  {
    "id": "multi-column-index",
    "number": 95,
    "title": "Create a Multi-Column Index",
    "topic": "COMPOSITE INDEX",
    "difficulty": "Advanced",
    "description": "A multi-column index can optimize filters and sorting that use the same leading columns.",
    "task": "Create idx_shipments_customer_date on CustomerID followed by ShippedDate in Shipments.",
    "starterSql": "",
    "solutionSql": "CREATE INDEX idx_shipments_customer_date\nON Shipments (\n  CustomerID,\n  ShippedDate\n);",
    "hints": [
      "Column order matters in an index.",
      "CustomerID must come first.",
      "ShippedDate must come second."
    ],
    "resultOrderMatters": true,
    "executionMode": "sandbox",
    "setupSql": "CREATE TABLE Shipments (\n  ShipmentID INTEGER PRIMARY KEY,\n  CustomerID INTEGER,\n  ShippedDate TEXT\n);",
    "verificationSql": "SELECT\n  indexes.name AS IndexName,\n  columns.seqno AS Sequence,\n  columns.name AS ColumnName\nFROM pragma_index_list(\n  'Shipments'\n) AS indexes\nJOIN pragma_index_info(\n  indexes.name\n) AS columns\nWHERE indexes.name =\n  'idx_shipments_customer_date'\nORDER BY columns.seqno;"
  },
  {
    "id": "capstone-customer-revenue",
    "number": 96,
    "title": "Project: Top Customers by Revenue",
    "topic": "JOIN and GROUP BY",
    "difficulty": "Advanced",
    "description": "Combine several related tables to calculate a business metric.",
    "task": "Return the ten customers with the highest calculated revenue. Use Quantity multiplied by Price and name the rounded total Revenue.",
    "starterSql": "",
    "solutionSql": "SELECT\n  customers.CustomerID,\n  customers.CustomerName,\n  ROUND(\n    SUM(\n      details.Quantity *\n      products.Price\n    ),\n    2\n  ) AS Revenue\nFROM Customers AS customers\nJOIN Orders AS orders\n  ON orders.CustomerID =\n    customers.CustomerID\nJOIN OrderDetails AS details\n  ON details.OrderID =\n    orders.OrderID\nJOIN Products AS products\n  ON products.ProductID =\n    details.ProductID\nGROUP BY\n  customers.CustomerID,\n  customers.CustomerName\nORDER BY\n  Revenue DESC,\n  customers.CustomerName\nLIMIT 10;",
    "hints": [
      "Join Customers, Orders, OrderDetails, and Products.",
      "Revenue is Quantity multiplied by Price.",
      "Group by the customer columns."
    ],
    "resultOrderMatters": true
  },
  {
    "id": "capstone-category-analysis",
    "number": 97,
    "title": "Project: Category Analysis",
    "topic": "AGGREGATE REPORT",
    "difficulty": "Advanced",
    "description": "A grouped report can combine counts, averages, and totals.",
    "task": "Return every category with ProductCount, AveragePrice rounded to two decimals, and TotalCatalogValue rounded to two decimals. Keep categories without products.",
    "starterSql": "",
    "solutionSql": "SELECT\n  categories.CategoryName,\n  COUNT(\n    products.ProductID\n  ) AS ProductCount,\n  ROUND(\n    AVG(products.Price),\n    2\n  ) AS AveragePrice,\n  ROUND(\n    SUM(products.Price),\n    2\n  ) AS TotalCatalogValue\nFROM Categories AS categories\nLEFT JOIN Products AS products\n  ON products.CategoryID =\n    categories.CategoryID\nGROUP BY\n  categories.CategoryID,\n  categories.CategoryName\nORDER BY\n  ProductCount DESC,\n  categories.CategoryName;",
    "hints": [
      "Use Categories as the left table.",
      "COUNT should use ProductID.",
      "Group by the category identifier and name."
    ],
    "resultOrderMatters": true
  },
  {
    "id": "capstone-normalized-school",
    "number": 98,
    "title": "Project: Build a Normalized School Database",
    "topic": "NORMALIZATION",
    "difficulty": "Advanced",
    "description": "A normalized design separates entities and connects them through keys.",
    "task": "Create StudentsProject, CoursesProject, and EnrollmentsProject. EnrollmentsProject must use a composite primary key and foreign keys to both parent tables. Insert Anna in SQL Basics with grade A.",
    "starterSql": "",
    "solutionSql": "CREATE TABLE StudentsProject (\n  StudentID INTEGER PRIMARY KEY,\n  StudentName TEXT NOT NULL\n);\n\nCREATE TABLE CoursesProject (\n  CourseID INTEGER PRIMARY KEY,\n  CourseName TEXT NOT NULL\n);\n\nCREATE TABLE EnrollmentsProject (\n  StudentID INTEGER,\n  CourseID INTEGER,\n  Grade TEXT,\n  PRIMARY KEY (\n    StudentID,\n    CourseID\n  ),\n  FOREIGN KEY (StudentID)\n    REFERENCES StudentsProject(\n      StudentID\n    ),\n  FOREIGN KEY (CourseID)\n    REFERENCES CoursesProject(\n      CourseID\n    )\n);\n\nINSERT INTO StudentsProject (\n  StudentID,\n  StudentName\n)\nVALUES (\n  1,\n  'Anna'\n);\n\nINSERT INTO CoursesProject (\n  CourseID,\n  CourseName\n)\nVALUES (\n  10,\n  'SQL Basics'\n);\n\nINSERT INTO EnrollmentsProject (\n  StudentID,\n  CourseID,\n  Grade\n)\nVALUES (\n  1,\n  10,\n  'A'\n);",
    "hints": [
      "Create the parent tables first.",
      "The enrollment key contains StudentID and CourseID.",
      "EnrollmentsProject requires two foreign keys."
    ],
    "resultOrderMatters": true,
    "executionMode": "sandbox",
    "setupSql": "SELECT 1;",
    "verificationSql": "SELECT\n  students.StudentName,\n  courses.CourseName,\n  enrollments.Grade,\n  (\n    SELECT COUNT(*)\n    FROM pragma_foreign_key_list(\n      'EnrollmentsProject'\n    )\n  ) AS ForeignKeyCount\nFROM EnrollmentsProject AS enrollments\nJOIN StudentsProject AS students\n  ON students.StudentID =\n    enrollments.StudentID\nJOIN CoursesProject AS courses\n  ON courses.CourseID =\n    enrollments.CourseID\nORDER BY\n  students.StudentName,\n  courses.CourseName;"
  },
  {
    "id": "capstone-trigger-transfer",
    "number": 99,
    "title": "Project: Automated Account Transfer",
    "topic": "TRIGGER and TRANSACTION",
    "difficulty": "Advanced",
    "description": "Triggers and transactions can implement an atomic business operation.",
    "task": "Create trg_process_transfer. After a row is inserted into TransfersProject, subtract Amount from FromAccountID and add it to ToAccountID. Then insert a transfer of 125 from Account 1 to Account 2 inside a transaction.",
    "starterSql": "",
    "solutionSql": "CREATE TRIGGER trg_process_transfer\nAFTER INSERT ON TransfersProject\nBEGIN\n  UPDATE AccountsProject\n  SET Balance =\n    Balance - NEW.Amount\n  WHERE AccountID =\n    NEW.FromAccountID;\n\n  UPDATE AccountsProject\n  SET Balance =\n    Balance + NEW.Amount\n  WHERE AccountID =\n    NEW.ToAccountID;\nEND;\n\nBEGIN;\n\nINSERT INTO TransfersProject (\n  TransferID,\n  FromAccountID,\n  ToAccountID,\n  Amount\n)\nVALUES (\n  1,\n  1,\n  2,\n  125\n);\n\nCOMMIT;",
    "hints": [
      "The trigger performs two UPDATE statements.",
      "Use NEW.Amount and the two NEW account IDs.",
      "Insert the transfer between BEGIN and COMMIT."
    ],
    "resultOrderMatters": true,
    "executionMode": "sandbox",
    "setupSql": "CREATE TABLE AccountsProject (\n  AccountID INTEGER PRIMARY KEY,\n  AccountName TEXT NOT NULL,\n  Balance REAL NOT NULL\n);\n\nCREATE TABLE TransfersProject (\n  TransferID INTEGER PRIMARY KEY,\n  FromAccountID INTEGER NOT NULL,\n  ToAccountID INTEGER NOT NULL,\n  Amount REAL NOT NULL\n);\n\nINSERT INTO AccountsProject (\n  AccountID,\n  AccountName,\n  Balance\n)\nVALUES\n  (1, 'Main', 1000),\n  (2, 'Savings', 500);",
    "verificationSql": "SELECT\n  accounts.AccountID,\n  accounts.AccountName,\n  accounts.Balance,\n  (\n    SELECT COUNT(*)\n    FROM TransfersProject\n  ) AS TransferCount,\n  (\n    SELECT COUNT(*)\n    FROM sqlite_master\n    WHERE type = 'trigger'\n      AND name =\n        'trg_process_transfer'\n  ) AS TriggerCount\nFROM AccountsProject AS accounts\nORDER BY accounts.AccountID;"
  },
  {
    "id": "sql-pro-final-project",
    "number": 100,
    "title": "Final Project: Build the SQLTrain Railway",
    "topic": "SQL PRO PROJECT",
    "difficulty": "Advanced",
    "description": "Combine tables, keys, relationships, indexes, data, and a view into one complete database design.",
    "task": "Build StationsFinal, RoutesFinal, and RouteStopsFinal. Use primary and foreign keys, create a composite index on RouteID and StopNumber, insert the SQL Express route from Berlin to Munich, and create a RouteSchedule view.",
    "starterSql": "",
    "solutionSql": "CREATE TABLE StationsFinal (\n  StationID INTEGER PRIMARY KEY,\n  StationName TEXT NOT NULL UNIQUE\n);\n\nCREATE TABLE RoutesFinal (\n  RouteID INTEGER PRIMARY KEY,\n  RouteName TEXT NOT NULL\n);\n\nCREATE TABLE RouteStopsFinal (\n  RouteID INTEGER,\n  StopNumber INTEGER,\n  StationID INTEGER NOT NULL,\n  ArrivalTime TEXT,\n  PRIMARY KEY (\n    RouteID,\n    StopNumber\n  ),\n  FOREIGN KEY (RouteID)\n    REFERENCES RoutesFinal(RouteID),\n  FOREIGN KEY (StationID)\n    REFERENCES StationsFinal(StationID)\n);\n\nCREATE INDEX\n  idx_route_stops_route_number\nON RouteStopsFinal (\n  RouteID,\n  StopNumber\n);\n\nINSERT INTO StationsFinal (\n  StationID,\n  StationName\n)\nVALUES\n  (1, 'Berlin'),\n  (2, 'Hamburg'),\n  (3, 'Munich');\n\nINSERT INTO RoutesFinal (\n  RouteID,\n  RouteName\n)\nVALUES (\n  100,\n  'SQL Express'\n);\n\nINSERT INTO RouteStopsFinal (\n  RouteID,\n  StopNumber,\n  StationID,\n  ArrivalTime\n)\nVALUES\n  (100, 1, 1, '08:00'),\n  (100, 2, 2, '10:00'),\n  (100, 3, 3, '14:00');\n\nCREATE VIEW RouteSchedule AS\nSELECT\n  routes.RouteName,\n  stops.StopNumber,\n  stations.StationName,\n  stops.ArrivalTime\nFROM RouteStopsFinal AS stops\nJOIN RoutesFinal AS routes\n  ON routes.RouteID =\n    stops.RouteID\nJOIN StationsFinal AS stations\n  ON stations.StationID =\n    stops.StationID;",
    "hints": [
      "Create the parent tables before RouteStopsFinal.",
      "RouteStopsFinal uses two foreign keys and a composite primary key.",
      "Create the view only after all tables exist."
    ],
    "resultOrderMatters": true,
    "executionMode": "sandbox",
    "setupSql": "SELECT 1;",
    "verificationSql": "SELECT\n  schedule.RouteName,\n  schedule.StopNumber,\n  schedule.StationName,\n  schedule.ArrivalTime,\n  (\n    SELECT COUNT(*)\n    FROM pragma_foreign_key_list(\n      'RouteStopsFinal'\n    )\n  ) AS ForeignKeyCount,\n  (\n    SELECT COUNT(*)\n    FROM sqlite_master\n    WHERE type = 'index'\n      AND name =\n        'idx_route_stops_route_number'\n  ) AS IndexCount\nFROM RouteSchedule AS schedule\nORDER BY schedule.StopNumber;"
  }

];

export function getSqlLesson(
  lessonId: string,
): SqlLesson | null {
  return (
    SQL_LESSONS.find(
      (lesson) => lesson.id === lessonId,
    ) ?? null
  );
}
