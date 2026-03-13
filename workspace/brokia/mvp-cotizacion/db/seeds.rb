# This file should contain all the record creation needed to seed the database.
# The data can then be loaded with the bin/rails db:seed command.

puts "Creating sample data for BROKIA MVP..."

# Create a sample conversation
conv = Conversation.find_or_create_by!(customer_phone: '+59899123456') do |c|
  c.customer_name = 'Juan Pérez'
  c.status = :active
  c.control_mode = :human_led
  c.last_message_at = Time.current
end

# Create sample messages
conv.messages.create!([
  {
    direction: :inbound,
    actor_type: :customer,
    body: 'Hola, quiero cotizar un seguro para mi auto',
    status: :received,
    correlation_id: 'corr_demo_1'
  },
  {
    direction: :outbound,
    actor_type: :ai,
    body: '¡Hola! Con gusto te ayudo. ¿Qué marca y modelo es tu vehículo?',
    status: :sent,
    correlation_id: 'corr_demo_2'
  },
  {
    direction: :inbound,
    actor_type: :customer,
    body: 'Es un Gol 2021',
    status: :received,
    correlation_id: 'corr_demo_3'
  }
])

# Create a sample decision
decision = conv.decision_objects.create!(
  type: 'CotizacionAuto',
  status: :needs_info,
  data: {
    'marca' => 'Volkswagen',
    'modelo' => 'Gol',
    'anio' => 2021
  },
  missing_fields: ['cilindrada', 'uso', 'zona', 'edad_conductor'],
  evidence_map: {
    'marca' => ['msg_3'],
    'modelo' => ['msg_3'],
    'anio' => ['msg_3']
  },
  confidence: 0.75
)

# Create decision events
decision.decision_events.create!(
  event_type: 'decision.detected',
  idempotency_key: "dec_#{decision.id}_detected",
  payload: { type: 'CotizacionAuto', intent: 'cotizacion_auto' },
  occurred_at: Time.current - 5.minutes
)

decision.decision_events.create!(
  event_type: 'decision.needs_info',
  idempotency_key: "dec_#{decision.id}_needs_info",
  payload: { missing_fields: decision.missing_fields },
  occurred_at: Time.current - 4.minutes
)

puts "✅ Seed data created successfully!"
puts ""
puts "Sample data:"
puts "- Conversation: #{conv.customer_phone} (#{conv.customer_name})"
puts "- Decision ##{decision.id}: #{decision.type} - #{decision.status}"
puts "- Missing fields: #{decision.missing_fields.join(', ')}"
puts ""
puts "Visit http://localhost:3000/dashboard to see the data"
