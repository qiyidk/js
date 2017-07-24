(function(global){
  // namespace
  var ajaxUtils = {};
  function getRequestObject(){
    if (global.XMLHttpRequest){
      return new XMLHttpRequest(); 
    }
    else if (global.ActiveXObject){
      return new ActiveXObject("Microsoft.XMLHTTP");
    }
    else {
      global.alert("Ajax is not supported!");
      return null;
    }
  }
  ajaxUtils.send = function(url, responseHandler, isJSONResponse){
    var request = getRequestObject();
    request.onreadystatechange = 
    function(){
      handleResponse(request,
                      responseHandler, 
                      isJSONResponse
                      );

    }
    request.open("GET", url, true);
    request.send(null);

  }

  function handleResponse(request,
                      responseHandler, 
                      isJSONResponse){
    if ((request.readyState == 4) 
      && (request.status == 200)){
        if (isJSONResponse == undefined){
          isJSONResponse = false;
        }
        var response = request.responseText;
        if (isJSONResponse){
          responseHandler(JSON.parse(response));
        }
        else{
          responseHandler(response);
        }
      }

  }
  global.ajaxUtils = ajaxUtils;
})(window);