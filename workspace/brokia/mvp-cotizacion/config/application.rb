require_relative 'boot'

require "rails/all"

Bundler.require(*Rails.groups)

module BrokiaMvp
  class Application < Rails::Application
    config.load_defaults 7.1
    config.api_only = false
    config.middleware.use ActionDispatch::Flash
    config.middleware.use ActionDispatch::Cookies
    config.middleware.use ActionDispatch::Session::CookieStore
    
    # Sidekiq config
    config.active_job.queue_adapter = :sidekiq
  end
end
