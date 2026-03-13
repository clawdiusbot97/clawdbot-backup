Rails.application.routes.draw do
  root "dashboard#index"
  
  # API Routes
  namespace :api do
    namespace :v1 do
      post 'webhooks/whatsapp', to: 'webhooks#whatsapp'
      
      resources :decisions, only: [:show, :create, :index] do
        member do
          post :approve
          post :reject
          post :request_info
        end
      end
      
      resources :processes, only: [:show, :create] do
        member do
          post :approve
        end
      end
    end
  end
  
  # Dashboard Routes
  get 'dashboard', to: 'dashboard#index'
  get 'dashboard/conversations/:id', to: 'dashboard#conversation', as: :dashboard_conversation
  get 'dashboard/decisions/:id', to: 'dashboard#decision', as: :dashboard_decision
  post 'dashboard/decisions/:id/approve', to: 'dashboard#approve_decision', as: :approve_dashboard_decision
  post 'dashboard/decisions/:id/reject', to: 'dashboard#reject_decision', as: :reject_dashboard_decision
end
