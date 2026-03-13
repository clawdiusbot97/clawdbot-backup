class CreateProcessExecutions < ActiveRecord::Migration[7.1]
  def change
    create_table :process_executions do |t|
      t.string :template, null: false # cotizacion_auto_v1
      t.integer :template_version, default: 1
      t.references :decision_object, null: false, foreign_key: true
      t.integer :status, default: 0, null: false # running, waiting_human, waiting_integration, done, failed
      t.string :current_step_key
      t.jsonb :context, default: {}
      t.datetime :due_at
      t.timestamps
    end
    
    add_index :process_executions, :decision_object_id
    add_index :process_executions, :status
  end
end
