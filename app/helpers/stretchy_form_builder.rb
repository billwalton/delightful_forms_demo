class StretchyFormBuilder < ActionView::Helpers::FormBuilder
  # add :default_value and :required to each input with class="stretchy_input"
  def text_field(label, *args)
    options = args.extract_options!
    if options[:class] && options[:class].split(' ').include?('stretchy_input')
      if @object.is_a_required_field?(label)
        options[:link_style] = 'stretchy_box' if options[:link_style].blank?
      end
      options[:default_value] = @object.default_value_for(label) unless @object.default_value_for(label).blank?
    end
    super(label, *(args << options))
  end
end