# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_delightful_forms_demo_session',
  :secret      => '453e25bc12ad1dd3ae9bff6c1f3ef2e129062bee0fcdaae50112588e6fd23e57eb4e0b284e42bca039f1ba29d5254882abaeed43c4e7b39fa57936d175a039e2'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
