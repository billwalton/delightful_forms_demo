class Contact < ActiveRecord::Base
  validates_presence_of :first_name
  validates_presence_of :last_name
  
  before_validation :eliminate_defaults

  def create_defaults
    self.default_values.each do |key, value|
      self[key] = value if self[key].blank?
    end
  end

	def default_values
    defaults = self.create_from_validations
    defaults['email'] = 'add Email address'
    defaults
	end

  def create_from_validations
    {'first_name' => 'Required',
     'last_name' => 'Required',
     'street' => 'Optional',
     'city' => 'Optional',
     'state' => 'Optional',
     'zip' => 'Optional',
     'email' => 'add eMail address',
     'phone' => 'Optional'} 
  end

	def eliminate_defaults
		Contact.column_names.each do |this_field|
			self[this_field] = '' if self.default_values[this_field] == self[this_field]
		end
	end

  
end
