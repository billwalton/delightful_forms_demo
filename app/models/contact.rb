class Contact < ActiveRecord::Base
  include StretchyFieldExtensions

  validates :first_name, :last_name, :presence => true

	def default_values_for_stretchy_fields
    {'email' => 'add Email address',
     'phone' => 'XXX-XXX-XXXX'}
	end

end
