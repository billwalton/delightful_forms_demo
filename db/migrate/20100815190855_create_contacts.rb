class CreateContacts < ActiveRecord::Migration
  def self.up
    create_table "contacts" do |t|
      t.string         :first_name
      t.string         :last_name
      t.string         :street
      t.string         :city
      t.string         :state
      t.string         :zip
      t.text           :directions
      t.string         :phone
      t.string         :cell
      t.string         :email
    end
  end

  def self.down
    drop_table "contacts"
  end
end
