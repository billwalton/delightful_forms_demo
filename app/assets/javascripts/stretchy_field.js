var tabbableElements = [];
var elementGroups = [];
var currentElement = -1;

function populateLinkValues(element, defaultValue, originalValue) {
  var linkID;
  var boxID;

  if(element.className != 'stretchy_group_start' && element.className != 'stretchy_group_end'){
    linkID = '#' + element.name + '_link_value';
    boxID = '#' + element.name + '_box_value';
    if($(linkID) != null && $(boxID) != null) {
      if(originalValue == null || originalValue == "") {
        $(linkID).text(defaultValue);
        $(boxID).text(defaultValue);
      }
      else {
        $(linkID).text(originalValue);
        $(boxID).text(originalValue);
      }
    }
  }
}

function findTabbableElements() {
    tabbableElements.length = 0;
    elementGroups.length = 0;
    currentElement = -1;
    var defaultValue;
    var originalValue;
    var groupName;
    var groupStartIndex;
    var groupEndIndex;

    if (document.forms[0]) {
        var allElements = document.forms[0].elements;
        for(var e=0; e < allElements.length; e++) {
            if(allElements[e].type != 'hidden') {
                defaultValue = allElements[e].getAttribute("default_value");
                originalValue = allElements[e].value;
                if(originalValue == null || originalValue == ""){allElements[e].value = defaultValue;}
                var newElement = new domElement(allElements[e].id, allElements[e].className, defaultValue, originalValue);
                populateLinkValues(newElement, defaultValue, originalValue);
                tabbableElements.push(newElement);
                if(newElement.className == 'stretchy_group_start') {
                    groupName = newElement.name.replace(/_start/,'');
                    groupStartIndex = tabbableElements.length;
                    var newGroupElement = new domGroup(groupName, groupStartIndex, null);
                    elementGroups.push(newGroupElement);
                }
                if(allElements[e].className == 'stretchy_group_end') {
                    groupName = allElements[e].name.replace(/_end/,'');
                    groupEndIndex = tabbableElements.length - 2;
                    for(i=0; i < elementGroups.length; i ++) {
                        if(elementGroups[i].name == groupName) {
                            elementGroups[i].lastElementIndex = groupEndIndex;
                        }
                    }
                }
            }
        }
        if( tabbableElements.length > 0 && tabbableElements[0].className != 'stretchy_input') {
            document.getElementById(tabbableElements[0].name).focus()
            currentElement = 0;
        }
    }
}

function domElement(name, className, defaultValue, originalValue) {
    this.name = name;
    this.className = className;
    this.defaultValue = defaultValue;
    this.originalValue = originalValue;
}

function domGroup(name, firstElementIndex, lastElementIndex) {
    this.name = name;
    this.firstElementIndex = firstElementIndex;
    this.lastElementIndex = lastElementIndex;
}

function advanceFocusOnTab(e) {
    var kc = e.keyCode;
    var nextElement;
    var advancingBackwards;

    if(kc == 9) {
        if(e.shiftKey) {
          nextElement = currentElement - 1;
          advancingBackwards = true;
          if(nextElement < 0) {
              nextElement = tabbableElements.length - 1;
          }
        }
        else {
          nextElement = currentElement + 1;
          advancingBackwards = false;
          if(nextElement == tabbableElements.length) {
              nextElement = 0;
          }
        }
        if(tabbableElements[nextElement].className.search(/stretchy/) > -1)
        {
            if(tabbableElements[nextElement].className.search(/stretchy_input/) > -1)
            {
                setFocusOnStretchy(tabbableElements[nextElement].name);
            }
            else
            {
                if(tabbableElements[nextElement].className.search(/stretchy_group_start/) > -1)

                {
                  if(advancingBackwards) {
                    swapStretchyGroupForLink(tabbableElements[nextElement].name);
                    nextElement -= 1;
                    setFocusOnStretchy(tabbableElements[nextElement].name);
                  }
                  else {
                    swapStretchyLinkForGroup(tabbableElements[nextElement].name);
                    nextElement += 1;
                    setFocusOnStretchy(tabbableElements[nextElement].name);
                  }
                }
                else
                {
                    if(tabbableElements[nextElement].className.search(/stretchy_group_end/) > -1)
                    {
                      if(advancingBackwards) {
                        swapStretchyLinkForGroup(tabbableElements[nextElement].name);
                        nextElement -= 1;
                        setFocusOnStretchy(tabbableElements[nextElement].name);
                      }
                      else {
                        swapStretchyGroupForLink(tabbableElements[nextElement].name);
                        nextElement += 1;
                        setFocusOnStretchy(tabbableElements[nextElement].name);
                      }
                    }
                    else
                    {
                        setFocusOnStretchy(tabbableElements[nextElement].name);
                    }
                }
            }
        }
        else
        {
            $('#' + tabbableElements[nextElement].name).focus();
        }
        currentElement = nextElement;
        return false;
    }
    else
    {
      if(kc == 13  && (tabbableElements[currentElement].name.search(/upc_code/) > -1)) {
        return false;
      }
      else {
        return true;
      }
    }
    return true;
}

function swapStretchyLinkForGroup(elementName) {
    var groupName;
    if(elementName.search(/_end/) > -1) {
      groupName = elementName.replace(/_end/, '');
    }
    else {
      groupName = elementName.replace(/_start/, '');
    }

    $('#' + groupName + '_link').hide();
    $('#' + groupName + '_block').show();
}

function swapStretchyGroupForLink(elementName) {
    var groupName;
    if(elementName.search(/_end/) > -1) {
      groupName = elementName.replace(/_end/, '');
    }
    else {
      groupName = elementName.replace(/_start/, '');
    }

    var changed = checkForContent(groupName);
    if(changed)
    {
        return true;
    }
    else
    {
        $('#' + groupName + '_block').hide();
        $('#' + groupName + '_link').show();
        return true;
    }
}

function checkForContent(groupName) {
    var group;
    var groupHasContent = false;
    var currentValue;

    for(var e=0; e < elementGroups.length; e++) {
        if(elementGroups[e].name == groupName)
        {
            group = elementGroups[e];
            break;
        }
    }

    for(var i=group.firstElementIndex; i <= group.lastElementIndex; i++){
        currentValue = $(tabbableElements[i].name).val();
        if(currentValue != tabbableElements[i].defaultValue && !(currentValue == null || currentValue == "") ) {
            groupHasContent = true;
            break;
        }
    }

    return groupHasContent;
}

function setFocusOnStretchy(elementName) {
    $('#' + elementName + '_link').hide();
    $('#' + elementName + '_box').hide();
    $('#' + elementName + '_input').show();
    $('#' + elementName).focus();
    return true;
}

function swapStretchyLinkForTextInput(elementName) {
    setCurrentElement(elementName);
    $('#' + elementName + '_link').hide();
    $('#' + elementName + '_input').show();
    $('#' + elementName).focus();
}

function swapStretchyBoxForTextInput(elementName) {
    setCurrentElement(elementName);
    $('#' + elementName + '_box').hide();
    $('#' + elementName + '_input').show();
    $('#' + elementName).focus();
}

function setCurrentElement(elementName) {

    for(var e=0; e < tabbableElements.length; e++) {
        if(tabbableElements[e].name == elementName){
            currentElement = e;
            break;
        }
    }

    for(var i = 0; i < elementGroups.length; i++) {
        var groupName = elementGroups[i].name;
        if(currentElement < elementGroups[i].firstElementIndex || currentElement > elementGroups[i].lastElementIndex) {
            var groupHasChanged = checkForContent(groupName);
            if(groupHasChanged) {
                $(groupName + '_link').hide();
                $(groupName + '_block').show();
            }
            else {
                $(groupName + '_block').hide();
                $(groupName + '_link').show();
            }
        }
    }
}

function swapTextInputForStretchyControl(elementName) {
    var user_input = $('#' + elementName).val();
    var default_value;
    var original_value;

    var required = $('#' + elementName + '_input').attr("required") != null;
    for(i=0; i < tabbableElements.length; i ++) {
        if(tabbableElements[i].name == elementName) {
            default_value = tabbableElements[i].defaultValue;
            original_value = tabbableElements[i].originalValue;
            break;
        }
    }
    if (required) // required field
    {
        $('#' + elementName + '_input').hide();
        $('#' + elementName + '_box').show();
        if (user_input.length > 0 && user_input != default_value && user_input != original_value)
        {
            $('#' + elementName + '_box_value').val(user_input);
            $('#' + elementName).val(user_input);
            $('#' + elementName + '_box_value').css('color', 'black');
        }
        else
        {
            if (user_input == original_value) {
                if(original_value == null || original_value == ""){
                  $('#' + elementName + '_box_value').text(default_value);
                  $('#' + elementName).val(default_value);
                }
                else {
                  $('#' + elementName + '_box_value').text(original_value);
                  $('#' + elementName).val(original_value);
                }
                $('#' + elementName + '_box_value').css('color', '#888888');
            }
            else {
                $('#' + elementName + '_box_value').text(default_value);
                $('#' + elementName + '_box_value').css('color', '#888888');
                $('#' + elementName).val(default_value);
            }
        }
    }
    else // optional field
    {
       $('#' + elementName + '_input').hide();
        $('#' + elementName + '_link').show();
        if (user_input.length > 0 && user_input != default_value && user_input != original_value)
        {
            $('#' + elementName + '_link_value').text(user_input);
            $('#' + elementName).val(user_input);
            $('#' + elementName + '_link_value').css('color', 'black');
        }
        else
        {
            if (user_input == original_value) {
                if(original_value.blank()){
                  $('#' + elementName + '_link_value').text(default_value);
                  $('#' + elementName).val(default_value);
                }
                else {
                  $('#' + elementName + '_link_value').text(original_value);
                  $('#' + elementName).val(original_value);
                }
                $('#' + elementName + '_link_value').css('color', '#888888');
            }
            else {
                $('#' + elementName + '_link_value').text(default_value);
                $('#' + elementName + '_link_value').css('color', '#888888');
                $('#' + elementName).val(default_value);
            }
        }
    }
}