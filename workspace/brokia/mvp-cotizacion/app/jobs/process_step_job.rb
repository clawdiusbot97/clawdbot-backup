class ProcessStepJob < ApplicationJob
  queue_as :default
  
  def perform(process_execution_id)
    process = ProcessExecution.find(process_execution_id)
    decision = process.decision_object
    conversation = decision.conversation
    
    case process.current_step_key
    when 'recopilar_datos'
      handle_recopilar_datos(process, decision, conversation)
    when 'validar_completitud'
      handle_validar_completitud(process, decision)
    when 'ejecutar_cotizacion'
      handle_ejecutar_cotizacion(process, decision)
    when 'presentar_al_cliente'
      handle_presentar(process, decision, conversation)
    when 'validar_aceptacion'
      handle_validar_aceptacion(process, decision)
    when 'gate_aprobacion_humana'
      handle_gate_aprobacion(process, decision)
    when 'emitir_poliza'
      handle_emitir_poliza(process, decision, conversation)
    end
  end
  
  private
  
  def handle_recopilar_datos(process, decision, conversation)
    # Check if we have all required fields
    if decision.missing_fields_list.any?
      # In AI-first mode, send question
      # In human-led mode, just wait
      if conversation.ai_first?
        question = generate_question(decision.missing_fields_list.first)
        send_whatsapp_mock(conversation, question)
      end
      # Don't advance - wait for more messages
    else
      process.advance_step!
    end
  end
  
  def handle_validar_completitud(process, decision)
    if decision.missing_fields_list.empty?
      process.advance_step!
    else
      process.update!(current_step_key: 'recopilar_datos')
      ProcessStepJob.perform_later(process.id)
    end
  end
  
  def handle_ejecutar_cotizacion(process, decision)
    # Mock - in real app, call aseguradoras APIs
    cotizaciones = [
      { aseguradora: 'SURA', prima: 45000, cobertura: 'Todo Riesgo' },
      { aseguradora: 'Porto Seguro', prima: 42000, cobertura: 'Todo Riesgo' },
      { aseguradora: 'Mapfre', prima: 48000, cobertura: 'Todo Riesgo' }
    ]
    
    mejor = cotizaciones.min_by { |c| c[:prima] }
    
    process.update!(
      context: process.context_data.merge(
        cotizaciones: cotizaciones,
        recomendacion: mejor
      )
    )
    decision.update!(
      data: decision.data.merge('cotizaciones' => cotizaciones, 'recomendacion' => mejor)
    )
    
    process.advance_step!
  end
  
  def handle_presentar(process, decision, conversation)
    recomendacion = process.context_data['recomendacion']
    mensaje = "💰 *Cotización Lista*\n\n"
    mensaje += "🚗 #{decision.data['marca']} #{decision.data['modelo']} #{decision.data['anio']}\n\n"
    mensaje += "*Mejor opción:*\n"
    mensaje += "#{recomendacion['aseguradora']}: $#{recomendacion['prima']}/año\n"
    mensaje += "Cobertura: #{recomendacion['cobertura']}\n\n"
    mensaje += "¿Te interesa esta opción? Responde *SI* para continuar."
    
    if conversation.ai_first?
      send_whatsapp_mock(conversation, mensaje)
    end
    
    # Create message record
    conversation.messages.create!(
      direction: :outbound,
      actor_type: :ai,
      body: mensaje,
      correlation_id: "corr_#{conversation.id}_#{Time.now.to_i}"
    )
    
    process.advance_step!
  end
  
  def handle_validar_aceptacion(process, decision)
    # In real app, check last customer message for "SI" or "NO"
    # For MVP, we wait for human or simulate
    last_message = decision.conversation.messages.inbound.order(:created_at).last
    
    if last_message && last_message.body.match?(/si|ok|acepto/i)
      process.advance_step!
    elsif last_message && last_message.body.match?(/no|rechazo/i)
      process.update!(status: :done, current_step_key: 'rechazado')
    else
      # Still waiting - requeue in 1 minute
      ProcessStepJob.set(wait: 1.minute).perform_later(process.id)
    end
  end
  
  def handle_gate_aprobacion(process, decision)
    # Pause and wait for human approval
    process.update!(status: :waiting_human)
    
    # Notify broker
    send_notification_to_broker(decision)
  end
  
  def handle_emitir_poliza(process, decision, conversation)
    # Mock emission
    poliza_numero = "POL-#{Time.now.to_i}"
    
    mensaje = "✅ *Póliza Emitida*\n\n"
    mensaje += "Número: #{poliza_numero}\n"
    mensaje += "Aseguradora: #{decision.data['recomendacion']['aseguradora']}\n"
    mensaje += "Prima: $#{decision.data['recomendacion']['prima']}\n\n"
    mensaje += "Tu seguro está activo. ¡Gracias por confiar en nosotros!"
    
    if conversation.ai_first?
      send_whatsapp_mock(conversation, mensaje)
    end
    
    conversation.messages.create!(
      direction: :outbound,
      actor_type: :system,
      body: mensaje,
      correlation_id: "corr_#{conversation.id}_#{Time.now.to_i}"
    )
    
    decision.update!(status: :executed)
    process.update!(status: :done, current_step_key: 'completed')
  end
  
  def generate_question(field)
    questions = {
      'marca' => '¿Qué marca es el vehículo?',
      'modelo' => '¿Qué modelo?',
      'anio' => '¿De qué año?',
      'cilindrada' => '¿Qué cilindrada tiene (ej: 1.6, 2.0)?',
      'uso' => '¿El uso es particular o comercial?',
      'zona' => '¿En qué zona circula principalmente?',
      'edad_conductor' => '¿Qué edad tiene el conductor principal?'
    }
    questions[field] || "¿Me podrías indicar #{field}?"
  end
  
  def send_whatsapp_mock(conversation, message)
    # In MVP, just log it. In production, call WABA API
    Rails.logger.info "[WHATSAPP MOCK] To #{conversation.customer_phone}: #{message}"
  end
  
  def send_notification_to_broker(decision)
    Rails.logger.info "[BROKER NOTIFICATION] Decision #{decision.id} waiting for approval"
    # In production: send email, WhatsApp, or push notification
  end
end
