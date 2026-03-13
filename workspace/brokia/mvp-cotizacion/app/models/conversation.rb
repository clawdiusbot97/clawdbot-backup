class Conversation < ApplicationRecord
  has_many :messages, dependent: :destroy
  has_many :decision_objects, dependent: :destroy
  
  enum status: { active: 0, closed: 1 }
  enum control_mode: { ai_first: 0, human_led: 1, human_takeover: 2 }
  
  validates :customer_phone, presence: true, uniqueness: true
  
  def self.find_or_create_by_phone(phone, name = nil)
    find_or_create_by(customer_phone: phone) do |conv|
      conv.customer_name = name
      conv.status = :active
      conv.control_mode = :human_led # Default to human-led for safety
    end
  end
  
  def latest_decision
    decision_objects.order(created_at: :desc).first
  end
end
