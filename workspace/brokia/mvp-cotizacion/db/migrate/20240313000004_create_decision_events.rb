class CreateDecisionEvents < ActiveRecord::Migration[7.1]
  def change
    create_table :decision_events do |t|
      t.string :event_type, null: false
      t.references :decision_object, null: false, foreign_key: true
      t.string :idempotency_key, null: false
      t.jsonb :payload, default: {}
      t.jsonb :causation, default: {}
      t.datetime :occurred_at, null: false
      t.timestamps
    end
    
    add_index :decision_events, :decision_object_id
    add_index :decision_events, :event_type
    add_index :decision_events, :idempotency_key, unique: true
  end
end
