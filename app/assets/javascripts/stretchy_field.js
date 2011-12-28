  var tabbableElements = [];
  var elementGroups = [];
  var currentElement = -1;


$(function() {
  findTabbableElements();
  if(elementGroups.length > 0) {
    for(var g=0; g < elementGroups.length; g++) {
      swapStretchyGroupForLink(elementGroups[g].name + '_start');
    }
  };
  wrapStretchyInputs();
  document.onkeypress = advanceFocusOnTab;
}); // end of document.ready

function wrapStretchyInputs() {
  var btn = /button/
  var grp = /group/
  for(var e=0; e < tabbableElements.length; e++) {
    if(!(tabbableElements[e].className.match(btn) || tabbableElements[e].className.match(grp))){
      $('#' + tabbableElements[e].name).wrap('<div id="' + tabbableElements[e].name + '_input" ></div>');
      $('#' + tabbableElements[e].name + '_input').wrap('<div class="stretchy_input_field"></div>');
      var required = $('#' + tabbableElements[e].name).attr("required") != null;
      var stretchy_div = '<div id="' + tabbableElements[e].name + '_stretchy" class=' + (required ? "stretchy_box" : "stretchy_link") + ' >';
      stretchy_div += '<ul><li><a id="' + tabbableElements[e].name + '_value" onclick="swapStretchyForTextInput(' + '\'' + tabbableElements[e].name + '\');></a></li></ul></div>'
      $('#' + tabbableElements[e].name + '_input').before(stretchy_div);
      populateLinkValues(tabbableElements[e]);
    }
  }
}

function populateLinkValues(element) {
  var stretchyID;

  if(element.className != 'stretchy_group_start' && element.className != 'stretchy_group_end'){
    stretchyID = '#' + element.name + '_value';
    if($(stretchyID) != null) {
      if(element.originalValue == null || element.originalValue == "") { $(stretchyID).text(element.defaultValue); }
      else { $(stretchyID).text(element.originalValue); }
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
                swapStretchyForTextInput(tabbableElements[nextElement].name);
            }
            else
            {
                if(tabbableElements[nextElement].className.search(/stretchy_group_start/) > -1)
                {
                  if(advancingBackwards) {
                    swapStretchyGroupForLink(tabbableElements[nextElement].name);
                    nextElement -= 1;
                    swapStretchyForTextInput(tabbableElements[nextElement].name);
                  }
                  else {
                    swapStretchyLinkForGroup(tabbableElements[nextElement].name);
                    nextElement += 1;
                    swapStretchyForTextInput(tabbableElements[nextElement].name);
                  }
                }
                else
                {
                    if(tabbableElements[nextElement].className.search(/stretchy_group_end/) > -1)
                    {
                      if(advancingBackwards) {
                        swapStretchyLinkForGroup(tabbableElements[nextElement].name);
                        nextElement -= 1;
                        swapStretchyForTextInput(tabbableElements[nextElement].name);
                      }
                      else {
                        swapStretchyGroupForLink(tabbableElements[nextElement].name);
                        nextElement += 1;
                        swapStretchyForTextInput(tabbableElements[nextElement].name);
                      }
                    }
                    else
                    {
                        swapStretchyForTextInput(tabbableElements[nextElement].name);
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
    else {
      return true;
    }
}

function swapStretchyLinkForGroup(elementName) {
    var groupName;
    if(elementName.search(/_end/) > -1) {
      groupName = elementName.replace(/_end/, '');
    }
    else {
      groupName = elementName.replace(/_start/, '');
    }

    $('#' + groupName + '_link').css('display','none');
    $('#' + groupName + '_block').css('display','block');
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
        $('#' + groupName + '_link').css('display','none');
        return true;
    }
    else
    {
        $('#' + groupName + '_block').css('display','none');
        $('#' + groupName + '_link').css('display','block');
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
        currentValue = $('#' + tabbableElements[i].name).val();
        if(currentValue != tabbableElements[i].defaultValue && !(currentValue == null || currentValue == "") ) {
            groupHasContent = true;
            break;
        }
    }

    return groupHasContent;
}

function swapStretchyForTextInput(elementName) {
    setCurrentElement(elementName);
    $('#' + elementName + '_stretchy').css('display','none');
    $('#' + elementName).css('display', 'block');
    $('#' + elementName).focus();
    $('#' + elementName).select();
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
                $('#' + groupName + '_link').css('display','none');
                $('#' + groupName + '_block').css('display','block');
            }
            else {
                $('#' + groupName + '_block').css('display','none');
                $('#' + groupName + '_link').css('display','block');
            }
        }
    }
}

function swapTextInputForStretchyControl(elementName) {
    var user_input = $('#' + elementName).val();
    var default_value;
    var original_value;

    var required = $('#' + elementName).attr("required") != null;
    for(i=0; i < tabbableElements.length; i ++) {
        if(tabbableElements[i].name == elementName) {
            default_value = tabbableElements[i].defaultValue;
            original_value = tabbableElements[i].originalValue;
            break;
        }
    };

    $('#' + elementName).css('display','none');
    $('#' + elementName + '_stretchy').css('display','block');
    if (user_input.length > 0 && user_input != default_value && user_input != original_value)
    {
        $('#' + elementName + '_value').text(user_input);
        $('#' + elementName).val(user_input);
        $('#' + elementName + '_value').css('color', 'black');
    }
    else
    {
        if (user_input == original_value) {
            if(original_value == null || original_value == ""){
              $('#' + elementName + '_value').text(default_value);
              $('#' + elementName).val(default_value);
            }
            else {
              $('#' + elementName + '_value').text(original_value);
              $('#' + elementName).val(original_value);
            }
            $('#' + elementName + '_value').css('color', '#888888');
        }
        else {
            $('#' + elementName + '_value').text(default_value);
            $('#' + elementName + '_value').css('color', '#888888');
            $('#' + elementName).val(default_value);
        }
    }

}