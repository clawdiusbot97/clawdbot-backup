module Api
  module V1
    class DecisionsController < ApplicationController
      def index
        decisions = DecisionObject.order(created_at: :desc).limit(50)
        render json: decisions.as_json(include: :conversation)
      end
      
      def show
        decision = DecisionObject.find(params[:id])
        render json: decision.as_json(
          include: [:conversation, :decision_events, :process_execution]
        )
      end
      
      def approve
        decision = DecisionObject.find(params[:id])
        decision.update!(status: :approved)
        
        if decision.process_execution
          decision.process_execution.approve!
        end
        
        render json: { status: 'approved', decision_id: decision.id }
      end
      
      def reject
        decision = DecisionObject.find(params[:id])
        decision.update!(status: :rejected)
        render json: { status: 'rejected', decision_id: decision.id }
      end
    end
  end
end
