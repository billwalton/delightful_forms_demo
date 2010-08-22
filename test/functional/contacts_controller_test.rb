require 'test_helper'

class ContactsControllerTest < ActionController::TestCase
  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:contacts)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create contacts" do
    assert_difference('Contacts.count') do
      post :create, :contacts => { }
    end

    assert_redirected_to contacts_path(assigns(:contacts))
  end

  test "should show contacts" do
    get :show, :id => contacts(:one).to_param
    assert_response :success
  end

  test "should get edit" do
    get :edit, :id => contacts(:one).to_param
    assert_response :success
  end

  test "should update contacts" do
    put :update, :id => contacts(:one).to_param, :contacts => { }
    assert_redirected_to contacts_path(assigns(:contacts))
  end

  test "should destroy contacts" do
    assert_difference('Contacts.count', -1) do
      delete :destroy, :id => contacts(:one).to_param
    end

    assert_redirected_to contacts_path
  end
end
