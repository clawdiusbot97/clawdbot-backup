class DecisionEvent < ApplicationRecord
  belongs_to :decision_object
  
  validates :event_type, presence: true
  validates :idempotency_key, presence: true, uniqueness: true
  validates :occurred_at, presence: true
  
  before_validation :set_occurred_at, unless: :occurred_at?
  before_validation :set_idempotency_key, unless: :idempotency_key?
  
  private
  
  def set_occurred_at
    self.occurred_at = Time.current
  end
  
  def set_idempotency_key
    self.idempotency_key = "#{event_type}_#{decision_object_id}_#{Time.now.to_i}"
  end
end
