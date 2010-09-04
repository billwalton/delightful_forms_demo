module StretchyFieldExtensions
  
  def create_stretchy_field_defaults
    true
  end

  def create_defaults
    self.default_values.each do |key, value|
      self[key] = value if self[key].blank?
    end
  end

  def get_initial_values
    values = Hash.new
    columns = self.class.column_names
    columns.delete("id")
    columns.each {|c|
      values[c] = self[c]
    }
    values
  end

  def identify_required_fields
    required_fields = []
    defaults = self.create_from_validations
    defaults.each {|k,v|
        required_fields.push(k) if v == 'Required'
      }
    required_fields
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

	def eliminate_stretchy_field_defaults
		self.class.column_names.each do |this_field|
			self[this_field] = '' if self.default_values[this_field] == self[this_field]
		end
	end

  def check_group_fields(group)
    address_fields = ['street', 'city', 'state', 'zip']
    defaults = self.default_values
    all_fields_are_defaults = true
    defaults.each do |key, value|
      if address_fields.include?(key)
        if self[key] != value
          all_fields_are_defaults = false
          address_fields.clear
        end
      end
    end
    return all_fields_are_defaults
  end

end
