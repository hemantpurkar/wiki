(function(){

var export_mode = false;

function defaults(obj, std){
	for (var key in std)
		if (!obj[key])
			obj[key] = std[key];
	return obj;
}

scheduler.exportToPDF = function(config){
	config = defaults((config || {}), { 
		name:"calendar.pdf",
		format:"A3",
		orientation:"portrait",
		dpi:96,
		zoom:1,
		header: "<div style='font-size: 18px;font-weight: 400;font-family: arial;text-align: center;position: absolute;width: 100%;top: 14px;'>"+ 
		$("#dhx_cal_date_header").text() + "</div>"
	});
	config.html = config.html || this._export_html(config);
        config.mode = this.getState().mode;
	this._send_to_export(config);
}

scheduler.exportToPNG = function(config){
	config = defaults((config || {}), { 
		name:"calendar.png",
		format:"A4",
		orientation:"landscape",
		dpi:96,
		zoom:1
	});
	config.html = config.html || this._export_html(config);
        config.mode = this.getState().mode;
	this._send_to_export(config);
}

scheduler._send_to_export = function(base){
	var form = this._create_hidden_form();
	form.firstChild.action = "https://export.dhtmlx.com/scheduler";
	form.firstChild.firstChild.value = JSON.stringify(base);
	form.firstChild.submit();
}

scheduler._create_hidden_form = function(){
	if (!this._hidden_export_form){
		var t = this._hidden_export_form = document.createElement("div");
		t.style.display = "none";
		t.innerHTML = "<form method='POST'><input type='text' name='data'></form>";
		document.body.appendChild(t);
	}
	return this._hidden_export_form;
}

scheduler._export_resize = function(){
	if (scheduler.callEvent("onSchedulerResize",[]))  {
		scheduler.update_view();
		scheduler.callEvent("onAfterSchedulerResize", []);
	}
}


scheduler._get_export_size = function(format, orientation, zoom, dpi){
	var border = 10;
    var dpi = dpi/25.4;
    var sizes = {
        "A5":{ x:148, y:210 },
        "A4":{ x:210, y:297 },
        "A3":{ x:297, y:420 },
        "A2":{ x:420, y:594 },
        "A1":{ x:594, y:841 },
        "A0":{ x:841, y:1189 }
    };

	var cSize = { x:sizes[format].x, y:sizes[format].y };
    if (orientation == "landscape"){
        var c = cSize.x;
        cSize.x = cSize.y;
        cSize.y = c;
    }

    cSize.x = Math.floor( (cSize.x - border*2 ) * dpi ) * 1/zoom;
    cSize.y = Math.floor( (cSize.y - border*2 ) * dpi );

    return cSize;

}

scheduler._export_html = function(obj){
	var hy = scheduler.xy.nav_height;
	var sw = scheduler.xy.scroll_width;
	var xs = scheduler._obj.style.width;
	var ys = scheduler._obj.style.height;

	var size = scheduler._get_export_size(obj.format, obj.orientation, obj.zoom, obj.dpi);
	scheduler._obj.style.width  = size.x + "px";
	scheduler._obj.style.height = size.y + "px";

	scheduler.xy.nav_height = 0;
	scheduler.xy.scroll_width = 0;

	export_mode = true;
	scheduler._export_resize();
	export_mode = false;

	var html = scheduler._obj.innerHTML;

	scheduler.xy.nav_height = sw;
	scheduler.xy.nav_height = hy;
	scheduler._obj.style.width  = xs;
	scheduler._obj.style.height = ys;

	scheduler._export_resize();
	return html;
};

})();