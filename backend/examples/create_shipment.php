<?php
/**
 * PHP example for creating a shipment record in the Midwest Shipment database.
 * This example POSTs JSON to the backend shipments API and stores the shipment record.
 * Update the DSN, username, and password to match your MySQL connection.
 *
 * Example payload keys:
 *   sender_name, sender_address, sender_city, recipient_name, recipient_address,
 *   recipient_city, service_type, status, shipment_cost, clearance_cost,
 *   total_amount, payment_status, payment_method, parcel_items
 */

header('Content-Type: application/json; charset=utf-8');

$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON payload.']);
    exit;
}

$required = [
    'sender_name',
    'sender_address',
    'sender_city',
    'recipient_name',
    'recipient_address',
    'recipient_city',
    'service_type',
    'status'
];

foreach ($required as $field) {
    if (empty($input[$field])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => "Missing required field: {$field}" ]);
        exit;
    }
}

$dsn = 'mysql:host=127.0.0.1;dbname=midwest_shipment;charset=utf8mb4';
$username = 'root';
$password = '';
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

try {
    $pdo = new PDO($dsn, $username, $password, $options);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed.', 'error' => $e->getMessage()]);
    exit;
}

function generateTrackingId(): string
{
    return 'ZG-' . strtoupper(bin2hex(random_bytes(4)));
}

$trackingId = generateTrackingId();
$orderId = trim((string)($input['order_id'] ?? '')) ?: 'ORD-' . date('YmdHis') . '-' . strtoupper(substr(bin2hex(random_bytes(2)), 0, 4));

$parcelItems = $input['parcel_items'] ?? [];
if (!is_array($parcelItems)) {
    $parcelItems = [];
}

$parcelItemsJson = json_encode($parcelItems, JSON_UNESCAPED_UNICODE);

$sql = <<<SQL
INSERT INTO shipments (
  tracking_id, order_id,
  sender_name, sender_email, sender_phone, sender_address, sender_city, sender_state, sender_country, sender_zip,
  recipient_name, recipient_email, recipient_phone, recipient_address, recipient_city, recipient_state, recipient_country, recipient_zip,
  shipment_cost, clearance_cost, total_amount, payment_status, currency,
  parcel_quantity, parcel_product, parcel_status, parcel_description,
  parcel_shipping_cost, parcel_total_cost, parcel_items,
  description, weight, weight_unit, dimensions, package_type, declared_value,
  service_type, status, priority, ship_date, estimated_delivery,
  current_location, notes, admin_notes, created_by
) VALUES (
  :tracking_id, :order_id,
  :sender_name, :sender_email, :sender_phone, :sender_address, :sender_city, :sender_state, :sender_country, :sender_zip,
  :recipient_name, :recipient_email, :recipient_phone, :recipient_address, :recipient_city, :recipient_state, :recipient_country, :recipient_zip,
  :shipment_cost, :clearance_cost, :total_amount, :payment_status, :currency,
  :parcel_quantity, :parcel_product, :parcel_status, :parcel_description,
  :parcel_shipping_cost, :parcel_total_cost, :parcel_items,
  :description, :weight, :weight_unit, :dimensions, :package_type, :declared_value,
  :service_type, :status, :priority, :ship_date, :estimated_delivery,
  :current_location, :notes, :admin_notes, :created_by
)
SQL;

$statement = $pdo->prepare($sql);

$params = [
    ':tracking_id' => $trackingId,
    ':order_id' => $orderId,
    ':sender_name' => $input['sender_name'],
    ':sender_email' => $input['sender_email'] ?? null,
    ':sender_phone' => $input['sender_phone'] ?? null,
    ':sender_address' => $input['sender_address'],
    ':sender_city' => $input['sender_city'],
    ':sender_state' => $input['sender_state'] ?? null,
    ':sender_country' => $input['sender_country'] ?? 'USA',
    ':sender_zip' => $input['sender_zip'] ?? $input['sender_postal_code'] ?? null,
    ':recipient_name' => $input['recipient_name'],
    ':recipient_email' => $input['recipient_email'] ?? null,
    ':recipient_phone' => $input['recipient_phone'] ?? null,
    ':recipient_address' => $input['recipient_address'],
    ':recipient_city' => $input['recipient_city'],
    ':recipient_state' => $input['recipient_state'] ?? null,
    ':recipient_country' => $input['recipient_country'] ?? 'USA',
    ':recipient_zip' => $input['recipient_zip'] ?? $input['recipient_postal_code'] ?? null,
    ':shipment_cost' => isset($input['shipment_cost']) ? (float)$input['shipment_cost'] : null,
    ':clearance_cost' => isset($input['clearance_cost']) ? (float)$input['clearance_cost'] : null,
    ':total_amount' => isset($input['total_amount']) ? (float)$input['total_amount'] : null,
    ':payment_status' => $input['payment_status'] ?? 'pending',
    ':currency' => $input['currency'] ?? 'USD',
    ':parcel_quantity' => isset($input['parcel_quantity']) ? (int)$input['parcel_quantity'] : 1,
    ':parcel_product' => $input['parcel_product'] ?? null,
    ':parcel_status' => $input['parcel_status'] ?? null,
    ':parcel_description' => $input['parcel_description'] ?? null,
    ':parcel_shipping_cost' => isset($input['parcel_shipping_cost']) ? (float)$input['parcel_shipping_cost'] : null,
    ':parcel_total_cost' => isset($input['parcel_total_cost']) ? (float)$input['parcel_total_cost'] : null,
    ':parcel_items' => $parcelItemsJson,
    ':description' => $input['description'] ?? null,
    ':weight' => isset($input['weight']) ? (float)$input['weight'] : null,
    ':weight_unit' => $input['weight_unit'] ?? 'lbs',
    ':dimensions' => $input['dimensions'] ?? null,
    ':package_type' => $input['package_type'] ?? null,
    ':declared_value' => isset($input['declared_value']) ? (float)$input['declared_value'] : null,
    ':service_type' => $input['service_type'],
    ':status' => $input['status'],
    ':priority' => $input['priority'] ?? 'normal',
    ':ship_date' => $input['ship_date'] ?? null,
    ':estimated_delivery' => $input['estimated_delivery'] ?? null,
    ':current_location' => $input['current_location'] ?? null,
    ':notes' => $input['notes'] ?? null,
    ':admin_notes' => $input['admin_notes'] ?? null,
    ':created_by' => null,
];

try {
    $statement->execute($params);
    echo json_encode([
        'success' => true,
        'message' => 'Shipment created successfully.',
        'tracking_id' => $trackingId,
        'order_id' => $orderId,
        'id' => $pdo->lastInsertId(),
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to save shipment.', 'error' => $e->getMessage()]);
}
