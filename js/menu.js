// Manage the top right menu
g_config = {
    nbLine : 150,
    glowEnabled : false,
    
    // Options for the clock itself
    is_vignetteOn               : false,
    is_lensFlareOn              : false,
    is_circleRotationOn         : false,
    is_bloomOn                  : false,
    
    // Options for the background
    is_backgroundNoiseOn        : false,
    is_backgroundNoiseAnimOn    : false,
    is_backgroundTextOn         : false,
    is_backgroundTextAnimOn     : false,
    
    // Options (experimental/WIP)
    is_soundOn                  : false,
    is_parallaxOn               : false
};


g_rand = {
    
    lines : [],
    lineChoose : 0,
    
    // -- Initialisation -- (Fill 4 array with random values)
    init : function(){
        for (var i=0; i<4; i++){
            this.generateLine();
        }
    },
    generateLine : function(){
        var currentTime = new Date();
        var h = currentTime.getHours();
        var m = currentTime.getMinutes();
        var s = currentTime.getSeconds();
        var d = currentTime.getMilliseconds();
        var line = [];
        for (var i=0; i<300; i++){
            line.push($.md5(s + d + i + d));
        }
        this.lines.push(line);
    },
    
    getRndStr : function(amount){
        this.lineChoose++;
        if(this.lineChoose > 3){
            this.lineChoose = 0;
        }

        return this.lines[this.lineChoose].slice(0,amount).join("" + this.lineChoose);
    }
};

g_menu = {
    
    // -- Variables --
    visible : false,
    screenHeight : 500,
    
    
    // -- Initialisation -- (will be executed at beginning)
    init : function(){
        this.hide();
        // Enable menu display
        $("#clockmenu-access-button").click(function(){
            g_menu.toggle();
        });
        
        // Hide menu if click outside display
        $("#clockmain-content").click(function(){
            g_menu.hide();
        });
        $("#clockbackground-pic").click(function(){
            g_menu.hide();
        });
        
        $("#clocklens-content").click(function(){
            g_menu.hide();
        });
        
        // Add the generic btn class to all buttons
        $(".ui-yesno-btn").addClass("ui-generic-btn");
        
        // Check which yesno btn should be active
        $(".ui-yesno-btn").each(function(){
            if(g_menu.getYesNobtn(this)){
                g_menu.setYesNobtn(this, true);
            } else {
                g_menu.setYesNobtn(this, false);
            }
        });
        
        $("#menu-backgroundAnimation-btn").click(function(){
           g_menu.setYesNobtnToggle($("#" + $(this).data("ref"))); 
        });
        
        
        // Hide the copyright section
        $("#clockmain-copyright-information").hide();
        
        // FIXME Doesn't work when the vignette is on top
        $("#clockmain-copyright-button").click(function(){
            $("#clockmain-copyright-information").show();
        });
    },
    
    // -- Hide the menu --
    hide : function(){
        $("#clockmenu-title").hide();
        $("#clockmenu-screen").hide();
        $("#clockmenu-access-button").addClass("clockmenu-buttons-default");
        $("#clockmenu-access-button").removeClass("clockmenu-buttons-active");
        $("#clockmenu-screen").css("height", '0px');
        this.visible = false;
    },
    
    // -- Show the menu with a little animation
    show : function(){
        $("#clockmenu-title").show();
        $("#clockmenu-screen").show();
        $("#clockmenu-screen").animate({height: + this.screenHeight + 'px'}, 200);
        $("#clockmenu-access-button").addClass("clockmenu-buttons-active");
        $("#clockmenu-access-button").removeClass("clockmenu-buttons-default");
        this.visible = true;
    },
    
    // -- Toggle the menu
    toggle : function(){
        if(this.visible){
            this.hide();
        }else{
            this.show();
        }
    },

    // -- menu UI management --
    setYesNobtn : function(btn, value){
        if(value){
            $(btn).data("value", "yes");
            $(btn).text("✔");
            $(btn).addClass("ui-yesno-btn-active");
        }else{
            $(btn).data("value", "no");
            $(btn).text("");
            $(btn).removeClass("ui-yesno-btn-active");
        }
    },
    
    getYesNobtn : function(btn){
        if($(btn).data("value") == "yes"){
            return true;
        } else {
            return false;
        }
    },
    
    setYesNobtnToggle : function(btn){
        console.log($(btn).data("value"));
        this.setYesNobtn(btn, !this.getYesNobtn(btn));
    }
};

