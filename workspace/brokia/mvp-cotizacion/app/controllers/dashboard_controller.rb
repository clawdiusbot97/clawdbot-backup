class DashboardController < ApplicationController
  def index
    @conversations = Conversation.active.order(last_message_at: :desc).limit(20)
    @decisions = DecisionObject.order(created_at: :desc).limit(20)
    @pending_approvals = DecisionObject.where(status: :ready).order(created_at: :desc)
  end
  
  def conversation
    @conversation = Conversation.find(params[:id])
    @messages = @conversation.messages.order(:created_at)
    @decisions = @conversation.decision_objects.order(created_at: :desc)
  end
  
  def decision
    @decision = DecisionObject.find(params[:id])
    @conversation = @decision.conversation
    @messages = @conversation.messages.order(:created_at)
    @events = @decision.decision_events.order(:occurred_at)
    @process = @decision.process_execution
  end
  
  def approve_decision
    @decision = DecisionObject.find(params[:id])
    @decision.update!(status: :approved)
    
    if @decision.process_execution
      @decision.process_execution.approve!
    end
    
    redirect_to dashboard_decision_path(@decision), notice: 'Decisión aprobada correctamente'
  end
  
  def reject_decision
    @decision = DecisionObject.find(params[:id])
    @decision.update!(status: :rejected)
    redirect_to dashboard_decision_path(@decision), notice: 'Decisión rechazada'
  end
end
