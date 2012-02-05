class StretchyFormBuilder < ActionView::Helpers::FormBuilder

  def add_options_for_stretchy_text_inputs(object, label, *args)
    options = args.extract_options!
    if options[:class] && options[:class].split(' ').include?('stretchy_input')
      if object.is_a_required_field?(label)
        options[:link_style] = 'stretchy_box' if options[:link_style].blank?
      end
      options[:default_value] = object.default_value_for(label) unless object.default_value_for(label).blank?
    end
    return (args << options)
  end

  def text_field(label, *args)
    args = add_options_for_stretchy_text_inputs(@object, label, *args)
    super(label, *args)
  end

  def text_area(label, *args)
    args = add_options_for_stretchy_text_inputs(@object, label, *args)
    super(label, *args)
  end

end