class CreateDecisionObjects < ActiveRecord::Migration[7.1]
  def change
    create_table :decision_objects do |t|
      t.string :type, null: false # CotizacionAuto, Endoso, etc.
      t.integer :status, default: 0, null: false # draft, needs_info, ready, approved, executed
      t.references :conversation, null: false, foreign_key: true
      t.jsonb :data, default: {}
      t.jsonb :missing_fields, default: []
      t.jsonb :evidence_map, default: {}
      t.decimal :confidence, precision: 3, scale: 2
      t.string :current_version_id
      t.timestamps
    end
    
    add_index :decision_objects, :conversation_id
    add_index :decision_objects, :type
    add_index :decision_objects, :status
  end
end
