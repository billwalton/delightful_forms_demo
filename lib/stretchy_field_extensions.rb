class String
  def camel_case
    self.tr('_',' ').split(' ').map {|part| part.capitalize}.join
  end
end

module StretchyFieldExtensions
  
  def get_initial_values
    values = Hash.new
    columns = self.class.column_names
    columns.delete("id")
    columns.each {|c|
      values[c.to_s] = self[c].blank? ? self.default_value_for(c) : self[c]
    }
    values
  end

  def is_a_required_field?(field)
    column_validations = self.class.reflect_on_all_validations
    column_validations.each {|v| return true if v.name.to_s == field.to_s && v.macro == :validates_presence_of }
    false
  end

  def default_values
    base_values = self.create_from_validations
    added_values = self.default_values_for_stretchy_fields
    added_values.each {|k,v| base_values[k] = v }
    base_values
  end

  def default_value_for(field)
    base_values = self.default_values
    base_values[field]
  end

  def create_from_validations
    values = Hash.new
    columns = self.class.column_names
    columns.delete("id")
    columns.each {|c| values[c] = 'Optional'}
    column_validations = self.class.reflect_on_all_validations
    column_validations.each {|v| values[v.name.to_s] = 'Required' if v.macro == :validates_presence_of }
    values
  end

	def eliminate_stretchy_field_defaults
		self.class.column_names.each do |this_field|
			self[this_field] = '' if self.default_values[this_field] == self[this_field]
		end
	end

#  def check_group_fields(group)
#    address_fields = ['street', 'city', 'state', 'zip']
#    defaults = self.default_values
#    all_fields_are_defaults = true
#    defaults.each do |key, value|
#      if address_fields.include?(key)
#        if self[key] != value
#          all_fields_are_defaults = false
#          address_fields.clear
#        end
#      end
#    end
#    return all_fields_are_defaults
#  end

end
