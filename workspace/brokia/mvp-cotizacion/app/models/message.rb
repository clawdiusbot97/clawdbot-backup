class Message < ApplicationRecord
  belongs_to :conversation
  
  enum direction: { inbound: 0, outbound: 1 }
  enum actor_type: { customer: 0, ai: 1, human: 2, system: 3 }
  enum status: { received: 0, queued: 1, sent: 2, delivered: 3, read: 4, failed: 5 }
  
  validates :body, presence: true
  validates :correlation_id, presence: true
  
  before_create :set_correlation_id, unless: :correlation_id?
  
  scope :recent, -> { order(created_at: :desc).limit(50) }
  
  private
  
  def set_correlation_id
    self.correlation_id = "corr_#{conversation_id}_#{Time.now.to_i}"
  end
end
