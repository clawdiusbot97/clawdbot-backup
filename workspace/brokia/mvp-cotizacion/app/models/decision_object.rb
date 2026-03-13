class DecisionObject < ApplicationRecord
  belongs_to :conversation
  has_many :decision_events, dependent: :destroy
  has_one :process_execution, dependent: :destroy
  
  enum status: { 
    draft: 0, 
    needs_info: 1, 
    ready: 2, 
    approved: 3, 
    rejected: 4,
    executed: 5 
  }
  
  validates :type, presence: true
  
  after_create :emit_detected_event
  after_update :emit_status_change_event, if: :saved_change_to_status?
  
  def self.types
    %w[CotizacionAuto Endoso Siniestro Renovacion]
  end
  
  def missing_fields_list
    missing_fields || []
  end
  
  def evidence_for(field)
    evidence_map&.dig(field) || []
  end
  
  def update_extraction!(extracted_data, missing, evidence)
    self.data = (data || {}).merge(extracted_data)
    self.missing_fields = missing
    self.evidence_map = evidence
    self.status = missing.any? ? :needs_info : :ready
    save!
  end
  
  private
  
  def emit_detected_event
    decision_events.create!(
      event_type: 'decision.detected',
      idempotency_key: "dec_#{id}_detected",
      payload: { type: type, source: 'extraction' },
      occurred_at: Time.current
    )
  end
  
  def emit_status_change_event
    decision_events.create!(
      event_type: "decision.#{status}",
      idempotency_key: "dec_#{id}_#{status}_#{Time.now.to_i}",
      payload: { previous_status: status_before_last_save, current_status: status },
      occurred_at: Time.current
    )
  end
end
