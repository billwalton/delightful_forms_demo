class ContactsController < ApplicationController
  # GET /contacts
  # GET /contacts.xml
  def index
    @contacts = Contact.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @contacts }
    end
  end

  # GET /contacts/1
  # GET /contacts/1.xml
  def show
    @contact = Contact.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @contact }
    end
  end

  # GET /contacts/new
  # GET /contacts/new.xml
  def new
    @contact = Contact.new
    @initial_value = @contact.get_initial_values
    @address_group_empty = true
    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @contact }
    end
  end

  # GET /contacts/1/edit
  def edit
    @contact = Contact.find(params[:id])
    @initial_value = @contact.get_initial_values
    @address_group_empty = check_address_fields
    respond_to do |format|
      format.html # edit.html.erb
      format.xml  { render :xml => @contact }
    end
  end

  # POST /contacts
  # POST /contacts.xml
  def create

    respond_to do |format|
      if params[:commit] == 'Cancel'
        format.html {
          redirect_to contacts_path
        }
      else
        @contact = Contact.new(params[:contact])
        if @contact.save
          flash[:notice] = 'Contact was successfully created.'
          format.html { redirect_to(@contact) }
          format.xml  { render :xml => @contact, :status => :created, :location => @contact }
        else
          @initial_value = @contact.get_initial_values
          @address_group_empty = check_address_fields
          format.html { render :action => "new" }
          format.xml  { render :xml => @contact.errors, :status => :unprocessable_entity }
        end
      end
    end
  end

  # PUT /contacts/1
  # PUT /contacts/1.xml
  def update
    respond_to do |format|
      if params[:commit] == 'Cancel'
        format.html {
          redirect_to contacts_path
        }
      else
        @contact = Contact.find(params[:id])
        if @contact.update_attributes(params[:contact])
          flash[:notice] = 'Contact was successfully updated.'
          format.html { redirect_to(@contact) }
          format.xml  { head :ok }
        else
          @initial_value = @contact.get_initial_values
          @address_group_empty = check_address_fields
          format.html { render :action => "edit" }
          format.xml  { render :xml => @contact.errors, :status => :unprocessable_entity }
        end
      end
    end
  end

  # DELETE /contacts/1
  # DELETE /contacts/1.xml
  def destroy
    @contact = Contact.find(params[:id])
    @contact.destroy

    respond_to do |format|
      format.html { redirect_to(contacts_url) }
      format.xml  { head :ok }
    end
  end

  def check_address_fields
    address_fields = ['street', 'city', 'state', 'zip']
    all_fields_are_defaults = true
    address_fields.each do |field|
      all_fields_are_defaults = false unless @contact[field].blank?
    end
    return all_fields_are_defaults
  end

end