class CreateConversations < ActiveRecord::Migration[7.1]
  def change
    create_table :conversations do |t|
      t.string :customer_phone, null: false
      t.string :customer_name
      t.integer :status, default: 0, null: false # enum: active, closed
      t.integer :control_mode, default: 0, null: false # enum: ai_first, human_led, human_takeover
      t.datetime :last_message_at
      t.timestamps
    end
    
    add_index :conversations, :customer_phone, unique: true
    add_index :conversations, :status
  end
end
