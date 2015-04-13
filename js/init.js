// Initialisation file
function time_formatStr(number){
    if(number < 10){
        return "0" + number;
    }
    return "" + number;
}

/**
 * detect IE
 * returns version of IE or false, if browser is not Internet Explorer
 */
function detectIE() {
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
       // IE 12 => return version number
       return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    // other browser
    return false;
}

function time_display(hh,mm,ss){
    $("#clock-display-hh").text(time_formatStr(hh));
    $("#clock-display-mm").text(time_formatStr(mm));
    $("#clock-display-ss").text(time_formatStr(ss));
    
    $("#clock-display-hh-glow").text(time_formatStr(hh));
    $("#clock-display-mm-glow").text(time_formatStr(mm));
    $("#clock-display-ss-glow").text(time_formatStr(ss));
}

function time_circle(selector, value){
    var attribut = $(selector).attr("style").split(";");
    var strAttribut = "";
    for(var i=0; i<attribut.length; i++){
        if(attribut[i].indexOf("stroke-width") > -1){
            attribut[i] = "stroke-width:" + (value % 4 + 1)*4;
        }
    }
    strAttribut = attribut.join(";");
    $(selector).attr("style", strAttribut);
}

function time_rotate(selector, value){
    var attribut = $(selector).attr("transform");
    $(selector).attr("transform", attribut.split(" ")[0] + " rotate(" + value + ",256,256)");
}

$(document).ready(function(){

    g_menu.init();
    
    $("#audioDemo").trigger('load');
    $("#audioDemo").bind("load",function(){
        console.log("Audio Loaded succesfully");
    });
    
    // fill the whole screen with the main div and align the lens flare
    $("#clockmain-content").css("height", $(window).height() - (40+$("#clockmain-copyright-section").height()));
    g_config.nbLine = ($(window).height() * $(window).width())/10000;
    $("#clocklens-lensflare").css("margin-top", ($(window).height() - $("#clocklens-lensflare").height() - $("#clockmain-copyright-section").height()) / 2 );

    $( window ).resize(function() {
        $("#clocklens-lensflare").css("margin-top", ($(window).height() - $("#clocklens-lensflare").height() - $("#clockmain-copyright-section").height()) / 2 );
        g_config.nbLine = ($(window).height() * $(window).width())/10000;
        $("#clockmain-content").css("height", $(window).height() - (40+$("#clockmain-copyright-section").height()));
    });
    
    g_rand.init();
    
    // Animated text on the background
    $("#clockbackground-randomtext").text(g_rand.getRndStr(g_config.nbLine));
    setInterval(function(){
        if(g_config.is_fancyAnimation){
            $("#clockbackground-randomtext").text(g_rand.getRndStr(g_config.nbLine));
        }
    },1000);
    
    //$("#audioDemo").trigger('play');
    $("#audioDemo").prop("volume",0.1);
    $("#audioDemo").hide();
    //$("#audioDemo").trigger('play');
    setInterval(function(){
        $(".audioDemo").prop("currentTime",0);
        //$("#audioDemo").trigger('play');
    },1000);
    
    // Parallax effect
    $("body").mousemove(function( event ) {
        if(g_config.is_fancyAnimation){
            var amount = 50.0;
            var x_offset = (event.clientX / amount) - $(window).width()/(amount*2);
            var y_offset = (event.clientY / amount) - $(window).height()/(amount*2);
            $("#clockbackground-pic").css("left", x_offset);
            $("#clockbackground-pic").css("top", y_offset);
            
            $("#clockmain-content").css("left", -x_offset/2);
            $("#clockmain-content").css("top", -y_offset/2);
        }
    });

    // SVG management
    var s = Snap("#clockmain-svg-container");
    var tux = Snap.load("assets/canva.svg", function(loadedFragment){
        s.append(loadedFragment);
        
        console.log($("#barcode-a").attr("style"));
        
        setInterval(function(){
        

            

            var currentTime = new Date();
            var h = currentTime.getHours();
            var m = currentTime.getMinutes();
            var s = currentTime.getSeconds();
            var d = currentTime.getMilliseconds();
            
            
            time_display(h,m,s);
            time_circle("#barcode-separator-a",m+h);
            time_circle("#barcode-separator-b",m+h+1);
            time_circle("#barcode-separator-c",m);
            time_circle("#barcode-separator-d",m+1);
            time_circle("#barcode-separator-f",s+h);
            time_circle("#barcode-separator-g",s+h+1);
            
            // Only enable rotation if user enabled it and not in IE (rotation doesn't work on IE);
            if(g_config.is_fancyAnimation && !detectIE()){
                time_rotate("#barcode-separator-g", s*6); 
                time_rotate("#barcode-separator-f", -s+m*2);
                time_rotate("#barcode-separator-d", s*3);
                time_rotate("#barcode-separator-c", -s*4);
                time_rotate("#barcode-separator-b", s*5);
                
                time_circle("#barcode-separator-a-glow",m+h);
                time_circle("#barcode-separator-b-glow",m+h+1);
                time_circle("#barcode-separator-c-glow",m);
                time_circle("#barcode-separator-d-glow",m+1);
                time_circle("#barcode-separator-f-glow",s+h);
                time_circle("#barcode-separator-g-glow",s+h+1);
                
                time_rotate("#barcode-separator-g-glow", s*6);
                time_rotate("#barcode-separator-f-glow", -s+m*2);
                time_rotate("#barcode-separator-d-glow", s*3);
                time_rotate("#barcode-separator-c-glow", -s*4);
                time_rotate("#barcode-separator-b-glow", s*5);
            }


        },1000);
        
    });


});
