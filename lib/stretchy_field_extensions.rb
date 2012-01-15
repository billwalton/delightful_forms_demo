module StretchyFieldExtensions
  
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

  def default_value_for(field)
    base_values = self.default_values_for_stretchy_fields
    base_values[field.to_s]
  end

end