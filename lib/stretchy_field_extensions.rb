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
    column_validations = self.class.validators
    column_validations.each  do |v|
      if v.class.to_s.split("::").last == "PresenceValidator"
        v.attributes.each do |a|
          return true if a.to_s == field.to_s
        end
      end
    end
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
    columns.each {|c| c == 'id' || is_a_required_field?(c) ? values[c] = 'Required' : values[c] = 'Optional'}
    values
  end

	def eliminate_stretchy_field_defaults
    columns = self.class.column_names
    columns.each do |this_field|
			self[this_field] = '' if self.default_values[this_field] == self[this_field]
		end
	end

end

class String
  def camel_case
    self.tr('_',' ').split(' ').map {|part| part.capitalize}.join
  end
end

