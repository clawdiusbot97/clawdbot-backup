class ProcessExecution < ApplicationRecord
  belongs_to :decision_object
  
  enum status: { 
    running: 0, 
    waiting_human: 1, 
    waiting_integration: 2, 
    done: 3, 
    failed: 4 
  }
  
  validates :template, presence: true
  validates :current_step_key, presence: true, allow_nil: false
  
  after_create :start_process
  
  STEPS = {
    'cotizacion_auto_v1' => %w[
      recopilar_datos
      validar_completitud
      ejecutar_cotizacion
      presentar_al_cliente
      validar_aceptacion
      gate_aprobacion_humana
      emitir_poliza
    ]
  }
  
  def start_process
    update!(current_step_key: 'recopilar_datos', status: :running)
    ProcessStepJob.perform_later(id)
  end
  
  def advance_step!
    steps = STEPS[template] || []
    current_index = steps.index(current_step_key)
    next_step = steps[current_index + 1] if current_index
    
    if next_step
      update!(current_step_key: next_step)
      ProcessStepJob.perform_later(id)
    else
      update!(status: :done, current_step_key: 'completed')
    end
  end
  
  def current_step_requires_approval?
    current_step_key == 'gate_aprobacion_humana'
  end
  
  def approve!
    return unless waiting_human?
    advance_step!
  end
  
  def context_data
    context || {}
  end
end
