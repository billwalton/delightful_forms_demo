class CreateContacts < ActiveRecord::Migration
  def self.up
    create_table "contacts" do |t|
      t.first_name    :string
      t.last_name     :string
      t.street        :string
      t.city          :string
      t.state         :string
      t.zip           :string
      t.phone         :string
      t.email         :string
    end
  end

  def self.down
    drop_table "contacts"
  end
end
