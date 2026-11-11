-- 4. Monthly Customer Financials
-- Tables:
-- customers(customer_id, name)
-- orders(order_id, customer_id, ordered_at, status)
-- order_items(order_id, product_id, quantity, unit_price)
-- payments(payment_id, order_id, amount, status, paid_at)

-- Write one query returning, for each customer and calendar month in 2026 with at least one non-cancelled order:
-- order_count, gross_order_value, captured_payment_value, and outstanding_value. Avoid double counting caused
-- by joining order_items and payments. Include customers whose captured payment is zero.
-- Expected: SQL plus a short explanation of how pre-aggregation prevents row multiplication.


WITH orders_totals AS (
	SELECT
order_id,
SUM(quantity * unit_price) AS gross_order_value
FROM order_items
GROUP BY order_id
)

-- above pre-aggregates by order_id into a CTE

WITH payment_totals AS (
	SELECT
		order_id,
		SUM (amount) AS captured_payment_value
	FROM payments
	WHERE status <> 'cancelled'
	GROUP BY order_id
)

-- above pre-aggregates by order_id into a CTE
-- then finally below we do the table joins with the pre-aggregated CTEs

SELECT
	c.customer_id,
	c.name,
DATE_TRUNC('month', o.ordered_at) as calendar_month,
	COUNT (DISTINCT o.order_id) as order_count,
	SUM(ot.gross_order_value) AS gross_order_value,
SUM(pt.captured_payment_value) AS captured_payment_value,
SUM(ot.gross_order_value) - SUM(pt.captured_payment_value) AS outstanding_value
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
LEFT JOIN order_totals ot ON o.order_id = ot.order_id
LEFT JOIN payment_totals pt ON o.order_id = pt.order_id
WHERE DATE_TRUNC('year', o.ordered_at) = '2026'
GROUP BY c.customer_id, c.name, DATE_TRUNC('year', o.ordered_at)
ORDER BY c.customer_id, calendar_month
