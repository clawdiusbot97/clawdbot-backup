class CreateMessages < ActiveRecord::Migration[7.1]
  def change
    create_table :messages do |t|
      t.references :conversation, null: false, foreign_key: true
      t.integer :direction, null: false # enum: inbound, outbound
      t.integer :actor_type, null: false # enum: customer, ai, human, system
      t.string :actor_ref
      t.text :body
      t.string :intent # ask_missing_info, confirm, etc.
      t.string :provider_message_id
      t.integer :status, default: 0 # received, sent, delivered, failed
      t.string :idempotency_key
      t.string :correlation_id, null: false
      t.jsonb :provider_payload, default: {}
      t.timestamps
    end
    
    add_index :messages, :conversation_id
    add_index :messages, :correlation_id
    add_index :messages, [:conversation_id, :created_at]
  end
end
