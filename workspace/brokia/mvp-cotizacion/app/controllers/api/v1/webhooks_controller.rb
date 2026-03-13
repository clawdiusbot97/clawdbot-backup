module Api
  module V1
    class WebhooksController < ApplicationController
      skip_before_action :verify_authenticity_token
      
      def whatsapp
        # Mock webhook processing for MVP
        phone = params[:From] || params[:from] || "+59899999999"
        body = params[:Body] || params[:body] || "Quiero cotizar un Gol 2021"
        message_id = params[:MessageSid] || "msg_#{Time.now.to_i}"
        
        # Find or create conversation
        conversation = Conversation.find_or_create_by_phone(phone)
        
        # Create inbound message
        message = conversation.messages.create!(
          direction: :inbound,
          actor_type: :customer,
          body: body,
          provider_message_id: message_id,
          status: :received
        )
        
        # Trigger async processing
        ProcessInboundMessageJob.perform_later(message.id)
        
        render json: { status: 'received', conversation_id: conversation.id, message_id: message.id }
      rescue => e
        render json: { error: e.message }, status: :unprocessable_entity
      end
    end
  end
end
