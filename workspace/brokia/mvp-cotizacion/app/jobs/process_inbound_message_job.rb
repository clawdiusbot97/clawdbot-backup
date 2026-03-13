class ProcessInboundMessageJob < ApplicationJob
  queue_as :default
  
  def perform(message_id)
    message = Message.find(message_id)
    conversation = message.conversation
    
    # Step 1: Classify intent
    intent = classify_intent(message.body)
    
    # Step 2: If cotizacion detected, extract data
    if intent == 'cotizacion_auto'
      extracted = extract_vehicle_data(message.body)
      
      # Create or update decision
      decision = conversation.decision_objects.create!(
        type: 'CotizacionAuto',
        status: :needs_info,
        data: extracted[:data],
        missing_fields: extracted[:missing],
        evidence_map: extracted[:evidence],
        confidence: extracted[:confidence]
      )
      
      # Start process execution
      ProcessExecution.create!(
        decision_object: decision,
        template: 'cotizacion_auto_v1',
        context: { source_message_id: message.id }
      )
    end
    
    # Update conversation timestamp
    conversation.update!(last_message_at: Time.current)
  end
  
  private
  
  def classify_intent(text)
    text = text.downcase
    if text.match?(/cotizar|cotizacion|precio|seguro.*auto|vehiculo/)
      'cotizacion_auto'
    elsif text.match?(/endoso|cambio.*vehiculo/)
      'endoso'
    elsif text.match?(/siniestro|accidente/)
      'siniestro'
    else
      'unknown'
    end
  end
  
  def extract_vehicle_data(text)
    text = text.downcase
    data = {}
    missing = %w[marca modelo anio cilindrada uso zona edad_conductor]
    evidence = {}
    
    # Simple regex extraction (MVP - replace with LLM later)
    if text.match?(/gol/)
      data['marca'] = 'Volkswagen'
      data['modelo'] = 'Gol'
      missing -= %w[marca modelo]
      evidence['marca'] = ['msg_current']
      evidence['modelo'] = ['msg_current']
    end
    
    if text.match?(/(=\d{4})/)
      year = text.match(/(=\d{4})/)[1].to_i
      if year >= 1990 && year <= 2026
        data['anio'] = year
        missing.delete('anio')
        evidence['anio'] = ['msg_current']
      end
    end
    
    {
      data: data,
      missing: missing,
      evidence: evidence,
      confidence: data.empty? ? 0.3 : 0.7
    }
  end
end
