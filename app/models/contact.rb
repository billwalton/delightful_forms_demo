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
    defaults['address'] = 'Optional'
    defaults
	end

  def create_from_validations
    values = Hash.new
    columns = self.class.column_names
    columns.delete("id")
    columns.each {|c| values[c] = 'Optional'}
    validations = self.class.reflect_on_all_validations
    validations.each {|v| values[v.name.to_s] = 'Required' if v.macro == :validates_presence_of }
    values
  end

	def eliminate_defaults
		self.class.column_names.each do |this_field|
			self[this_field] = '' if self.default_values[this_field] == self[this_field]
		end
	end

  
end
