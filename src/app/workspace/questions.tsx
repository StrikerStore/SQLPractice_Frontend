import type { ReactNode } from 'react';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type MockQuestion = {
  id: string;
  db: string;
  topic: string;
  difficulty: Difficulty;
  title: string;
  prompt: ReactNode;
  /** Plain-text version of the prompt for sending to AI */
  promptText: string;
  hint: string;
  coachContext: string;
  solution: string;
};

export const MOCK_SCHEMAS: Record<
  string,
  { name: string; cols: { n: string; t: string }[] }[]
> = {
  retail: [
    { name: 'categories', cols: [{ n: 'category_id', t: 'PK' }, { n: 'name', t: 'VARCHAR' }] },
    { name: 'products', cols: [{ n: 'product_id', t: 'PK' }, { n: 'category_id', t: 'FK' }, { n: 'sku', t: 'VARCHAR' }, { n: 'list_price', t: 'DECIMAL' }] },
    { name: 'customers', cols: [{ n: 'customer_id', t: 'PK' }, { n: 'first_name', t: 'VARCHAR' }, { n: 'last_name', t: 'VARCHAR' }, { n: 'email', t: 'VARCHAR' }, { n: 'city', t: 'VARCHAR' }] },
    { name: 'staff', cols: [{ n: 'staff_id', t: 'PK' }, { n: 'full_name', t: 'VARCHAR' }, { n: 'role', t: 'VARCHAR' }] },
    { name: 'orders', cols: [{ n: 'order_id', t: 'PK' }, { n: 'customer_id', t: 'FK' }, { n: 'staff_id', t: 'FK' }, { n: 'order_date', t: 'DATE' }, { n: 'status', t: 'VARCHAR' }] },
    { name: 'order_items', cols: [{ n: 'order_item_id', t: 'PK' }, { n: 'order_id', t: 'FK' }, { n: 'product_id', t: 'FK' }, { n: 'qty', t: 'INT' }, { n: 'paid_price', t: 'DECIMAL' }] },
  ],
  hr: [
    { name: 'departments', cols: [{ n: 'dept_no', t: 'PK' }, { n: 'dept_name', t: 'VARCHAR' }] },
    { name: 'employees', cols: [{ n: 'emp_no', t: 'PK' }, { n: 'birth_date', t: 'DATE' }, { n: 'first_name', t: 'VARCHAR' }, { n: 'last_name', t: 'VARCHAR' }, { n: 'hire_date', t: 'DATE' }, { n: 'gender', t: 'CHAR' }] },
    { name: 'dept_emp', cols: [{ n: 'emp_no', t: 'FK' }, { n: 'dept_no', t: 'FK' }, { n: 'from_date', t: 'DATE' }, { n: 'to_date', t: 'DATE' }] },
    { name: 'salaries', cols: [{ n: 'emp_no', t: 'FK' }, { n: 'salary', t: 'INT' }, { n: 'from_date', t: 'DATE' }, { n: 'to_date', t: 'DATE' }] },
    { name: 'titles', cols: [{ n: 'emp_no', t: 'FK' }, { n: 'title', t: 'VARCHAR' }, { n: 'from_date', t: 'DATE' }, { n: 'to_date', t: 'DATE' }] },
    { name: 'dept_manager', cols: [{ n: 'dept_no', t: 'FK' }, { n: 'emp_no', t: 'FK' }, { n: 'from_date', t: 'DATE' }, { n: 'to_date', t: 'DATE' }] },
  ],
  flights: [
    { name: 'airlines', cols: [{ n: 'carrier', t: 'PK' }, { n: 'name', t: 'VARCHAR' }] },
    { name: 'airports', cols: [{ n: 'faa', t: 'PK' }, { n: 'name', t: 'VARCHAR' }, { n: 'lat', t: 'DECIMAL' }, { n: 'lon', t: 'DECIMAL' }] },
    { name: 'aircraft', cols: [{ n: 'tail', t: 'PK' }, { n: 'carrier', t: 'FK' }, { n: 'model', t: 'VARCHAR' }] },
    { name: 'routes', cols: [{ n: 'route_id', t: 'PK' }, { n: 'origin', t: 'FK' }, { n: 'dest', t: 'FK' }, { n: 'miles', t: 'INT' }] },
    { name: 'flights', cols: [{ n: 'flight_id', t: 'PK' }, { n: 'carrier', t: 'FK' }, { n: 'origin', t: 'FK' }, { n: 'dest', t: 'FK' }, { n: 'air_time', t: 'INT' }, { n: 'dep_ts', t: 'DATETIME' }, { n: 'route_id', t: 'FK' }] },
  ],
  analytics: [
    { name: 'dim_source', cols: [{ n: 'source_id', t: 'PK' }, { n: 'name', t: 'VARCHAR' }] },
    { name: 'campaigns', cols: [{ n: 'campaign_id', t: 'PK' }, { n: 'name', t: 'VARCHAR' }, { n: 'source_id', t: 'FK' }] },
    { name: 'users', cols: [{ n: 'user_id', t: 'PK' }, { n: 'country', t: 'VARCHAR' }, { n: 'signup_ts', t: 'DATETIME' }] },
    { name: 'sessions', cols: [{ n: 'session_id', t: 'PK' }, { n: 'user_id', t: 'FK' }, { n: 'campaign_id', t: 'FK' }, { n: 'started_at', t: 'DATETIME' }] },
    { name: 'page_views', cols: [{ n: 'view_id', t: 'PK' }, { n: 'session_id', t: 'FK' }, { n: 'user_id', t: 'FK' }, { n: 'page_path', t: 'VARCHAR' }, { n: 'view_ts', t: 'DATETIME' }] },
  ],
  finance: [
    { name: 'branches', cols: [{ n: 'branch_id', t: 'PK' }, { n: 'city', t: 'VARCHAR' }] },
    { name: 'customers_fin', cols: [{ n: 'customer_id', t: 'PK' }, { n: 'name', t: 'VARCHAR' }, { n: 'segment', t: 'VARCHAR' }] },
    { name: 'products', cols: [{ n: 'product_id', t: 'PK' }, { n: 'name', t: 'VARCHAR' }, { n: 'rate_annual', t: 'DECIMAL' }] },
    { name: 'accounts', cols: [{ n: 'account_id', t: 'PK' }, { n: 'customer_id', t: 'FK' }, { n: 'branch_id', t: 'FK' }, { n: 'account_type', t: 'VARCHAR' }, { n: 'balance', t: 'DECIMAL' }] },
    { name: 'transactions', cols: [{ n: 'txn_id', t: 'PK' }, { n: 'account_id', t: 'FK' }, { n: 'amount', t: 'DECIMAL' }, { n: 'txn_type', t: 'VARCHAR' }, { n: 'posted_at', t: 'DATETIME' }] },
    { name: 'fx_rates', cols: [{ n: 'ccy', t: 'PK' }, { n: 'usd_rate', t: 'DECIMAL' }] },
  ],
};

export const MOCK_QUESTIONS: MockQuestion[] = [
  // Retail — retail.orders (3500 rows) + order_items
  {
    id: '#R01',
    db: 'retail',
    topic: 'Aggregates & filters',
    difficulty: 'easy',
    title: 'Count completed orders',
    promptText: "How many rows in the orders table have status = 'COMPLETED'?",
    prompt: (
      <p>
        How many rows in <code>orders</code> have <code>status = &apos;COMPLETED&apos;</code>?
      </p>
    ),
    hint: 'Use COUNT(*) with a WHERE clause on status. Filter on the indexed status column.',
    coachContext: 'Single-table aggregate: COUNT with WHERE status.',
    solution: `SELECT COUNT(*) AS cnt FROM orders WHERE status = 'COMPLETED'`,
  },
  {
    id: '#R02',
    db: 'retail',
    topic: 'CTEs (Common Table Expressions)',
    difficulty: 'medium',
    title: 'Customers with more than five orders',
    promptText: 'How many distinct customer_id values have more than five orders in the orders table?',
    prompt: (
      <p>
        How many distinct <code>customer_id</code> values have more than <strong>five</strong> orders in <code>orders</code>?
      </p>
    ),
    hint: 'Use a WITH clause to compute per-customer order counts, then filter and count.',
    coachContext: 'CTE: aggregate per customer, then COUNT rows where cnt > 5.',
    solution: `WITH cust_counts AS (
  SELECT customer_id, COUNT(*) AS order_cnt
  FROM orders
  GROUP BY customer_id
)
SELECT COUNT(*) AS cust_above_five
FROM cust_counts
WHERE order_cnt > 5`,
  },
  {
    id: '#R03',
    db: 'retail',
    topic: 'Window functions',
    difficulty: 'medium',
    title: 'Customer with the most orders',
    promptText: 'Return the customer_id that has the highest number of orders. Break ties by smallest customer_id.',
    prompt: (
      <p>
        Return the <code>customer_id</code> that has the <strong>highest</strong> number of orders (break ties by smallest <code>customer_id</code>).
      </p>
    ),
    hint: 'Use COUNT(*) with GROUP BY, then ROW_NUMBER() OVER (ORDER BY cnt DESC, customer_id ASC) in a subquery.',
    coachContext: 'Window function ROW_NUMBER() over grouped counts.',
    solution: `SELECT customer_id
FROM (
  SELECT customer_id,
    ROW_NUMBER() OVER (ORDER BY cnt DESC, customer_id ASC) AS rn
  FROM (
    SELECT customer_id, COUNT(*) AS cnt
    FROM orders
    GROUP BY customer_id
  ) x
) t
WHERE rn = 1`,
  },
  {
    id: '#R04',
    db: 'retail',
    topic: 'Subqueries & correlated queries',
    difficulty: 'hard',
    title: 'Above-average order volume',
    promptText: 'List up to 10 customer_id values (ascending) whose order count is greater than the average order count per customer.',
    prompt: (
      <p>
        List up to 10 <code>customer_id</code> values (ascending) whose order count is <strong>greater than</strong> the average order count per customer.
      </p>
    ),
    hint: "Compare each customer's COUNT(*) to a scalar subquery AVG from a grouped subquery.",
    coachContext: 'Scalar subquery for average of per-customer counts; filter customers.',
    solution: `SELECT customer_id
FROM customers c
WHERE (
  SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.customer_id
) > (
  SELECT AVG(oc) FROM (SELECT COUNT(*) AS oc FROM orders GROUP BY customer_id) x
)
ORDER BY customer_id
LIMIT 10`,
  },
  {
    id: '#R05',
    db: 'retail',
    topic: 'Indexing & selective predicates',
    difficulty: 'easy',
    title: 'June orders for customer 42',
    promptText: 'How many orders does customer_id = 42 have with order_date in June 2023 (from 2023-06-01 up to but not including 2023-07-01)?',
    prompt: (
      <p>
        How many orders does <code>customer_id = 42</code> have with <code>order_date</code> in June 2023 (from <code>2023-06-01</code> up to but not including <code>2023-07-01</code>)?
      </p>
    ),
    hint: 'Topic: indexing — filter on (customer_id, order_date) to match the composite index. Use a half-open date range.',
    coachContext: 'Point/range queries that use idx_cust_date; explain in class: leading column + range.',
    solution: `SELECT COUNT(*) AS cnt
FROM orders
WHERE customer_id = 42
  AND order_date >= '2023-06-01'
  AND order_date < '2023-07-01'`,
  },

  // HR — salaries (3500 rows)
  {
    id: '#H01',
    db: 'hr',
    topic: 'JOINs & GROUP BY',
    difficulty: 'easy',
    title: 'Largest department by headcount',
    promptText: 'Which dept_name has the most employees? Join employees, dept_emp, and departments.',
    prompt: (
      <p>
        Which <code>dept_name</code> has the <strong>most</strong> employees (join <code>employees</code>, <code>dept_emp</code>, <code>departments</code>)?
      </p>
    ),
    hint: 'GROUP BY department and ORDER BY COUNT(*) DESC LIMIT 1.',
    coachContext: 'Multi-table JOIN with GROUP BY.',
    solution: `SELECT d.dept_name
FROM employees e
JOIN dept_emp de ON e.emp_no = de.emp_no
JOIN departments d ON de.dept_no = d.dept_no
GROUP BY d.dept_no, d.dept_name
ORDER BY COUNT(*) DESC
LIMIT 1`,
  },
  {
    id: '#H02',
    db: 'hr',
    topic: 'Window functions',
    difficulty: 'medium',
    title: 'Top current salary',
    promptText: 'Return the emp_no with the highest salary among rows with to_date > CURDATE(). Use ROW_NUMBER and break ties by emp_no.',
    prompt: (
      <p>
        Return the <code>emp_no</code> with the <strong>highest</strong> salary among rows with <code>to_date &gt; CURDATE()</code> (use RANK or ROW_NUMBER; break ties by <code>emp_no</code>).
      </p>
    ),
    hint: 'Use ROW_NUMBER() OVER (ORDER BY salary DESC, emp_no ASC) and filter rn = 1.',
    coachContext: 'Ranking window on current salary rows.',
    solution: `SELECT emp_no
FROM (
  SELECT emp_no,
    ROW_NUMBER() OVER (ORDER BY salary DESC, emp_no ASC) AS rn
  FROM salaries
  WHERE to_date > CURDATE()
) t
WHERE rn = 1`,
  },
  {
    id: '#H03',
    db: 'hr',
    topic: 'CTEs (Common Table Expressions)',
    difficulty: 'medium',
    title: 'Average current salary',
    promptText: 'What is the average salary among rows in the salaries table where to_date > CURDATE()?',
    prompt: (
      <p>
        What is the average <code>salary</code> among rows where <code>to_date &gt; CURDATE()</code>?
      </p>
    ),
    hint: 'WITH current_sal AS (…) SELECT AVG(salary) FROM current_sal.',
    coachContext: 'CTE wrapping filtered salaries.',
    solution: `WITH current_sal AS (
  SELECT emp_no, salary
  FROM salaries
  WHERE to_date > CURDATE()
)
SELECT AVG(salary) AS avg_current_salary
FROM current_sal`,
  },
  {
    id: '#H04',
    db: 'hr',
    topic: 'EXISTS & semi-joins',
    difficulty: 'hard',
    title: 'Employees with high current salary',
    promptText: 'List up to 5 emp_no (ascending) that have a current salary row with salary > 95000 and to_date > CURDATE(). Use EXISTS.',
    prompt: (
      <p>
        List up to 5 <code>emp_no</code> (ascending) that have a <strong>current</strong> salary row with <code>salary &gt; 95000</code> and <code>to_date &gt; CURDATE()</code>.
      </p>
    ),
    hint: 'Use EXISTS (SELECT 1 FROM salaries s WHERE s.emp_no = e.emp_no AND …).',
    coachContext: 'EXISTS vs INNER JOIN for existence.',
    solution: `SELECT e.emp_no
FROM employees e
WHERE EXISTS (
  SELECT 1 FROM salaries s
  WHERE s.emp_no = e.emp_no AND s.salary > 95000 AND s.to_date > CURDATE()
)
ORDER BY e.emp_no
LIMIT 5`,
  },
  {
    id: '#H05',
    db: 'hr',
    topic: 'Indexing & date ranges',
    difficulty: 'easy',
    title: 'Salary history rows for employee 101',
    promptText: 'How many rows in the salaries table for emp_no = 101 have from_date on or after 2020-01-01 and before 2025-01-01?',
    prompt: (
      <p>
        How many rows in <code>salaries</code> for <code>emp_no = 101</code> have <code>from_date</code> on or after <code>2020-01-01</code> and before <code>2025-01-01</code>?
      </p>
    ),
    hint: 'Topic: indexing — filter emp_no first (equality), then range on from_date (uses idx_emp / idx_dates).',
    coachContext: 'Range scans on leading index columns.',
    solution: `SELECT COUNT(*) AS cnt
FROM salaries
WHERE emp_no = 101
  AND from_date >= '2020-01-01'
  AND from_date < '2025-01-01'`,
  },

  // Flights — flights (3500 rows)
  {
    id: '#F01',
    db: 'flights',
    topic: 'JOINs & GROUP BY',
    difficulty: 'easy',
    title: 'Airline with the most flights',
    promptText: 'Which airline name has the largest number of flights in the flights table? Join flights to airlines.',
    prompt: (
      <p>
        Which airline <code>name</code> has the <strong>largest</strong> number of flights in <code>flights</code>?
      </p>
    ),
    hint: 'JOIN flights to airlines; GROUP BY carrier; ORDER BY COUNT(*) DESC LIMIT 1.',
    coachContext: 'JOIN + GROUP BY + ORDER BY count.',
    solution: `SELECT a.name
FROM flights f
JOIN airlines a ON f.carrier = a.carrier
GROUP BY a.carrier, a.name
ORDER BY COUNT(*) DESC
LIMIT 1`,
  },
  {
    id: '#F02',
    db: 'flights',
    topic: 'Window functions',
    difficulty: 'medium',
    title: 'Longest flight',
    promptText: 'Return the flight_id with the longest air_time. Tie-break by flight_id ascending.',
    prompt: (
      <p>
        Return the <code>flight_id</code> with the longest <code>air_time</code> (tie-break by <code>flight_id</code> ascending).
      </p>
    ),
    hint: 'ROW_NUMBER() OVER (ORDER BY air_time DESC, flight_id ASC) then filter rn = 1.',
    coachContext: 'Window ranking on air_time.',
    solution: `SELECT flight_id
FROM (
  SELECT flight_id,
    ROW_NUMBER() OVER (ORDER BY air_time DESC, flight_id ASC) AS rn
  FROM flights
) t
WHERE rn = 1`,
  },
  {
    id: '#F03',
    db: 'flights',
    topic: 'CTEs (Common Table Expressions)',
    difficulty: 'medium',
    title: 'Long flights count',
    promptText: 'How many flights have air_time >= 180 minutes? Use a CTE.',
    prompt: (
      <p>
        How many flights have <code>air_time &gt;= 180</code> minutes?
      </p>
    ),
    hint: 'WITH long_flights AS (SELECT * FROM flights WHERE air_time >= 180) SELECT COUNT(*) FROM long_flights.',
    coachContext: 'CTE as a filtered view of flights.',
    solution: `WITH long_flights AS (
  SELECT * FROM flights WHERE air_time >= 180
)
SELECT COUNT(*) AS cnt FROM long_flights`,
  },
  {
    id: '#F04',
    db: 'flights',
    topic: 'Subqueries & aggregates',
    difficulty: 'easy',
    title: 'Busiest origin airport',
    promptText: 'Which origin airport code appears on the most flight rows?',
    prompt: (
      <p>
        Which <code>origin</code> code appears on the <strong>most</strong> flight rows?
      </p>
    ),
    hint: 'GROUP BY origin; ORDER BY COUNT(*) DESC LIMIT 1.',
    coachContext: 'Simple aggregation without JOIN.',
    solution: `SELECT origin
FROM flights
GROUP BY origin
ORDER BY COUNT(*) DESC
LIMIT 1`,
  },
  {
    id: '#F05',
    db: 'flights',
    topic: 'Indexing & time ranges',
    difficulty: 'easy',
    title: 'Delta flights in H1 2024',
    promptText: "How many flights have carrier = 'DL' and dep_ts on or after 2024-01-01 and before 2024-07-01?",
    prompt: (
      <p>
        How many flights have <code>carrier = &apos;DL&apos;</code> and <code>dep_ts</code> on or after <code>2024-01-01</code> and before <code>2024-07-01</code>?
      </p>
    ),
    hint: 'Topic: indexing — (carrier, dep_ts) seeks; use half-open range on dep_ts.',
    coachContext: 'Composite index on carrier + dep_ts for time-range queries.',
    solution: `SELECT COUNT(*) AS cnt
FROM flights
WHERE carrier = 'DL'
  AND dep_ts >= '2024-01-01 00:00:00'
  AND dep_ts < '2024-07-01 00:00:00'`,
  },

  // Analytics — page_views (3500 rows)
  {
    id: '#A01',
    db: 'analytics',
    topic: 'JOINs & GROUP BY',
    difficulty: 'easy',
    title: 'Country with the most sessions',
    promptText: 'Which country has the largest number of distinct session_id values in page_views? Join users table.',
    prompt: (
      <p>
        Which <code>country</code> has the <strong>largest</strong> number of distinct <code>session_id</code> values in <code>page_views</code> (join <code>users</code>)?
      </p>
    ),
    hint: 'COUNT(DISTINCT session_id) GROUP BY country; ORDER BY sessions DESC LIMIT 1.',
    coachContext: 'JOIN users to page_views; distinct session counts.',
    solution: `SELECT u.country
FROM page_views pv
JOIN users u ON pv.user_id = u.user_id
GROUP BY u.country
ORDER BY COUNT(DISTINCT pv.session_id) DESC
LIMIT 1`,
  },
  {
    id: '#A02',
    db: 'analytics',
    topic: 'Window functions',
    difficulty: 'hard',
    title: 'Latest view per user',
    promptText: 'Return the session_id from the row with the latest view_ts per user_id (tie-break: latest session_id). Then return the smallest such session_id among those last-view rows.',
    prompt: (
      <p>
        Return the <code>session_id</code> from the row with the <strong>latest</strong> <code>view_ts</code> per <code>user_id</code> (use tie-breaks: latest <code>session_id</code>); then return the <strong>smallest</strong> such <code>session_id</code> among those "last view" rows.
      </p>
    ),
    hint: 'ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY view_ts DESC, session_id DESC) WHERE rn = 1; then ORDER BY session_id LIMIT 1.',
    coachContext: 'Per-partition first row with window functions.',
    solution: `SELECT session_id
FROM (
  SELECT session_id,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY view_ts DESC, session_id DESC) AS rn
  FROM page_views
) t
WHERE rn = 1
ORDER BY session_id ASC
LIMIT 1`,
  },
  {
    id: '#A03',
    db: 'analytics',
    topic: 'CTEs (Common Table Expressions)',
    difficulty: 'medium',
    title: 'Max views in one session',
    promptText: 'What is the maximum number of page_views rows in a single session_id?',
    prompt: (
      <p>
        What is the <strong>maximum</strong> number of <code>page_views</code> rows in a single <code>session_id</code>?
      </p>
    ),
    hint: 'WITH per_session AS (GROUP BY session_id) SELECT MAX(views).',
    coachContext: 'CTE aggregating per session.',
    solution: `WITH per_session AS (
  SELECT session_id, COUNT(*) AS views
  FROM page_views
  GROUP BY session_id
)
SELECT MAX(views) AS max_views_one_session FROM per_session`,
  },
  {
    id: '#A04',
    db: 'analytics',
    topic: 'Subqueries & averages',
    difficulty: 'hard',
    title: 'Power users',
    promptText: 'List up to 5 user_id values (ascending) whose total page view count is greater than the average view count per user.',
    prompt: (
      <p>
        List up to 5 <code>user_id</code> values (ascending) whose total page view count is <strong>greater than</strong> the average view count per user.
      </p>
    ),
    hint: 'Compare grouped COUNT(*) to AVG(…) from a derived table of per-user counts.',
    coachContext: 'Scalar subquery for average of grouped counts.',
    solution: `SELECT user_id
FROM (
  SELECT user_id, COUNT(*) AS vc
  FROM page_views
  GROUP BY user_id
) t
WHERE vc > (
  SELECT AVG(cnt) FROM (
    SELECT COUNT(*) AS cnt FROM page_views GROUP BY user_id
  ) z
)
ORDER BY user_id
LIMIT 5`,
  },
  {
    id: '#A05',
    db: 'analytics',
    topic: 'Indexing & path filters',
    difficulty: 'easy',
    title: 'Checkout views in March 2024',
    promptText: "How many page_views rows have user_id = 50, page_path = '/checkout', and view_ts in March 2024?",
    prompt: (
      <p>
        How many <code>page_views</code> rows have <code>user_id = 50</code>, <code>page_path = &apos;/checkout&apos;</code>, and <code>view_ts</code> in March 2024?
      </p>
    ),
    hint: 'Topic: indexing — (user_id, page_path, view_ts) supports selective equality + range.',
    coachContext: 'Composite index on user_id, page_path, view_ts.',
    solution: `SELECT COUNT(*) AS cnt
FROM page_views
WHERE user_id = 50
  AND page_path = '/checkout'
  AND view_ts >= '2024-03-01'
  AND view_ts < '2024-04-01'`,
  },

  // Finance — transactions (3500 rows)
  {
    id: '#B01',
    db: 'finance',
    topic: 'JOINs & GROUP BY',
    difficulty: 'easy',
    title: 'Account type with lowest net flow',
    promptText: "For the 2024 calendar year (posted_at >= '2024-01-01' and < '2025-01-01'), which account_type has the lowest sum of amount (most negative net)?",
    prompt: (
      <p>
        For 2024 calendar year (<code>posted_at &gt;= &apos;2024-01-01&apos;</code> and <code>&lt; &apos;2025-01-01&apos;</code>), which <code>account_type</code> has the <strong>lowest</strong> sum of <code>amount</code> (most negative net)?
      </p>
    ),
    hint: 'JOIN transactions to accounts; SUM(amount) GROUP BY account_type; ORDER BY total_flow ASC LIMIT 1.',
    coachContext: 'JOIN + SUM + ORDER BY aggregate.',
    solution: `SELECT a.account_type
FROM transactions t
JOIN accounts a ON t.account_id = a.account_id
WHERE t.posted_at >= '2024-01-01'
  AND t.posted_at < '2025-01-01'
GROUP BY a.account_type
ORDER BY SUM(t.amount) ASC
LIMIT 1`,
  },
  {
    id: '#B02',
    db: 'finance',
    topic: 'Window functions',
    difficulty: 'hard',
    title: 'First running balance',
    promptText: 'For account_id = 100, return the first row running sum of amount ordered by posted_at then txn_id.',
    prompt: (
      <p>
        For <code>account_id = 100</code>, return the <strong>first</strong> row&apos;s running sum of <code>amount</code> (order by <code>posted_at</code>, then <code>txn_id</code>).
      </p>
    ),
    hint: 'SUM(amount) OVER (PARTITION BY account_id ORDER BY posted_at, txn_id ROWS UNBOUNDED PRECEDING) with ROW_NUMBER rn=1.',
    coachContext: 'Running total window frame.',
    solution: `SELECT running_sum
FROM (
  SELECT SUM(amount) OVER (
    PARTITION BY account_id ORDER BY posted_at, txn_id
  ) AS running_sum,
    ROW_NUMBER() OVER (ORDER BY posted_at, txn_id) AS rn
  FROM transactions
  WHERE account_id = 100
) t
WHERE rn = 1`,
  },
  {
    id: '#B03',
    db: 'finance',
    topic: 'CTEs (Common Table Expressions)',
    difficulty: 'medium',
    title: 'Strongest revenue month',
    promptText: 'Which calendar month (YYYY-MM) in the data has the highest total amount across all transactions?',
    prompt: (
      <p>
        Which calendar month (<code>YYYY-MM</code>) in the data has the <strong>highest</strong> total <code>amount</code> across all transactions?
      </p>
    ),
    hint: "WITH monthly AS (GROUP BY DATE_FORMAT(posted_at, '%Y-%m')) ORDER BY flow DESC LIMIT 1.",
    coachContext: 'CTE + monthly aggregation.',
    solution: `WITH monthly AS (
  SELECT DATE_FORMAT(posted_at, '%Y-%m') AS ym, SUM(amount) AS flow
  FROM transactions
  GROUP BY DATE_FORMAT(posted_at, '%Y-%m')
)
SELECT ym FROM monthly ORDER BY flow DESC LIMIT 1`,
  },
  {
    id: '#B04',
    db: 'finance',
    topic: 'Subqueries & averages',
    difficulty: 'medium',
    title: 'Large balances',
    promptText: 'List up to 3 account_id values (ascending) where ABS(balance) is greater than the average of ABS(balance) over all accounts.',
    prompt: (
      <p>
        List up to 3 <code>account_id</code> values (ascending) where <code>ABS(balance)</code> is greater than the average of <code>ABS(balance)</code> over all accounts.
      </p>
    ),
    hint: 'Compare each row balance to scalar subquery SELECT AVG(ABS(balance)) FROM accounts.',
    coachContext: 'Scalar subquery for global average.',
    solution: `SELECT account_id
FROM accounts a
WHERE ABS(a.balance) > (
  SELECT AVG(ABS(balance)) FROM accounts
)
ORDER BY account_id
LIMIT 3`,
  },
  {
    id: '#B05',
    db: 'finance',
    topic: 'Indexing & txn filters',
    difficulty: 'easy',
    title: 'June debits on account 200',
    promptText: "How many transactions are txn_type = 'DEBIT' for account_id = 200 with posted_at in June 2024?",
    prompt: (
      <p>
        How many <code>transactions</code> are <code>txn_type = &apos;DEBIT&apos;</code> for <code>account_id = 200</code> with <code>posted_at</code> in June 2024?
      </p>
    ),
    hint: 'Topic: indexing — (account_id, posted_at) seeks; filter txn_type for covering index if present.',
    coachContext: 'Narrowing by account_id + time range + txn_type.',
    solution: `SELECT COUNT(*) AS cnt
FROM transactions
WHERE account_id = 200
  AND txn_type = 'DEBIT'
  AND posted_at >= '2024-06-01'
  AND posted_at < '2024-07-01'`,
  },
];
