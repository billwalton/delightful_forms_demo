class Contact < ActiveRecord::Base
  include StretchyFieldExtensions

  before_validation :eliminate_stretchy_field_defaults

  validates_presence_of :first_name
  validates_presence_of :last_name

	def default_values_for_stretchy_fields
    {'email' => 'add Email address',
     'address' => 'Optional'}
	end

end
