class Contact < ActiveRecord::Base

  include StretchyFieldExtensions
  after_create :create_stretchy_field_defaults
  
  validates_presence_of :first_name
  validates_presence_of :last_name
  
  before_validation :eliminate_stretchy_field_defaults

end
