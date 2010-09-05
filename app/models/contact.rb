class Contact < ActiveRecord::Base
  require 'stretchy_field_extensions'
  include StretchyFieldExtensions

  before_validation :eliminate_stretchy_field_defaults

  validates_presence_of :first_name
  validates_presence_of :last_name

end
