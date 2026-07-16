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
