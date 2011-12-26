class Contact < ActiveRecord::Base
  include StretchyFieldExtensions
  before_validation :eliminate_stretchy_field_defaults

  validates :first_name, :last_name, :presence => true

	def default_values_for_stretchy_fields
    {'email' => 'add Email address',
     'address' => 'Optional'}
	end

end
