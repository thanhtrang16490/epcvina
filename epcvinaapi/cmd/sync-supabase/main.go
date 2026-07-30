package main

import (
	"context"
	"encoding/json"
	"errors"
	"flag"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

type tableSpec struct {
	Name    string
	Columns []string
}

var syncTables = []tableSpec{
	{Name: "brands", Columns: []string{"id", "slug", "name", "description", "image_url", "logo_url", "status", "is_active", "sort_order", "created_at", "updated_at"}},
	{Name: "product_categories", Columns: []string{"id", "slug", "name", "description", "image_url", "parent_id", "status", "is_active", "sort_order", "created_at", "updated_at"}},
	{Name: "combo_categories", Columns: []string{"id", "slug", "name", "description", "image_url", "status", "is_active", "sort_order", "created_at", "updated_at"}},
	{Name: "discounts", Columns: []string{"id", "slug", "name", "discount_type", "value", "description", "is_active", "sort_order", "created_at", "updated_at"}},
	{Name: "payment_policies", Columns: []string{"id", "slug", "name", "policy_code", "deposit_percent", "delivery_percent", "acceptance_percent", "description", "is_active", "sort_order", "created_at", "updated_at"}},
	{Name: "pricing_settings", Columns: []string{"id", "labor_ongrid_per_kwp", "labor_hybrid_per_kwp", "target_gross_margin_pct", "default_psh_hours", "default_pr", "self_use_ratio", "residential_electricity_price_vnd_per_kwh", "commercial_electricity_price_vnd_per_kwh", "electricity_price_vnd_per_kwh", "feed_in_tariff_vnd_per_kwh", "updated_at"}},
	{Name: "customers", Columns: []string{"id", "slug", "customer_type", "parent_company_id", "name", "phone", "email", "tax_code", "province", "district", "ward", "address_detail", "address", "billing_name", "billing_phone", "billing_email", "note", "created_at", "updated_at"}},
	{Name: "projects", Columns: []string{"id", "slug", "code", "customer_id", "name", "address", "status", "sort_order", "note", "created_at", "updated_at", "capacity", "system_type", "completion_date", "image_url", "gallery_urls", "description", "source_url", "is_active"}},
	{Name: "suppliers", Columns: []string{"id", "slug", "name", "phone", "email", "tax_code", "address", "note", "created_at", "updated_at", "contact_name", "website", "sort_order", "is_active"}},
	{Name: "products", Columns: []string{"id", "slug", "name", "sku", "brand_name", "category", "unit", "cost_price", "sale_price", "vat_rate", "status", "note", "created_at", "updated_at", "technical_specs", "category_id", "brand_id", "cover_image_url", "image_urls", "quantity", "warranty", "description", "is_active", "sort_order"}},
	{Name: "combos", Columns: []string{"id", "slug", "name", "code", "combo_type", "phase_type", "status", "total_sale_price", "total_cost_price", "note", "created_at", "updated_at", "phase", "solar_kw", "battery_kwh", "battery_type", "target_min_price", "reference_price", "combo_category_id", "cover_image_url", "image_urls", "source_kind"}},
	{Name: "combo_items", Columns: []string{"id", "combo_id", "product_id", "reference_product_id", "no", "category", "specification", "brand_name", "unit", "quantity", "unit_price_vat", "warranty", "cost_price", "gross_margin", "notes", "item_name", "brand", "total_price_vat", "total_cost_price", "sheet_group", "sort_order", "source_sheet"}},
	{Name: "supplier_products", Columns: []string{"id", "supplier_id", "product_id", "supplier_sku", "supplier_price", "min_order_qty", "lead_time_days", "note", "created_at", "updated_at"}},
	{Name: "orders", Columns: []string{"id", "slug", "customer_id", "project_id", "order_no", "order_type", "status", "order_date", "note", "subtotal", "discount", "total", "created_at", "updated_at", "payment_method", "discount_id", "discount_name", "discount_type", "discount_value", "payment_policy_id", "payment_policy_name", "payment_policy_code", "payment_policy_deposit_percent", "payment_policy_delivery_percent", "payment_policy_acceptance_percent", "deposit_amount", "delivery_amount", "acceptance_amount", "pdf_generated_at", "pdf_url", "customer_type", "invoice_customer_id", "invoice_contact_id", "invoice_name_snapshot", "invoice_tax_code_snapshot", "invoice_phone_snapshot", "invoice_email_snapshot", "invoice_address_snapshot", "contact_name_snapshot", "contact_phone_snapshot", "contact_email_snapshot", "code"}},
	{Name: "order_items", Columns: []string{"id", "order_id", "combo_id", "product_id", "item_name", "item_type", "quantity", "unit_price", "total_price", "note", "sort_order", "snapshot_data", "created_at", "updated_at"}},
	{Name: "order_payments", Columns: []string{"id", "order_id", "payment_date", "payment_method", "amount", "note", "created_at", "updated_at"}},
	{Name: "order_pdf_versions", Columns: []string{"id", "order_id", "version", "file_path", "file_url", "created_at"}},
}

func main() {
	_ = godotenv.Load(".env.local")
	_ = godotenv.Load(".env")

	tableFilter := flag.String("table", "", "sync only one table")
	tablesFilter := flag.String("tables", "", "sync only a comma-separated list of tables")
	flag.Parse()

	sourceURL := firstEnv("SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_URL")
	sourceKey := firstEnv("SUPABASE_SERVICE_ROLE_KEY")
	targetDSN := firstEnv("DATABASE_URL")

	if sourceURL == "" || sourceKey == "" || targetDSN == "" {
		log.Fatal("missing env: SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, DATABASE_URL")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	pool, err := pgxpool.New(ctx, targetDSN)
	if err != nil {
		log.Fatalf("connect local postgres: %v", err)
	}
	defer pool.Close()

	selected := selectedSyncTables(*tableFilter, *tablesFilter)
	client := &http.Client{Timeout: 60 * time.Second}
	for _, spec := range selected {
		if err := syncTable(ctx, client, sourceURL, sourceKey, pool, spec); err != nil {
			log.Fatalf("sync %s: %v", spec.Name, err)
		}
	}

	log.Println("sync completed")
}

func selectedSyncTables(tableFilter, tablesFilter string) []tableSpec {
	if tableFilter == "" && tablesFilter == "" {
		return syncTables
	}

	selected := map[string]bool{}
	if tableFilter != "" {
		selected[strings.TrimSpace(tableFilter)] = true
	}
	if tablesFilter != "" {
		for _, name := range strings.Split(tablesFilter, ",") {
			name = strings.TrimSpace(name)
			if name != "" {
				selected[name] = true
			}
		}
	}

	var out []tableSpec
	for _, spec := range syncTables {
		if selected[spec.Name] {
			out = append(out, spec)
		}
	}
	return out
}

func syncTable(ctx context.Context, client *http.Client, sourceURL, sourceKey string, pool *pgxpool.Pool, spec tableSpec) error {
	rows, err := fetchTableRows(ctx, client, sourceURL, sourceKey, spec.Name)
	if err != nil {
		return err
	}
	if _, err := pool.Exec(ctx, fmt.Sprintf("delete from %s", spec.Name)); err != nil {
		return err
	}
	if len(rows) == 0 {
		log.Printf("%s: 0 rows", spec.Name)
		return nil
	}

	columnSet, err := localColumns(ctx, pool, spec.Name)
	if err != nil {
		return err
	}
	columns := make([]string, 0, len(spec.Columns))
	for _, col := range spec.Columns {
		if columnSet[col] {
			columns = append(columns, col)
		}
	}
	if len(columns) == 0 {
		log.Printf("%s: skipped, no matching columns", spec.Name)
		return nil
	}

	batch := make([][]any, 0, len(rows))
	for i, row := range rows {
		if spec.Name == "combo_items" {
			if row["no"] == nil {
				row["no"] = float64(i + 1)
			}
		}
		if spec.Name == "orders" && blank(row["code"]) {
			if !blank(row["order_no"]) {
				row["code"] = row["order_no"]
			} else if !blank(row["slug"]) {
				row["code"] = row["slug"]
			}
		}
		if spec.Name == "order_pdf_versions" && blank(row["file_path"]) {
			if !blank(row["file_url"]) {
				row["file_path"] = row["file_url"]
			} else {
				row["file_path"] = fmt.Sprintf("order-pdfs/%s/v%d.pdf", stringValue(row["order_id"]), intValue(row["version"], 1))
			}
		}
		values := make([]any, 0, len(columns))
		for _, col := range columns {
			values = append(values, normalizeValue(row[col]))
		}
		batch = append(batch, values)
	}

	var sql strings.Builder
	sql.WriteString("insert into ")
	sql.WriteString(spec.Name)
	sql.WriteString(" (")
	sql.WriteString(strings.Join(columns, ", "))
	sql.WriteString(") values ")
	args := make([]any, 0, len(batch)*len(columns))
	for i, row := range batch {
		if i > 0 {
			sql.WriteString(", ")
		}
		sql.WriteString("(")
		for j := range row {
			if j > 0 {
				sql.WriteString(", ")
			}
			sql.WriteString(fmt.Sprintf("$%d", len(args)+j+1))
		}
		sql.WriteString(")")
		args = append(args, row...)
	}

	if _, err := pool.Exec(ctx, sql.String(), args...); err != nil {
		return err
	}

	log.Printf("%s: %d rows", spec.Name, len(rows))
	return nil
}

func fetchTableRows(ctx context.Context, client *http.Client, sourceURL, sourceKey, table string) ([]map[string]any, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, fmt.Sprintf("%s/rest/v1/%s?select=*", strings.TrimRight(sourceURL, "/"), table), nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("apikey", sourceKey)
	req.Header.Set("Authorization", "Bearer "+sourceKey)
	req.Header.Set("Accept", "application/json")

	res, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}
	if res.StatusCode >= 300 {
		return nil, fmt.Errorf("supabase %s: %s", res.Status, strings.TrimSpace(string(body)))
	}
	var rows []map[string]any
	if err := json.Unmarshal(body, &rows); err != nil {
		return nil, err
	}
	return rows, nil
}

func localColumns(ctx context.Context, pool *pgxpool.Pool, table string) (map[string]bool, error) {
	rows, err := pool.Query(ctx, `select column_name from information_schema.columns where table_schema = 'public' and table_name = $1`, table)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	out := map[string]bool{}
	for rows.Next() {
		var name string
		if err := rows.Scan(&name); err != nil {
			return nil, err
		}
		out[name] = true
	}
	return out, rows.Err()
}

func normalizeValue(v any) any {
	switch x := v.(type) {
	case nil:
		return nil
	case string, bool, int, int32, int64, float32, float64:
		return x
	case map[string]any, []any:
		b, _ := json.Marshal(x)
		return json.RawMessage(b)
	default:
		b, _ := json.Marshal(x)
		if len(b) == 0 {
			return nil
		}
		return json.RawMessage(b)
	}
}

func firstEnv(keys ...string) string {
	for _, key := range keys {
		if v := strings.TrimSpace(os.Getenv(key)); v != "" {
			return v
		}
	}
	return ""
}

func blank(v any) bool {
	return strings.TrimSpace(stringValue(v)) == ""
}

func stringValue(v any) string {
	switch x := v.(type) {
	case nil:
		return ""
	case string:
		return x
	case fmt.Stringer:
		return x.String()
	default:
		return fmt.Sprint(v)
	}
}

func intValue(v any, fallback int) int {
	switch x := v.(type) {
	case float64:
		return int(x)
	case float32:
		return int(x)
	case int:
		return x
	case int32:
		return int(x)
	case int64:
		return int(x)
	default:
		return fallback
	}
}

var _ = errors.New
